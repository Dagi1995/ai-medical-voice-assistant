"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useClerk } from "@clerk/nextjs";
import { History, LayoutDashboard, Stethoscope, CreditCard, Settings } from "lucide-react";

export const menuOptions = [
  {
    id: 1,
    name: "Assistant",
    path: "/home",
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    id: 2,
    name: "History",
    path: "/history",
    icon: <History className="w-5 h-5" />
  },
  {
    id: 3,
    name: "Pricing",
    path: "/pricing",
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    id: 4,
    name: "Doctors",
    path: "/doctors",
    icon: <Stethoscope className="w-5 h-5" />
  },
  {
    id: 5,
    name: "Settings",
    path: "/settings",
    icon: <Settings className="w-5 h-5" />
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { openUserProfile } = useClerk();

  return (
    <div className="w-64 h-full flex flex-col p-6 pb-12 bg-transparent justify-between">
      {/* Top Section */}
      <div>
        <div className="flex items-center gap-2 mb-10 pl-2">
            <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-sm">
              <span className="font-bold text-[10px] text-[#c2464b] dark:text-red-500">Logo</span>
            </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menuOptions.map((item) => {
            const isActive = pathname === item.path || (pathname === '/' && item.path === '/home');

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-[15px] ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm dark:bg-white dark:text-gray-900"
                    : "text-gray-600 hover:bg-[#d6d6d6] hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2">
       
        <div 
          onClick={() => openUserProfile()}
          className="flex items-center gap-3 px-4 py-2 mt-1 rounded-xl cursor-pointer hover:bg-[#d6d6d6] dark:hover:bg-gray-800 transition-colors"
        >
          <UserButton afterSignOutUrl="/" />
          <span className="font-medium text-[15px] text-gray-600 dark:text-gray-400 pointer-events-none">Setting</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
