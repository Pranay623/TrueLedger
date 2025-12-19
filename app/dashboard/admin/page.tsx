"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Shield,
    Download
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface AdminStats {
    totalCertificates: number;
    pending: number;
    approved: number;
    rejected: number;
    verified: number;
    todayUploads: number;
    successRate: number;
}

export default function AdminDashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.usertype !== "INSTITUTION")) {
            // Basic client-side protection, API handles real security
            // Ideally redirect to 404 or regular dashboard
            // router.push("/dashboard"); 
        }
    }, [user, authLoading, router]);


    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/dashboard/stats");
                if (!res.ok) {
                    if (res.status === 403) {
                        setError("Access Denied: Admin permissions required.");
                    } else {
                        setError("Failed to load admin statistics.");
                    }
                    return;
                }
                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        if (user && user.usertype === "INSTITUTION") {
            fetchStats();
        } else if (!authLoading && !user) {
            setLoading(false); // Stop loading if no user
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card className="bg-red-900/10 border-red-900/20">
                    <CardContent className="p-6 flex items-center justify-center text-red-400">
                        {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-400">Institution overview and management</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-emerald-900/30 text-emerald-400 hover:bg-emerald-900/20">
                        <Download className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Certificates"
                    value={stats.totalCertificates}
                    icon={FileText}
                    description="All time issuance"
                    trend="+12% this month"
                />
                <StatsCard
                    title="Pending Review"
                    value={stats.pending}
                    icon={Clock}
                    description="Requires action"
                    trend={`${stats.pending} items waiting`}
                    alert={stats.pending > 0}
                />
                <StatsCard
                    title="Verified Certificates"
                    value={stats.verified}
                    icon={Shield}
                    description="Successfully verified on-chain"
                    trend="High trust score"
                />
                <StatsCard
                    title="Success Rate"
                    value={`${stats.successRate}%`}
                    icon={TrendingUp}
                    description="Approval vs Rejection"
                    trend="Unchanged"
                />
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Issuance Status</CardTitle>
                        <CardDescription>Breakdown of current certificate statuses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <StatusRow label="Approved" value={stats.approved} icon={CheckCircle} color="text-emerald-400" />
                        <StatusRow label="Pending" value={stats.pending} icon={Clock} color="text-yellow-400" />
                        <StatusRow label="Rejected" value={stats.rejected} icon={XCircle} color="text-red-400" />
                        <StatusRow label="Uploaded Today" value={stats.todayUploads} icon={FileText} color="text-blue-400" />
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/upload">
                            <Button variant="secondary" className="w-full h-24 flex flex-col gap-2">
                                <FileText className="w-6 h-6" />
                                Issue New
                            </Button>
                        </Link>
                        <Link href="/dashboard/certificates?status=PENDING">
                            <Button variant="secondary" className="w-full h-24 flex flex-col gap-2">
                                <Clock className="w-6 h-6" />
                                Review Pending
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, description, trend, alert }: any) {
    return (
        <Card className={`bg-gray-900/30 border-gray-800 backdrop-blur-sm ${alert ? 'border-yellow-500/30 bg-yellow-900/5' : ''}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${alert ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-800 text-gray-400'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {alert && <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-[10px] uppercase">Action Required</Badge>}
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{description}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className={alert ? 'text-yellow-500' : 'text-emerald-500'}>{trend}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusRow({ label, value, icon: Icon, color }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-gray-800/50">
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-gray-300 font-medium">{label}</span>
            </div>
            <span className="text-xl font-bold text-white">{value}</span>
        </div>
    );
}

