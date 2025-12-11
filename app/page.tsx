"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Scan,
  Brain,
  CheckCircle,
  Upload,
  Database,
  Users,
  Lock,
  Zap,
  ArrowRight,
  Blocks,
  FileCheck,
  Link2,
  Box,
  Network,
} from "lucide-react";

export default function TrueLedgerLandingMerged() {
  return (
    <div className="min-h-screen  text-gray-100 relative">
      {/* Subtle background layers from bright/glass theme */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-10 mix-blend-overlay" />
      <div className="fixed inset-0 noise-overlay pointer-events-none opacity-6" />

      {/* Gradient orbs (muted for dark theme) */}
      <div className="fixed top-8 left-1/6 w-[420px] h-[420px] bg-linear-to-br from-emerald-700/8 via-teal-600/6 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-8 right-1/6 w-[360px] h-[360px] bg-linear-to-br from-primary/6 via-emerald-600/6 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-gray-900/60 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                <Blocks className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-mono tracking-normal">
                <span className="font-light">True</span>
                <span className="font-semibold text-gradient ml-1">Ledger</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "Process" },
                { href: "#technology", label: "Technology" },
                { href: "#verify", label: "Verify" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-black font-medium">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="py-24 px-6 relative">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge variant="glow" className="mb-6 bg-emerald-950/10 text-emerald-300 px-4 py-2">
            <Network className="w-4 h-4 mr-2 inline-block" />
            Blockchain-Verified Credentials
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-mono font-bold mb-6 leading-tight">
            <span className="block text-white">Immutable</span>
            <span className="block text-gradient">Certificate Truth & Ledger</span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Verify, store and authenticate credentials using cryptographic hashing and distributed ledger technology. Tamper-proof records, instant verification, and privacy-preserving sharing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-black font-medium px-6 flex items-center justify-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Certificate
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-900 text-white flex items-center justify-center">
              <Shield className="w-5 h-5 mr-2" />
              Verify Now
            </Button>
          </div>

          {/* Composite Hero Visual: glass card + dark framed demo */}
          <div className="relative max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-6 glow-border border border-emerald-900/20 bg-linear-to-br from-black/60 to-gray-900/40">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Scan className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-mono text-gray-400">SCAN</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-mono text-gray-400">PROCESS</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Link2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-mono text-gray-400">STORE</p>
                </div>
              </div>

              {/* subtle connection line */}
              <div className="hidden md:flex justify-center items-center mt-6 space-x-2">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-mono font-semibold mb-2">Built for <span className="text-gradient">Trust</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Enterprise-grade infrastructure for credential verification — hybrid design mixing glass and dark accents.</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered OCR",
                description: "Machine learning extracts data from any certificate format automatically",
                features: ["OpenCV preprocessing", "Tesseract integration", "Smart parsing"],
              },
              {
                icon: Shield,
                title: "Blockchain Storage",
                description: "Immutable records ensure certificates cannot be tampered with",
                features: ["Smart contracts", "Cryptographic hashing", "Distributed ledger"],
              },
              {
                icon: Zap,
                title: "Instant Verification",
                description: "Verify any credential in seconds with our public verification API",
                features: ["Real-time lookup", "QR code scanning", "Batch verification"],
              },
              {
                icon: Users,
                title: "Institution Portal",
                description: "Complete dashboard for credential issuers and administrators",
                features: ["Bulk processing", "Analytics dashboard", "Role management"],
              },
              {
                icon: Lock,
                title: "Zero-Knowledge Proofs",
                description: "Verify credentials without exposing sensitive data",
                features: ["Privacy preserving", "Selective disclosure", "GDPR compliant"],
              },
              {
                icon: Database,
                title: "Decentralized Storage",
                description: "Credentials stored across distributed networks for resilience",
                features: ["IPFS integration", "Redundant storage", "Global availability"],
              },
            ].map((feature, index) => (
              <Card key={index} className="glass group bg-linear-to-br from-black/40 to-gray-900/30 border border-emerald-900/20 hover:scale-[1.01] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-900/20 border border-emerald-800/30 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-900/30 transition-colors">
                    <feature.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <CardTitle className="text-white font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-mono font-semibold mb-2">Simple <span className="text-gradient">Process</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From upload to verified in four steps — cryptographic and privacy-first.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", icon: Upload, title: "Upload", desc: "Submit certificate image" },
              { step: "02", icon: Scan, title: "Extract", desc: "AI processes data" },
              { step: "03", icon: FileCheck, title: "Confirm", desc: "Review and approve" },
              { step: "04", icon: Blocks, title: "Store", desc: "Record on blockchain" },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-emerald-900/10 border border-emerald-800/30 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 glow-border">
                    <item.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-mono text-emerald-600/60">{item.step}</span>
                </div>
                <h3 className="font-mono font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verify CTA */}
      <section id="verify" className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="glass rounded-2xl p-10 glow-border border border-emerald-900/20 bg-black/60 text-center">
            <h2 className="text-3xl md:text-4xl font-mono font-semibold mb-3">Ready for <span className="text-gradient">Immutable Trust</span>?</h2>
            <p className="text-gray-400 mb-6">Join institutions worldwide securing credentials on the blockchain. Try our public verification API or start a trial.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glow" size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-black font-medium px-6 flex items-center">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
              <Button variant="outline" size="lg" className="border-gray-700 hover:bg-gray-900 text-white">Schedule Demo</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded flex items-center justify-center">
                  <Box className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-mono tracking-wider">
                  True<span className="font-semibold">Ledger</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">Decentralized credential verification infrastructure powered by blockchain technology and machine learning.</p>
            </div>

            <div>
              <h4 className="text-white font-normal mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#technology" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-normal mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2024 TrueLedger. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
