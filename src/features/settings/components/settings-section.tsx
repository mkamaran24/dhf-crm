import { Card, CardHeader, CardContent } from "@/src/shared/components/ui";
import { LucideIcon } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, icon: Icon, children }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}

