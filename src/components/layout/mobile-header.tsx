"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/inbox": "Inbox",
  "/today": "Today",
  "/upcoming": "Upcoming",
};

export function MobileHeader() {
  const pathname = usePathname();

  // Get page title or default to TodoIt
  const pageTitle = PAGE_TITLES[pathname] || "TodoIt";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
    </header>
  );
}
