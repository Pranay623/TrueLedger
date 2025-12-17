"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
    const [hash, setHash] = useState("");
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (hash.trim()) {
            router.push(`/verify/${hash.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-20" />
            <div className="fixed inset-0 noise-overlay pointer-events-none opacity-10" />

            {/* Orb Effects */}
            <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-20 left-1/4 w-80 h-80 bg-teal-900/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <nav className="border-b border-gray-800/60 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
                            <Shield className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-2xl font-mono font-light">
                            True<span className="font-semibold text-emerald-400">Ledger</span>
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/signin">
                            <Button variant="ghost" className="text-gray-400 hover:text-white">Sign In</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="max-w-2xl w-full space-y-8 text-center">

                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-900/20 rounded-full ring-1 ring-emerald-500/30 mb-4">
                            <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tight">
                            Verify a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Certificate</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-lg mx-auto">
                            Enter the unique verification ID or scan the QR code to validate the authenticity of a credential.
                        </p>
                    </div>

                    <Card className="bg-gray-900/40 border-emerald-900/30 backdrop-blur-md shadow-2xl">
                        <CardContent className="p-8">
                            <form onSubmit={handleVerify} className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input
                                        placeholder="Enter Certificate ID (e.g. 550e8400-e29b...)"
                                        className="pl-10 h-14 bg-black/50 border-gray-700 text-lg focus:border-emerald-500 focus:ring-emerald-500/20"
                                        value={hash}
                                        onChange={(e) => setHash(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-lg shadow-lg shadow-emerald-900/20 transition-all"
                                >
                                    Verify Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                        {[
                            { icon: CheckCircle, title: "Instant Validation", desc: "Real-time verification against the blockchain ledger." },
                            { icon: Shield, title: "Tamper Proof", desc: "Cryptographic proof ensures data integrity." },
                            { icon: AlertCircle, title: "Fraud Protection", desc: "Prevent counterfeit credentials instantly." }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
                                <feature.icon className="w-8 h-8 text-emerald-400 mb-4" />
                                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
