import { Metadata } from "next";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI Interviewer | Dashboard",
  description: "Manage your interviews and track your progress",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-12 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
