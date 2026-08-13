import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "@/lib/nav-config";

interface AdminSidebarProps {
  items: SidebarItem[];
  onClose?: () => void;
}

export function AdminSidebar({ items, onClose }: AdminSidebarProps) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4 lg:px-6">
        <span className="text-lg font-bold text-[#5b0e5c]">
          Loja Açaí
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#5b0e5c] text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">
              {user?.name || "Usuário"}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {user?.role === "platform_owner" ? "Plataforma" : "Loja"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
