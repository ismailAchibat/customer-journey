'use server';

import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getClientsByOrgID = async (org_id: string) => {
  const events = await db
    .select()
    .from(clients)
    .where(eq(clients.organisation_id, org_id));

  if (!events || events.length === 0) {
    throw new Error(`No clients found for Organisation ID: ${org_id}`);
  }
  return events;
};


export const addClient = async ( client: {
  name: string;
  company: string;
  phone_number: string;
  email: string;
  country: string;
  status: "prospect" | "actif" | "inactif";
  organisation_id: string;
}) => {
  const newClient = await db
    .insert(clients)
    .values({
      id: crypto.randomUUID(),
      name: client.name,
      company: client.company,
      phone_number: client.phone_number,
      email: client.email,
      country: client.country,
      status: client.status,
      organisation_id: client.organisation_id,
    })
    .returning();

  return newClient[0];
}