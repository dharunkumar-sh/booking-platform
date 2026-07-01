"use client";

import React from "react";
import { ShieldAlert, CheckCircle, XCircle, ArrowLeft, HeartPulse, Phone } from "lucide-react";

export default function SafetyGuidelinesPage() {
  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a href="/support" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-orange-400 transition mb-8">
          <ArrowLeft size={14} /> Back to Help Center
        </a>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Event & Venue Safety Guidelines</h1>
            <p className="text-sm text-neutral-400">Protocols designed to keep our live community safe, secure, and vibrant.</p>
          </div>
        </div>

        {/* Dos and Donts Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/30 bg-neutral-900/40 p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-emerald-400">
              <CheckCircle size={18} /> Permitted & Recommended
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Digital QR Ticket on your mobile device (high screen brightness).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Original Government Photo ID (matching the ticket holder name).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Small personal waist bags or transparent slings under 12 inches.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Ear protection / earplugs for loud electronic or metal concerts.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-rose-500/30 bg-neutral-900/40 p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-rose-400">
              <XCircle size={18} /> Strictly Prohibited Items
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                Professional DSLRs, drones, telephoto lenses, or flash gear.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                Outside alcoholic beverages, illicit substances, or glassware.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                Laser pointers, fireworks, flares, or sharp metal items.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                Large backpacks or suitcases blocking venue fire exits.
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Assistance Card */}
        <div className="mt-12 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
              <HeartPulse size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">On-Site Emergency Response</h3>
              <p className="text-xs text-neutral-400 mt-1">Every partner venue features designated first-aid kiosks and security personnel.</p>
            </div>
          </div>
          <a
            href="tel:112"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
          >
            <Phone size={16} /> Emergency Helpline 112
          </a>
        </div>
      </div>
    </div>
  );
}
