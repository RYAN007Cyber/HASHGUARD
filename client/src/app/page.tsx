import HashStatus from "./components/HashStatus";

import BlockedLogs from "./components/BlockedLogs";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">System Integrity Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <HashStatus />
        </div>


        <div>
          <BlockedLogs />
        </div>
      </div>
    </div>
  );
}
