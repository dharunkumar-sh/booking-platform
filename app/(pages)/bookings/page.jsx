"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, MapPin, QrCode, ArrowRight, Download, CheckCircle2, AlertCircle, Search, X, Printer, User, Mail, Phone } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr, category) {
  if (!timeStr) return "";
  const cat = (category || "").toLowerCase();
  if (cat === "movie" || cat === "cinema" || timeStr.toLowerCase() === "various timings") {
    return "10:45 AM, 1:45 PM, 4:45 PM, 7:45 PM, 10:45 PM";
  }
  return timeStr;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketModal, setSelectedTicketModal] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      let userBooked = [];
      let confirmedBooked = [];
      try {
        userBooked = JSON.parse(sessionStorage.getItem("userBookings") || "[]");
        confirmedBooked = JSON.parse(sessionStorage.getItem("confirmedBookings") || "[]");
      } catch (e) {
        console.error("Failed loading local bookings:", e);
      }

      let dbBookings = [];
      try {
        const storedUser = sessionStorage.getItem("vibepass_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user?.email) {
            const res = await fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (data.success && data.bookings) {
              dbBookings = data.bookings;
            }
          }
        }
      } catch (e) {
        console.error("Failed syncing bookings from database:", e);
      }

      // Normalize all formats
      const normalize = (b) => ({
        id: b.bookingId || b.id,
        bookingId: b.bookingId || b.id,
        eventTitle: b.event?.title || b.title || b.eventTitle,
        eventDate: b.event?.date || b.date || b.eventDate,
        venue: b.event?.venue || b.venue,
        seats: b.seats?.map(s => s.label || s.id) || b.seats,
        totalAmount: b.pricing?.finalTotal || b.totalAmount || b.total || b.price,
        user: b.user,
        pricing: b.pricing,
        event: b.event,
        audiNumber: b.audiNumber,
        category: b.event?.category || b.category || "",
        confirmedAt: b.confirmedAt || b.bookingDate || 0
      });

      const mergedMap = new Map();

      // Load local bookings
      userBooked.forEach(b => {
        const norm = normalize(b);
        if (norm.id) mergedMap.set(norm.id, norm);
      });

      confirmedBooked.forEach(b => {
        const norm = normalize(b);
        if (norm.id) mergedMap.set(norm.id, norm);
      });

      // Load DB bookings (will overwrite local with same ID)
      dbBookings.forEach(b => {
        const norm = normalize(b);
        if (norm.id) mergedMap.set(norm.id, norm);
      });

      const combined = Array.from(mergedMap.values());
      // Sort by confirmedAt descending
      combined.sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt));

      setBookings(combined);
      if (combined.length > 0) {
        setSelectedTicket(combined[0]);
      }
    }

    loadBookings();
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
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-orange-400" /> {formatDate(b.eventDate || b.date) || "Upcoming Session"} • {formatTime(b.event?.time || b.time || "7:00 PM", b.event?.category || b.category)}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-orange-400" /> {b.venue || "Selected Arena"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500 uppercase">Seats</p>
                        <p className="font-extrabold text-orange-400 font-mono">
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
                <div 
                  className="mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-3xl bg-white p-4 shadow-xl cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedTicketModal(selectedTicket)}
                >
                  <QrCode className="h-full w-full text-neutral-950" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">{selectedTicket.eventTitle || selectedTicket.title || "VibePass Entry Ticket"}</h3>
                <p className="mt-1 text-xs text-neutral-400">Booking ID: #{selectedTicket.id || selectedTicket.bookingId || "VP-892103"}</p>
                
                <div className="mt-6 rounded-2xl bg-neutral-900/80 p-4 text-left text-xs space-y-2 border border-neutral-800">
                  <div className="flex justify-between"><span className="text-neutral-500">Holder Status:</span> <span className="font-bold text-emerald-400">Verified</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Total Paid:</span> <span className="font-bold text-white">₹{selectedTicket.totalAmount || selectedTicket.price || "499"}</span></div>
                </div>

                <button 
                  onClick={() => setSelectedTicketModal(selectedTicket)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-xs font-bold text-white transition hover:opacity-95 active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  <Ticket size={14} /> Open Digital Ticket Pass
                </button>
                <button 
                  onClick={() => {
                    setSelectedTicketModal(selectedTicket);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-3 text-xs font-bold text-neutral-300 transition hover:bg-neutral-700 cursor-pointer"
                >
                  <Download size={14} /> Print Digital Pass PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-250">
            {/* Gradient Top Header */}
            <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500" />
            
            {/* Modal Control Row */}
            <div className="flex justify-between items-center p-5 border-b border-neutral-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Ticket className="text-orange-500" size={16} /> Digital Booking Pass
              </span>
              <button
                onClick={() => setSelectedTicketModal(null)}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            {/* Ticket Content Container */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              
              {/* Event Poster details */}
              <div className="text-center">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                  ✓ Booking Confirmed
                </span>
                <h3 className="text-lg font-extrabold text-white leading-tight">
                  {selectedTicketModal.eventTitle || selectedTicketModal.title}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Booking ID: <span className="font-mono text-white font-semibold">{selectedTicketModal.bookingId || selectedTicketModal.id}</span>
                </p>
              </div>

              {/* Main Ticket Card design */}
              <div className="border border-neutral-800 rounded-2xl bg-neutral-950/50 p-4 space-y-3 relative">
                {/* Side cutouts */}
                <div className="absolute top-1/2 -left-3 w-5 h-5 bg-neutral-900 rounded-full border-r border-neutral-800 -translate-y-1/2"></div>
                <div className="absolute top-1/2 -right-3 w-5 h-5 bg-neutral-900 rounded-full border-l border-neutral-800 -translate-y-1/2"></div>

                {/* Details list */}
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block mb-0.5">DATE & TIME</span>
                    <span className="font-semibold text-white">
                      {formatDate(selectedTicketModal.eventDate || selectedTicketModal.date) || "Upcoming Session"} at {formatTime(selectedTicketModal.event?.time || selectedTicketModal.time || "7:00 PM", selectedTicketModal.event?.category || selectedTicketModal.category)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-0.5">VENUE</span>
                    <span className="font-semibold text-white">{selectedTicketModal.venue}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-0.5">SCREEN & AUDI</span>
                    <span className="font-semibold text-white">{selectedTicketModal.audiNumber || "Audi 1"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-0.5">SEATS</span>
                    <span className="font-semibold text-orange-400 font-mono">
                      {selectedTicketModal.seats && selectedTicketModal.seats.length > 0 
                        ? (Array.isArray(selectedTicketModal.seats) ? selectedTicketModal.seats.join(", ") : selectedTicketModal.seats)
                        : "General Admission"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-neutral-850 pt-3 flex flex-col items-center justify-center gap-2">
                  {/* QR Code */}
                  <div className="bg-white p-2 rounded-xl shadow-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                        JSON.stringify({
                          bookingId: selectedTicketModal.bookingId || selectedTicketModal.id,
                          event: selectedTicketModal.eventTitle || selectedTicketModal.title,
                          seats: selectedTicketModal.seats,
                          name: selectedTicketModal.user?.name
                        })
                      )}`} 
                      alt="Pass QR" 
                      className="w-28 h-28"
                    />
                  </div>
                  <span className="text-[9px] text-neutral-500 tracking-wider">SCAN AT GATE ENTRY</span>
                </div>
              </div>

              {/* Side-by-side details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Customer Details Block */}
                <div className="space-y-1.5 bg-neutral-950/20 p-3.5 border border-neutral-800/80 rounded-2xl text-[11px]">
                  <span className="font-bold text-neutral-400 block tracking-wider uppercase text-[9px] mb-1">Holder Information</span>
                  <div className="flex justify-between gap-2"><span className="text-neutral-500">Name</span> <span className="font-semibold text-white truncate max-w-[100px]">{selectedTicketModal.user?.name || "VibePass Customer"}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-neutral-500">Email</span> <span className="font-semibold text-white truncate max-w-[100px]" title={selectedTicketModal.user?.email}>{selectedTicketModal.user?.email || "No email info"}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-neutral-500">Phone</span> <span className="font-semibold text-white">{selectedTicketModal.user?.phone || "No phone info"}</span></div>
                </div>

                {/* Price details */}
                <div className="space-y-1.5 bg-neutral-950/20 p-3.5 border border-neutral-800/80 rounded-2xl text-[11px]">
                  <span className="font-bold text-neutral-400 block tracking-wider uppercase text-[9px] mb-1">Payment Summary</span>
                  <div className="flex justify-between"><span className="text-neutral-500">Ticket Cost</span> <span className="text-white">₹{selectedTicketModal.pricing?.ticketCost || selectedTicketModal.totalAmount || selectedTicketModal.total || "499"}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Fees & GST</span> <span className="text-white">₹{selectedTicketModal.pricing ? (selectedTicketModal.pricing.convenienceFee + selectedTicketModal.pricing.gstAmount) : "0"}</span></div>
                  <div className="border-t border-neutral-800/60 pt-1 flex justify-between font-bold text-xs">
                    <span className="text-neutral-300">Total Paid</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">
                      ₹{selectedTicketModal.pricing?.finalTotal || selectedTicketModal.totalAmount || selectedTicketModal.total || "499"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 p-4 border-t border-neutral-800 bg-neutral-950/40">
              <button 
                onClick={() => {
                  window.print();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Printer size={13} /> Print Pass
              </button>
              <button 
                onClick={() => {
                  setSelectedTicketModal(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl text-xs hover:opacity-95 transition-opacity cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
