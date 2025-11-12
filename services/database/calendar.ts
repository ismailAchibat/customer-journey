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


export const addCalendarEvent = async ( calendarEvent: {
  subject: string;
  client_name?: string;
  date: string;
  time: string;
  duration?: number;
}) => {
  const newEvent = await db
    .insert(calendar)
    .values({
      id: crypto.randomUUID(),
      date: calendarEvent.date,
      time: calendarEvent.time,
      subject: calendarEvent.subject,
      client_name: calendarEvent.client_name,
      duration: calendarEvent.duration,
      userId: "user_002",
    })
    .returning();

  return newEvent[0];
}