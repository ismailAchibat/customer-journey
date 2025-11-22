'use client';
import { Event, EventManager } from "@/components/shared/event-manager";
import { useUserStore } from "@/hooks/use-user-store";
import { useQuery } from "@tanstack/react-query";

const colors = [
  "blue", "purple", "green", "orange", "pink", "red", "teal", "cyan", "indigo"
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function AgendaPage() {
  const user = useUserStore((state) => state.user);

  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ["calendarEvents", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/agenda?userId=${user.id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      return res.json();
    },
    enabled: !!user?.id, // Only run the query if the user ID exists
  });

  const mappedEvents: Event[] = eventsData
    ? eventsData.map((event: any) => {
        const [hours, minutes, seconds] = event.time.split(':').map(Number);
        const startTime = new Date(event.date);
        startTime.setUTCHours(hours, minutes, seconds);

        const endTime = new Date(startTime);
        if (event.duration) {
          endTime.setUTCMinutes(startTime.getUTCMinutes() + event.duration);
        } else {
          endTime.setUTCHours(startTime.getUTCHours() + 1);
        }

        return {
          id: event.id,
          title: event.subject ?? "No Title",
          description: event.client_name ?? "",
          startTime,
          endTime,
          color: getRandomColor(),
          category: "Meeting",
          attendees: event.client_name ? [event.client_name] : [],
          tags: [],
        };
      })
    : [];

  if (!user) {
    // You might want a better loading state or a redirect to login
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div>Please log in to see your agenda.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div>Loading agenda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div>Error fetching events: {(error as Error).message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <EventManager
        events={mappedEvents}
        onEventCreate={(event) => console.log("Created:", event)}
        onEventUpdate={(id, event) => console.log("Updated:", id, event)}
        onEventDelete={(id) => console.log("Deleted:", id)}
        categories={["Meeting", "Task", "Reminder", "Personal"]}
        availableTags={["Important", "Urgent", "Work", "Personal", "Team", "Client"]}
        defaultView="month"
      />
    </div>
  );
}