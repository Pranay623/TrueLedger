"use client";

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
import { Loader2, Save, User, Building, Mail, Calendar, Shield, Activity, Award, TrendingUp, Clock } from "lucide-react";
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

// Skeleton Components
function ProfileCardSkeleton() {
    return (
        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <CardContent className="pt-8 text-center space-y-6 relative">
                <Skeleton className="w-28 h-28 rounded-full mx-auto bg-emerald-950/50" />
                <div className="space-y-2">
                    <Skeleton className="h-7 w-40 mx-auto bg-emerald-950/50" />
                    <Skeleton className="h-4 w-48 mx-auto bg-emerald-950/50" />
                </div>
                <Skeleton className="h-6 w-24 mx-auto bg-emerald-950/50" />
            </CardContent>
        </Card>
    );
}

function AccountInfoSkeleton() {
    return (
        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <CardHeader className="relative">
                <Skeleton className="h-5 w-32 bg-emerald-950/50" />
            </CardHeader>
            <CardContent className="text-sm space-y-4 relative">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                        <Skeleton className="h-4 w-24 bg-emerald-950/50" />
                        <Skeleton className="h-4 w-32 bg-emerald-950/50" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function ProfileStrengthSkeleton() {
    return (
        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <CardHeader className="relative">
                <Skeleton className="h-5 w-36 bg-emerald-950/50" />
            </CardHeader>
            <CardContent className="relative">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm mb-2">
                        <Skeleton className="h-4 w-20 bg-emerald-950/50" />
                        <Skeleton className="h-4 w-12 bg-emerald-950/50" />
                    </div>
                    <Skeleton className="h-2 w-full bg-emerald-950/50 rounded-full" />
                    <Skeleton className="h-3 w-full bg-emerald-950/50" />
                </div>
            </CardContent>
        </Card>
    );
}

function FormSkeleton() {
    return (
        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/30 h-fit overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <CardHeader className="relative border-b border-emerald-900/20 pb-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg bg-emerald-950/50" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-32 bg-emerald-950/50" />
                        <Skeleton className="h-4 w-48 bg-emerald-950/50" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 relative">
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-emerald-950/50" />
                            <Skeleton className="h-10 w-full bg-emerald-950/50 rounded-md" />
                        </div>
                    ))}
                    <div className="pt-6 flex justify-end border-t border-emerald-900/20">
                        <Skeleton className="h-10 w-36 bg-emerald-950/50 rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ProfilePage() {
    const [mounted, setMounted] = useState(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } = useForm<{ fullName: string; institutionname?: string }>();

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
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" 
                         style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl animate-pulse" 
                         style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl animate-pulse" 
                         style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8">
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                            <Skeleton className="h-10 w-48 bg-emerald-950/50" />
                        </div>
                        <Skeleton className="h-5 w-64 ml-7 bg-emerald-950/50" />
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
                        <div className="space-y-6">
                            <ProfileCardSkeleton />
                            <AccountInfoSkeleton />
                            <ProfileStrengthSkeleton />
                        </div>
                        <FormSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950/20 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>Failed to load profile. Please try refreshing the page.</AlertDescription>
                </Alert>
            </div>
        );
    }

    const isAdmin = profile.usertype === "INSTITUTION";
    const accountAge = Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950/20 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" 
                     style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl animate-pulse" 
                     style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl animate-pulse" 
                     style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8">
                {/* Header Section with Animation */}
                <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                        <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                            My Profile
                        </h1>
                    </div>
                    <p className="text-gray-400 ml-7">Manage your account settings and track your journey.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card className={`bg-black/40 backdrop-blur-sm border-emerald-900/30 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-800/50 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                              style={{ transitionDelay: '100ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                            <CardContent className="pt-8 text-center space-y-6 relative">
                                {/* Avatar with Glow Effect */}
                                <div className="relative inline-block group">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-500"></div>
                                    <Avatar className="w-28 h-28 mx-auto border-4 border-emerald-500/30 relative group-hover:border-emerald-500/50 transition-all duration-500 group-hover:scale-105">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} />
                                        <AvatarFallback className="bg-emerald-950 text-emerald-400 text-2xl font-bold">
                                            {profile.username.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {profile.fullName || profile.username}
                                    </h2>
                                    <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                                        <Mail className="w-3 h-3" />
                                        {profile.email}
                                    </p>
                                </div>

                                <div className="flex justify-center gap-2">
                                    <Badge variant="outline" className="border-emerald-800/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                                        <Shield className="w-3 h-3 mr-1" />
                                        {profile.usertype}
                                    </Badge>
                                    {profile.admin && (
                                        <Badge variant="default" className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 shadow-lg shadow-red-500/20">
                                            <Shield className="w-3 h-3 mr-1" />
                                            Admin
                                        </Badge>
                                    )}
                                </div>

                            </CardContent>
                        </Card>

                        {/* Account Stats */}
                        <Card className={`bg-black/40 backdrop-blur-sm border-emerald-900/30 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-800/50 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                              style={{ transitionDelay: '200ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                            <CardHeader className="relative">
                                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-500" />
                                    Account Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4 relative">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-500 transition-colors" />
                                        Member since
                                    </span>
                                    <span className="text-gray-300 font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <User className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-500 transition-colors" />
                                        Username
                                    </span>
                                    <span className="text-gray-300 font-medium">@{profile.username}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-500 transition-colors" />
                                        Account age
                                    </span>
                                    <span className="text-gray-300 font-medium">{accountAge} days</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats Card */}
                        <Card className={`bg-black/40 backdrop-blur-sm border-emerald-900/30 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-800/50 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                              style={{ transitionDelay: '300ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                            <CardHeader className="relative">
                                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    Profile Strength
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Completion</span>
                                        <span className="text-emerald-400 font-semibold">
                                            {Math.round(((profile.fullName ? 1 : 0) + (profile.institutionname && isAdmin ? 1 : 0) + 2) / (isAdmin ? 4 : 3) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                                            style={{ 
                                                width: `${Math.round(((profile.fullName ? 1 : 0) + (profile.institutionname && isAdmin ? 1 : 0) + 2) / (isAdmin ? 4 : 3) * 100)}%`,
                                                transitionDelay: '500ms'
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {profile.fullName && (!isAdmin || profile.institutionname) 
                                            ? "Your profile is complete! 🎉" 
                                            : "Complete your profile to unlock all features"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Edit Form */}
                    <Card className={`bg-black/40 backdrop-blur-sm border-emerald-900/30 h-fit overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-800/50 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                          style={{ transitionDelay: '200ms' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                        <CardHeader className="relative border-b border-emerald-900/20 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Save className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Edit Profile</CardTitle>
                                    <CardDescription className="text-gray-500 mt-1">
                                        Update your personal information
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="space-y-6">
                                {mutation.isSuccess && (
                                    <Alert 
                                        className="border-emerald-500/50 text-emerald-300 bg-emerald-500/10 animate-in fade-in slide-in-from-top-2"
                                    >
                                        <AlertDescription className="flex items-center gap-2">
                                            <Award className="w-4 h-4" />
                                            Profile updated successfully
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {mutation.isError && (
                                    <Alert 
                                        variant="destructive"
                                        className="animate-in fade-in slide-in-from-top-2"
                                    >
                                        <AlertDescription>
                                            {mutation.error instanceof Error ? mutation.error.message : "Failed to update profile"}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2 group">
                                    <Label className="text-gray-300 flex items-center gap-2">
                                        <User className="w-4 h-4 text-emerald-500/70" />
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            {...register("fullName")} 
                                            className="pl-4 bg-black/30 border-emerald-900/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-white placeholder:text-gray-600" 
                                            placeholder="Enter your full name" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <Label className="text-gray-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-emerald-500/70" />
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            value={profile.email} 
                                            disabled 
                                            className="pl-4 bg-black/20 border-emerald-900/20 text-gray-500 cursor-not-allowed" 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        Email cannot be changed for security reasons
                                    </p>
                                </div>

                                {isAdmin && (
                                    <div className="space-y-2 group">
                                        <Label className="text-gray-300 flex items-center gap-2">
                                            <Building className="w-4 h-4 text-emerald-500/70" />
                                            Institution Name
                                        </Label>
                                        <div className="relative">
                                            <Input 
                                                {...register("institutionname")} 
                                                className="pl-4 bg-black/30 border-emerald-900/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-white placeholder:text-gray-600" 
                                                placeholder="Enter institution name" 
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 flex justify-end border-t border-emerald-900/20">
                                    <Button 
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={mutation.isPending} 
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}