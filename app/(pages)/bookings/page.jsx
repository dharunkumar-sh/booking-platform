"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, MapPin, QrCode, ArrowRight, Download, CheckCircle2, AlertCircle, Search } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("userBookings") || "[]");
      setBookings(stored);
      if (stored.length > 0) {
        setSelectedTicket(stored[0]);
      }
    }
  }, []);

  const filtered = bookings.filter((b) => {
    const title = b.eventTitle || b.title || "Event Ticket";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-8 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-400">
              <Ticket size={14} /> My Digital Wallet
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Booking Status & QR Passes</h1>
            <p className="mt-1 text-sm text-neutral-400">Manage saved reservations, view seat charts, and present QR codes at venue entry gates.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter passes..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-neutral-800 bg-neutral-900/30 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-800 text-neutral-400">
              <Ticket size={32} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">No active passes stored on this device</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400">
              When you book live concerts, movies, or comedy nights on VibePass, your instant QR tickets are automatically stored here for offline entry.
            </p>
            <a
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            >
              Explore Live Vibes <ArrowRight size={16} />
            </a>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Tickets List */}
            <div className="space-y-4">
              {filtered.map((b, index) => {
                const isSelected = selectedTicket && (selectedTicket.id === b.id || selectedTicket.bookingId === b.bookingId || selectedTicket === b);
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedTicket(b)}
                    className={`cursor-pointer rounded-3xl border p-6 transition ${
                      isSelected
                        ? "border-orange-500 bg-neutral-900/90 shadow-xl shadow-orange-500/10"
                        : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">Confirmed Pass</span>
                        <h3 className="mt-3 text-xl font-bold text-white">{b.eventTitle || b.title || "Live Entertainment Pass"}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-orange-400" /> {b.eventDate || b.date || "Upcoming Session"}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-orange-400" /> {b.venue || "Selected Arena"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500 uppercase">Seats</p>
                        <p className="font-extrabold text-orange-400">
                          {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats || "General Admission"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Ticket QR Preview */}
            {selectedTicket && (
              <div className="sticky top-24 rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 text-center shadow-2xl h-fit">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Scan at Entry Gate</span>
                <div className="mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-3xl bg-white p-4 shadow-xl">
                  <QrCode className="h-full w-full text-neutral-950" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">{selectedTicket.eventTitle || selectedTicket.title || "VibePass Entry Ticket"}</h3>
                <p className="mt-1 text-xs text-neutral-400">Booking ID: #{selectedTicket.id || selectedTicket.bookingId || "VP-892103"}</p>
                
                <div className="mt-6 rounded-2xl bg-neutral-900/80 p-4 text-left text-xs space-y-2 border border-neutral-800">
                  <div className="flex justify-between"><span className="text-neutral-500">Holder Status:</span> <span className="font-bold text-emerald-400">Verified</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Total Paid:</span> <span className="font-bold text-white">₹{selectedTicket.totalAmount || selectedTicket.price || "499"}</span></div>
                </div>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-3 text-xs font-bold text-white transition hover:bg-neutral-700">
                  <Download size={14} /> Download Digital Pass PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
