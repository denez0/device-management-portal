import { setRequestLocale } from "next-intl/server";
import { RequestsPanel } from "@/components/dashboard/requests-panel";

type Props = {
  params: { locale: string };
};

export default async function RequestsPage({ params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);

  return <RequestsPanel />;
}
