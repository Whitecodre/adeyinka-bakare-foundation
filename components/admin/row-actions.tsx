"use client";

import type { LucideIcon } from "lucide-react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ExtraAction {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  disabled?: boolean;
}

interface RowActionsProps {
  /** What the row is, for screen readers: "Amara Obi". */
  name: string;
  onEdit?: () => void;
  onDelete?: () => void;
  extra?: ExtraAction[];
}

/** Edit/delete controls: inline icon buttons on desktop, a menu on phones. */
export function RowActions({ name, onEdit, onDelete, extra = [] }: RowActionsProps) {
  return (
    <>
      <div className="hidden items-center gap-1 md:flex">
        {extra.map(({ label, icon: Icon, onSelect, disabled }) => (
          <Button
            key={label}
            variant="ghost"
            size="icon"
            onClick={onSelect}
            disabled={disabled}
            aria-label={`${label} ${name}`}
            title={label}
          >
            <Icon />
          </Button>
        ))}
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit ${name}`} title="Edit">
            <Pencil />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Delete ${name}`}
            title="Delete"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
          </Button>
        )}
      </div>

      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label={`Actions for ${name}`}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            {extra.map(({ label, icon: Icon, onSelect, disabled }) => (
              <DropdownMenuItem key={label} onSelect={onSelect} disabled={disabled} className="min-h-11 gap-2">
                <Icon className="size-4" />
                {label}
              </DropdownMenuItem>
            ))}
            {onEdit && (
              <DropdownMenuItem onSelect={onEdit} className="min-h-11 gap-2">
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onDelete} className="min-h-11 gap-2 text-destructive focus:text-destructive">
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
