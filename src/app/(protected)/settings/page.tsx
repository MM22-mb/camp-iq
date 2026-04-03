/**
 * Settings Page
 *
 * Matches the Lovable app layout: Notifications, Privacy, and Appearance
 * sections with toggle switches. Local state for now — database integration later.
 */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Shield, Palette } from "lucide-react";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SettingRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [emailReminders, setEmailReminders] = useState(true);
  const [weeklyInspiration, setWeeklyInspiration] = useState(false);
  const [tripsVisible, setTripsVisible] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <SettingRow
                label="Email notifications for trip reminders"
                checked={emailReminders}
                onChange={setEmailReminders}
              />
              <SettingRow
                label="Weekly trip inspiration emails"
                checked={weeklyInspiration}
                onChange={setWeeklyInspiration}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <SettingRow
                label="Make my trips visible in Explore"
                checked={tripsVisible}
                onChange={setTripsVisible}
              />
              <SettingRow
                label="Show my profile to other users"
                checked={profileVisible}
                onChange={setProfileVisible}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow
              label="Dark mode"
              checked={darkMode}
              onChange={setDarkMode}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
