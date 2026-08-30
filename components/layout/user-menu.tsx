"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { User, LogOut } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function UserMenu() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const [open, setOpen] = useState(false);

  const user = data?.user;

  if (isPending) {
    return (
      <div
        className="w-9 h-9 rounded-full bg-surface-container-low animate-pulse"
        aria-label={t("accountMenu")}
      />
    );
  }

  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const roleLabel = user?.role === "ADMIN" ? t("roleAdmin") : t("roleStudent");

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        id="header-user"
        aria-label={t("accountMenu")}
      >
        {user ? (
          <span className="w-9 h-9 rounded-xl gradient-primary text-white flex items-center justify-center text-sm font-bold elevation-1">
            {initials}
          </span>
        ) : (
          <User className="w-6 h-6" />
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute end-0 top-full mt-2 w-72 z-50 bg-white rounded-2xl border border-outline-variant/40 elevation-3 overflow-hidden animate-scale-in"
            role="menu"
            aria-label={t("accountMenu")}
          >
            {user ? (
              <>
                <div className="px-5 py-4 flex items-center gap-3.5 border-b border-outline-variant/30">
                  <span className="w-12 h-12 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-lg shrink-0 elevation-1">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-label-md font-semibold text-on-surface truncate">
                      {user.name}
                    </p>
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-2">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className="rounded-full text-xs"
                  >
                    {roleLabel}
                  </Badge>
                </div>
                <div className="border-t border-outline-variant/30 p-1.5">
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      role="menuitem"
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-label-md transition-all duration-200",
                        pathname === "/admin/dashboard"
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-on-surface-variant hover:bg-surface-neutral",
                      )}
                    >
                      {t("adminDashboard")}
                    </Link>
                  )}
                  <Link
                    href="/my-questions"
                    onClick={() => setOpen(false)}
                    role="menuitem"
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-label-md transition-all duration-200",
                      pathname === "/my-questions"
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-on-surface-variant hover:bg-surface-neutral",
                    )}
                  >
                    {t("myQuestions")}
                  </Link>
                  <button
                    role="menuitem"
                    onClick={async () => {
                      setOpen(false);
                      await signOut();
                      router.refresh();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-label-md text-error hover:bg-error/5 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-3 flex flex-col gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="justify-start text-label-md rounded-xl"
                  id="header-login"
                >
                  <Link href="/login" onClick={() => setOpen(false)}>
                    {t("login")}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="justify-start text-label-md gradient-primary rounded-xl"
                  id="header-signup"
                >
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    {t("signup")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
