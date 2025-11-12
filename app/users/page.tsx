"use client";

import { useMemo, useState } from "react";

// Schéma Users conforme à ta base
type User = {
  id: string;
  full_name: string;
  email: string;
  team_role: string;
  organisation_id: string;
  organisation_name: string; // jointure virtuelle pour affichage
  created_at: string; // ISO
};

// Données mockées cohérentes avec la DB
const MOCK_USERS: User[] = [
  {
    id: "U-001",
    full_name: "Alice Martin",
    email: "alice.martin@acme.com",
    team_role: "Sales Manager",
    organisation_id: "ORG-001",
    organisation_name: "Acme Corp",
    created_at: "2024-09-01T09:20:00Z",
  },
  {
    id: "U-002",
    full_name: "Sofiane Diallo",
    email: "sofiane.diallo@acme.com",
    team_role: "Support",
    organisation_id: "ORG-001",
    organisation_name: "Acme Corp",
    created_at: "2024-09-12T10:00:00Z",
  },
  {
    id: "U-003",
    full_name: "Carla Mendes",
    email: "carla@novatech.io",
    team_role: "Marketing Lead",
    organisation_id: "ORG-002",
    organisation_name: "NovaTech",
    created_at: "2024-08-15T08:00:00Z",
  },
  {
    id: "U-004",
    full_name: "Yann Legrand",
    email: "yann@startup.io",
    team_role: "CTO",
    organisation_id: "ORG-003",
    organisation_name: "Startup.io",
    created_at: "2024-07-05T13:30:00Z",
  },
];

export default function UsersPage() {
  const [q, setQ] = useState("");

  const users = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MOCK_USERS;
    return MOCK_USERS.filter(
      (u) =>
        u.full_name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.team_role.toLowerCase().includes(s) ||
        u.organisation_name.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500">
            Gérez les membres, leurs rôles et les organisations associées.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Ajouter un utilisateur
        </button>
      </div>

      {/* Barre de recherche */}
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
              <Th>Nom complet</Th>
              <Th>Email</Th>
              <Th>Rôle</Th>
              <Th>Organisation</Th>
              <Th>Date d’inscription</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <Td>{u.id}</Td>
                <Td className="font-medium">{u.full_name}</Td>
                <Td>{u.email}</Td>
                <Td>{u.team_role}</Td>
                <Td>{u.organisation_name}</Td>
                <Td>{new Date(u.created_at).toLocaleDateString()}</Td>
                <Td>
                  <div className="flex gap-3">
                    <button className="text-indigo-600 hover:underline">
                      Voir
                    </button>
                    <button className="text-gray-600 hover:underline">
                      Modifier
                    </button>
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

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>
      {children}
    </td>
  );
}
