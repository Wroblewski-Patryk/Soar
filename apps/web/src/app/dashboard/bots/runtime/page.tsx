import { redirect } from "next/navigation";
import { dashboardRoutes } from "@/ui/layout/dashboard/dashboardRoutes";

type BotsRuntimePageProps = {
  searchParams?: Promise<{
    botId?: string;
    legacy?: string;
  }>;
};

export default async function BotsRuntimePage({ searchParams }: BotsRuntimePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const botId = params?.botId?.trim();
  const legacy = params?.legacy?.trim();

  if (botId) {
    redirect(dashboardRoutes.bots.preview(botId));
  }

  if (legacy === "orders") {
    redirect(`${dashboardRoutes.home}#orders`);
  }

  if (legacy === "positions") {
    redirect(`${dashboardRoutes.home}#positions`);
  }

  redirect(dashboardRoutes.bots.list);
}
