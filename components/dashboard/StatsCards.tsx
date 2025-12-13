import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  return (
    <Card className="bg-black/60 backdrop-blur-xl border border-emerald-900/20 shadow-lg hover:shadow-emerald-900/10 transition">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>

          {change && (
            <div className="flex items-center gap-1 text-xs">
              {change.type === "increase" ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span
                className={cn(
                  "font-medium",
                  change.type === "increase"
                    ? "text-emerald-400"
                    : "text-red-400"
                )}
              >
                {change.value}
              </span>
              <span className="text-gray-500">{change.period}</span>
            </div>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-emerald-900/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsCards() {
  const stats = [
    {
      title: "Total Certificates",
      value: "2,847",
      change: {
        value: "+12.5%",
        type: "increase" as const,
        period: "this month",
      },
      icon: Award,
    },
    {
      title: "Active Students",
      value: "1,234",
      change: {
        value: "+8.2%",
        type: "increase" as const,
        period: "this month",
      },
      icon: Users,
    },
    {
      title: "Verified Today",
      value: "156",
      change: {
        value: "+23.1%",
        type: "increase" as const,
        period: "since yesterday",
      },
      icon: Shield,
    },
    {
      title: "Success Rate",
      value: "98.7%",
      change: {
        value: "+0.3%",
        type: "increase" as const,
        period: "this week",
      },
      icon: CheckCircle,
    },
  ];

  const alerts = [
    {
      title: "Pending Reviews",
      value: "12",
      icon: Clock,
      tone: "warning",
    },
    {
      title: "Failed Verifications",
      value: "3",
      icon: AlertTriangle,
      tone: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((item, i) => (
          <Card
            key={i}
            className={cn(
              "bg-black/60 backdrop-blur-xl border shadow-lg",
              item.tone === "warning"
                ? "border-yellow-900/30"
                : "border-red-900/30"
            )}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{item.title}</p>
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <Badge
                  className={cn(
                    "mt-2 text-xs border",
                    item.tone === "warning"
                      ? "bg-yellow-900/20 text-yellow-300 border-yellow-900/30"
                      : "bg-red-900/20 text-red-300 border-red-900/30"
                  )}
                >
                  Needs attention
                </Badge>
              </div>

              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  item.tone === "warning"
                    ? "bg-yellow-900/20"
                    : "bg-red-900/20"
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
