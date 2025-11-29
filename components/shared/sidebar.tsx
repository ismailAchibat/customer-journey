"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/hooks/use-user-store";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/app/context/i18n";
import { LanguageSwitcher } from "../ui/language-switcher";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useUserStore();
  const { t } = useI18n();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const items = [
    { label: t('dashboard'), path: "/dashboard", icon: "/icons/dashboard.png" },
    { label: t('clients'), path: "/clients", icon: "/icons/clients.png" },
    { label: t('users'), path: "/users", icon: "/icons/users.png" },
    { label: t('messages'), path: "/messages", icon: "/icons/message.png" },
    { label: t('agenda'), path: "/agenda", icon: "/icons/calendar.png" },
    { label: t('projects'), path: "/projects", icon: "/icons/projects.png" },
    { label: t('aiAssistant'), path: "/ai-assistant", icon: "/icons/ai.png" },
    { label: t('settings'), path: "/settings", icon: "/icons/settings.png" },
    { label: t('help'), path: "/help", icon: "/icons/help.png" },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r flex flex-col">
      {/* Zone haute : logo + titre */}
      <div className="flex-1 overflow-y-auto">
        <Link href={"/"}>
          <div className="flex items-center gap-3 p-6">
            <Image
              src="/logos.png"
              alt="Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-gray-900">Customer Journey</span>
          </div>
        </Link>

        {/* Liste de navigation */}
        <nav className="px-3 space-y-1">
          {items.map((item) => (
            <SidebarItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              active={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
        </nav>
      </div>

      {/* Profil utilisateur (bas de la sidebar) */}
      <div className="p-4 border-t">
        <Link
          href="/profile"
          className="w-full flex items-center gap-3 hover:bg-gray-50 transition rounded-md p-2"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
            E
          </div>
          <div>
            <p className="font-semibold text-gray-900">{t('evano')}</p>
            <p className="text-sm text-gray-500">{t('projectManager')}</p>
          </div>
        </Link>
        <div className="mt-2">
          <LanguageSwitcher />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('logout')}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

/* --- Élément de navigation individuel --- */
function SidebarItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <Image
        src={icon}
        alt={`${label} icon`}
        width={18}
        height={18}
        className="opacity-80"
      />
      {label}
    </button>
  );
}
