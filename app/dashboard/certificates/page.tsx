"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    Calendar
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-mono text-white mb-2">My Certificates</h1>
                    <p className="text-gray-400">Manage, verify, and share your credentials.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-500">
                    <Plus className="w-4 h-4 mr-2" /> Upload New
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <form onSubmit={handleSearch}>
                        <Input
                            placeholder="Search certificates..."
                            className="pl-9 bg-black/40 border-gray-800"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>
                <Button variant="outline" className="border-gray-800">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="py-20 text-center text-gray-500">Loading certificates...</div>
            ) : certificates.length === 0 ? (
                <div className="py-20 text-center space-y-4 border border-dashed border-gray-800 rounded-xl">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-gray-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-white">No certificates found</p>
                        <p className="text-gray-500">Upload your first certificate to get started.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="bg-black/40 border-emerald-900/20 hover:border-emerald-500/30 transition group">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg flex items-center justify-center border border-emerald-500/10">
                                    <Award className="w-5 h-5 text-emerald-400" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-black border-gray-800">
                                        <DropdownMenuItem>
                                            <Eye className="w-4 h-4 mr-2" /> View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => window.open(cert.fileUrl, '_blank')}>
                                            <Download className="w-4 h-4 mr-2" /> Download
                                        </DropdownMenuItem>
                                        {cert.verificationHash && (
                                            <Link href={`/verify/${cert.verificationHash}`}>
                                                <DropdownMenuItem>
                                                    <Share2 className="w-4 h-4 mr-2" /> Public Link
                                                </DropdownMenuItem>
                                            </Link>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{cert.title}</h3>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(cert.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Badge className={`
                           ${cert.status === 'VERIFIED' || cert.status === 'APPROVED' ? 'bg-emerald-900/20 text-emerald-300 border-emerald-900/30' : ''}
                           ${cert.status === 'PENDING' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-900/30' : ''}
                           ${cert.status === 'REJECTED' ? 'bg-red-900/20 text-red-300 border-red-900/30' : ''}
                        `}>
                                        {cert.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
