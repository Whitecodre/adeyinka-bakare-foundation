import { metadata } from "./metadata";
import AdminLayoutClient from "./layout-client";

export { metadata };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
