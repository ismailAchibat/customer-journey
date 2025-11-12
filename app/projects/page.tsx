"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Project = {
    id: string;
    nom: string;
    client: string;
    statut: "En cours" | "Terminé" | "En attente";
    progression: number;
    responsable: string;
};

export default function ProjectsPage() {
    const [projects] = useState<Project[]>([
        {
            id: "PRJ-001",
            nom: "Refonte site vitrine",
            client: "Startup.io",
            statut: "En cours",
            progression: 65,
            responsable: "Alice Martin",
        },
        {
            id: "PRJ-002",
            nom: "Campagne marketing Q4",
            client: "Acme Corp",
            statut: "Terminé",
            progression: 100,
            responsable: "Jean Dupont",
        },
        {
            id: "PRJ-003",
            nom: "Application mobile CRM",
            client: "NovaTech",
            statut: "En attente",
            progression: 10,
            responsable: "Sofiane Diallo",
        },
    ]);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Projets</h1>
                    <p className="text-sm text-gray-500">
                        Gérez vos projets clients et suivez leur avancement.
                    </p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Nouveau projet
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <Th>ID</Th>
                            <Th>Nom du projet</Th>
                            <Th>Client</Th>
                            <Th>Responsable</Th>
                            <Th>Statut</Th>
                            <Th>Progression</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {projects.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <Td>{p.id}</Td>
                                <Td className="font-medium">{p.nom}</Td>
                                <Td>{p.client}</Td>
                                <Td>{p.responsable}</Td>
                                <Td>
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.statut === "Terminé"
                                                ? "bg-green-100 text-green-700"
                                                : p.statut === "En attente"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {p.statut}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${p.progression === 100
                                                    ? "bg-green-600"
                                                    : "bg-indigo-600"
                                                }`}
                                            style={{ width: `${p.progression}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {p.progression}%
                                    </span>
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
    return (
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            {children}
        </th>
    );
}

function Td({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>;
}
