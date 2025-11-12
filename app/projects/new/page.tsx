"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Réemploi des mêmes mocks minimalistes (id, name/displayName)
const CLIENTS = [
    { id: "CL-001", name: "Startup.io" },
    { id: "CL-002", name: "Acme Corp" },
    { id: "CL-003", name: "NovaTech" },
];
const USERS = [
    { id: "U-001", displayName: "Alice Martin" },
    { id: "U-002", displayName: "Jean Dupont" },
    { id: "U-003", displayName: "Sofiane Diallo" },
];

export default function NewProjectPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [clientId, setClientId] = useState(CLIENTS[0].id);
    const [ownerId, setOwnerId] = useState(USERS[0].id);
    const [status, setStatus] = useState<"En cours" | "En attente" | "Terminé">("En cours");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ici: POST /api/projects avec {name, clientId, ownerId, status}
        console.log({ name, clientId, ownerId, status });
        router.push("/projects");
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">Nouveau projet</h1>

            <form onSubmit={submit} className="max-w-xl space-y-4 rounded-2xl border bg-white p-6">
                <div>
                    <label className="mb-1 block text-sm text-gray-700">Nom du projet</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ex. Application mobile CRM"
                        required
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm text-gray-700">Client</label>
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-300 px-3"
                        >
                            {CLIENTS.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-gray-700">Responsable</label>
                        <select
                            value={ownerId}
                            onChange={(e) => setOwnerId(e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-300 px-3"
                        >
                            {USERS.map((u) => (
                                <option key={u.id} value={u.id}>{u.displayName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-700">Statut</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="h-10 w-full rounded-lg border border-gray-300 px-3"
                    >
                        <option>En cours</option>
                        <option>En attente</option>
                        <option>Terminé</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => history.back()} className="rounded-lg border px-4 py-2">
                        Annuler
                    </button>
                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}
