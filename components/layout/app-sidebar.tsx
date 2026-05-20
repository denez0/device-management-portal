"use client";

import { LayoutDashboard, Monitor, MessageSquare, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/devices", icon: Monitor, labelKey: "devices" as const },
  { href: "/requests", icon: MessageSquare, labelKey: "requests" as const },
];

type AppSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map(({ href, icon: Icon, labelKey }) => (
        <Link
          key={href}
          href={href}
          onClick={onMobileClose}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(href)
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          )}
        >
          <Icon className="size-4 shrink-0" />
          {t(labelKey)}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            Bosch
          </span>
        </div>
        {nav}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label={t("close")}
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full w-64 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
              <span className="text-sm font-semibold tracking-tight">Bosch</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("close")}
                onClick={onMobileClose}
              >
                <X />
              </Button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
