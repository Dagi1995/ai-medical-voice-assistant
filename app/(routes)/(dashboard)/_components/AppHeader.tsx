"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "./DarkMood";
import { useTheme } from "next-themes";

const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/home",
  },
  {
    id: 2,
    name: "History",
    path: "/history",
  },
  {
    id: 3,
    name: "Pricing",
    path: "/pricing",
  },
];

// Navigation Skeleton using shadcn Skeleton with dark mode support
function NavigationSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`fixed inset-0 z-[100] pointer-events-none ${
        isDark ? "bg-black/50" : "bg-white/50"
      } backdrop-blur-[1px]`}
    >
      {/* Header Skeleton */}
      <div
        className={`${
          isDark ? "bg-gray-900/80" : "bg-white/80"
        } backdrop-blur-sm border-b ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between p-4 px-10 md:px-20 lg:px-40 xl:px-60">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded hidden sm:block" />
          </div>

          {/* Desktop Navigation Skeleton */}
          <div className="hidden md:flex items-center gap-4">
            <Skeleton className="h-10 w-20 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>

          {/* User Button Skeleton */}
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Page Content Skeleton */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Page-specific skeleton loaders with dark mode support
function HomePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero section skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-xl" />
        <Skeleton className="h-6 w-2/3 max-w-2xl" />
      </div>

      {/* Features grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryPageSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* History items skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`border rounded-lg p-4 space-y-3 ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingPageSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Title skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Pricing cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`border rounded-2xl p-6 space-y-4 ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationPath, setNavigationPath] = useState("");
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
    setNavigationPath("");
  }, [pathname]);

  const handleNavigation = (e: React.MouseEvent<any>, path: string) => {
    // Don't show skeleton if it's the same page
    if (pathname === path) {
      e.preventDefault?.();
      return;
    }

    setIsNavigating(true);
    setNavigationPath(path);

    // Fallback: hide skeleton after 3 seconds in case navigation gets stuck
    setTimeout(() => {
      setIsNavigating(false);
    }, 3000);
  };

  // Render the appropriate skeleton based on the navigation path
  const renderSkeleton = () => {
    switch (navigationPath) {
      case "/home":
        return <HomePageSkeleton />;
      case "/history":
        return <HistoryPageSkeleton />;
      case "/pricing":
        return <PricingPageSkeleton />;
      default:
        return <HomePageSkeleton />;
    }
  };

  const currentPath = pathname;

  return (
    <>
      <header
        className={`flex items-center justify-between p-4 px-10 md:px-20 lg:px-40 xl:px-60 border-b sticky top-0 z-50 ${
          isDark
            ? "bg-gray-900/60 border-gray-800"
            : "bg-white/60 border-gray-200"
        } backdrop-blur-sm`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Image
            src={"/logo.svg"}
            alt="MediVoice Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span
            className={`font-semibold text-lg hidden sm:block ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            MediVoice
          </span>
        </div>

        {/* Desktop Navigation Menu - Pill Shape */}
        <div className="hidden md:flex items-center justify-around gap-1 rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          {/* Inner container: same as your existing */}
          <div
            className={`flex items-center justify-around gap-1 rounded-2xl ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {menuOptions.map((option) => {
              const isActive = currentPath === option.path;

              return (
                <Button
                  key={option.id}
                  variant="ghost"
                  size="sm"
                  className={`relative px-4 py-5 text-base font-medium rounded-xl ${
                    isActive
                      ? isDark
                        ? "text-blue-400 bg-blue-950/50 hover:bg-blue-900/50"
                        : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : isDark
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  asChild
                  onClick={(e) => handleNavigation(e, option.path)}
                >
                  <Link href={option.path}>
                    {option.name}
                    {/* Active indicator line */}
                    {isActive && (
                      <span
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${
                          isDark ? "bg-blue-400" : "bg-blue-600"
                        }`}
                      />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
        {/* User Section & Mobile Menu Button */}

        <div className="flex items-center gap-3">
          <ModeToggle />

          <Button 
            onClick={() => signOut()} 
            variant="outline" 
            className={`rounded-xl ${isDark ? "bg-gray-800 text-gray-200" : ""}`}
          >
            Log Out
          </Button>

          {/* Hamburger Menu Button (Mobile Only) */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden rounded-xl ${
              isDark ? "hover:bg-gray-800 text-gray-400" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Dropdown */}
          <div
            className={`md:hidden fixed top-[73px] left-4 right-4 z-50 rounded-2xl border shadow-xl animate-in slide-in-from-top-2 duration-300 p-3 ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-1">
              {menuOptions.map((option) => {
                const isActive = currentPath === option.path;

                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    className={`w-full justify-start text-base font-medium py-6 ${
                      isActive
                        ? isDark
                          ? "text-blue-400 bg-blue-950/50 hover:bg-blue-900/50"
                          : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                        : isDark
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                    asChild
                    onClick={(e) => {
                      handleNavigation(e, option.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Link
                      href={option.path}
                      className="flex items-center gap-2"
                    >
                      <span className="flex-1 text-left">{option.name}</span>
                      {/* Active indicator dot */}
                      {isActive && (
                        <span
                          className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${
                            isDark ? "bg-blue-400" : "bg-blue-600"
                          }`}
                        />
                      )}
                    </Link>
                  </Button>
                );
              })}

              {/* Mobile Menu Footer */}
              <div
                className={`border-t mt-3 pt-4 px-3 ${
                  isDark ? "border-gray-800" : "border-gray-100"
                }`}
              >
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  © 2026 MediVoice
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Navigation Loading Skeleton */}
      {isNavigating && (
        <div
          className={`fixed inset-0 z-[100] overflow-y-auto ${
            isDark ? "bg-gray-950/80" : "bg-white/80"
          } backdrop-blur-[2px]`}
        >
          <div className="max-w-7xl mx-auto p-8">{renderSkeleton()}</div>

          {/* Loading indicator */}
          <div
            className={`fixed bottom-4 right-4 z-[101] px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2 ${
              isDark ? "bg-blue-600" : "bg-blue-600"
            } text-white`}
          >
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading{" "}
            {menuOptions.find((opt) => opt.path === navigationPath)?.name ||
              "page"}
            ...
          </div>
        </div>
      )}
    </>
  );
}

export default AppHeader;
