"use client";

import React from "react";
import { RefreshCw, AlertCircle, Clock, CheckCircle2, ArrowLeft } from "lucide-react";

export default function CancellationsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a href="/support" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-orange-400 transition mb-8">
          <ArrowLeft size={14} /> Back to Help Center
        </a>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
            <RefreshCw size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Cancellation & Rescheduling Policy</h1>
            <p className="text-sm text-neutral-400">Understand eligibility rules and cut-off windows across event types.</p>
          </div>
        </div>

        {/* Policy Comparison Table */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/80 text-xs uppercase tracking-wider text-neutral-400">
                <th className="p-5 font-bold">Event Category</th>
                <th className="p-5 font-bold">Cut-Off Window</th>
                <th className="p-5 font-bold">Refund Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-sm">
              <tr>
                <td className="p-5 font-bold text-white">Movie Screenings</td>
                <td className="p-5 text-neutral-300">Up to 2 hours before showtime</td>
                <td className="p-5"><span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">100% Wallet / Bank Refund</span></td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Live Concerts & Festivals</td>
                <td className="p-5 text-neutral-300">Up to 72 hours before event</td>
                <td className="p-5"><span className="rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-400">75% Refund (25% Organizer Fee)</span></td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Standup Comedy Gigs</td>
                <td className="p-5 text-neutral-300">Up to 24 hours before show</td>
                <td className="p-5"><span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">Full Refund</span></td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Sports Tournaments</td>
                <td className="p-5 text-neutral-300">Non-cancellable once booked</td>
                <td className="p-5"><span className="rounded-full bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-400">Transferable QR Code Only</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step by Step Guide */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-bold text-white">How to Request a Cancellation</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-400">1</span>
              <h3 className="mt-3 font-bold text-white">Go to My Tickets</h3>
              <p className="mt-1 text-xs text-neutral-400">Navigate to the Tickets page or click Booking Status in the footer.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-400">2</span>
              <h3 className="mt-3 font-bold text-white">Select Your Booking</h3>
              <p className="mt-1 text-xs text-neutral-400">Locate the active QR code pass you wish to cancel and tap 'Manage Order'.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-400">3</span>
              <h3 className="mt-3 font-bold text-white">Confirm Cancellation</h3>
              <p className="mt-1 text-xs text-neutral-400">Review the refund breakdown and click confirm. Funds will settle within 3-5 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
