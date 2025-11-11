"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { error } from "console";
import { and, eq } from "drizzle-orm";

export const getUserById = async (userId: string) => {
  const user = await db.select().from(users).where(eq(users.id, userId));

  if (!user || user.length === 0) {
    throw new Error(`User not found with ID: ${userId}`);
  }
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, password)));

  if (!user || user.length === 0) {
    throw new Error(`Invalid email or password`);
  }
  return user;
};
