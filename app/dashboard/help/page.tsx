"use client";

import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-emerald-400" /> Help & Support
      </h1>
      <p className="mb-6 text-gray-400">Find answers to common questions or contact support.</p>
      <div className="bg-black/30 border border-emerald-900/20 rounded-xl p-6 text-gray-400">
        Help content and support contact will appear here.
      </div>
    </div>
  );
}
