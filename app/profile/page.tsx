"use client";

import { useState } from "react";

type Tab = "projects" | "team" | "vacations";

export default function ProfilePage() {
    const [tab, setTab] = useState<Tab>("projects");

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">Mon profil</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                {/* Colonne gauche : carte profil */}
                <aside className="rounded-2xl border bg-white p-5">
                    <div className="flex items-center gap-3">
                        {/* Mets ton image dans /public/avatars/evan.jpg */}
                        <img
                            src="/avatars/evan.jpg"
                            alt="Photo de profil"
                            className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                            <div className="text-lg font-semibold">Evan Yates</div>
                            <div className="text-sm text-gray-500">UX/UI Designer</div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 text-sm">
                        <Section title="Infos principales">
                            <Field label="Fonction" value="UX/UI Designer" />
                            <Field label="Équipe" value="Produit" />
                            <Field label="Organisation" value="Customer Journey" />
                            <Field label="Ville" value="Le Mans, FR" />
                        </Section>

                        <Section title="Contact">
                            <Field label="Email" value="evan@company.com" />
                            <Field label="Téléphone" value="+33 6 12 34 56 78" />
                            <Field label="Depuis" value="12/06/2024" />
                        </Section>
                    </div>
                </aside>

                {/* Colonne droite : contenu par onglets */}
                <main className="rounded-2xl border bg-white">
                    {/* Onglets */}
                    <div className="flex items-center gap-2 border-b px-4 py-3">
                        <TabBtn active={tab === "projects"} onClick={() => setTab("projects")}>
                            Projets
                        </TabBtn>
                        <TabBtn active={tab === "team"} onClick={() => setTab("team")}>
                            Équipe
                        </TabBtn>
                        <TabBtn active={tab === "vacations"} onClick={() => setTab("vacations")}>
                            Congés
                        </TabBtn>
                    </div>

                    {/* Contenu */}
                    <div className="p-4">
                        {tab === "projects" && <ProjectsTab />}
                        {tab === "team" && <TeamTab />}
                        {tab === "vacations" && <VacationsTab />}
                    </div>
                </main>
            </div>
        </div>
    );
}

/* ---------- Sous-composants ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {title}
            </div>
            <div className="space-y-2">{children}</div>
        </div>
    );
}
function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
function TabBtn({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-3 py-1.5 text-sm ${active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
        >
            {children}
        </button>
    );
}

/* ----- Onglet Projets ----- */
function ProjectsTab() {
    const projects = [
        { id: "PRJ-001", name: "Medical App (iOS native)", created: "12 sept. 2024", risk: "Moyen", tasks: 34, active: 13, assignees: 5 },
        { id: "PRJ-002", name: "Food Delivery Service", created: "10 sept. 2024", risk: "Moyen", tasks: 50, active: 24, assignees: 4 },
        { id: "PRJ-003", name: "Internal Project", created: "28 mai 2024", risk: "Faible", tasks: 23, active: 20, assignees: 6 },
    ];
    return (
        <ul className="space-y-3">
            {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">
                    <div className="min-w-0">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="text-xs text-gray-500">Créé le {p.created} • Risque {p.risk}</div>
                    </div>
                    <div className="hidden gap-6 text-sm text-gray-600 sm:flex">
                        <div>Toutes les tâches: <span className="font-semibold text-gray-900">{p.tasks}</span></div>
                        <div>Tâches actives: <span className="font-semibold text-gray-900">{p.active}</span></div>
                        <div>Assignés: <span className="font-semibold text-gray-900">{p.assignees}</span></div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

/* ----- Onglet Équipe ----- */
function TeamTab() {
    const people = [
        { id: "U-001", name: "Shawn Stone", role: "UX/UI Designer" },
        { id: "U-002", name: "Randy Delgado", role: "UX/UI Designer" },
        { id: "U-003", name: "Emily Tyler", role: "Copywriter" },
        { id: "U-004", name: "Blake Silva", role: "iOS Developer" },
    ];
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {people.map((p) => (
                <div key={p.id} className="rounded-xl border p-4 text-center">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gray-200" />
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.role}</div>
                </div>
            ))}
        </div>
    );
}

/* ----- Onglet Congés ----- */
function VacationsTab() {
    const counters = [
        { label: "Vacances", value: 12 },
        { label: "Congé maladie", value: 5 },
        { label: "Télétravail", value: 42 },
    ];
    const requests = [
        { id: "R-101", type: "Sick Leave", created: "5 sept. 2025", status: "En attente" },
        { id: "R-102", type: "Work remotely", created: "9 sept. 2025", status: "Approuvé" },
        { id: "R-103", type: "Vacation", created: "12 sept. 2025", status: "Approuvé" },
    ];
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {counters.map((c) => (
                    <div key={c.label} className="rounded-xl border bg-gray-50 p-4 text-center">
                        <div className="text-2xl font-semibold">{c.value}</div>
                        <div className="text-sm text-gray-600">{c.label}</div>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl border">
                <table className="min-w-full divide-y bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Créé le</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {requests.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{r.id}</td>
                                <td className="px-4 py-3">{r.type}</td>
                                <td className="px-4 py-3">{r.created}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${r.status === "Approuvé"
                                                ? "bg-green-100 text-green-700"
                                                : r.status === "En attente"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {r.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
