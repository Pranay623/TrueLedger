"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState, useAuthActions } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Zap,
  Award,
  Command,
} from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthState();
  const { signout } = useAuthActions();
  const router = useRouter();

  const handleSignout = async () => {
    await signout();
    router.push("/");
  };

  const getUserInitials = (email: string) =>
    email.split("@")[0].substring(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-emerald-900/20">
      <div className="flex items-center justify-between px-6 py-4">

        {/* LEFT */}
        <div className="flex-1">
          {title ? (
            <>
              <h1 className="text-2xl font-mono font-semibold text-white">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-gray-400 mt-1">{description}</p>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Command className="w-4 h-4" />
              <span className="text-sm">
                Press <kbd className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs">⌘K</kbd> to search
              </span>
            </div>
          )}
        </div>

        {/* SEARCH */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates, students..."
              className="pl-10 pr-8 h-10 bg-black/40 border-gray-800 text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* QUICK ACTIONS */}
          <div className="hidden lg:flex gap-2">
            <Button size="sm" variant="outline" className="border-emerald-800/30 text-emerald-300">
              <Zap className="w-3 h-3 mr-1" />
              Quick Scan
            </Button>
            <Button size="sm" variant="outline" className="border-emerald-800/30 text-emerald-300">
              <Award className="w-3 h-3 mr-1" />
              New Certificate
            </Button>
          </div>

          {/* NOTIFICATIONS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-600 text-white">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 bg-black/90 border border-gray-800 text-gray-200">
              <DropdownMenuLabel className="flex justify-between">
                Notifications
                <Badge className="bg-emerald-900/20 text-emerald-300 text-xs">
                  3 new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {[
                ["New certificate uploaded", "John Doe submitted a certificate", "2 min ago", "bg-emerald-500"],
                ["Verification completed", "Certificate verified", "5 min ago", "bg-green-500"],
                ["Storage warning", "85% storage used", "1 hour ago", "bg-orange-500"],
              ].map(([title, desc, time, color], i) => (
                <div key={i} className="flex gap-3 p-3 hover:bg-gray-900 rounded-lg cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-2 ${color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                    <p className="text-xs text-gray-500 mt-1">{time}</p>
                  </div>
                </div>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-emerald-400 cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-black font-semibold">
                    {user?.email ? getUserInitials(user.email) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 bg-black/90 border border-gray-800 text-gray-200">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuItem><HelpCircle className="mr-2 h-4 w-4" /> Help</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignout} className="text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
