"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { parseError } from "@/lib/dashboard/api";
import { REQUEST_TYPES, type SupportRequest } from "@/lib/dashboard/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RequestsPanel() {
  const t = useTranslations("requests");
  const tTypes = useTranslations("requestTypes");

  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestFormError, setRequestFormError] = useState<string | null>(null);
  const [requestForm, setRequestForm] = useState({
    deviceId: "",
    requestType: "support" as (typeof REQUEST_TYPES)[number],
    description: "",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      setRequestsLoading(true);
      setRequestsError(null);
      try {
        const res = await fetch("/api/requests");
        if (!res.ok) {
          throw new Error(await parseError(res, t("loadError")));
        }
        const data = (await res.json()) as SupportRequest[];
        if (!cancelled) setRequests(data);
      } catch (err) {
        if (!cancelled) {
          setRequestsError(
            err instanceof Error ? err.message : t("loadError")
          );
        }
      } finally {
        if (!cancelled) setRequestsLoading(false);
      }
    }

    loadRequests();
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshRequests() {
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      const res = await fetch("/api/requests");
      if (!res.ok) {
        throw new Error(await parseError(res, t("loadError")));
      }
      setRequests((await res.json()) as SupportRequest[]);
    } catch (err) {
      setRequestsError(
        err instanceof Error ? err.message : t("loadError")
      );
    } finally {
      setRequestsLoading(false);
    }
  }

  async function handleCreateRequest(e: FormEvent) {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestFormError(null);
    try {
      const deviceId = Number(requestForm.deviceId);
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          requestType: requestForm.requestType,
          description: requestForm.description,
        }),
      });
      if (!res.ok) {
        throw new Error(await parseError(res, t("createError")));
      }
      setRequestForm({
        deviceId: "",
        requestType: "support",
        description: "",
      });
      await refreshRequests();
    } catch (err) {
      setRequestFormError(
        err instanceof Error ? err.message : t("createError")
      );
    } finally {
      setRequestSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

  return (
    <section aria-labelledby="requests-heading">
      <h1 id="requests-heading" className="mb-6 text-2xl font-semibold tracking-tight">
        {t("title")}
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-sm">{t("createTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted-foreground">
                  {t("deviceId")}
                </span>
                <input
                  type="number"
                  min={1}
                  required
                  value={requestForm.deviceId}
                  onChange={(e) =>
                    setRequestForm((f) => ({
                      ...f,
                      deviceId: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder={t("deviceIdPlaceholder")}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted-foreground">
                  {t("requestType")}
                </span>
                <select
                  required
                  value={requestForm.requestType}
                  onChange={(e) =>
                    setRequestForm((f) => ({
                      ...f,
                      requestType: e.target
                        .value as (typeof REQUEST_TYPES)[number],
                    }))
                  }
                  className={inputClass}
                >
                  {REQUEST_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {tTypes(type)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">
                {t("description")}
              </span>
              <textarea
                required
                rows={3}
                value={requestForm.description}
                onChange={(e) =>
                  setRequestForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder={t("descriptionPlaceholder")}
              />
            </label>
            {requestFormError && (
              <p className="text-sm text-destructive">{requestFormError}</p>
            )}
            <Button type="submit" disabled={requestSubmitting}>
              {requestSubmitting ? t("submitting") : t("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {requestsError && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {requestsError}
        </p>
      )}

      {requestsLoading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : requests.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id}>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      #{req.id} · {t("devicePrefix")} {req.deviceId}
                    </span>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize">
                        {tTypes(req.requestType as (typeof REQUEST_TYPES)[number])}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize">
                        {req.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">{req.description}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
