"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

// ---------- MAIN WRAPPER REQUIRED FOR BUILD ----------
export default function ContactPage() {
  return (
    <Suspense fallback={<div />}>
      <ContactPageContent />
    </Suspense>
  );
}
// ------------------------------------------------------

// ---------- ACTUAL PAGE CONTENT BELOW ----------
function ContactPageContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="min-h-screen text-gray-100 relative">

      {/* NAVBAR */}
      <nav className="border-b border-gray-900/60 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Blocks className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-mono">
              <span className="font-light">True</span>
              <span className="font-semibold text-gradient ml-1">Ledger</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">Home</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/signin"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/signup"><Button size="sm" className="bg-emerald-600 text-black">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Background Layers */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-10" />
      <div className="fixed inset-0 noise-overlay pointer-events-none opacity-6" />

      {/* Header */}
      <header className="py-16 px-6 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Box className="w-8 h-8 text-black" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4">
            Contact <span className="text-gradient">TrueLedger</span>
          </h1>

          <p className="text-gray-400 text-lg">
            Have a question or need support? We're here to help.
          </p>
        </div>
      </header>

      {/* Contact Section */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10">

          {/* Left Info */}
          <Card className="glass bg-black/40 border border-emerald-900/20 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-mono">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <Info icon={Mail} label="Email" value="srivastavapranay623@gmail.com" />
              <Info icon={Phone} label="Phone" value="7307220060" />
              <Info icon={MapPin} label="Location" value="Kanpur, Uttar Pradesh, India" />

            </CardContent>
          </Card>

          {/* Right Side Form */}
          <Card className="glass bg-black/40 border border-emerald-900/20 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-mono">
                {isSuccess ? "Message Sent!" : "Send a Message"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <SuccessMessage />
              ) : (
                <ContactForm baseUrl={baseUrl} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 px-6 text-center text-gray-500">
        © {new Date().getFullYear()} TrueLedger — Immutable Trust Infrastructure
      </footer>
    </div>
  );
}

// Reusable info section
function Info({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/20 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="font-mono text-white">{value}</p>
      </div>
    </div>
  );
}

// Success Message
function SuccessMessage() {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center border border-emerald-700/30">
        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-mono font-semibold mt-6">Thank You!</h3>
      <p className="text-gray-400 mt-2 max-w-sm">Your message has been delivered.</p>
      <Link href="/contact">
        <Button className="mt-6 bg-emerald-600 text-black">Send Another</Button>
      </Link>
    </div>
  );
}

// Contact Form
function ContactForm({ baseUrl }: any) {
  return (
    <form
      action="https://formsubmit.co/srivastavapranay623@gmail.com"
      method="POST"
      className="space-y-6"
    >
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={`${baseUrl}/contact?success=true`} />

      <div>
        <label className="text-sm text-gray-400">Your Name</label>
        <Input name="name" required className="mt-1 bg-black/40 border-gray-700 text-white" />
      </div>

      <div>
        <label className="text-sm text-gray-400">Your Email</label>
        <Input name="email" type="email" required className="mt-1 bg-black/40 border-gray-700 text-white" />
      </div>

      <div>
        <label className="text-sm text-gray-400">Your Message</label>
        <Textarea name="message" rows={5} required className="mt-1 bg-black/40 border-gray-700 text-white" />
      </div>

      <Button type="submit" size="lg" className="w-full bg-emerald-600 text-black">
        Send Message <Send className="w-5 h-5 ml-2" />
      </Button>
    </form>
  );
}
