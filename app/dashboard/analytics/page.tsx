"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-emerald-400" /> Analytics
      </h1>
      <p className="mb-6 text-gray-400">View analytics and trends for certificates and verifications.</p>
      {/* TODO: Connect to /api/admin/analytics/route.ts and show analytics data */}
      <div className="bg-black/30 border border-emerald-900/20 rounded-xl p-6 text-gray-400">
        Analytics charts and data will appear here.
      </div>
    </div>
  );
}
