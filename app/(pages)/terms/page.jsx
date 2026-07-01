"use client";

import React, { useState } from "react";
import { FileText, CheckCircle, AlertTriangle, Scale, Ticket, Ban, ChevronRight } from "lucide-react";

export default function TermsOfServicePage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Terms", icon: Scale },
    { id: "bookings", label: "Ticket Bookings & Pricing", icon: Ticket },
    { id: "conduct", label: "Venue Code of Conduct", icon: CheckCircle },
    { id: "liability", label: "Liability & Disclaimers", icon: AlertTriangle },
    { id: "termination", label: "Account Termination", icon: Ban },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
          <FileText size={14} />
          Legal Agreement
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Terms of <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">Service</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-400">
          Please read these Terms of Service carefully before booking tickets or utilizing AI discovery services on VibePass.
        </p>
        <p className="mt-2 text-xs text-neutral-500">Effective Date: July 1, 2026</p>
      </div>

      {/* Tabs Navigation */}
      <div className="mx-auto mt-12 max-w-5xl overflow-x-auto">
        <div className="flex min-w-max gap-2 border-b border-neutral-800 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Card */}
      <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-10">
        {activeTab === "general" && (
          <div className="space-y-5 text-neutral-300">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">
              By accessing VibePass (mobile web, desktop web, or downloadable applications), you agree to be bound by these Terms of Service and all applicable national and municipal entertainment laws.
            </p>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 text-sm leading-6">
              <h3 className="font-bold text-orange-400">Modification of Terms</h3>
              <p className="mt-1 text-neutral-400">
                We reserve the right to amend these terms periodically to reflect new ticketing features or compliance updates. Continued use of VibePass constitutes acceptance of the modified terms.
              </p>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-5 text-neutral-300">
            <h2 className="text-2xl font-bold text-white">2. Ticket Bookings, Pricing & Fulfillment</h2>
            <p className="text-sm leading-relaxed">
              VibePass acts as an authorized ticketing aggregator and discovery marketplace connecting event organizers, cinema operators, and entertainment seekers.
            </p>
            <ul className="list-disc space-y-3 pl-5 text-sm">
              <li><strong>Pricing & Convenience Fees:</strong> Ticket prices are set by the respective venue or organizer. Bookings may include a nominal service fee and government taxes clearly displayed before payment confirmation.</li>
              <li><strong>Order Confirmation:</strong> A booking is finalized only when a QR code or unique ticket confirmation ID is generated and saved to your device.</li>
              <li><strong>Seat Transfers:</strong> Tickets are intended for personal entertainment use and may not be resold above face value on unauthorized black-market channels.</li>
            </ul>
          </div>
        )}

        {activeTab === "conduct" && (
          <div className="space-y-5 text-neutral-300">
            <h2 className="text-2xl font-bold text-white">3. Venue & Event Code of Conduct</h2>
            <p className="text-sm leading-relaxed">
              Admission to live events, stadiums, and cinema halls is strictly subject to the specific entry rules established by the event organizer.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
                <h4 className="font-bold text-white">Age & ID Verification</h4>
                <p className="mt-1 text-xs text-neutral-400">Valid government-issued photo ID is mandatory for age-restricted events (e.g., 18+ comedy nights or lounge events).</p>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
                <h4 className="font-bold text-white">Prohibited Items</h4>
                <p className="mt-1 text-xs text-neutral-400">Outside food, beverages, professional recording equipment, and hazardous items are strictly forbidden inside partner venues.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "liability" && (
          <div className="space-y-5 text-neutral-300">
            <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              VibePass facilitates ticket booking but does not directly produce or manage third-party live concerts, movies, or travel excursions.
            </p>
            <p className="text-sm leading-relaxed">
              In no event shall VibePass be liable for personal injury, property loss, or event cancellations caused by inclement weather, technical malfunctions at the venue, or force majeure events. Our maximum cumulative liability shall not exceed the exact monetary value of the purchased ticket.
            </p>
          </div>
        )}

        {activeTab === "termination" && (
          <div className="space-y-5 text-neutral-300">
            <h2 className="text-2xl font-bold text-white">5. Suspension & Account Termination</h2>
            <p className="text-sm leading-relaxed">
              We reserve the right to suspend or terminate access to VibePass booking services immediately if we detect automated bot scraping, payment fraud, or abusive conduct toward customer support personnel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
