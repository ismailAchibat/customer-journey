"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { and, or, eq, ilike, desc, asc, sql, InferInsertModel } from "drizzle-orm";

/* ----------------------------- Types ----------------------------- */

export type ClientStatus = "prospect" | "actif" | "inactif";

export type ClientRow = {
  id: string;
  name: string;
  company: string;
  phoneNumber: string;
  email: string;
  country: string;
  status: ClientStatus;
  createdAt: Date;
};

export type AddClientInput = {
  id?: string;
  name: string;
  company?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  country?: string | null;
  status?: ClientStatus;
  /** ⚠️ requis si la colonne n'est pas nullable dans le schéma */
  organisationId: string;
};

export const addClient = async (input: AddClientInput) => {
  if (!input?.name?.trim()) throw new Error("Le nom du client est requis.");
  if (!input.organisationId) throw new Error("organisationId est requis.");

  const status: ClientStatus = input.status ?? "prospect";
  const id = input.id ?? crypto.randomUUID();

  // doublon email éventuel
  if (input.email) {
    const existing = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.email, input.email))
      .limit(1);

    if (existing.length > 0) {
      const [row] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, existing[0].id))
        .limit(1);
      return row;
    }
  }

  // ✅ typage explicite pour forcer l’overload objet
  type ClientInsert = InferInsertModel<typeof clients>;
  const values: ClientInsert = {
    id,
    name: input.name.trim(),
    // si ces colonnes sont NOT NULL côté schéma, on met des chaînes vides par défaut
    company: input.company ?? "",
    phoneNumber: input.phoneNumber ?? "",
    email: input.email ?? "",
    country: input.country ?? "",
    status, // "prospect" par défaut si non fourni
    organisationId: input.organisationId, // requis ici
    // createdAt: laissé à defaultNow() dans le schéma
  };

  const [created] = await db.insert(clients).values(values).returning();
  return created;
};
export async function getClients() {
    const rows = await db.select().from(clients).orderBy(desc(clients.createdAt));
    return rows;
  }
  
