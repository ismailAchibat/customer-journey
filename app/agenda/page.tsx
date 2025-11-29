'use client';
import { Event, EventManager } from "@/components/shared/event-manager";
import { useUserStore } from "@/hooks/use-user-store";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/app/context/i18n";

const colors = [
  "blue", "purple", "green", "orange", "pink", "red", "teal", "cyan", "indigo"
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function AgendaPage() {
  const user = useUserStore((state) => state.user);
  const { t } = useI18n();

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
    enabled: !!user?.id,
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
          title: event.subject ?? t('noTitle'),
          description: event.client_name ?? "",
          startTime,
          endTime,
          color: getRandomColor(),
          category: t('meeting'),
          attendees: event.client_name ? [event.client_name] : [],
          tags: [],
        };
      })
    : [];

  if (!user) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div>{t('pleaseLoginAgenda')}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div>{t('loadingAgenda')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div>{t('errorFetchingEvents')}{(error as Error).message}</div>
      </div>
    );
  }

  const categories = ["meeting", "task", "reminder", "personal"].map(key => t(key));
  const availableTags = ["important", "urgent", "work", "personal", "team", "client"].map(key => t(key));

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <EventManager
        events={mappedEvents}
        onEventCreate={(event) => console.log("Created:", event)}
        onEventUpdate={(id, event) => console.log("Updated:", id, event)}
        onEventDelete={(id) => console.log("Deleted:", id)}
        categories={categories}
        availableTags={availableTags}
        defaultView="month"
      />
    </div>
  );
}