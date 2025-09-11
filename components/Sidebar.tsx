"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, User as UserIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { adminNavigationItems } from "@/lib/admin-utils";
import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import { UserRole, User } from "@/types";
import { userNavigationItems } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();
  const [navigationItems, setNavigationItems] = useState(userNavigationItems);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const currentUser = await getCurrentUser();
      const isUserAdmin = currentUser?.role === UserRole.ADMIN;
      setUser(currentUser);
      setIsAdmin(isUserAdmin);
      setNavigationItems(isUserAdmin ? adminNavigationItems : userNavigationItems);
    };
    checkUserRole();
  }, []);

  const handleLogout = async () => {
    await signOut();
    redirect("/sign-in");
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-dark-200 border-r border-light-600/20 flex flex-col transition-all duration-300 relative`}>
      <div className="p-6 border-b border-light-600/20 flex items-center justify-between">
        <Link href="/" className={`${isCollapsed ? 'mx-auto' : ''}`}>
          <Image
            src={isCollapsed ? "/amali-logo.png" : "/Logo-AmaliTech.svg"}
            alt="AI Interviewer"
            className={`${isCollapsed ? 'h-6 w-6' : 'h-8 w-auto'}`}
            width={isCollapsed ? 24 : 120}
            height={isCollapsed ? 24 : 120}
          />
        </Link>
        {!isCollapsed && (
          <div className="absolute top-6 right-[-12px] z-10">
            <Button
              onClick={() => setIsCollapsed(true)}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 bg-dark-200 border border-light-600/20 hover:bg-dark-300 rounded-full"
            >
              <ChevronLeft className="h-4 w-4 text-light-100" />
            </Button>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="absolute top-6 right-[-12px] z-10">
          <Button
            onClick={() => setIsCollapsed(false)}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6 bg-dark-200 border border-light-600/20 hover:bg-dark-300 rounded-full"
          >
            <ChevronRight className="h-3 w-3 text-light-100" />
          </Button>
        </div>
      )}

      {isAdmin && (
        <div className={`${isCollapsed ? 'p-3' : 'p-6'}`}>
          <Button
            asChild
            className={`${isCollapsed ? 'w-12 h-12 p-0' : 'w-full'} bg-primary-200 hover:bg-primary-200/80 text-dark-100 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Link
              href="/admin/interviews/new"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}
              title={isCollapsed ? 'Create New Interview' : undefined}
            >
              <Plus className="w-4 h-4" />
              {!isCollapsed && 'Create New Interview'}
            </Link>
          </Button>
        </div>
      )}

      <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-6'}`}>
        <ul className="space-y-4 list-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`relative flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-dark-300 text-white border-2 border-secondary-100/40"
                    : "text-light-100 hover:text-white hover:bg-dark-300"
                    }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile and Logout Section */}
      <div className={`mt-auto ${isCollapsed ? 'p-3' : 'p-6'} border-t border-light-600/20`}>
        {user && !isCollapsed && (
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-300">
              <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-dark-100" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-light-100 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {user && isCollapsed && (
          <div className="mb-4 flex justify-center">
            <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center" title={`${user.name}\n${user.email}`}>
              <UserIcon className="w-5 h-5 text-dark-100" />
            </div>
          </div>
        )}

        <Button
          onClick={handleLogout}
          variant="outline"
          className={`${isCollapsed ? 'w-12 h-12 p-0' : 'w-full'} bg-dark-300 hover:bg-dark-300/80 text-light-100 border-light-600/20 hover:border-light-600/40 ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className={`${isCollapsed ? 'w-4 h-4' : 'w-4 h-4 mr-2'}`} />
          {!isCollapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
