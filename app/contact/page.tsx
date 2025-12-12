"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Box,
  Blocks,
} from "lucide-react";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const [baseUrl, setBaseUrl] = useState("");

  // Detect domain (local or production)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="min-h-screen text-gray-100 relative">

      {/* 🌐 NAVBAR ADDED HERE */}
      <nav className="border-b border-gray-900/60 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Blocks className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-mono tracking-wide">
              <span className="font-light">True</span>
              <span className="font-semibold text-gradient ml-1">Ledger</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">Home</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
            </Link>

            <Link href="/signup">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-black font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      {/* 🌐 NAVBAR END */}

      {/* Background Layers */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-10 mix-blend-overlay" />
      <div className="fixed inset-0 noise-overlay pointer-events-none opacity-6" />

      {/* Gradient Orbs */}
      <div className="fixed top-10 left-1/5 w-[420px] h-[420px] bg-linear-to-br from-emerald-700/8 via-teal-600/6 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/5 w-[360px] h-[360px] bg-linear-to-br from-primary/6 via-emerald-600/6 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="py-16 px-6 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Box className="w-8 h-8 text-black" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4">
            Contact <span className="text-gradient">TrueLedger</span>
          </h1>

          <p className="text-gray-400 text-lg">
            Have a question, partnership idea, or need support?
            We’re here to help — reach out anytime.
          </p>
        </div>
      </header>

      {/* Contact Section */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10">

          {/* Contact Info Panel */}
          <Card className="glass bg-linear-to-br from-black/40 to-gray-900/30 border border-emerald-900/20 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-mono">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-mono text-white">srivastavapranay623@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-mono text-white">7307220060</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-mono text-white">Kanpur, Uttar Pradesh, India</p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Contact Form / Success Message */}
          <Card className="glass bg-linear-to-br from-black/40 to-gray-900/30 border border-emerald-900/20 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-mono">
                {isSuccess ? "Message Sent!" : "Send a Message"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center border border-emerald-700/30 animate-scale-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>

                  <h3 className="text-2xl font-mono font-semibold mt-6">
                    Thank You!
                  </h3>
                  <p className="text-gray-400 mt-2 max-w-sm">
                    Your message has been delivered successfully.  
                    We’ll get back to you soon.
                  </p>

                  <Link href="/contact">
                    <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-black">
                      Send Another Message
                    </Button>
                  </Link>
                </div>
              ) : (
                <form
                  action="https://formsubmit.co/srivastavapranay623@gmail.com"
                  method="POST"
                  className="space-y-6"
                >
                  <input type="text" name="_honey" className="hidden" />
                  <input type="hidden" name="_captcha" value="false" />

                  {/* Redirect */}
                  <input
                    type="hidden"
                    name="_next"
                    value={`${baseUrl}/contact?success=true`}
                  />

                  <div>
                    <label className="text-sm text-gray-400">Your Name</label>
                    <Input type="text" name="name" required className="mt-1 bg-black/40 border border-gray-700 text-white" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Your Email</label>
                    <Input type="email" name="email" required className="mt-1 bg-black/40 border border-gray-700 text-white" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Your Message</label>
                    <Textarea name="message" required rows={5} className="mt-1 bg-black/40 border border-gray-700 text-white" />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-black font-medium flex items-center justify-center">
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 px-6 text-center text-gray-500">
        <p className="text-sm font-mono">
          © {new Date().getFullYear()} TrueLedger — Immutable Trust Infrastructure.
        </p>
      </footer>
    </div>
  );
}
