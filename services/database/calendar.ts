import { db } from "@/db";
import { calendar } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getCalendarEventsById = async (user_id: string) => {
  const events = await db
    .select()
    .from(calendar)
    .where(eq(calendar.userId, user_id));

  if (!events || events.length === 0) {
    throw new Error(`No calendar events found for User ID: ${user_id}`);
  }
  return events;
};
