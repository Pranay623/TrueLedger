"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Filter,
    Download,
    MoreVertical,
    Eye,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Modal } from "@/components/ui/modal";

interface Certificate {
    id: string;
    title: string;
    description: string;
    status: "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";
    createdAt: string;
    fileUrl: string;
    owner: {
        fullName: string;
        email: string;
    };
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminCertificatesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState<string | null>(
        searchParams.get("status") || null
    );

    const fetchCertificates = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append("page", pagination.page.toString());
            params.append("limit", pagination.limit.toString());
            if (search) params.append("search", search);
            if (statusFilter && statusFilter !== "ALL") params.append("status", statusFilter);

            const res = await fetch(`/api/admin/certificates?${params.toString()}`);

            if (!res.ok) {
                if (res.status === 403) {
                    setError("Access Denied: Admin permissions required.");
                } else {
                    setError("Failed to fetch certificates.");
                }
                return;
            }

            const data = await res.json();
            setCertificates(data.data);
            setPagination({
                page: data.page,
                limit: data.limit,
                total: data.total,
                totalPages: data.totalPages,
            });
        } catch (err) {
            console.error(err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Auth check
    useEffect(() => {
        if (!authLoading && (!user || user.usertype !== "INSTITUTION")) {
            // Ideally redirect, for now just let the API handle 403
        }
    }, [user, authLoading]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            // Reset to page 1 on search change
            if (pagination.page !== 1) {
                setPagination(prev => ({ ...prev, page: 1 }));
            } else {
                fetchCertificates();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    // Fetch when page changes
    useEffect(() => {
        fetchCertificates();
    }, [pagination.page]);


    const handleDownload = async (certId: string, title: string) => {
        try {
            // Admin might need a specific download endpoint or use the public one if authorized
            // Assuming generic download endpoint works for admin too if they own the institution
            const res = await fetch(`/api/certificates/${certId}/download`);
            if (!res.ok) throw new Error("Download failed");

            const data = await res.json();
            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.download = title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download file.");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "VERIFIED":
            case "APPROVED":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                        <CheckCircle className="w-3 h-3 mr-1" /> {status}
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">
                        <Clock className="w-3 h-3 mr-1" /> {status}
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
                        <XCircle className="w-3 h-3 mr-1" /> {status}
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Modal States
    const [approveId, setApproveId] = useState<string | null>(null);
    const [rejectId, setRejectId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Import Modal (assuming it's available now, if not I will just use the standard UI for now but the prompt implies I should use it)
    // Since I cannot import it in the same tool call, I will assume it exists or use Inline if needed, 
    // BUT I am creating it in parallel. To be safe, I will add the import at the top in a separate chunk 
    // OR I will just add the Logic here and the Import in a multi-replace.
    // Actually, I'll do a multi-replace to handle imports and logic together.

    const confirmApprove = async () => {
        if (!approveId) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/certificates/${approveId}/approve`, {
                method: "POST"
            });

            if (res.ok) {
                fetchCertificates();
                setApproveId(null);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to approve certificate");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setActionLoading(false);
        }
    };

    const confirmReject = async () => {
        if (!rejectId) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/certificates/${rejectId}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectReason })
            });

            if (res.ok) {
                fetchCertificates();
                setRejectId(null);
                setRejectReason("");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to reject certificate");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Certificates Management
                    </h1>
                    <p className="text-gray-400">View and manage issued certificates</p>
                </div>
                <Link href="/dashboard/upload">
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                        <FileText className="w-4 h-4 mr-2" /> Issue New
                    </Button>
                </Link>
            </div>

            <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by title, name or email..."
                                className="pl-9 bg-black/20 border-gray-800 focus:border-emerald-500/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="border-gray-800 bg-black/20 text-gray-300">
                                        <Filter className="w-4 h-4 mr-2" />
                                        {statusFilter ? statusFilter : "All Status"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-950 border-gray-800">
                                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>Pending</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("APPROVED")}>Approved</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("VERIFIED")}>Verified</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("REJECTED")}>Rejected</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-400">
                            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p>{error}</p>
                        </div>
                    ) : certificates.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <FileText className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p>No certificates found matching your criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border border-gray-800/50 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-black/40">
                                        <TableRow className="hover:bg-transparent border-gray-800">
                                            <TableHead className="text-gray-400">Certificate</TableHead>
                                            <TableHead className="text-gray-400">Recipient</TableHead>
                                            <TableHead className="text-gray-400">Date Issued</TableHead>
                                            <TableHead className="text-gray-400">Status</TableHead>
                                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {certificates.map((cert) => (
                                            <TableRow key={cert.id} className="border-gray-800 hover:bg-white/5">
                                                <TableCell className="font-medium text-gray-200">
                                                    <div className="flex flex-col">
                                                        <span>{cert.title}</span>
                                                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{cert.description}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-300">{cert.owner.fullName}</span>
                                                        <span className="text-xs text-gray-500">{cert.owner.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-400">
                                                    {new Date(cert.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(cert.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-gray-950 border-gray-800 text-gray-300">
                                                            <Link href={`/dashboard/certificates/${cert.id}`}>
                                                                <DropdownMenuItem className="cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-400">
                                                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDownload(cert.id, cert.title)}
                                                                className="cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-400"
                                                            >
                                                                <Download className="w-4 h-4 mr-2" /> Download
                                                            </DropdownMenuItem>
                                                            {cert.status === "PENDING" && (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => setApproveId(cert.id)}
                                                                        className="cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-400"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => setRejectId(cert.id)}
                                                                        className="cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-2" /> Reject
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                                <div>
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-800 bg-black/20 text-gray-300 hover:bg-gray-800"
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-gray-400">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-800 bg-black/20 text-gray-300 hover:bg-gray-800"
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page >= pagination.totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>

            </Card>

            {/* Approve Modal */}
            <Modal
                isOpen={!!approveId}
                onClose={() => setApproveId(null)}
                title="Approve Certificate"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setApproveId(null)} disabled={actionLoading}>Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={confirmApprove} disabled={actionLoading}>
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                            Approve
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Are you sure you want to approve this certificate?
                    </p>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex gap-3 text-sm text-emerald-300">
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <p>This action will generate a permanent verification hash on the blockchain simulation.</p>
                    </div>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal
                isOpen={!!rejectId}
                onClose={() => setRejectId(null)}
                title="Reject Certificate"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setRejectId(null)} disabled={actionLoading}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmReject} disabled={actionLoading}>
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                            Reject
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Please provide a reason for rejecting this certificate. This will be visible to the user.
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Reason</label>
                        <Input
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. Incorrect spelling, Wrong document..."
                            className="bg-black/40 border-gray-700"
                        />
                    </div>
                </div>
            </Modal>
        </div >
    );
}
