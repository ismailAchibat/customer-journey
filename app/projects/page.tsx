"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

// === Mocks alignés DB ===
type Client = { id: string; name: string };
type User = { id: string; displayName: string };

const CLIENTS: Client[] = [
    { id: "CL-001", name: "Startup.io" },
    { id: "CL-002", name: "Acme Corp" },
    { id: "CL-003", name: "NovaTech" },
];

const USERS: User[] = [
    { id: "U-001", displayName: "Alice Martin" },
    { id: "U-002", displayName: "Jean Dupont" },
    { id: "U-003", displayName: "Sofiane Diallo" },
];

// Projet = références vers Clients/Users
type Project = {
    id: string;
    name: string;
    clientId: string;   // -> Clients.id
    ownerId: string;    // -> Users.id
    status: "En cours" | "Terminé" | "En attente";
    progress: number;   // 0..100
    createdAt: string;  // ISO
};

const PROJECTS: Project[] = [
    { id: "PRJ-001", name: "Refonte site vitrine", clientId: "CL-001", ownerId: "U-001", status: "En cours", progress: 65, createdAt: "2025-05-10T10:00:00Z" },
    { id: "PRJ-002", name: "Campagne marketing Q4", clientId: "CL-002", ownerId: "U-002", status: "Terminé", progress: 100, createdAt: "2025-03-02T09:00:00Z" },
    { id: "PRJ-003", name: "Application mobile CRM", clientId: "CL-003", ownerId: "U-003", status: "En attente", progress: 10, createdAt: "2025-06-01T12:00:00Z" },
];

export default function ProjectsPage() {
    const [q, setQ] = useState("");
    const data = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return PROJECTS;
        return PROJECTS.filter(
            (p) =>
                p.id.toLowerCase().includes(s) ||
                p.name.toLowerCase().includes(s) ||
                lookupClient(p.clientId).toLowerCase().includes(s) ||
                lookupUser(p.ownerId).toLowerCase().includes(s)
        );
    }, [q]);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Projets</h1>
                    <p className="text-sm text-gray-500">Gérez vos projets et suivez l’avancement.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Rechercher (id, nom, client, responsable)…"
                        className="h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Link href="/projects/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                        Nouveau projet
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <Th>ID</Th>
                            <Th>Nom</Th>
                            <Th>Client</Th>
                            <Th>Responsable</Th>
                            <Th>Statut</Th>
                            <Th>Progression</Th>
                            <Th></Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <Td>{p.id}</Td>
                                <Td className="font-medium">{p.name}</Td>
                                <Td>{lookupClient(p.clientId)}</Td>
                                <Td>{lookupUser(p.ownerId)}</Td>
                                <Td>
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "Terminé"
                                            ? "bg-green-100 text-green-700"
                                            : p.status === "En attente"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {p.status}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="w-full rounded-full bg-gray-200 h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${p.progress === 100 ? "bg-green-600" : "bg-indigo-600"}`}
                                            style={{ width: `${p.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{p.progress}%</span>
                                </Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <Link href={`/projects/${p.id}`} className="text-indigo-600 hover:underline">
                                            Détails
                                        </Link>
                                        <Link href={`/projects/${p.id}/board`} className="text-gray-600 hover:underline">
                                            Board
                                        </Link>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function lookupClient(id: string) {
    return CLIENTS.find((c) => c.id === id)?.name ?? id;
}
function lookupUser(id: string) {
    return USERS.find((u) => u.id === id)?.displayName ?? id;
}

function Th({ children }: { children?: React.ReactNode }) {
    return (
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            {children}
        </th>
    );
}

function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>;
}

