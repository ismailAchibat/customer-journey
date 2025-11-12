import ClientManager from "./client-manager"; // Import the new wrapper component

export default function AgendaPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>
      {/* Render the ClientManager wrapper */}
      <ClientManager />
    </div>
  );
}