"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Sprout, 
  LineChart, 
  Stethoscope, 
  LogOut,
  History,
} from "lucide-react"; // install lucide-react for icons
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Krishi Mitr", href: "/krishi-mitr", icon: Sprout },
  { name: "Analysis", href: "/analysis", icon: LineChart },
  { name: "Disease Predictor", href: "/disease-predictor", icon: Stethoscope },
  { name: "Chat History", href: "/chat-history", icon: History},
  { name: "posts", href: "/posts", icon: History},
  { name: "my-posts", href: "/my-posts", icon: History}
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-emerald-900 text-white shadow-xl">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-emerald-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sprout className="h-8 w-8 text-emerald-400" />
          KrishiApp
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-emerald-300 group-hover:text-white"}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Logout Section */}
      <div className="p-4 border-t border-emerald-800">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 px-4 py-3 text-emerald-200 hover:bg-emerald-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}