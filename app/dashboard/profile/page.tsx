"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Loader2, Save, User, Building, Mail, Calendar, Shield, Activity,
    Award, TrendingUp, Clock, Trash2, AlertTriangle, Sparkles,
    CheckCircle2, Zap, Star, Crown
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileData {
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    usertype: "STUDENT" | "INSTITUTION";
    institutionname: string | null;
    createdAt: string;
    admin: boolean;
}

// Fetch profile function
const fetchProfile = async (): Promise<ProfileData> => {
    const res = await fetch("/api/users/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
};

// Update profile function
const updateProfile = async (data: { fullName: string; institutionname?: string }): Promise<{ user: ProfileData }> => {
    const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
    }
    return res.json();
};

// Delete profile function
const deleteProfile = async (): Promise<void> => {
    const res = await fetch("/api/users/me", {
        method: "DELETE",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete account");
    }
    return res.json();
};

function ProfileCardSkeleton() {
    return (
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl border-gray-800/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 animate-pulse" />
            <CardContent className="pt-8 text-center space-y-6 relative">
                <div className="relative">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-emerald-900/30 to-blue-900/30" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-2xl" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-8 w-48 mx-auto bg-gray-800/50" />
                    <Skeleton className="h-4 w-56 mx-auto bg-gray-800/50" />
                </div>
                <div className="flex justify-center gap-2">
                    <Skeleton className="h-7 w-24 bg-gray-800/50 rounded-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function ProfilePage() {
    const [mounted, setMounted] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    const { register, handleSubmit, reset } = useForm<{ fullName: string; institutionname?: string }>();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch profile with React Query
    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });

    // Update profile mutation
    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            // Update cache with new data
            queryClient.setQueryData(["profile"], data.user);
        },
    });

    // Delete profile mutation
    const deleteMutation = useMutation({
        mutationFn: deleteProfile,
        onSuccess: () => {
            router.push("/signin"); // Redirect to login after deletion
        },
    });

    // Reset form when profile data is loaded
    useEffect(() => {
        if (profile) {
            reset({
                fullName: profile.fullName || "",
                institutionname: profile.institutionname || "",
            });
        }
    }, [profile, reset]);

    const onSubmit = (data: { fullName: string; institutionname?: string }) => {
        mutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950/20 relative overflow-hidden">
                {/* Enhanced Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-16 bg-gradient-to-b from-emerald-500 via-emerald-400 to-blue-500 rounded-full animate-pulse" />
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-56 bg-gray-800/50" />
                                <Skeleton className="h-5 w-80 bg-gray-800/50" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                        <div className="space-y-6">
                            <ProfileCardSkeleton />
                            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl border-gray-800/50">
                                <CardHeader>
                                    <Skeleton className="h-5 w-32 bg-gray-800/50" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-16 w-full bg-gray-800/50 rounded-lg" />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl border-gray-800/50 h-fit">
                            <CardHeader>
                                <Skeleton className="h-8 w-40 bg-gray-800/50" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-24 bg-gray-800/50" />
                                        <Skeleton className="h-12 w-full bg-gray-800/50 rounded-lg" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950/20 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md bg-red-950/50 border-red-900/50 text-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Failed to load profile. Please try refreshing the page.</AlertDescription>
                </Alert>
            </div>
        );
    }

    const isAdmin = profile.usertype === "INSTITUTION";
    const accountAge = Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const profileCompletion = Math.round(((profile.fullName ? 1 : 0) + (profile.institutionname && isAdmin ? 1 : 0) + 2) / (isAdmin ? 4 : 3) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950/20 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-500/30 rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-10">
                {/* Enhanced Header */}
                <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                            <div className="w-1.5 h-16 bg-gradient-to-b from-emerald-500 via-emerald-400 to-blue-500 rounded-full" />
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full blur-md opacity-50" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                                My Profile
                                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                            </h1>
                            <p className="text-gray-400 text-lg">Manage your account and track your achievements</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card className={`bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl border-gray-800/50 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/30 hover:scale-[1.02] group ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                            style={{ transitionDelay: '100ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                            <CardContent className="pt-10 pb-8 text-center space-y-6 relative">
                                {/* Avatar with Advanced Effects */}
                                <div className="relative inline-block group/avatar">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-full blur-2xl group-hover/avatar:blur-3xl transition-all duration-500 animate-pulse" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-xl animate-spin" style={{ animationDuration: '10s' }} />

                                    <Avatar className="w-32 h-32 mx-auto border-4 border-gradient-to-r from-emerald-500/50 to-blue-500/50 relative group-hover/avatar:border-emerald-400/70 transition-all duration-500 group-hover/avatar:scale-110 shadow-2xl">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} />
                                        <AvatarFallback className="bg-gradient-to-br from-emerald-900 to-blue-900 text-emerald-300 text-3xl font-bold">
                                            {profile.username.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Animated Status Ring */}
                                    <div className="absolute bottom-2 right-2">
                                        <div className="relative">
                                            <div className="w-5 h-5 bg-emerald-500 rounded-full border-3 border-gray-900 animate-pulse shadow-lg shadow-emerald-500/50" />
                                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                        </div>
                                    </div>

                                    {/* Level Badge */}
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-500/50 flex items-center gap-1">
                                        <Star className="w-3 h-3" fill="currentColor" />
                                        Level 5
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {profile.fullName || profile.username}
                                    </h2>
                                    <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                                        <Mail className="w-4 h-4 text-emerald-500" />
                                        {profile.email}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2">
                                    <Badge className="border-emerald-500/40 text-emerald-300 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 transition-all px-4 py-1.5 shadow-lg shadow-emerald-500/20">
                                        <Shield className="w-3 h-3 mr-1.5" />
                                        {profile.usertype}
                                    </Badge>
                                    {profile.admin && (
                                        <Badge className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white border-0 shadow-lg shadow-red-500/30 px-4 py-1.5 animate-pulse">
                                            <Crown className="w-3 h-3 mr-1.5" fill="currentColor" />
                                            Admin
                                        </Badge>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-800/50">
                                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-transparent hover:from-emerald-500/20 transition-all group/stat">
                                        <Award className="w-5 h-5 mx-auto mb-1 text-emerald-400 group-hover/stat:scale-110 transition-transform" />
                                        <p className="text-2xl font-bold text-white">12</p>
                                        <p className="text-xs text-gray-500">Certificates</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all group/stat">
                                        <Zap className="w-5 h-5 mx-auto mb-1 text-blue-400 group-hover/stat:scale-110 transition-transform" />
                                        <p className="text-2xl font-bold text-white">24</p>
                                        <p className="text-xs text-gray-500">Activities</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent hover:from-purple-500/20 transition-all group/stat">
                                        <Star className="w-5 h-5 mx-auto mb-1 text-purple-400 group-hover/stat:scale-110 transition-transform" />
                                        <p className="text-2xl font-bold text-white">98%</p>
                                        <p className="text-xs text-gray-500">Rating</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Info Card */}
                        <Card className={`bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl border-gray-800/50 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 group ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                            style={{ transitionDelay: '200ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative pb-4">
                                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                        <Activity className="w-4 h-4 text-blue-400" />
                                    </div>
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 relative">
                                {[
                                    { icon: Calendar, label: "Member since", value: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), color: "emerald" },
                                    { icon: User, label: "Username", value: `@${profile.username}`, color: "blue" },
                                    { icon: Clock, label: "Account age", value: `${accountAge} days`, color: "purple" }
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/30 hover:from-\u0024{item.color}-500/10 hover:to-gray-900/30 border border-gray-800/50 hover:border-\u0024{item.color}-500/30 transition-all duration-300 group/item`}
                                    >
                                        <span className="text-gray-400 flex items-center gap-3 text-sm group-hover/item:text-gray-300 transition-colors">
                                            <div className={`p-1.5 bg-\u0024{item.color}-500/10 rounded-lg group-hover/item:bg-\u0024{item.color}-500/20 transition-colors`}>
                                                <item.icon className={`w-4 h-4 text-\u0024{item.color}-400`} />
                                            </div>
                                            {item.label}
                                        </span>
                                        <span className="text-white font-semibold text-sm">{item.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Profile Strength Card */}
                        <Card className={`bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl border-gray-800/50 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 group ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                            style={{ transitionDelay: '300ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative pb-4">
                                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                        <TrendingUp className="w-4 h-4 text-purple-400" />
                                    </div>
                                    Profile Strength
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative space-y-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-400 text-sm font-medium">Completion</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                                        {profileCompletion}%
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                                            style={{ width: `${profileCompletion}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full blur-md" style={{ width: `${profileCompletion}%` }} />
                                </div>

                                <div className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        {profileCompletion === 100
                                            ? "🎉 Your profile is complete! You're all set to get the most out of TrueLedger."
                                            : "Complete your profile to unlock advanced features and personalized experiences."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Edit Form */}
                        <Card className={`bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl border-gray-800/50 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 group ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: '200ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="relative border-b border-gray-800/50 pb-6 bg-gradient-to-r from-gray-900/50 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <Save className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                                Edit Profile
                                            </CardTitle>
                                            <CardDescription className="text-gray-400 mt-1">
                                                Update your personal information and preferences
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                                </div>
                            </CardHeader>

                            <CardContent className="pt-8 relative">
                                <div className="space-y-6">
                                    {mutation.isSuccess && (
                                        <Alert className="border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <AlertDescription className="text-emerald-300 font-medium flex items-center gap-2 ml-2">
                                                Profile updated successfully! Your changes have been saved.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {mutation.isError && (
                                        <Alert variant="destructive" className="bg-red-950/50 border-red-900/50 animate-in fade-in slide-in-from-top-4">
                                            <AlertDescription>
                                                {mutation.error instanceof Error ? mutation.error.message : "Failed to update profile"}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-3 group/field">
                                        <Label className="text-gray-300 flex items-center gap-2 text-sm font-semibold">
                                            <User className="w-4 h-4 text-emerald-400" />
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                {...register("fullName")}
                                                className="pl-4 pr-4 py-6 bg-gray-900/50 border-gray-700/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-white placeholder:text-gray-600 rounded-xl hover:border-gray-600 group-focus-within/field:shadow-lg group-focus-within/field:shadow-emerald-500/10"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group/field">
                                        <Label className="text-gray-300 flex items-center gap-2 text-sm font-semibold">
                                            <Mail className="w-4 h-4 text-blue-400" />
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                value={profile.email}
                                                disabled
                                                className="pl-4 pr-4 py-6 bg-gray-950/50 border-gray-800/50 text-gray-500 cursor-not-allowed rounded-xl"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5 ml-1">
                                            <Shield className="w-3 h-3" />
                                            Email cannot be changed for security reasons
                                        </p>
                                    </div>

                                    {isAdmin && (
                                        <div className="space-y-3 group/field">
                                            <Label className="text-gray-300 flex items-center gap-2 text-sm font-semibold">
                                                <Building className="w-4 h-4 text-purple-400" />
                                                Institution Name
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    {...register("institutionname")}
                                                    className="pl-4 pr-4 py-6 bg-gray-900/50 border-gray-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-white placeholder:text-gray-600 rounded-xl hover:border-gray-600 group-focus-within/field:shadow-lg group-focus-within/field:shadow-purple-500/10"
                                                    placeholder="Enter institution name"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-8 flex justify-end border-t border-gray-800/50">
                                        <Button
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={mutation.isPending}
                                            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 h-12 px-8 rounded-xl font-semibold"
                                        >
                                            {mutation.isPending ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className={`lg:col-start-2 bg-gradient-to-br from-red-950/10 to-red-900/10 backdrop-blur-xl border-red-900/30 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-red-900/10 hover:border-red-800/50 group ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: '300ms' }}>
                            <CardHeader className="relative border-b border-red-900/20 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <AlertTriangle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-red-400 font-bold">Danger Zone</CardTitle>
                                        <CardDescription className="text-red-900/60 dark:text-red-300/60 mt-1 font-medium">
                                            Irreversible account actions
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 relative">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-red-950/20 border border-red-900/20">
                                        <div className="space-y-1">
                                            <h3 className="text-gray-200 font-semibold">Delete Account</h3>
                                            <p className="text-sm text-gray-400">Permanently remove your account and all associated data</p>
                                        </div>
                                        {!showDeleteConfirm ? (
                                            <Button
                                                variant="destructive"
                                                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 h-10 px-6 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
                                                onClick={() => setShowDeleteConfirm(true)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="ghost"
                                                    className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 h-10 px-4 transition-colors"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="bg-red-600 hover:bg-red-700 text-white h-10 px-4 shadow-lg shadow-red-600/20"
                                                    onClick={() => deleteMutation.mutate()}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    {deleteMutation.isPending ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        "Confirm Delete"
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {showDeleteConfirm && (
                                        <Alert variant="destructive" className="bg-red-950/30 border-red-900/50 text-red-200 animate-in fade-in zoom-in duration-300">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription className="ml-2">
                                                Warning: This action cannot be undone. All your certificates and data will be permanently lost.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {deleteMutation.isError && (
                                        <Alert variant="destructive">
                                            <AlertDescription>
                                                {deleteMutation.error instanceof Error ? deleteMutation.error.message : "Failed to delete account"}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}