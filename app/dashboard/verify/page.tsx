"use client";

import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Verify Certificate</h1>
      <p className="mb-6 text-gray-400">Enter certificate details to verify authenticity.</p>
      <form className="space-y-4">
        <input type="text" placeholder="Certificate ID" className="block w-full px-4 py-2 rounded bg-black/30 border border-emerald-900/20 text-gray-200" />
        <Button type="submit" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Verify
        </Button>
      </form>
    </div>
  );
}
