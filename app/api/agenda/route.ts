import { getCalendarEventsById } from "@/services/database/calendar";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const events = await getCalendarEventsById(userId);
    return NextResponse.json(events);
  } catch (error: any) {
    // The service throws an error if no events are found.
    // Return an empty array in that case, which is what the client expects.
    if (error.message.includes("No calendar events found")) {
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
