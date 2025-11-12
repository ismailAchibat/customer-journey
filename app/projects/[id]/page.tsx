"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

// Mocks minimaux (mêmes ids que la liste)
const CLIENTS = { "CL-001": "Startup.io", "CL-002": "Acme Corp", "CL-003": "NovaTech" } as const;
const USERS = { "U-001": "Alice Martin", "U-002": "Jean Dupont", "U-003": "Sofiane Diallo" } as const;

const PROJECTS = {
    "PRJ-001": { id: "PRJ-001", name: "Refonte site vitrine", clientId: "CL-001", ownerId: "U-001", status: "En cours", progress: 65 },
    "PRJ-002": { id: "PRJ-002", name: "Campagne marketing Q4", clientId: "CL-002", ownerId: "U-002", status: "Terminé", progress: 100 },
    "PRJ-003": { id: "PRJ-003", name: "Application mobile CRM", clientId: "CL-003", ownerId: "U-003", status: "En attente", progress: 10 },
} as const;

type Task = {
    id: string;
    projectId: string;
    title: string;
    assigneeId: string;  // -> Users.id
    dueDate?: string;    // ISO
    priority: "Low" | "Medium" | "High";
    status: "A faire" | "En cours" | "Terminé";
};

const TASKS: Task[] = [
    { id: "T-1", projectId: "PRJ-001", title: "Wireframes accueil", assigneeId: "U-001", dueDate: "2025-09-20", priority: "Medium", status: "En cours" },
    { id: "T-2", projectId: "PRJ-001", title: "Charte graphique", assigneeId: "U-002", dueDate: "2025-09-25", priority: "High", status: "A faire" },
    { id: "T-3", projectId: "PRJ-003", title: "Spec API auth", assigneeId: "U-003", priority: "Low", status: "A faire" },
];

export default function ProjectDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const project = (PROJECTS as any)[id];
    if (!project) return notFound();

    const tasks = TASKS.filter((t) => t.projectId === id);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
                    <p className="text-sm text-gray-600">
                        Client : {CLIENTS[project.clientId as keyof typeof CLIENTS]} · Responsable : {USERS[project.ownerId as keyof typeof USERS]}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/projects/${id}/board`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Board</Link>
                    <Link href="/projects" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Retour</Link>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6 rounded-2xl border bg-white p-5">
                <div className="mb-2 text-sm text-gray-600">Progression</div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                    <div className={`h-3 rounded-full ${project.progress === 100 ? "bg-green-600" : "bg-indigo-600"}`} style={{ width: `${project.progress}%` }} />
                </div>
                <div className="mt-1 text-right text-xs text-gray-500">{project.progress}%</div>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border bg-white">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="font-semibold">Tâches</div>
                    <Link href="#" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700 text-sm">Ajouter une tâche</Link>
                </div>

                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <Th>ID</Th>
                            <Th>Titre</Th>
                            <Th>Assignée à</Th>
                            <Th>Échéance</Th>
                            <Th>Priorité</Th>
                            <Th>Statut</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {tasks.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <Td>{t.id}</Td>
                                <Td className="font-medium">{t.title}</Td>
                                <Td>{USERS[t.assigneeId as keyof typeof USERS]}</Td>
                                <Td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</Td>
                                <Td>
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${t.priority === "High" ? "bg-red-100 text-red-700" : t.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{t.priority}</span>
                                </Td>
                                <Td>
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${t.status === "Terminé" ? "bg-green-100 text-green-700" : t.status === "En cours" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{t.status}</span>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>;
}
