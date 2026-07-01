"use client";

import React from "react";
import { CreditCard, AlertTriangle, ShieldCheck, CheckCircle2, ArrowLeft, Zap } from "lucide-react";

export default function PaymentIssuesPage() {
  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a href="/support" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-orange-400 transition mb-8">
          <ArrowLeft size={14} /> Back to Help Center
        </a>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Payment Gateway & Troubleshooting</h1>
            <p className="text-sm text-neutral-400">Resolving double debits, pending bank authorizations, and failed checkouts.</p>
          </div>
        </div>

        {/* Common Solutions Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="flex items-center gap-2 font-bold text-orange-400">
              <Zap size={18} /> Money Debited But No QR Code?
            </div>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              When network fluctuations occur between your bank and our payment processor, the transaction status may temporarily show pending. Our automated clearing house verifies pending orders every 15 minutes.
            </p>
            <div className="mt-4 rounded-xl bg-neutral-950 p-3 text-xs text-neutral-400">
              ⚡ If confirmed, your ticket will appear in 'My Tickets'. If declined by the bank, full auto-refund occurs in 48 hours.
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="flex items-center gap-2 font-bold text-orange-400">
              <AlertTriangle size={18} /> Session Timeout During Checkout?
            </div>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Seat holds expire after 8 minutes to ensure fairness for high-demand shows. If your payment went through right as the seat timer expired, the reservation will auto-reverse immediately.
            </p>
            <div className="mt-4 rounded-xl bg-neutral-950 p-3 text-xs text-neutral-400">
              🔒 No manual intervention required; your funds are protected by automated banking escrow.
            </div>
          </div>
        </div>

        {/* Accepted Payment Methods Banner */}
        <div className="mt-12 rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8 text-center">
          <ShieldCheck size={32} className="mx-auto text-emerald-400" />
          <h2 className="mt-3 text-lg font-bold text-white">100% Secure & PCI-DSS Compliant Payments</h2>
          <p className="mt-1 text-xs text-neutral-400">We support all major payment networks with 256-bit encryption.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-bold text-neutral-300">
            <span className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2">UPI (GPay / PhonePe / Paytm)</span>
            <span className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2">Visa / Mastercard / RuPay</span>
            <span className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2">Net Banking (All Major Banks)</span>
            <span className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2">No-Cost EMI & Pay Later</span>
          </div>
        </div>
      </div>
    </div>
  );
}
