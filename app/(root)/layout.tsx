import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="">
          <Image
            src="/Logo-AmaliTech.svg"
            alt="Amalitech Logo"
            width={140}
            height={120}
            className="object-cover"
          />
        </Link>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
