"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Calendar, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavCount {
  inbox: number;
  today: number;
  upcoming: number;
}

interface BottomNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  count?: number;
  isActive: boolean;
}

function BottomNavItem({ href, label, icon: Icon, count, isActive }: BottomNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground"
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {count !== undefined && count > 0 && (
          <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

interface BottomNavProps {
  counts?: NavCount;
}

export function BottomNav({ counts }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <BottomNavItem
        href="/inbox"
        label="Inbox"
        icon={Inbox}
        count={counts?.inbox}
        isActive={pathname === "/inbox"}
      />
      <BottomNavItem
        href="/today"
        label="Today"
        icon={Calendar}
        count={counts?.today}
        isActive={pathname === "/today"}
      />
      <BottomNavItem
        href="/upcoming"
        label="Upcoming"
        icon={CalendarDays}
        count={counts?.upcoming}
        isActive={pathname === "/upcoming"}
      />
    </nav>
  );
}
