"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Building,
    Mail,
    User,
    ShieldCheck,
    ExternalLink,
    Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface InstitutionDetails {
    institutionName: string;
    admin: {
        id: string;
        fullName: string;
        email: string;
        createdAt: string;
    } | null;
    message?: string;
}

export default function InstitutionPage() {
    const [data, setData] = useState<InstitutionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/institution/details");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    const err = await res.json();
                    setError(err.message || "Failed to load institution details");
                }
            } catch (error) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <>
                <DashboardHeader title="Institution" description="Your connected institution" />
                <div className="p-6">
                    <Card className="bg-black/40 border-emerald-900/20 backdrop-blur-sm max-w-2xl">
                        <CardHeader className="space-y-4">
                            <Skeleton className="w-16 h-16 rounded-lg bg-gray-800" />
                            <div className="space-y-2">
                                <Skeleton className="w-48 h-6 bg-gray-800" />
                                <Skeleton className="w-64 h-4 bg-gray-800" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="w-full h-24 bg-gray-800/50 rounded-xl" />
                            <Skeleton className="w-full h-12 bg-gray-800/50 rounded-xl" />
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6">
                <Card className="bg-red-900/10 border-red-900/20 max-w-lg">
                    <CardContent className="p-6 text-red-400">
                        <h3 className="text-lg font-bold mb-2">Error</h3>
                        <p>{error || "Could not load data"}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <DashboardHeader
                title="Institution"
                description="View details of your linked institution and admin"
            />

            <div className="p-6">
                <div className="grid gap-6 md:grid-cols-[1fr_300px] max-w-5xl">

                    {/* Main Info */}
                    <Card className="bg-gradient-to-br from-black/60 to-emerald-900/5 border-emerald-900/20 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <CardHeader className="pb-8">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-6">
                                    <div className="w-20 h-20 bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/20">
                                        <Building className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <div>
                                        <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">Verified Institution</Badge>
                                        <CardTitle className="text-3xl font-bold text-white mb-2">{data.institutionName}</CardTitle>
                                        <CardDescription className="text-gray-400 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            Officially Registered on TrueLedger
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            {/* Admin Contact Card */}
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Institution Administrator</h3>

                                {data.admin ? (
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-14 h-14 border-2 border-emerald-500/30">
                                            <AvatarImage src="" />
                                            <AvatarFallback className="bg-emerald-900 text-emerald-200 text-lg">
                                                {data.admin.fullName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-white">{data.admin.fullName}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {data.admin.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Since {new Date(data.admin.createdAt).getFullYear()}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="ml-auto border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                            Contact
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-yellow-400 text-sm">
                                        No dedicated administrator found.
                                    </div>
                                )}
                            </div>

                            <div className="text-sm text-gray-500">
                                <p>Need help? Contact the administrator above for approvals or certificate issues.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar / Actions */}
                    <div className="space-y-6">
                        <Card className="bg-black/40 border-emerald-900/20">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" variant="ghost">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Visit Website
                                </Button>
                                <Button className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10" variant="ghost">
                                    Report Issue
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </>
    );
}
