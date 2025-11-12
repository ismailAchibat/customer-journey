"use client";

import { useParams } from "next/navigation";

// Reprend les mêmes tâches que sur la page détail (ici en local pour la démo)
const TASKS = [
    { id: "T-1", projectId: "PRJ-001", title: "Wireframes accueil", status: "En cours" },
    { id: "T-2", projectId: "PRJ-001", title: "Charte graphique", status: "A faire" },
    { id: "T-4", projectId: "PRJ-001", title: "Tests UI", status: "Terminé" },
];

type Col = "A faire" | "En cours" | "Terminé";

export default function BoardPage() {
    const { id } = useParams<{ id: string }>();
    const tasks = TASKS.filter((t) => t.projectId === id);

    const columns: Col[] = ["A faire", "En cours", "Terminé"];

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">Board – {id}</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {columns.map((col) => (
                    <div key={col} className="rounded-2xl border bg-white p-4">
                        <div className="mb-3 text-sm font-semibold">{col}</div>
                        <div className="space-y-3">
                            {tasks
                                .filter((t) => t.status === col)
                                .map((t) => (
                                    <div key={t.id} className="rounded-xl border bg-gray-50 p-3 text-sm">
                                        {t.title}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
