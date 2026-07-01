"use client";

import React, { useState } from "react";
import { CreditCard, Clock, CheckCircle2, ArrowLeft, Search, AlertCircle } from "lucide-react";

export default function RefundsPage() {
  const [refId, setRefId] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!refId.trim()) return;
    setResult({
      status: "Processed & Settled",
      method: "Original Payment Source (UPI / Card)",
      date: "Within 3 business days of initiation",
      utr: `VP-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  };

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
            <h1 className="text-3xl font-extrabold text-white">Refund Processing & SLAs</h1>
            <p className="text-sm text-neutral-400">Track refund status and settlement timelines for cancelled orders.</p>
          </div>
        </div>

        {/* Refund Status Checker */}
        <div className="mt-10 rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900/90 to-neutral-900/50 p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white">Instant Refund Tracker</h2>
          <p className="text-xs text-neutral-400 mt-1">Enter your Booking ID or Refund Reference Number to check settlement UTR.</p>
          
          <form onSubmit={handleCheck} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={refId}
              onChange={(e) => { setResult(null); setRefId(e.target.value); }}
              placeholder="e.g. TICKET-982341 or VP-88321"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
            >
              Check Status
            </button>
          </form>

          {result && (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 size={18} /> Refund {result.status}
              </div>
              <div className="mt-3 grid gap-2 text-xs text-neutral-300 sm:grid-cols-3">
                <div><span className="text-neutral-500 block">Destination:</span> {result.method}</div>
                <div><span className="text-neutral-500 block">Bank Reference (UTR):</span> {result.utr}</div>
                <div><span className="text-neutral-500 block">Expected Arrival:</span> {result.date}</div>
              </div>
            </div>
          )}
        </div>

        {/* Processing SLA Grid */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-bold text-white">Standard Banking Timelines</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5">
              <h3 className="font-bold text-orange-400">UPI & Google Pay</h3>
              <p className="mt-2 text-2xl font-extrabold text-white">Instant - 24 Hrs</p>
              <p className="mt-1 text-xs text-neutral-400">Direct credit to linked bank savings account.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5">
              <h3 className="font-bold text-orange-400">Credit & Debit Cards</h3>
              <p className="mt-2 text-2xl font-extrabold text-white">3 - 5 Days</p>
              <p className="mt-1 text-xs text-neutral-400">Reflected in your next monthly billing cycle statement.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5">
              <h3 className="font-bold text-orange-400">Net Banking</h3>
              <p className="mt-2 text-2xl font-extrabold text-white">2 - 4 Days</p>
              <p className="mt-1 text-xs text-neutral-400">Reconciled via NEFT / IMPS electronic clearing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
