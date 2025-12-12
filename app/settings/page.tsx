import { Card } from "@/components/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      <Card>
        <p className="text-gray-500">System configuration and preferences.</p>
      </Card>
    </div>
  );
}
