"use client";

import { useMemo, useState } from "react";
import { Search, Calendar as CalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useI18n } from "@/app/context/i18n";

/* ---------------------------------------------
   MOCKS alignés avec la base
----------------------------------------------*/
// Clients (status: prospect | actif | inactif)
const CLIENTS = [
  { id: "CL-001", status: "actif" },
  { id: "CL-002", status: "prospect" },
  { id: "CL-003", status: "inactif" },
  { id: "CL-004", status: "actif" },
  { id: "CL-005", status: "prospect" },
] as const;

// Users
const USERS = [
  { id: "U-001", displayName: "Shawn Stone", team_role: "UX/UI Designer" },
  { id: "U-002", displayName: "Randy Delgado", team_role: "UX/UI Designer" },
  { id: "U-003", displayName: "Emily Tyler", team_role: "Copywriter" },
  { id: "U-004", displayName: "Louis Castro", team_role: "Copywriter" },
];

// Calendar
const EVENTS = [
  { id: "EV-001", subject: "Présentation nouvelle offre", date: "2025-09-16", time: "17:00" },
  { id: "EV-002", subject: "Anniversaire d’Anna", date: "2025-09-16", time: "18:00" },
  { id: "EV-003", subject: "Anniversaire de Ray", date: "2025-09-17", time: "14:00" },
];

// Chat / Activity
const ACTIVITY = [
  { id: "A1", who: "Oscar Holloway", text: "A mis à jour la tâche « Mind Map » → En cours", when: "Il y a 2 h" },
  { id: "A2", who: "Emily Tyler", text: "A attaché un fichier à la tâche", when: "Il y a 3 h" },
  { id: "A3", who: "Emily Tyler", text: "A changé le statut de « Mind Map » → Terminé", when: "Hier" },
];

/* --------------------------------------------- */

export default function Dashboard() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  // Exemples de KPIs (dérivés des mocks)
  const totalClients = CLIENTS.length;
  const actifs = CLIENTS.filter((c) => c.status === "actif").length;
  const prospects = CLIENTS.filter((c) => c.status === "prospect").length;

  // Courbe: pipeline / revenus (exemple)
  const revenueData = [
    { month: "Jan", amount: 4000 },
    { month: "Fév", amount: 3000 },
    { month: "Mar", amount: 5200 },
    { month: "Avr", amount: 4700 },
    { month: "Mai", amount: 6200 },
    { month: "Juin", amount: 7600 },
  ];

  // Pie: statut des clients
  const customerStatusData = useMemo(
    () => [
      { name: t('activePie'), value: actifs },
      { name: t('prospectsPie'), value: prospects },
      { name: t('inactivePie'), value: totalClients - actifs - prospects },
    ],
    [actifs, prospects, totalClients, t]
  );

  const COLORS = ["#16A34A", "#64748B", "#EF4444"]; // green, slate, red

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Contenu principal */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('welcome')}</p>
            <h1 className="text-2xl font-semibold">{t('dashboard')}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder={t('searchDashboardPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <CalIcon className="h-4 w-4" />
              {t('currentWeek')}
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title={t('totalClients')} value={String(totalClients)} change="+3 cette semaine" />
          <StatCard title={t('activeClients')} value={String(actifs)} change="+1" />
          <StatCard title={t('prospects')} value={String(prospects)} change="+2" />
          <StatCard title={t('upcomingEvents')} value={String(EVENTS.length)} change="Moins 1 vs hier" />
        </div>

        {/* Charts + colonnes droites comme sur la maquette */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Colonne charts (x2) */}
          <div className="xl:col-span-2 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Courbe */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">{t('businessActivity')}</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Camembert */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">{t('clientStatus')}</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={customerStatusData} dataKey="value" nameKey="name" outerRadius={100} label>
                    {customerStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Workload (cartes membres) */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('teamWorkload')}</h2>
                <Button variant="ghost" size="sm">{t('seeAll')}</Button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {USERS.map((u) => (
                  <div key={u.id} className="rounded-xl border p-4">
                    <div className="font-medium">{u.displayName}</div>
                    <div className="text-xs text-gray-500">{u.team_role}</div>
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${30 + Math.random() * 60}%` }} />
                    </div>
                    <div className="mt-1 text-right text-xs text-gray-500">{t('estimatedLoad')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projets (liste compacte – style Woorkroom) */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('projects')}</h2>
                <Button variant="ghost" size="sm">{t('seeAll')}</Button>
              </div>
              <ul className="divide-y">
                {[
                  { id: "PRJ001265", name: "Medical App (iOS native)", tasks: 34, active: 13 },
                  { id: "PRJ001221", name: "Food Delivery Service", tasks: 50, active: 24 },
                  { id: "PRJ001260", name: "Food Delivery Service", tasks: 23, active: 20 },
                ].map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">ID {p.id}</div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{t('allTasks')}<span className="font-medium text-gray-900">{p.tasks}</span></div>
                      <div>{t('activeTasks')}<span className="font-medium text-gray-900">{p.active}</span></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Colonne droite : événements + activité */}
          <div className="flex flex-col gap-8">
            {/* Événements à venir */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('upcomingEvents')}</h2>
                <Button variant="ghost" size="sm">{t('seeAll')}</Button>
              </div>
              <ul className="space-y-3">
                {EVENTS.map((e) => (
                  <li key={e.id} className="rounded-lg border bg-gray-50 px-3 py-2">
                    <div className="font-medium">{e.subject}</div>
                    <div className="text-xs text-gray-600">
                      {new Date(e.date).toLocaleDateString("fr-FR")} · {e.time}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Flux d’activité */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('activityFeed')}</h2>
                <Button variant="ghost" size="sm">{t('seeMore')}</Button>
              </div>
              <ul className="space-y-3">
                {ACTIVITY.map((a) => (
                  <li key={a.id} className="rounded-lg border px-3 py-2">
                    <div className="text-sm">
                      <span className="font-medium">{a.who}</span> — {a.text}
                    </div>
                    <div className="text-xs text-gray-500">{a.when}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ----- Stat Card Component ----- */
function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  const positive = change.trim().startsWith("+");
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold">{value}</h3>
      <p className={`mt-1 text-sm ${positive ? "text-green-600" : "text-red-600"}`}>
        {change}
      </p>
    </div>
  );
}
