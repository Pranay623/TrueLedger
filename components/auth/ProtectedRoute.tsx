"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { status } = useSession(); // NextAuth
  const router = useRouter();
  const [jwtAuthed, setJwtAuthed] = useState<boolean | null>(null);

  // Check JWT cookie
  useEffect(() => {
    fetch("/api/auth/check", { credentials: "include" })
      .then((res) => setJwtAuthed(res.ok))
      .catch(() => setJwtAuthed(false));
  }, []);

  // ✅ Google / NextAuth login
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // ⏳ Loading
  if (status === "loading" || jwtAuthed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ✅ Email/password JWT login
  if (jwtAuthed) {
    return <>{children}</>;
  }

  // ❌ Not authenticated
  router.replace(redirectTo);
  return null;
}
