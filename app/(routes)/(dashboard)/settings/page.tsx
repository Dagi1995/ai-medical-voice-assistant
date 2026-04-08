"use client";

import { ModeToggle } from "../_components/DarkMood";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}