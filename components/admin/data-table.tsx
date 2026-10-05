import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps {
  headers: string[];
  rows: {
    id: string;
    data: React.ReactNode[];
    actions?: React.ReactNode;
  }[];
}

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {row.data.map((cell, index) => (
              <TableCell key={index}>{cell}</TableCell>
            ))}
            {row.actions && <TableCell>{row.actions}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
