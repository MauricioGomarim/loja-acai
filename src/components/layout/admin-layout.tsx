import { useState } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { platformNavItems, getStoreNavItems } from "@/lib/nav-config";

interface AdminLayoutProps {
  variant: "platform" | "store";
}

export function AdminLayout({ variant }: AdminLayoutProps) {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = variant === "platform"
    ? platformNavItems
    : getStoreNavItems(slug || "");

  // Derive page title from current path
  const currentItem = items.find((item) => {
    if (item.href === location.pathname) return true;
    // For index routes, match the parent
    if (variant === "store" && location.pathname === `/${slug}/admin`) {
      return item.href === `/${slug}/admin`;
    }
    if (variant === "platform" && location.pathname === "/platform") {
      return item.href === "/platform";
    }
    return location.pathname.startsWith(item.href) && item.href !== (
      variant === "store" ? `/${slug}/admin` : "/platform"
    );
  });
  const pageTitle = currentItem?.label || (variant === "platform" ? "Plataforma" : "Dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-white">
        <AdminSidebar items={items} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar items={items} onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader
          title={pageTitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
