"use client";

import { useState, useEffect, useCallback } from "react";
import { socket } from "@/lib/socket";

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);


  const fetchNotifications = useCallback(async () => {
    try {
      const url = userId ? `/api/notifications?userId=${encodeURIComponent(userId)}` : '/api/notifications';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    socket.on("notification:update", (updatedNotifications: Notification[]) => {
      // If we have a userId, filter the notifications for this user.
      const userNotifications = userId 
        ? updatedNotifications.filter(n => n.userId === userId)
        : updatedNotifications;
        
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    });

    socket.on("notification:new", (newNotification: Notification) => {
      if (!userId || newNotification.userId === userId) {
        setNotifications(prev => {
          const updated = [newNotification, ...prev];
          setUnreadCount(updated.filter(n => !n.read).length);
          return updated;
        });
      }
    });

    return () => {
      socket.off("notification:update");
      socket.off("notification:new");
    };
  }, [userId]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const clearAll = async () => {
    try {
      await fetch('/api/notifications', { method: 'DELETE' });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  return { notifications, unreadCount, markAsRead, clearAll };
}
