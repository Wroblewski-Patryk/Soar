'use client';

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppLogoLink from "@/ui/components/AppLogoLink";
import FooterPreferencesSwitchers from "@/ui/components/FooterPreferencesSwitchers";
import { ErrorState, LoadingState } from "@/ui/components/ViewState";
import { useI18n } from "@/i18n/I18nProvider";

export default function AdminLayoutShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const router = useRouter();
  const year = new Date().getFullYear();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <main className="mx-auto w-full max-w-7xl px-4 py-8">
          <LoadingState title={t("admin.layout.auth.loading")} />
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <main className="mx-auto w-full max-w-7xl px-4 py-8">
          <ErrorState
            title={t("admin.layout.auth.deniedTitle")}
            description={t("admin.layout.auth.deniedDescription")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <header className="sticky top-0 z-40 border-b border-base-300/60 bg-base-100/80 backdrop-blur">
        <div className="navbar max-w-7xl mx-auto px-4 min-h-16">
          <AppLogoLink href="/" className="text-lg text-base-content" />
          <nav className="ml-auto flex items-center gap-2">
            <Link href="/admin/subscriptions" className="btn btn-ghost btn-sm">
              {t("admin.layout.nav.subscriptions")}
            </Link>
            <Link href="/admin/users" className="btn btn-ghost btn-sm">
              {t("admin.layout.nav.users")}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-base-300/60 bg-base-200/70 py-4 text-base-content/80">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4">
          <p className="text-sm">
            &copy; {year} {t("public.brand.name")}. {t("admin.layout.footer.rights")}
          </p>
          <FooterPreferencesSwitchers />
        </div>
      </footer>
    </div>
  );
}
