"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations("header");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark =
    mounted && (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={t("themeToggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {!mounted ? (
        <span className="size-4" aria-hidden />
      ) : isDark ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </Button>
  );
}
