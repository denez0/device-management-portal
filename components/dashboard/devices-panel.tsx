"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { parseError } from "@/lib/dashboard/api";
import type { Device } from "@/lib/dashboard/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DevicesPanel() {
  const t = useTranslations("devices");

  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [devicesError, setDevicesError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [deviceSubmitting, setDeviceSubmitting] = useState(false);
  const [deviceFormError, setDeviceFormError] = useState<string | null>(null);
  const [deviceForm, setDeviceForm] = useState({
    name: "",
    model: "",
    userId: "",
    status: "active",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false;

    async function loadDevices() {
      setDevicesLoading(true);
      setDevicesError(null);
      try {
        const res = await fetch("/api/devices");
        if (!res.ok) {
          throw new Error(await parseError(res, t("loadError")));
        }
        const data = (await res.json()) as Device[];
        if (!cancelled) setDevices(data);
      } catch (err) {
        if (!cancelled) {
          setDevicesError(
            err instanceof Error ? err.message : t("loadError")
          );
        }
      } finally {
        if (!cancelled) setDevicesLoading(false);
      }
    }

    loadDevices();
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshDevices() {
    setDevicesLoading(true);
    setDevicesError(null);
    try {
      const res = await fetch("/api/devices");
      if (!res.ok) {
        throw new Error(await parseError(res, t("loadError")));
      }
      setDevices((await res.json()) as Device[]);
    } catch (err) {
      setDevicesError(
        err instanceof Error ? err.message : t("loadError")
      );
    } finally {
      setDevicesLoading(false);
    }
  }

  async function handleCreateDevice(e: FormEvent) {
    e.preventDefault();
    setDeviceSubmitting(true);
    setDeviceFormError(null);
    try {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deviceForm.name,
          model: deviceForm.model,
          userId: deviceForm.userId,
          status: deviceForm.status || "active",
        }),
      });
      if (!res.ok) {
        throw new Error(await parseError(res, t("createError")));
      }
      setDeviceForm({ name: "", model: "", userId: "", status: "active" });
      setModalOpen(false);
      await refreshDevices();
    } catch (err) {
      setDeviceFormError(
        err instanceof Error ? err.message : t("createError")
      );
    } finally {
      setDeviceSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

  return (
    <section aria-labelledby="devices-heading">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 id="devices-heading" className="text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <Button
          type="button"
          onClick={() => {
            setDeviceFormError(null);
            setModalOpen(true);
          }}
        >
          {t("orderNew")}
        </Button>
      </div>

      {devicesError && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {devicesError}
        </p>
      )}

      {devicesLoading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : devices.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {devices.map((device) => (
            <li key={device.id}>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                  <CardTitle>{device.name}</CardTitle>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs capitalize">
                    {device.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <dt className="font-mono text-foreground/50">
                        {t("modelLabel")}
                      </dt>
                      <dd>{device.model}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-mono text-foreground/50">
                        {t("userLabel")}
                      </dt>
                      <dd>{device.userId}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-mono text-foreground/50">
                        {t("idLabel")}
                      </dt>
                      <dd>{device.id}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent showCloseButton={!deviceSubmitting}>
          <DialogHeader>
            <DialogTitle>{t("modalTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDevice} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">
                {t("name")}
              </span>
              <input
                type="text"
                required
                value={deviceForm.name}
                onChange={(e) =>
                  setDeviceForm((f) => ({ ...f, name: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">
                {t("model")}
              </span>
              <input
                type="text"
                required
                value={deviceForm.model}
                onChange={(e) =>
                  setDeviceForm((f) => ({ ...f, model: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">
                {t("userId")}
              </span>
              <input
                type="text"
                required
                value={deviceForm.userId}
                onChange={(e) =>
                  setDeviceForm((f) => ({ ...f, userId: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">
                {t("status")}
              </span>
              <input
                type="text"
                value={deviceForm.status}
                onChange={(e) =>
                  setDeviceForm((f) => ({ ...f, status: e.target.value }))
                }
                placeholder={t("statusPlaceholder")}
                className={inputClass}
              />
            </label>
            {deviceFormError && (
              <p className="text-sm text-destructive">{deviceFormError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={deviceSubmitting}
                onClick={() => setModalOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={deviceSubmitting}>
                {deviceSubmitting ? t("creating") : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
