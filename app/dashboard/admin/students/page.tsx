"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Users,
    Search,
    Mail,
    Calendar,
    FileText,
    Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface Student {
    id: string;
    fullName: string;
    email: string;
    username: string;
    createdAt: string;
    avatar: string | null;
    _count: {
        certificates: number;
    };
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchStudents() {
            try {
                const res = await fetch("/api/admin/students");
                if (res.ok) {
                    const data = await res.json();
                    setStudents(data.data);
                }
            } catch (error) {
                console.error("Failed to load students", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <DashboardHeader
                title="Students"
                description="Manage students registered to your institution"
            >
                <div className="flex gap-2">
                    <Button variant="outline" className="border-emerald-900/30 text-emerald-400">
                        <Users className="w-4 h-4 mr-2" />
                        Total: {students.length}
                    </Button>
                </div>
            </DashboardHeader>

            <div className="p-6 space-y-6">
                {/* Search Bar */}
                <Card className="bg-black/40 border-emerald-900/20 backdrop-blur-sm">
                    <div className="p-4 flex items-center gap-4">
                        <Search className="w-5 h-5 text-gray-500" />
                        <Input
                            placeholder="Search by name, email or username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none text-white focus-visible:ring-0 placeholder-gray-500"
                        />
                    </div>
                </Card>

                {/* Students Table */}
                <Card className="bg-black/40 border-emerald-900/20 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Registered Students</CardTitle>
                        <CardDescription>List of all students currently linked to this institution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 border-b border-gray-800">
                                        <div className="flex gap-4">
                                            <Skeleton className="w-10 h-10 rounded-full bg-gray-800" />
                                            <div className="space-y-2">
                                                <Skeleton className="w-32 h-4 bg-gray-800" />
                                                <Skeleton className="w-48 h-3 bg-gray-800" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No students found.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800 hover:bg-transparent">
                                        <TableHead className="text-gray-400">Student</TableHead>
                                        <TableHead className="text-gray-400">Contact</TableHead>
                                        <TableHead className="text-gray-400">Joined</TableHead>
                                        <TableHead className="text-gray-400 text-right">Certificates</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="border-gray-800 hover:bg-emerald-900/5">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500 font-bold border border-emerald-900/50">
                                                        {student.fullName?.[0]?.toUpperCase() || student.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{student.fullName || student.username}</p>
                                                        <p className="text-xs text-gray-500">@{student.username}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-sm">{student.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-sm">{new Date(student.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/10 text-emerald-400 border border-emerald-900/20 text-xs font-medium">
                                                    <FileText className="w-3 h-3" />
                                                    {student._count.certificates}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
