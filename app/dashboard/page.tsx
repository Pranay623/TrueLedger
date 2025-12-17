"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Shield,
  BarChart3,
  FileText,
  Award,
  ArrowRight,
  Plus,
  Download,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening with your certificates."
      />

      <main className="flex-1 p-6 space-y-8 overflow-auto">

        {/* Stats */}
        <StatsCards />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-16 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-400 text-black font-medium">
            <Upload className="w-5 h-5 mr-2" />
            Upload Certificate
          </Button>

          <Button variant="outline" className="h-16 border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/20">
            <Shield className="w-5 h-5 mr-2" />
            Verify Certificate
          </Button>

          <Button variant="outline" className="h-16 border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/20">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </Button>

          <Button variant="outline" className="h-16 border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/20">
            <FileText className="w-5 h-5 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Side Panels */}
          <div className="space-y-6">

            {/* Today's Summary */}
            <Card className="glass bg-black/40 border border-emerald-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-mono">Today's Summary</CardTitle>
                <CardDescription className="text-gray-400">Key metrics for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SummaryRow label="Certificates Processed" value="156" />
                <SummaryRow label="Success Rate" value="98.7%" success />
                <SummaryRow label="Pending Reviews" value="12" />

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-400">Processing Queue</span>
                    <span className="text-emerald-300">78%</span>
                  </div>
                  <Progress value={78} className="h-2 bg-gray-800" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Certificates */}
            <Card className="glass bg-black/40 border border-emerald-900/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">Recent Certificates</CardTitle>
                  <CardDescription className="text-gray-400">Latest uploads</CardDescription>
                </div>
                <Button size="icon" variant="ghost">
                  <Plus className="w-4 h-4 text-emerald-300" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {[
                  { title: "Computer Science Degree", student: "John Doe", status: "verified", date: "2h ago" },
                  { title: "MBA Certificate", student: "Sarah Wilson", status: "pending", date: "4h ago" },
                  { title: "PhD in Data Science", student: "Michael Chen", status: "verified", date: "1d ago" }
                ].map((cert, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-gray-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cert.title}</p>
                      <p className="text-xs text-gray-400">{cert.student}</p>
                      <div className="flex justify-between mt-1">
                        <Badge className={cert.status === "verified"
                          ? "bg-emerald-900/20 text-emerald-300"
                          : "bg-orange-900/20 text-orange-300"}>
                          {cert.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{cert.date}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full border-emerald-800/30 text-emerald-300">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="glass bg-black/40 border border-emerald-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-mono">System Status</CardTitle>
                <CardDescription className="text-gray-400">All systems operational</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatusRow label="AI Processing" status="Online" />
                <StatusRow label="Blockchain Network" status="Connected" />
                <StatusRow label="Storage" status="75% Used" warning />

                <Button variant="outline" className="w-full border-emerald-800/30 text-emerald-300">
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Certificate Trends"
            description="Monthly processing overview"
            icon={<BarChart3 />}
          />
          <ChartCard
            title="Verification Success Rate"
            description="Success trends"
            icon={<TrendingUp />}
          />
        </div>
      </main>
    </>
  );
}

/* ---------- Helpers ---------- */

function SummaryRow({ label, value, success }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <Badge className={success ? "bg-emerald-900/20 text-emerald-300" : "bg-gray-800"}>
        {value}
      </Badge>
    </div>
  );
}

function StatusRow({ label, status, warning }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={warning ? "text-yellow-400" : "text-emerald-400"}>
        {status}
      </span>
    </div>
  );
}

function ChartCard({ title, description, icon }: any) {
  return (
    <Card className="glass bg-black/40 border border-emerald-900/20">
      <CardHeader>
        <CardTitle className="text-lg font-mono">{title}</CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-black/30 rounded-xl border border-gray-800">
          <div className="text-center text-gray-500">
            {icon}
            <p className="mt-2">Chart visualization here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
