import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

const logout = async () => {
  'use server'
  await signOut();
  redirect("/sign-in");
};

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-4">
        <Link href="/" className="">
          <Image
            src="/Logo-AmaliTech.svg"
            alt="Amalitech Logo"
            width={140}
            height={120}
            className="object-cover"
          />
        </Link>
        <form action={logout}>
        <Button type="submit" className="bg-gray-500 text-white hover:bg-primary-200">
          <LogOut className="mr-2  h-4 w-4" />
          Logout
        </Button>
        </form>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
