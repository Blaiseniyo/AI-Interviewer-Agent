"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { navigationItems } from "@/lib/admin-utils";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-dark-200 border-r border-light-600/20 flex flex-col">
      <Link href="/" className="p-6 border-b border-light-600/20">
        <Image
          src="/Logo-AmaliTech.svg"
          alt="AI Interviewer"
          className="h-8 w-auto"
          width={120}
          height={120}
        />
      </Link>

      <div className="p-6">
        <Button
          asChild
          className="w-full bg-primary-200 hover:bg-primary-200/80 text-dark-100"
        >
          <Link
            href="/admin/interviews/new"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Interview
          </Link>
        </Button>
      </div>

      <nav className="flex-1 px-6">
        <ul className="space-y-4 list-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`relative flex cur items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-dark-300/80 text-white ring-2 ring-secondary-100/60"
                      : "text-light-100 hover:text-white hover:bg-dark-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
