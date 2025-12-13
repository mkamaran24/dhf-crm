"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Building, 
  Save,
  Mail,
  Phone,
  Clock,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button, Input, Card, CardHeader, CardContent, Badge } from "@/src/shared/components/ui";
import { SettingsSection } from "@/src/features/settings/components";
import { useAuth } from "@/src/shared/contexts/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsReminders: true,
    appointmentReminders: true,
    taskReminders: true,
    marketingEmails: false,
  });

  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleSaveWorkingHours = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and system preferences</p>
      </div>

      <SettingsSection
        title="Profile Information"
        description="Update your personal information and preferences"
        icon={User}
      >
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              <Badge variant="info" className="mt-2">
                {user?.role || 'Staff'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              defaultValue={user?.name || ''}
              placeholder="Dr. Emily Brown"
            />
            <Input
              label="Email Address"
              type="email"
              defaultValue={user?.email || ''}
              placeholder="email@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Department"
              placeholder="Dental Care"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Notification Preferences"
        description="Configure how you receive notifications and reminders"
        icon={Bell}
      >
        <div className="space-y-4">
          {[
            { 
              key: 'emailNotifications', 
              label: 'Email Notifications', 
              description: 'Receive updates via email',
              icon: Mail
            },
            { 
              key: 'smsReminders', 
              label: 'SMS Reminders', 
              description: 'Get appointment reminders via SMS',
              icon: Phone
            },
            { 
              key: 'appointmentReminders', 
              label: 'Appointment Reminders', 
              description: 'Remind patients about upcoming appointments',
              icon: CalendarIcon
            },
            { 
              key: 'taskReminders', 
              label: 'Task Reminders', 
              description: 'Get notified about task deadlines',
              icon: Clock
            },
            { 
              key: 'marketingEmails', 
              label: 'Marketing Emails', 
              description: 'Receive promotional content and updates',
              icon: Mail
            },
          ].map((setting) => {
            const Icon = setting.icon;
            return (
              <div 
                key={setting.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{setting.label}</p>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [setting.key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button onClick={handleSaveNotifications} isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Working Hours"
        description="Set your clinic's operational hours"
        icon={Clock}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Opening Time"
              type="time"
              value={workingHours.start}
              onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
            />
            <Input
              label="Closing Time"
              type="time"
              value={workingHours.end}
              onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Current Schedule:</strong> {workingHours.start} - {workingHours.end}
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button onClick={handleSaveWorkingHours} isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Hours
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Organization Settings"
        description="Manage clinic information and branding"
        icon={Building}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Clinic Name"
              defaultValue="DHF Dental Clinic"
              placeholder="Your clinic name"
            />
            <Input
              label="Contact Email"
              type="email"
              defaultValue="info@dhfclinic.com"
              placeholder="clinic@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              type="tel"
              defaultValue="+1 (555) 123-4567"
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Website"
              type="url"
              defaultValue="https://dhfclinic.com"
              placeholder="https://example.com"
            />
          </div>

          <Input
            label="Address"
            defaultValue="123 Healthcare Ave, Medical District, NY 10001"
            placeholder="Full clinic address"
          />

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Update Information
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Security & Access"
        description="Manage security settings and user permissions"
        icon={Shield}
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Current Role</p>
              <Badge variant="info">{user?.role || 'Staff'}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              Your role determines what features and data you can access in the system.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Contact your administrator to change your role or request additional permissions.
            </p>
          </div>

          <Button variant="outlined" className="w-full md:w-auto">
            Change Password
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
