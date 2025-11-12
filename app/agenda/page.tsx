"use client";

import { useMemo, useState } from "react";

// Schéma Calendar (mock)
type EventItem = {
    id: string;
    Client: string;
    subject: string;
    date: string; // ISO date (yyyy-mm-dd)
    time: string; // "HH:MM"
    duration: number; // minutes
    User: string; // user id ou nom
};

const MOCK_EVENTS: EventItem[] = [
    { id: "EV-001", Client: "Acme Corp", subject: "Démo produit", date: "2025-09-10", time: "10:00", duration: 60, User: "Alice Martin" },
    { id: "EV-002", Client: "NovaTech", subject: "Kickoff projet", date: "2025-09-12", time: "14:30", duration: 90, User: "Sofiane Diallo" },
    { id: "EV-003", Client: "Startup.io", subject: "Suivi mensuel", date: "2025-09-12", time: "16:00", duration: 45, User: "Carla Mendes" },
    { id: "EV-004", Client: "Acme Corp", subject: "Revue contrat", date: "2025-09-22", time: "09:00", duration: 30, User: "Yann Legrand" },
];

function getMonthMatrix(year: number, monthIndex: number) {
    // monthIndex: 0-11
    const first = new Date(year, monthIndex, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // Lundi = début
    const weeks: Date[][] = [];
    for (let w = 0; w < 6; w++) {
        const week: Date[] = [];
        for (let d = 0; d < 7; d++) {
            const day = new Date(start);
            day.setDate(start.getDate() + w * 7 + d);
            week.push(day);
        }
        weeks.push(week);
    }
    return weeks;
}

export default function AgendaPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const matrix = useMemo(() => getMonthMatrix(year, month), [year, month]);
    const eventsByDay = useMemo(() => {
        const map = new Map<string, EventItem[]>();
        for (const ev of MOCK_EVENTS) {
            const k = ev.date;
            map.set(k, [...(map.get(k) || []), ev]);
        }
        return map;
    }, []);

    const monthLabel = new Date(year, month, 1).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    const gotoPrev = () => {
        const m = month - 1;
        if (m < 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else setMonth(m);
    };
    const gotoNext = () => {
        const m = month + 1;
        if (m > 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else setMonth(m);
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
                    <p className="text-sm text-gray-500">Vos tâches, rendez-vous et événements.</p>
                </div>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                    Ajouter un événement
                </button>
            </div>

            {/* Barre mois + recherche simple */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button onClick={gotoPrev} className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">◀</button>
                    <div className="min-w-[180px] rounded-lg border px-3 py-1.5 text-center font-medium">
                        {monthLabel}
                    </div>
                    <button onClick={gotoNext} className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">▶</button>
                </div>
                <input
                    placeholder="Rechercher un événement…"
                    className="h-10 w-full max-w-md rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Grille calendrier (lundi-dimanche) */}
            <div className="grid grid-cols-7 gap-2">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                    <div key={d} className="px-2 py-2 text-center text-xs font-semibold uppercase text-gray-600">
                        {d}
                    </div>
                ))}
                {matrix.flat().map((day, idx) => {
                    const inMonth = day.getMonth() === month && day.getFullYear() === year;
                    const key = day.toISOString().slice(0, 10);
                    const evts = eventsByDay.get(key) || [];
                    return (
                        <div
                            key={idx}
                            className={`min-h-[110px] rounded-xl border p-2 ${inMonth ? "bg-white" : "bg-gray-50 text-gray-400"}`}
                        >
                            <div className="mb-1 text-xs font-medium">{day.getDate()}</div>
                            <div className="space-y-1">
                                {evts.slice(0, 3).map((ev) => (
                                    <div
                                        key={ev.id}
                                        title={`${ev.subject} • ${ev.time}`}
                                        className="truncate rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-700"
                                    >
                                        {ev.time} · {ev.subject}
                                    </div>
                                ))}
                                {evts.length > 3 && (
                                    <div className="truncate rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                        +{evts.length - 3} autre(s)
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Liste des événements du mois (compacte) */}
            <div className="mt-6 rounded-xl border bg-white">
                <div className="border-b px-4 py-3 text-sm font-semibold text-gray-700">Événements à venir</div>
                <ul className="divide-y">
                    {MOCK_EVENTS.map((e) => (
                        <li key={e.id} className="flex items-center justify-between px-4 py-3 text-sm">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                <div className="truncate">
                                    <div className="truncate font-medium">{e.subject}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(e.date).toLocaleDateString()} · {e.time} · {e.Client} · {e.User}
                                    </div>
                                </div>
                            </div>
                            <button className="text-indigo-600 hover:underline">Détails</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
