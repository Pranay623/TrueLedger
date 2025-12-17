"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Users,
  Shield,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface StatsResponse {
  totalCertificates: number;
  verifiedToday: number;
  successRate: number;
  pendingReviews: number;
  failedVerifications: number;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease";
    period: string;
  };
  icon: React.ElementType;
}

/* ---------------- SKELETON LOADER ---------------- */
function StatsCardSkeleton() {
  return (
    <Card className="bg-black/60 backdrop-blur-xl border border-emerald-900/10 shadow-lg relative overflow-hidden">
      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-900/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 bg-emerald-900/20" />
          <Skeleton className="h-8 w-16 bg-emerald-900/20" />
          <Skeleton className="h-3 w-32 bg-emerald-900/10" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl bg-emerald-900/20" />
      </CardContent>
    </Card>
  );
}

function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  return (
    <Card className="bg-black/60 backdrop-blur-xl border border-emerald-900/20 shadow-lg hover:shadow-emerald-900/10 transition group">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1 font-medium group-hover:text-emerald-400 transition-colors">{title}</p>
          <p className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</p>

          {change && (
            <div className="flex items-center gap-1 text-xs mt-2">
              <span className={cn("flex items-center font-medium", change.type === "increase" ? "text-emerald-400" : "text-red-400")}>
                {change.type === "increase" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {change.value}
              </span>
              <span className="text-gray-600 ml-1">{change.period}</span>
            </div>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-emerald-900/10 flex items-center justify-center border border-emerald-500/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-900/20 transition-all duration-300">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<StatsResponse>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/certificates/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    },
    staleTime: 60 * 1000, // Cache for 1 minute
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const mainStats = [
    {
      title: "Total Certificates",
      value: stats.totalCertificates,
      icon: Award,
      change: { value: "+12%", type: "increase" as const, period: "vs last month" }
    },
    {
      title: "Verified Today",
      value: stats.verifiedToday,
      icon: Shield,
      change: { value: "+5%", type: "increase" as const, period: "vs yesterday" }
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      change: { value: "+1%", type: "increase" as const, period: "vs last week" }
    },
  ];

  const alerts = [
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Clock,
      tone: "warning",
    },
    {
      title: "Failed Verifications",
      value: stats.failedVerifications,
      icon: AlertTriangle,
      tone: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainStats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((item, i) => (
          <Card
            key={i}
            className={cn(
              "bg-black/60 backdrop-blur-xl border shadow-lg transition-transform hover:scale-[1.01] duration-200",
              item.tone === "warning"
                ? "border-yellow-900/20"
                : "border-red-900/20"
            )}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1 font-medium">{item.title}</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <Badge
                    className={cn(
                      "text-[10px] px-2 py-0.5 border uppercase tracking-wider font-semibold",
                      item.tone === "warning"
                        ? "bg-yellow-900/10 text-yellow-400 border-yellow-900/30"
                        : "bg-red-900/10 text-red-400 border-red-900/30"
                    )}
                  >
                    Action Required
                  </Badge>
                </div>
              </div>

              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border",
                  item.tone === "warning"
                    ? "bg-yellow-900/10 border-yellow-900/20"
                    : "bg-red-900/10 border-red-900/20"
                )}
              >
                <item.icon
                  className={cn(
                    "w-6 h-6",
                    item.tone === "warning"
                      ? "text-yellow-400"
                      : "text-red-400"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
