import { Outlet } from "react-router";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="p-10">
        <h1 className="text-3xl font-bold">Telemetry Monitor</h1>
      </header>
      <main className="px-10 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
