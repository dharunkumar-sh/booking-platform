"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, QrCode, User, Phone, Mail, ArrowLeft, Ticket } from "lucide-react";
import TicketSelection from "./TicketSelection";

export default function TicketsPage() {
  const router = useRouter();
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("confirmedBookings");
    if (stored) {
      setConfirmedBookings(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const handleBookNew = (ticketDetails) => {
    localStorage.setItem("pendingBooking", JSON.stringify(ticketDetails));
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="text-xl">Loading your tickets...</p>
      </div>
    );
  }

  // If the user has no tickets, we can show the TicketSelection component so they can still purchase tickets standalone
  if (confirmedBookings.length === 0) {
    return (
      <div className="pt-20 pb-20 bg-neutral-950 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-center">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
        <TicketSelection onConfirmBooking={handleBookNew} />
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

                  {/* Customer Block */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400">
                    <span className="flex items-center gap-1"><User size={12} /> {booking.user?.name}</span>
                    <span className="flex items-center gap-1"><Mail size={12} /> {booking.user?.email}</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {booking.user?.phone}</span>
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
                    className="w-32 h-32 rounded-xl bg-white p-1.5 border border-neutral-800 shadow-md"
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
    </div>
  );
}
