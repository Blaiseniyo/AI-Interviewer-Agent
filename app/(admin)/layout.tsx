import { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import AdminAuthGuard from "@/components/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Admin Dashboard | AI Interviewer",
  description: "Manage interviews and view analytics",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen admin-layout bg-dark-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
