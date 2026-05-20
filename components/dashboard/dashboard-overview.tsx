"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Monitor, MessageSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardOverview() {
  const t = useTranslations("dashboard");

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>
      </header>

      <h2 className="mb-4 text-lg font-medium">{t("overview")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="size-5 text-muted-foreground" />
              <CardTitle>{t("devicesTitle")}</CardTitle>
            </div>
            <CardDescription>{t("devicesDescription")}</CardDescription>
          </CardHeader>
          <CardContent />
          <CardFooter>
            <Link
              href="/devices"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              {t("devicesAction")}
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-muted-foreground" />
              <CardTitle>{t("requestsTitle")}</CardTitle>
            </div>
            <CardDescription>{t("requestsDescription")}</CardDescription>
          </CardHeader>
          <CardContent />
          <CardFooter>
            <Link
              href="/requests"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              {t("requestsAction")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
