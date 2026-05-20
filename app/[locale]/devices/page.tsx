import { setRequestLocale } from "next-intl/server";
import { DevicesPanel } from "@/components/dashboard/devices-panel";

type Props = {
  params: { locale: string };
};

export default async function DevicesPage({ params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);

  return <DevicesPanel />;
}
