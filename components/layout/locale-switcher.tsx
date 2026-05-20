"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const locales = ["en", "pl"] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="inline-flex rounded-lg border border-border p-0.5">
      {locales.map((loc) => (
        <Button
          key={loc}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "min-w-9 uppercase",
            locale === loc && "bg-muted text-foreground"
          )}
          onClick={() => router.replace(pathname, { locale: loc })}
        >
          {loc}
        </Button>
      ))}
    </div>
  );
}
