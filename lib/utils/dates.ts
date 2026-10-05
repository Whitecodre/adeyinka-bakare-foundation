import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: string | Date, formatStr: string = "PPP"): string {
  return format(new Date(date), formatStr);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "PPP p");
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}
