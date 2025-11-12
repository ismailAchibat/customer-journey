// app/(data)/projects.actions.ts
"use server";

import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { users } from "@/db/schema";
import {
  and, or, eq, ilike, desc, asc, sql, like,
} from "drizzle-orm";

export type ProjectStatusDB = "en_cours" | "termine" | "en_attente";

export type GetProjectsParams = {
  search?: string;                      // id, nom projet, client, responsable
  status?: ProjectStatusDB | "";        // filtre statut
  sort?: "newest" | "oldest";           // tri createdAt
  page?: number;                        // pagination (1-based)
  pageSize?: number;
};

export type ProjectListRow = {
  id: string;
  name: string;
  clientName: string | null;
  responsableName: string | null;
  statut: ProjectStatusDB;
  progression: number; // 0..100
  createdAt: Date | string;
};

export type GetProjectsResult = {
  row: ProjectListRow[];
  total: number;
  page: number;
  pageSize: number;
};

function buildSearchWhere(q?: string) {
  if (!q?.trim()) return undefined;
  const s = `%${q.trim()}%`;
  // recherche dans projet + jointures client / responsable
  return or(
    ilike(projects.id, s),
    ilike(projects.name, s),
    ilike(clients.name, s),
    ilike(users.full_name, s)
  );
}

/** Liste des projets pour le tableau */
export const getProjects = async (params: GetProjectsParams = {}) => {
  const {
    search = "",
    status = "",
    sort = "newest",
    page = 1,
    pageSize = 10,
  } = params;

  const searchWhere = buildSearchWhere(search);
  const whereParts = [];
  if (searchWhere) whereParts.push(searchWhere);
  if (status) whereParts.push(eq(projects.statut, status as ProjectStatusDB));
  const where = whereParts.length ? and(...whereParts) : undefined;

  // total pour la pagination
  const [{ count: total }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(users, eq(projects.responsableId, users.id))
    .where(where as any);

  // rangées paginées + jointures pour les libellés
  const offset = (Math.max(page, 1) - 1) * Math.max(pageSize, 1);
  const orderBy = sort === "oldest" ? asc(projects.createdAt) : desc(projects.createdAt);

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      clientName: clients.name,
      responsableName: users.full_name,
      statut: projects.statut,
      progression: projects.progression,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(users, eq(projects.responsableId, users.id))
    .where(where as any)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);

  return { rows, total, page, pageSize };
};

/** Détail d’un projet (pour la page /projects/[id]) */
export const getProjectById = async (projectId: string) => {
  const row = await db
    .select({
      id: projects.id,
      name: projects.name,
      clientId: projects.clientId,
      clientName: clients.name,
      responsableId: projects.responsableId,
      responsableName: users.full_name,
      statut: projects.statut,
      progression: projects.progression,
      reatedAt: projects.createdAt,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(users, eq(projects.responsableId, users.id))
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!row.length) throw new Error(`Project not found: ${projectId}`);
  return row[0];
};
