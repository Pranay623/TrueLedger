"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Eye,
    Download,
    Share2,
    Calendar,
    Sparkles,
    ShieldCheck,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Certificate {
    id: string;
    title: string;
    description: string;
    status: "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";
    createdAt: string;
    fileUrl: string;
    verificationHash?: string;
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchCertificates = async (query = "") => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append("search", query);
            params.append("limit", "50");

            const res = await fetch(`/api/certificates?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setCertificates(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCertificates(search);
    };

    const handleDownload = async (certId: string, title: string) => {
        try {
            const res = await fetch(`/api/certificates/${certId}/download`);
            if (!res.ok) throw new Error("Download failed");

            const data = await res.json();
            // Trigger download via temporary link
            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.download = title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download file. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950/20 text-gray-100 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grid Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-800/50">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                                My Certificates
                                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg">Manage, verify, and share your digital credentials secure on the blockchain.</p>
                    </div>
                    <Link href="/dashboard/upload">
                        <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 h-12 px-6 text-base">
                            <Plus className="w-5 h-5 mr-2" /> Upload New
                        </Button>
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex gap-4 p-1">
                    <div className="relative flex-1 max-w-md group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                            <form onSubmit={handleSearch}>
                                <Input
                                    placeholder="Search certificates..."
                                    className="pl-11 h-12 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all duration-300"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>
                    <Button variant="outline" className="h-12 border-gray-700/50 bg-gray-900/50 text-gray-300 hover:text-white hover:bg-gray-800/80 hover:border-emerald-500/30 transition-all duration-300 px-6 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="py-32 text-center text-gray-500 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                        <p className="text-lg animate-pulse">Loading certificates...</p>
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="py-32 text-center space-y-6 border border-dashed border-gray-800 rounded-3xl bg-gray-900/20 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-gray-900/80 rounded-full flex items-center justify-center mx-auto text-gray-700 ring-4 ring-gray-900">
                            <Award className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl font-bold text-white">No certificates found</p>
                            <p className="text-gray-400 max-w-sm mx-auto">It looks like you haven't earned any certificates yet. Upload your first one to get started!</p>
                        </div>
                        <Link href="/dashboard/upload">
                            <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50">
                                <Plus className="w-4 h-4 mr-2" />
                                Upload Certificate
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert, index) => (
                            <Card
                                key={cert.id}
                                className="bg-gray-900/40 border-gray-800/50 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-500 group overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardHeader className="flex flex-row items-start justify-between pb-4 relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-500/5">
                                        <Award className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-gray-950 border-gray-800 text-gray-200">
                                            <Link href={`/dashboard/certificates/${cert.id}`}>
                                                <DropdownMenuItem className="focus:bg-emerald-500/20 focus:text-emerald-400 cursor-pointer">
                                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem onClick={() => handleDownload(cert.id, cert.title)} className="focus:bg-emerald-500/20 focus:text-emerald-400 cursor-pointer">
                                                <Download className="w-4 h-4 mr-2" /> Download
                                            </DropdownMenuItem>
                                            {cert.verificationHash && (
                                                <Link href={`/verify/${cert.verificationHash}`} target="_blank">
                                                    <DropdownMenuItem className="focus:bg-emerald-500/20 focus:text-emerald-400 cursor-pointer">
                                                        <Share2 className="w-4 h-4 mr-2" /> Public Link
                                                    </DropdownMenuItem>
                                                </Link>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="space-y-5 relative">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors truncate mb-2">{cert.title}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-gray-600" />
                                            Issued on {new Date(cert.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/50">
                                        <Badge className={`
                                            px-3 py-1 text-xs font-semibold border backdrop-blur-md shadow-sm transition-all duration-300
                                            ${cert.status === 'VERIFIED' || cert.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' : ''}
                                            ${cert.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-yellow-500/10' : ''}
                                            ${cert.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10' : ''}
                                        `}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse
                                                ${cert.status === 'VERIFIED' || cert.status === 'APPROVED' ? 'bg-emerald-400' : ''}
                                                ${cert.status === 'PENDING' ? 'bg-yellow-400' : ''}
                                                ${cert.status === 'REJECTED' ? 'bg-red-400' : ''}
                                            `} />
                                            {cert.status}
                                        </Badge>

                                        {cert.verificationHash && (
                                            <div className="p-1.5 rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50" title="Blockchain Verified">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
