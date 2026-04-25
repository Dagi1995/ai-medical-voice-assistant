"use client";

import { useNotifications, Notification } from "@/hook/useNotifications";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Bell, Check, Trash2, CheckCircle2, AlertCircle, Info, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { user, isLoaded } = useUser();
  const { notifications, markAsRead, clearAll } = useNotifications(user?.primaryEmailAddress?.emailAddress);

  if (!isLoaded) return <div className="flex p-8 justify-center items-center h-full"><div className="animate-pulse flex items-center space-x-2"><div className="w-4 h-4 bg-blue-400 rounded-full"></div><div className="text-blue-500 font-medium">Loading notifications...</div></div></div>;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with your latest alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {notifications.some(n => !n.read) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                notifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
              }}
              className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearAll}
              className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 border-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-100 dark:border-white/5">
            <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No notifications yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">When you get notifications, they'll show up here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex gap-4 ${
                notification.read 
                  ? "bg-white dark:bg-[#0a0a0a] border-slate-100 dark:border-white/5 opacity-75" 
                  : "bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20 shadow-sm shadow-blue-500/5"
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                {getIconForType(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1">
                  <h4 className={`text-base font-semibold ${notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    {moment(notification.createdAt).fromNow()}
                  </span>
                </div>
                <p className={`text-sm ${notification.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
