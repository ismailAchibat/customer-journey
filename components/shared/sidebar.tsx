"use client";

import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Product", path: "/product" },
    { label: "Customers", path: "/customers" },
    { label: "Income", path: "/income" },
    { label: "Promote", path: "/promote" },
    { label: "Help", path: "/help" },
  ];

  return (
    // make the aside exactly the viewport height and stick it to the top
    <aside className="w-64 h-screen sticky top-0 bg-white border-r flex flex-col">
      {/* top area grows and becomes scrollable if there are many items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 text-2xl font-bold text-gray-900">Dashboard</div>
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

      {/* Bottom profile section - stays visible at bottom */}
      <div className="p-4 border-t flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
          E
        </div>
        <div>
          <p className="font-semibold">Evano</p>
          <p className="text-sm text-gray-500">Project Manager</p>
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
      className={`flex w-full px-4 py-2 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
