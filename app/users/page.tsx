"use client";

import { useMemo, useState } from "react";

// Schéma Users (mock conforme à ton MCD)
type User = {
    id: string;
    displayName: string;
    team_role: string;
    organisation: string;
    createdAt: string; // ISO
};

const MOCK_USERS: User[] = [
    { id: "U-001", displayName: "Alice Martin", team_role: "Sales Manager", organisation: "Acme Corp", createdAt: "2024-09-01T09:20:00Z" },
    { id: "U-002", displayName: "Sofiane Diallo", team_role: "Support", organisation: "Acme Corp", createdAt: "2024-09-12T10:00:00Z" },
    { id: "U-003", displayName: "Carla Mendes", team_role: "Marketing Lead", organisation: "NovaTech", createdAt: "2024-08-15T08:00:00Z" },
    { id: "U-004", displayName: "Yann Legrand", team_role: "CTO", organisation: "Startup.io", createdAt: "2024-07-05T13:30:00Z" },
];

export default function UsersPage() {
    const [q, setQ] = useState("");
    const users = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return MOCK_USERS;
        return MOCK_USERS.filter(
            (u) =>
                u.displayName.toLowerCase().includes(s) ||
                u.team_role.toLowerCase().includes(s) ||
                u.organisation.toLowerCase().includes(s)
        );
    }, [q]);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Utilisateurs</h1>
                    <p className="text-sm text-gray-500">
                        Gérez les membres, rôles et organisations.
                    </p>
                </div>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                    Ajouter un utilisateur
                </button>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex items-center gap-3">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher un utilisateur, rôle ou organisation…"
                    className="h-10 w-full max-w-md rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                    Exporter
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border bg-white">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <Th>ID</Th>
                            <Th>Nom</Th>
                            <Th>Rôle</Th>
                            <Th>Organisation</Th>
                            <Th>Inscription</Th>
                            <Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <Td>{u.id}</Td>
                                <Td className="font-medium">{u.displayName}</Td>
                                <Td>{u.team_role}</Td>
                                <Td>{u.organisation}</Td>
                                <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                                <Td>
                                    <div className="flex gap-3">
                                        <button className="text-indigo-600 hover:underline">Voir</button>
                                        <button className="text-gray-600 hover:underline">Modifier</button>
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

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            {children}
        </th>
    );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>;
}
