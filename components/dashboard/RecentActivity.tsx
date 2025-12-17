"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Upload,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  FileText,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Types ---------------- */

interface ActivityItem {
  id: string;
  type: "upload" | "verify" | "approve" | "reject" | "view";
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  createdAt: string;
  status: "success" | "pending" | "failed" | "info";
  certificateId?: string;
}

/* ---------------- Helpers ---------------- */

function getIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "upload":
      return <Upload className="w-4 h-4 text-emerald-400" />;
    case "verify":
      return <Shield className="w-4 h-4 text-teal-400" />;
    case "approve":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "reject":
      return <XCircle className="w-4 h-4 text-red-400" />;
    case "view":
      return <Eye className="w-4 h-4 text-gray-400" />;
    default:
      return <FileText className="w-4 h-4 text-gray-400" />;
  }
}

function getStatusBadge(status: ActivityItem["status"]) {
  const base = "text-xs px-2 py-0.5 border";
  switch (status) {
    case "success":
      return (
        <Badge className={cn(base, "bg-green-900/20 text-green-300 border-green-900/30")}>
          Success
        </Badge>
      );
    case "pending":
      return (
        <Badge className={cn(base, "bg-yellow-900/20 text-yellow-300 border-yellow-900/30")}>
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge className={cn(base, "bg-red-900/20 text-red-300 border-red-900/30")}>
          Failed
        </Badge>
      );
    case "info":
      return (
        <Badge className={cn(base, "bg-blue-900/20 text-blue-300 border-blue-900/30")}>
          Info
        </Badge>
      );
  }
}

/* ---------------- Component ---------------- */

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/activity", {
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error("Failed to fetch activity", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Card className="bg-black/60 backdrop-blur-xl border border-emerald-900/20 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg text-white">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest certificate management actions
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-300 hover:text-emerald-200"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">

        {loading ? (
          <p className="text-sm text-gray-500 py-6 text-center">
            Loading activity…
          </p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">
            No recent activity
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60 hover:border-emerald-900/40 transition"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-black text-xs font-semibold">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  {getIcon(activity.type)}
                  <p className="text-sm font-medium text-white truncate">
                    {activity.title}
                  </p>
                  {getStatusBadge(activity.status)}
                </div>

                <p className="text-sm text-gray-400">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{activity.user.name}</span>
                  <span>
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>

                {activity.certificateId && (
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs font-mono border-gray-700 text-gray-300"
                  >
                    {activity.certificateId}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}

        <div className="pt-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="w-full border-emerald-900/30 text-emerald-300"
            onClick={fetchActivities}
          >
            <Clock className="w-4 h-4 mr-2" />
            Refresh Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
