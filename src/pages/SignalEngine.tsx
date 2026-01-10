import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SignalEngineView } from "@/components/signals/SignalEngineView";

export default function SignalEnginePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <SignalEngineView />
        </main>
      </div>
    </div>
  );
}
