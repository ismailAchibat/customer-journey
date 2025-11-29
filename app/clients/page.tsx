"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { addClient } from "@/services/database/clients";
import { useI18n } from "@/app/context/i18n";

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

// Données mock alignées sur la DB 
type DbClientRow = {
  id: string;
  name: string;
  company: string | null;
  phoneNumber: string | null;
  email: string | null;
  country: string | null;
  status: "prospect" | "actif" | "inactif" | null;
  createdAt: Date | string;
};

// ⚠️ Remplace ceci par ton vrai tableau issu de la requête (props, fetch, etc.)
const DB_CLIENTS: DbClientRow[] = [
  // ...tes lignes DB ici
];

// Variable utilisée par la page (même API qu’avant)
const CLIENTS: Client[] = DB_CLIENTS.map((r) => ({
  id: r.id,
  name: r.name,
  company: r.company ?? "",
  phone_number: r.phoneNumber ?? "",
  email: r.email ?? "",
  country: r.country ?? "",
  status: (r.status ?? "prospect"),
  createdAt:
    typeof r.createdAt === "string"
      ? r.createdAt
      : r.createdAt.toISOString(),
}));


export default function ClientsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);


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
          <h1 className="text-2xl font-semibold">{t('clients')}</h1>

          <div className="relative w-72">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder={t('searchClientPlaceholder')}
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
              <h2 className="text-lg font-semibold">{t('allClients')}</h2>
              <p className="text-sm font-medium text-green-600">
                {filtered.filter((c) => c.status === "actif").length} {t('active')}
              </p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                {t('newClient')}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('newClient')}</DialogTitle>
              </DialogHeader>

              {/* Formulaire + appel à addClient */}
              <form
                className="grid gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);

                  try {
                    setSaving(true);
                    await addClient({
                      name: String(fd.get("name") || ""),
                      company: String(fd.get("company") || ""),
                      phoneNumber: String(fd.get("phoneNumber") || ""),
                      email: String(fd.get("email") || ""),
                      country: String(fd.get("country") || ""),
                      status: (fd.get("status") as "prospect" | "actif" | "inactif") || "prospect",
                      organisationId: "org_001", // ← remplace par l'ID réel
                    });

                    // reset + close
                    (e.currentTarget as HTMLFormElement).reset();
                    setOpenDialog(false);
                  } catch (err) {
                    console.error(err);
                    alert(t('addClientError'));
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <input name="name" className="h-10 rounded-lg border px-3" placeholder={t('name')} required />
                <input name="company" className="h-10 rounded-lg border px-3" placeholder={t('company')} />
                <input name="phoneNumber" className="h-10 rounded-lg border px-3" placeholder={t('phone')} />
                <input name="email" type="email" className="h-10 rounded-lg border px-3" placeholder={t('email')} />
                <input name="country" className="h-10 rounded-lg border px-3" placeholder={t('country')} />
                <select name="status" className="h-10 rounded-lg border px-3" defaultValue="prospect">
                  <option value="prospect">{t('prospect')}</option>
                  <option value="actif">{t('activeStatus')}</option>
                  <option value="inactif">{t('inactiveStatus')}</option>
                </select>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                    disabled={saving}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {saving ? t('saving') : t('save')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortNewest((v) => !v)}
            >
              {t('sortBy')} {sortNewest ? t('newest') : t('oldest')}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            
            
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">{t('id')}</th>
                <th className="px-6 py-3">{t('name')}</th>
                <th className="px-6 py-3">{t('company')}</th>
                <th className="px-6 py-3">{t('phone')}</th>
                <th className="px-6 py-3">{t('email')}</th>
                <th className="px-6 py-3">{t('country')}</th>
                <th className="px-6 py-3">{t('createdAt')}</th>
                <th className="px-6 py-3 text-center">{t('status')}</th>
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
