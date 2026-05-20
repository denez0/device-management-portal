import { setRequestLocale } from "next-intl/server";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

type Props = {
  params: { locale: string };
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);

  return <DashboardOverview />;
}
