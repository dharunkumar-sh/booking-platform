"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, QrCode, User, Phone, Mail, Ticket, X, Download, Printer } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";

export default function TicketsPage() {
  const router = useRouter();
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketModal, setSelectedTicketModal] = useState(null);

  useEffect(() => {
    async function loadTickets() {
      setIsLoading(true);
      const store = useBookingStore.getState();
      const user = store.user;

      if (!user || !user.email) {
        store.setLoginRedirect(window.location.pathname);
        router.push("/login");
        return;
      }

      let dbBookings = [];
      try {
        const res = await fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.success && data.bookings) {
          dbBookings = data.bookings;
        }
      } catch (e) {
        console.error("Failed syncing bookings from database:", e);
      }

      // Sort by confirmedAt / bookingDate descending (latest first)
      dbBookings.sort((a, b) => {
        const dateA = new Date(a.confirmedAt || a.bookingDate || 0);
        const dateB = new Date(b.confirmedAt || b.bookingDate || 0);
        return dateB - dateA;
      });

      setConfirmedBookings(dbBookings);
      setIsLoading(false);
    }

    loadTickets();
  }, [router]);

  const handleBookNew = async (ticketDetails) => {
    useBookingStore.getState().setPendingBooking(ticketDetails);
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="text-xl">Loading your tickets...</p>
      </div>
    );
  }

  // If the user has no tickets, show a clean empty state card directing them to browse events
  if (confirmedBookings.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6">
        <div className="max-w-md w-full text-center space-y-6 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-800 text-neutral-400">
            <Ticket size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">No Booked Tickets</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            You haven't booked any tickets yet. Explore concerts, movies, comedy shows, and sports events to get your passes!
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl text-sm hover:opacity-95 transition-opacity cursor-pointer text-center inline-flex items-center justify-center gap-2"
          >
            Explore Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent flex items-center gap-2">
              <Ticket className="text-orange-500" /> My Booked Tickets
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Here are your active booking passes. Present the QR code at the entrance.
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
          >
            Book More Tickets
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-8">
          {confirmedBookings.slice().reverse().map((booking, idx) => {
            const qrData = JSON.stringify({
              bookingId: booking.bookingId,
              event: booking.event.title,
              seats: booking.seats?.map(s => s.label || s.id) || [],
              name: booking.user?.name
            });
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

            return (
              <div 
                key={booking.bookingId || idx} 
                className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl hover:border-neutral-700/60 transition-colors"
              >
                
                {/* Main Ticket Area */}
                <div className="flex-1 p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-orange-500 tracking-wider uppercase block mb-1">
                        CONFIRMED PASS
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">{booking.event.title}</h2>
                    </div>
                    <span className="bg-neutral-800 text-neutral-300 text-xs px-3 py-1.5 rounded-full font-mono">
                      {booking.bookingId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm border-t border-b border-neutral-800/80 py-4">
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-500 block">DATE & TIME</span>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Calendar size={14} className="text-orange-500" /> {booking.event.date || "July 15, 2026"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-500 block">LOCATION</span>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <MapPin size={14} className="text-rose-500" /> {booking.event.venue}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-500 block">SEATS & AUDI</span>
                      <span className="font-semibold text-white">
                        {booking.audiNumber || "Audi 1"} • {booking.seats && booking.seats.length > 0 ? booking.seats.map(s => s.label || s.id).join(", ") : "General"}
                      </span>
                    </div>
                  </div>

                  {/* Customer Block & View Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><User size={12} /> {booking.user?.name}</span>
                      <span className="flex items-center gap-1"><Mail size={12} /> {booking.user?.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {booking.user?.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Dashed Separator for Screen Sizes */}
                <div className="hidden md:flex flex-col items-center justify-between py-6">
                  <div className="w-4 h-4 rounded-full bg-neutral-950 -mt-8 border-b border-neutral-800"></div>
                  <div className="h-full border-l border-dashed border-neutral-800"></div>
                  <div className="w-4 h-4 rounded-full bg-neutral-950 -mb-8 border-t border-neutral-800"></div>
                </div>
                
                <div className="block md:hidden border-t border-dashed border-neutral-800 mx-6"></div>

                {/* Stub / QR Area */}
                <div className="w-full md:w-60 bg-neutral-900/60 p-6 sm:p-8 flex flex-col items-center justify-center gap-4 text-center">
                  <img 
                    src={qrUrl} 
                    alt="Ticket QR Code" 
                    className="w-32 h-32 rounded-xl bg-white p-1.5 border border-neutral-800 shadow-md cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => setSelectedTicketModal(booking)}
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Total Paid</span>
                    <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                      ₹{booking.pricing?.finalTotal || booking.total}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
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
            <div className="print-area p-5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              
              {/* Event Poster details */}
              <div className="text-center">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                  ✓ Booking Confirmed
                </span>
                <h3 className="text-lg font-extrabold text-white leading-tight">
                  {selectedTicketModal.event.title}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Booking ID: <span className="font-mono text-white font-semibold">{selectedTicketModal.bookingId}</span>
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
                    <span className="font-semibold text-white">{selectedTicketModal.event.date || "July 15, 2026"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-0.5">VENUE</span>
                    <span className="font-semibold text-white">{selectedTicketModal.event.venue}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-0.5">SCREEN & AUDI</span>
                    <span className="font-semibold text-white">{selectedTicketModal.audiNumber || "Audi 1"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-0.5">SEATS</span>
                    <span className="font-semibold text-orange-400 font-mono">
                      {selectedTicketModal.seats && selectedTicketModal.seats.length > 0 
                        ? selectedTicketModal.seats.map(s => s.label || s.id).join(", ") 
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
                          bookingId: selectedTicketModal.bookingId,
                          event: selectedTicketModal.event.title,
                          seats: selectedTicketModal.seats?.map(s => s.label || s.id) || [],
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
                  <div className="flex justify-between gap-2"><span className="text-neutral-500">Name</span> <span className="font-semibold text-white truncate max-w-[100px]">{selectedTicketModal.user?.name}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-neutral-500">Email</span> <span className="font-semibold text-white truncate max-w-[100px]" title={selectedTicketModal.user?.email}>{selectedTicketModal.user?.email}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-neutral-500">Phone</span> <span className="font-semibold text-white">{selectedTicketModal.user?.phone}</span></div>
                </div>

                {/* Price details */}
                <div className="space-y-1.5 bg-neutral-950/20 p-3.5 border border-neutral-800/80 rounded-2xl text-[11px]">
                  <span className="font-bold text-neutral-400 block tracking-wider uppercase text-[9px] mb-1">Payment Summary</span>
                  <div className="flex justify-between"><span className="text-neutral-500">Ticket Cost</span> <span className="text-white">₹{selectedTicketModal.pricing?.ticketCost || selectedTicketModal.total}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Fees & GST</span> <span className="text-white">₹{selectedTicketModal.pricing ? (selectedTicketModal.pricing.convenienceFee + selectedTicketModal.pricing.gstAmount) : "0"}</span></div>
                  <div className="border-t border-neutral-800/60 pt-1 flex justify-between font-bold text-xs">
                    <span className="text-neutral-300">Total Paid</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">
                      ₹{selectedTicketModal.pricing?.finalTotal || selectedTicketModal.total}
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
