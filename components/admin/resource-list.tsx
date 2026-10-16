"use client";

import { AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { ListRow } from "@/components/admin/list-row";
import { RowActions, type ExtraAction } from "@/components/admin/row-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAccount } from "@/components/admin/account-provider";
import { cn } from "@/lib/utils";

export interface ResourceColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface ResourceListProps<T> {
  rows: T[];
  getKey: (row: T) => string;
  /** Plain-text name of a row, used in button labels for screen readers. */
  getName: (row: T) => string;
  /** Desktop table columns. The actions column is added for you. */
  columns: ResourceColumn<T>[];
  /** Phone card: icon shown when `leading` is not given. */
  icon: LucideIcon;
  leading?: (row: T) => React.ReactNode;
  title: (row: T) => React.ReactNode;
  badges?: (row: T) => React.ReactNode;
  meta?: (row: T) => React.ReactNode;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extra?: (row: T) => ExtraAction[];
}

/**
 * One list for every admin resource: a table on desktop, cards on phones,
 * both built from the same rows so they cannot drift apart.
 */
export function ResourceList<T>({
  rows,
  getKey,
  getName,
  columns,
  icon: Icon,
  leading,
  title,
  badges,
  meta,
  onEdit,
  onDelete: onDeleteProp,
  extra,
}: ResourceListProps<T>) {
  // Roles without delete rights (editors) never see the Delete action.
  const { canHere } = useAccount();
  const onDelete = canHere("delete") ? onDeleteProp : undefined;
  const actionsFor = (row: T) => (
    <RowActions
      name={getName(row)}
      onEdit={onEdit && (() => onEdit(row))}
      onDelete={onDelete && (() => onDelete(row))}
      extra={extra?.(row)}
    />
  );
  const hasActions = !!(onEdit || onDelete || extra);

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className={cn("h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground", column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={getKey(row)} className="hover:bg-muted/40">
                {columns.map((column) => (
                  <TableCell key={column.header} className={cn("py-3", column.className)}>
                    {column.cell(row)}
                  </TableCell>
                ))}
                {hasActions && <TableCell className="py-3 text-right">{actionsFor(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        <AnimatePresence initial={false}>
          {rows.map((row, index) => (
            <ListRow
              key={getKey(row)}
              index={index}
              leading={
                leading ? (
                  leading(row)
                ) : (
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                )
              }
              title={title(row)}
              badges={badges?.(row)}
              meta={meta?.(row)}
              actions={hasActions ? actionsFor(row) : undefined}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
