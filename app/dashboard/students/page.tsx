"use client";

import { Users } from "lucide-react";

export default function StudentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-emerald-400" /> Students
      </h1>
      <p className="mb-6 text-gray-400">List of students with certificates.</p>
      {/* TODO: Connect to /api/users/ and show students data */}
      <div className="bg-black/30 border border-emerald-900/20 rounded-xl p-6 text-gray-400">
        Student data will appear here.
      </div>
    </div>
  );
}
