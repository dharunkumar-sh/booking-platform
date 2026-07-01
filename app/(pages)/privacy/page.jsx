"use client";

import React, { useState } from "react";
import { Shield, Lock, Eye, Database, Cpu, CheckCircle2, ChevronRight, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("collection");

  const sections = [
    { id: "collection", title: "Information We Collect", icon: Database },
    { id: "usage", title: "How We Use Your Data", icon: Cpu },
    { id: "sharing", title: "Data Sharing & Disclosure", icon: Eye },
    { id: "security", title: "Security Measures", icon: Lock },
    { id: "rights", title: "Your Privacy Rights", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
          <Shield size={14} />
          Data Protection & Transparency
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Privacy <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-400">
          At VibePass, we respect your privacy and are committed to protecting the personal information you share with us while exploring entertainment experiences.
        </p>
        <p className="mt-2 text-xs text-neutral-500">Last Updated: July 1, 2026</p>
      </div>

      {/* Quick Takeaways Banner */}
      <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-900/30 p-6 shadow-2xl backdrop-blur sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400">Key Takeaways</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4">
            <CheckCircle2 size={20} className="text-orange-500" />
            <h3 className="mt-2 font-bold text-white">No Hidden Tracking</h3>
            <p className="mt-1 text-xs text-neutral-400">We only collect data necessary to provide personalized event recommendations and booking services.</p>
          </div>
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4">
            <Lock size={20} className="text-orange-500" />
            <h3 className="mt-2 font-bold text-white">Encrypted & Secure</h3>
            <p className="mt-1 text-xs text-neutral-400">All payment transactions and personal identifiers are safeguarded using industry-standard AES-256 encryption.</p>
          </div>
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4">
            <Cpu size={20} className="text-orange-500" />
            <h3 className="mt-2 font-bold text-white">AI Control</h3>
            <p className="mt-1 text-xs text-neutral-400">You can clear your local AI recommendation history or location preferences at any time in settings.</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[260px_1fr]">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Topics</p>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{sec.title}</span>
                </div>
                <ChevronRight size={14} className={`transition-transform ${isActive ? "translate-x-1" : ""}`} />
              </button>
            );
          })}
        </div>

        {/* Section Detail Card */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
          {activeSection === "collection" && (
            <div className="space-y-4 text-neutral-300">
              <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
              <p className="text-sm leading-relaxed">
                When you use VibePass, we collect information that helps us curate the best live events, movies, and OTT experiences tailored to your city and vibe preferences.
              </p>
              <h3 className="mt-4 text-base font-semibold text-white">A. Information You Provide</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li><strong>Account Details:</strong> Name, email address, phone number, and password when you register.</li>
                <li><strong>Booking Information:</strong> Seat selections, ticket preferences, and billing addresses during checkout.</li>
                <li><strong>Customer Support:</strong> Messages or attachments submitted when contacting our help desk.</li>
              </ul>
              <h3 className="mt-4 text-base font-semibold text-white">B. Automatically Collected Information</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li><strong>Device & Geolocation:</strong> City or approximate location coordinates (stored locally via your browser preference) to display nearby events.</li>
                <li><strong>Usage Data:</strong> Pages visited, search queries, filter selections, and interactions with AI recommendations.</li>
              </ul>
            </div>
          )}

          {activeSection === "usage" && (
            <div className="space-y-4 text-neutral-300">
              <h2 className="text-2xl font-bold text-white">2. How We Use Your Data</h2>
              <p className="text-sm leading-relaxed">
                We utilize your information strictly to operate, maintain, and continuously enhance the VibePass platform.
              </p>
              <div className="grid gap-3 pt-2">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 text-sm">
                  <strong className="text-orange-400">Ticket Processing & Confirmation:</strong> Generating QR codes, sending booking receipts, and reserving seat assignments.
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 text-sm">
                  <strong className="text-orange-400">AI Vibe Engine:</strong> Matching your selected mood and browsing history to relevant local gigs, movies, or OTT releases.
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 text-sm">
                  <strong className="text-orange-400">Safety & Fraud Prevention:</strong> Verifying transaction authenticity and protecting organizers and venues against unauthorized activity.
                </div>
              </div>
            </div>
          )}

          {activeSection === "sharing" && (
            <div className="space-y-4 text-neutral-300">
              <h2 className="text-2xl font-bold text-white">3. Data Sharing & Disclosure</h2>
              <p className="text-sm leading-relaxed">
                We do <strong className="text-white">not</strong> sell your personal data to third-party data brokers or advertisers. We share data only in these limited circumstances:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li><strong>Event Organizers & Venues:</strong> Guest lists and ticket QR codes required for venue entry and seating verification.</li>
                <li><strong>Payment Processors:</strong> Secure gateways (e.g., Stripe, Razorpay) to process credit card or UPI transactions safely.</li>
                <li><strong>Legal Compliance:</strong> When required by court orders or enforceable regulatory notices to ensure public safety.</li>
              </ul>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-4 text-neutral-300">
              <h2 className="text-2xl font-bold text-white">4. Security Measures</h2>
              <p className="text-sm leading-relaxed">
                Your data security is paramount. We implement defense-in-depth technical and organizational controls:
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 rounded-xl bg-neutral-950/40 p-3.5 text-sm">
                  <Lock size={18} className="mt-0.5 shrink-0 text-orange-400" />
                  <div>
                    <span className="font-bold text-white">TLS 1.3 Transport Security:</span> All data transmitted between your browser and our servers is encrypted in transit.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-neutral-950/40 p-3.5 text-sm">
                  <Shield size={18} className="mt-0.5 shrink-0 text-orange-400" />
                  <div>
                    <span className="font-bold text-white">Client-Side State Storage:</span> Geolocation cache and active cart items are primarily stored inside your browser's local storage for speed and privacy.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "rights" && (
            <div className="space-y-4 text-neutral-300">
              <h2 className="text-2xl font-bold text-white">5. Your Privacy Rights</h2>
              <p className="text-sm leading-relaxed">
                Depending on your jurisdiction, you retain full ownership and control over your personal profile:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li><strong>Right to Access:</strong> Request a complete export of your past bookings and saved preferences.</li>
                <li><strong>Right to Deletion:</strong> Request immediate erasure of your account details from our primary servers.</li>
                <li><strong>Cookie & Storage Control:</strong> Clear your browser's local storage anytime to reset location and personalized preferences.</li>
              </ul>
              <div className="mt-6 rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-rose-500/10 p-5 text-center">
                <p className="text-sm font-semibold text-white">Have privacy questions or wish to exercise your rights?</p>
                <a
                  href="mailto:privacy@vibepass.in"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-orange-600"
                >
                  <Mail size={14} /> Contact Privacy Officer
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
