import type { LucideIcon } from "lucide-react";
import {
  Store,
  Wallet,
  Users,
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Tag,
  Settings,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  href: string;
  end?: boolean;
}

export const platformNavItems: SidebarItem[] = [
  { label: "Lojas", icon: Store, href: "/platform", end: true },
  { label: "Saques", icon: Wallet, href: "/platform/withdrawals", end: true },
  { label: "Proprietários", icon: Users, href: "/platform/owners", end: true },
];

export function getStoreNavItems(slug: string): SidebarItem[] {
  return [
    { label: "Dashboard", icon: LayoutDashboard, href: `/${slug}/admin`, end: true },
    { label: "Pedidos", icon: ClipboardList, href: `/${slug}/admin/orders`, end: true },
    { label: "Cardápio", icon: UtensilsCrossed, href: `/${slug}/admin/products`, end: true },
    { label: "Categorias", icon: Tag, href: `/${slug}/admin/categories`, end: true },
    { label: "Saques", icon: Wallet, href: `/${slug}/admin/withdrawals`, end: true },
    { label: "Configurações", icon: Settings, href: `/${slug}/admin/settings`, end: true },
  ];
}
