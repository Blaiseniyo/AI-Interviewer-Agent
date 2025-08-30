import { Metadata } from "next";

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
    <div className="">
      <div className="admin-container">{children}</div>
    </div>
  );
}
