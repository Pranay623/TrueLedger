"use client";

import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-emerald-400" /> Reports
      </h1>
      <p className="mb-6 text-gray-400">Generate and download reports for certificates and verifications.</p>
      {/* TODO: Connect to /api/admin/dashboard/stats/ or /api/certificates/stats/ for report data */}
      <div className="bg-black/30 border border-emerald-900/20 rounded-xl p-6 text-gray-400">
        Report generation and download options will appear here.
      </div>
    </div>
  );
}
