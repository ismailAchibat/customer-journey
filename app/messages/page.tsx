"use client";

import { useMemo, useState } from "react";

// Schéma Chat (mock) – j'ajoute un champ 'content' pour le message
type ChatMessage = {
    id: string;
    from: string; // user id / nom
    to: string;   // user id / nom
    content: string;
    sentAt: string; // ISO
};

const THREAD_A: ChatMessage[] = [
    { id: "M1", from: "Alice Martin", to: "Sofiane Diallo", content: "Salut Sofiane, as-tu le retour du client ?", sentAt: "2025-09-12T09:10:00Z" },
    { id: "M2", from: "Sofiane Diallo", to: "Alice Martin", content: "Oui, ok pour la démo mardi 10h.", sentAt: "2025-09-12T09:12:00Z" },
    { id: "M3", from: "Alice Martin", to: "Sofiane Diallo", content: "Top, j'ajoute l'événement dans l'agenda.", sentAt: "2025-09-12T09:13:00Z" },
];

const THREAD_B: ChatMessage[] = [
    { id: "M4", from: "Carla Mendes", to: "Yann Legrand", content: "Peux-tu valider le devis Q4 ?", sentAt: "2025-09-10T14:00:00Z" },
    { id: "M5", from: "Yann Legrand", to: "Carla Mendes", content: "Je regarde et je te dis.", sentAt: "2025-09-10T14:05:00Z" },
];

type Conversation = {
    id: string;
    name: string; // destinataire principal affiché
    lastMessage: string;
    messages: ChatMessage[];
};

const CONVERSATIONS: Conversation[] = [
    { id: "C-A", name: "Sofiane Diallo", lastMessage: "Top, j'ajoute l'événement…", messages: THREAD_A },
    { id: "C-B", name: "Yann Legrand", lastMessage: "Je regarde et je te dis.", messages: THREAD_B },
];

const ME = "Alice Martin"; // utilisateur courant (mock)

export default function MessagesPage() {
    const [selectedId, setSelectedId] = useState<string>(CONVERSATIONS[0].id);
    const [draft, setDraft] = useState("");

    const conv = useMemo(
        () => CONVERSATIONS.find((c) => c.id === selectedId)!,
        [selectedId]
    );

    const send = () => {
        const text = draft.trim();
        if (!text) return;
        conv.messages.push({
            id: `M-${Date.now()}`,
            from: ME,
            to: conv.name,
            content: text,
            sentAt: new Date().toISOString(),
        });
        setDraft("");
    };

    return (
        <div className="grid h-[calc(100vh-64px)] grid-cols-[320px_1fr] gap-0">
            {/* Liste des conversations */}
            <aside className="border-r bg-white">
                <div className="p-4">
                    <h2 className="text-lg font-semibold">Messagerie</h2>
                    <input
                        placeholder="Rechercher une conversation…"
                        className="mt-3 h-10 w-full rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <ul className="divide-y">
                    {CONVERSATIONS.map((c) => (
                        <li
                            key={c.id}
                            onClick={() => setSelectedId(c.id)}
                            className={`cursor-pointer px-4 py-3 hover:bg-gray-50 ${selectedId === c.id ? "bg-indigo-50" : ""
                                }`}
                        >
                            <div className="font-medium">{c.name}</div>
                            <div className="truncate text-sm text-gray-500">{c.lastMessage}</div>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Fil de messages */}
            <main className="flex h-full flex-col bg-white">
                {/* En-tête fil */}
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <div>
                        <div className="text-sm text-gray-500">Conversation</div>
                        <div className="text-lg font-semibold">{conv.name}</div>
                    </div>
                    <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                        Infos
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                    {conv.messages.map((m) => {
                        const mine = m.from === ME;
                        return (
                            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                                        }`}
                                    title={new Date(m.sentAt).toLocaleString()}
                                >
                                    <div className="mb-0.5 text-[11px] opacity-70">
                                        {mine ? "Vous" : m.from}
                                    </div>
                                    <div>{m.content}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Zone de saisie */}
                <div className="flex items-center gap-2 border-t p-3">
                    <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Écrire un message…"
                        className="h-11 flex-1 rounded-full border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={send}
                        className="h-11 rounded-full bg-indigo-600 px-5 text-white hover:bg-indigo-700"
                    >
                        Envoyer
                    </button>
                </div>
            </main>
        </div>
    );
}
