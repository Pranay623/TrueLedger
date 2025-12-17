"use client";

import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Search className="w-6 h-6 text-emerald-400" /> Search
      </h1>
      <p className="mb-6 text-gray-400">Search for certificates, students, or analytics.</p>
      {/* TODO: Connect to /api/certificates/ or /api/users/ for search functionality */}
      <div className="bg-black/30 border border-emerald-900/20 rounded-xl p-6 text-gray-400">
        Search functionality will appear here.
      </div>
    </div>
  );
}
