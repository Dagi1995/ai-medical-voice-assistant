"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/hook/useNotifications";
import { useUser } from "@clerk/nextjs";

export function NotificationBadge({ href = "/notifications" }: { href?: string }) {
  const { user } = useUser();
  const { unreadCount } = useNotifications(user?.primaryEmailAddress?.emailAddress);

  return (
    <Link href={href}>
      <div className="relative p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer mr-2">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[1.25rem] h-5 px-1 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0a0a0a] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
}
