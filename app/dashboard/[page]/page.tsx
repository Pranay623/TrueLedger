"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const dashboardPages = [
  "certificates",
  "upload",
  "verify",
  "analytics",
  "students",
  "reports",
  "search",
  "help",
  "profile",
  "settings"
];

export default function DashboardPageRouter({ params }: { params: { page: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (dashboardPages.includes(params.page)) {
      router.replace(`/dashboard/${params.page}`);
    } else {
      router.replace("/dashboard");
    }
  }, [params.page, router]);

  return null;
}
