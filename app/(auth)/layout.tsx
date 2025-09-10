import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, getRedirectPath } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) {
    const redirectPath = await getRedirectPath();
    redirect(redirectPath);
  }

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
