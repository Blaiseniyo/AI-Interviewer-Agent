import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { UserRole } from "@/types";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default async function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== UserRole.ADMIN) {
    return <UnauthorizedAccess />;
  }

  return <>{children}</>;
}
