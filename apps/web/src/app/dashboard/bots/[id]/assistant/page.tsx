"use client";

import { useParams } from "next/navigation";
import { LuBot, LuList } from "react-icons/lu";

import BotsManagement from "@/features/bots/components/BotsManagement";
import { useI18n } from "@/i18n/I18nProvider";
import { PageTitle } from "@/ui/layout/dashboard/PageTitle";
import { dashboardRoutes } from "@/ui/layout/dashboard/dashboardRoutes";

export default function BotAssistantPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const id = params.id;

  return (
    <section className="w-full space-y-4">
      <PageTitle
        title={t("dashboard.nav.bots")}
        icon={<LuBot className="h-5 w-5" />}
        breadcrumb={[
          { label: t("dashboard.common.dashboard"), href: "/dashboard" },
          { label: t("dashboard.nav.bots"), href: dashboardRoutes.bots.list },
          { label: t("dashboard.bots.page.breadcrumbAssistant"), icon: <LuList className="h-3.5 w-3.5" /> },
        ]}
      />

      <BotsManagement initialTab="assistant" lockedTab="assistant" preferredBotId={id} />
    </section>
  );
}
