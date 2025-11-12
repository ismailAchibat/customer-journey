"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Type conforme à la DB
type Client = {
  id: string;
  name: string;
  company: string;
  phone_number: string;
  email: string;
  country: string;
  status: "prospect" | "actif" | "inactif";
  createdAt: string; // ISO
};

// Données mock alignées sur la DB (tu brancheras ensuite Drizzle)
const CLIENTS: Client[] = [
  {
    id: "CL-001",
    name: "Jean Dupont",
    company: "Acme Corp",
    phone_number: "+33 6 11 22 33 44",
    email: "jean.dupont@acme.com",
    country: "France",
    status: "actif",
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "CL-002",
    name: "Aïcha Konaté",
    company: "NovaTech",
    phone_number: "+221 77 123 45 67",
    email: "aicha@novatech.io",
    country: "Sénégal",
    status: "prospect",
    createdAt: "2025-02-02T09:30:00Z",
  },
  {
    id: "CL-003",
    name: "Carlos Mendes",
    company: "Startup.io",
    phone_number: "+351 912 345 678",
    email: "carlos@startup.io",
    country: "Portugal",
    status: "inactif",
    createdAt: "2024-11-15T14:10:00Z",
  },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let rows = CLIENTS;
    if (s) {
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.company.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.phone_number.toLowerCase().includes(s) ||
          c.country.toLowerCase().includes(s) ||
          c.id.toLowerCase().includes(s)
      );
    }
    rows = rows.slice().sort((a, b) =>
      sortNewest
        ? +new Date(b.createdAt) - +new Date(a.createdAt)
        : +new Date(a.createdAt) - +new Date(b.createdAt)
    );
    return rows;
  }, [search, sortNewest]);

  const badgeClass = (status: Client["status"]) =>
    status === "actif"
      ? "bg-green-100 text-green-700"
      : status === "prospect"
        ? "bg-gray-100 text-gray-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Contenu principal */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Clients</h1>

          <div className="relative w-72">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Rechercher (nom, email, société, pays, id)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold">Tous les clients</h2>
              <p className="text-sm font-medium text-green-600">
                {filtered.filter((c) => c.status === "actif").length} actifs
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortNewest((v) => !v)}
            >
              Trier : {sortNewest ? "Plus récents" : "Plus anciens"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Société</th>
                <th className="px-6 py-3">Téléphone</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Pays</th>
                <th className="px-6 py-3">Créé le</th>
                <th className="px-6 py-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{c.id}</td>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.company}</td>
                  <td className="px-6 py-4">{c.phone_number}</td>
                  <td className="px-6 py-4">{c.email}</td>
                  <td className="px-6 py-4">{c.country}</td>
                  <td className="px-6 py-4">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge className={badgeClass(c.status)}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination (statique pour l’instant) */}
          <div className="flex items-center justify-end gap-2 border-t px-6 py-4 text-sm">
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="ghost" size="sm">
              2
            </Button>
            <Button variant="ghost" size="sm">
              3
            </Button>
            <Button variant="ghost" size="sm">
              …
            </Button>
            <Button variant="ghost" size="sm">
              10
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
