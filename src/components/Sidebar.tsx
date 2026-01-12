"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Sprout,
  LineChart,
  Stethoscope,
  LogOut,
  History,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Krishi Mitr", href: "/krishi-mitr", icon: Sprout },
  { name: "Analysis", href: "/analysis", icon: LineChart },
  { name: "Disease Predictor", href: "/disease-predictor", icon: Stethoscope },
  { name: "Chat History", href: "/chat-history", icon: History },
  { name: "Forum", href: "/posts", icon: MessageSquare },
  { name: "My Posts", href: "/my-posts", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`flex h-full flex-col bg-emerald-900 text-white shadow-xl transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* --- HEADER SECTION --- */}
      <div 
        className={`flex items-center h-20 border-b border-emerald-800 transition-all duration-300 ${
          isCollapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        {/* Logo - Only visible when expanded */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Sprout className="h-8 w-8 text-emerald-400 flex-shrink-0" />
            <span className="text-2xl font-bold whitespace-nowrap">KrishiApp</span>
          </div>
        )}

        {/* Toggle Button - Always visible inside the header */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`flex-shrink-0 h-6 w-6 ${
                  isActive ? "text-white" : "text-emerald-300 group-hover:text-white"
                }`}
              />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- FOOTER / LOGOUT --- */}
      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title={isCollapsed ? "Log Out" : ""}
          className={`flex w-full items-center gap-3 px-3 py-3 text-emerald-200 hover:bg-emerald-800 hover:text-white rounded-lg transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="flex-shrink-0 h-6 w-6" />
          {!isCollapsed && <span className="whitespace-nowrap">Log Out</span>}
        </button>
      </div>
    </div>
  );
}