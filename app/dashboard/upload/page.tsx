"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Certificate</h1>
      <p className="mb-6 text-gray-400">Upload a new certificate to the system.</p>
      <form className="space-y-4">
        <input type="file" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-900/20 file:text-emerald-300 hover:file:bg-emerald-900/40" />
        <Button type="submit" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </form>
    </div>
  );
}
