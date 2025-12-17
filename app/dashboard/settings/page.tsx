"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const newPassword = watch("newPassword");

    const onChangePassword = async (data: any) => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/users/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Password updated successfully. Please log in again." });
                reset();
                setTimeout(() => signOut({ callbackUrl: "/signin" }), 2000);
            } else {
                setMessage({ type: "error", text: result.message || "Failed to update password" });
            }
        } catch (e) {
            setMessage({ type: "error", text: "Network error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-mono text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage security and account preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[300px_1fr]">

                {/* Sidebar Nav (Static for now) */}
                <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start bg-emerald-900/20 text-emerald-400">
                        <Lock className="w-4 h-4 mr-2" /> Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white" disabled>
                        <ShieldAlert className="w-4 h-4 mr-2" /> Notifications (Coming Soon)
                    </Button>
                </div>

                {/* Main Content */}
                <div className="space-y-6">

                    {/* Change Password */}
                    <Card className="bg-black/40 border-emerald-900/20">
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password to keep your account secure.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">

                                {message && (
                                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'success' ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10' : ''}>
                                        <AlertDescription>{message.text}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input
                                        type="password"
                                        {...register("currentPassword", { required: "Current password is required" })}
                                        className="bg-black/20 border-gray-800"
                                    />
                                    {errors.currentPassword && <p className="text-xs text-red-400">{errors.currentPassword.message as string}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input
                                            type="password"
                                            {...register("newPassword", {
                                                required: "New password is required",
                                                minLength: { value: 8, message: "Min 8 characters" }
                                            })}
                                            className="bg-black/20 border-gray-800"
                                        />
                                        {errors.newPassword && <p className="text-xs text-red-400">{errors.newPassword.message as string}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Confirm Password</Label>
                                        <Input
                                            type="password"
                                            {...register("confirmPassword", {
                                                validate: (val) => val === newPassword || "Passwords do not match"
                                            })}
                                            className="bg-black/20 border-gray-800"
                                        />
                                        {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message as string}</p>}
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500">
                                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Update Password
                                    </Button>
                                </div>

                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
