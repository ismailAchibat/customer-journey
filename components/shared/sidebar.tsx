"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // === Navigation adaptée au projet Customer Journey ===
  const items = [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Clients", path: "/clients" },
    { label: "Utilisateurs", path: "/users" },
    { label: "Messagerie", path: "/messages" },
    { label: "Agenda", path: "/agenda" },
    { label: "Tâches", path: "/tasks" },
    { label: "Événements", path: "/events" },
    { label: "Quick Action (IA)", path: "/ai-assistant" },
    { label: "Paramètres", path: "/settings" },
    { label: "Aide", path: "/help" },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r flex flex-col">
      {/* Zone haute : logo + titre */}
      <div className="flex-1 overflow-y-auto">
        <Link href={"/"}>
          <div className="p-6 text-2xl font-bold text-gray-900">
            Customer Journey
          </div>
        </Link>

        {/* Liste de navigation */}
        <nav className="px-4 space-y-2">
          {items.map((item) => (
            <SidebarItem
              key={item.path}
              label={item.label}
              active={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
        </nav>
      </div>

      {/* Profil utilisateur (bas de la sidebar) */}
      <div className="p-4 border-t flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
          E
        </div>
        <div>
          <p className="font-semibold">Evano</p>
          <p className="text-sm text-gray-500">Chef de projet</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

function SidebarItem({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full px-4 py-2 rounded-xl text-sm font-medium transition ${active
        ? "bg-indigo-100 text-indigo-700"
        : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
}
