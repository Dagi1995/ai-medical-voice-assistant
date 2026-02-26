"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  {
    id: 4,
    name: "Profile",
    path: "/profile",
  },
];

function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // For demo purposes, let's assume we're on home page
  // In reality, pathname would be "/home"
  const currentPath = "/home"; // This would come from pathname

  return (
    <>
      <header className="flex items-center justify-between p-4 px-10 md:px-20 lg:px-40 xl:px-60 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Image
            src={"/logo.svg"}
            alt="MediVoice Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="font-semibold text-gray-900 text-lg hidden sm:block">
            MediVoice
          </span>
        </div>

        {/* Desktop Navigation Menu - Pill Shape */}
        <div className="hidden md:flex items-center justify-around gap-1 border border-gray-200 rounded-2xl px-10 py-1.5 shadow-sm">
          {menuOptions.map((option) => {
            const isActive = currentPath === option.path;

            return (
              <Button
                key={option.id}
                variant="ghost"
                size="sm"
                className={`relative px-4 py-5 text-base font-medium rounded-xl ${
                  isActive
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                asChild
              >
                <a href={option.path}>
                  {option.name}
                  {/* Active indicator line - only shows on Home */}
                  {isActive && option.name === "Home" && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </a>
              </Button>
            );
          })}
        </div>

        {/* User Section & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />

          {/* Hamburger Menu Button (Mobile Only) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
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
          <div className="md:hidden fixed top-[73px] left-4 right-4 z-50 rounded-2xl bg-white border border-gray-200 shadow-xl animate-in slide-in-from-top-2 duration-300 p-3">
            <div className="flex flex-col gap-1">
              {menuOptions.map((option) => {
                const isActive = currentPath === option.path;

                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    className={`w-full justify-start text-base font-medium py-6 ${
                      isActive
                        ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <a href={option.path} className="flex items-center gap-2">
                      <span className="flex-1 text-left">{option.name}</span>
                      {/* Active indicator dot - only shows on Home */}
                      {isActive && option.name === "Home" && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </a>
                  </Button>
                );
              })}

              {/* Mobile Menu Footer */}
              <div className="border-t border-gray-100 mt-3 pt-4 px-3">
                <p className="text-xs text-gray-500">© 2026 MediVoice</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AppHeader;
