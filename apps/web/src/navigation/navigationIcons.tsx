import {
  Banknote,
  Briefcase,
  Building2,
  CalendarClock,
  CircleDollarSign,
  Cog,
  FileText,
  House,
  Inbox,
  Layers,
  LayoutGrid,
  MapPin,
  Package,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { NavigationIconName } from "./navigationRegistry";

const ICONS: Record<NavigationIconName, LucideIcon> = {
  house: House,
  users: Users,
  inbox: Inbox,
  "file-text": FileText,
  "layout-grid": LayoutGrid,
  briefcase: Briefcase,
  wrench: Wrench,
  "circle-dollar-sign": CircleDollarSign,
  package: Package,
  cog: Cog,
  truck: Truck,
  "shopping-cart": ShoppingCart,
  "user-round": UserRound,
  "calendar-clock": CalendarClock,
  banknote: Banknote,
  "building-2": Building2,
  scale: Scale,
  "map-pin": MapPin,
  layers: Layers,
  "shield-check": ShieldCheck,
};

export function navigationIcon(name: NavigationIconName): LucideIcon {
  return ICONS[name];
}
