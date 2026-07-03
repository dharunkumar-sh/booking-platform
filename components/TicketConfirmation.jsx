"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/useBookingStore";
import BookingTimer from "./BookingTimer";
import PaymentGateway from "./PaymentGateway";
import { 
  CheckCircle2, 
  QrCode, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Ticket, 
  FileText,
  AlertCircle,
  CreditCard,
  XCircle
} from "lucide-react";

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

export default function TicketConfirmation() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [audiNumber, setAudiNumber] = useState("");
  const [step, setStep] = useState("review"); // "review" | "payment" | "confirmed"
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    try {
      const store = useBookingStore.getState();
      const data = store.pendingBooking;
      if (data) {
        setBooking(data);
          
        // Generate unique Booking ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const rand = Math.floor(1000 + Math.random() * 9000);
        setBookingId(`AG-${dateStr}-${rand}`);
        
        // Assign random Screen/Audi
        setAudiNumber(`Audi ${Math.floor(1 + Math.random() * 5)}`);
      } else {
        // Redirect home if no booking in progress
        router.push("/");
      }
    } catch (e) {
      console.error(e);
      router.push("/");
    }
  }, [router]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="text-xl">Loading booking details...</p>
      </div>
    );
  }

  const { event, seats = [], tickets = [], user, total: baseTotal } = booking;
  const totalTickets = seats.length > 0 ? seats.length : (tickets.reduce((acc, t) => acc + t.quantity, 0) || 1);
  
  // Calculate price breakdown
  // Average base price per ticket
  const averagePrice = tickets.length > 0 
    ? (baseTotal / tickets.reduce((acc, t) => acc + t.quantity, 0)) 
    : (event.priceVal || 499);
  
  const ticketCost = baseTotal || (averagePrice * totalTickets);
  const gstAmount = Math.round(ticketCost * 0.18); // 18% GST
  const convenienceFee = 60 * totalTickets; // ₹60 flat convenience fee per ticket
  const finalTotal = ticketCost + gstAmount + convenienceFee;

  const handleConfirm = async (paymentMethod = "card") => {
    try {
      const seatIds = seats.map((s) => s.id || s.label || s);
      const store = useBookingStore.getState();
      const dbBookingIdFromStorage = store.dbBookingId;
      const postBody = {
        email: user?.email,
        name: user?.name,
        phone: user?.phone,
        eventId: event.id,
        seats: seatIds,
        seatsBooked: totalTickets,
        totalPrice: finalTotal,
        paymentMethod,
        bookingId: dbBookingIdFromStorage ? parseInt(dbBookingIdFromStorage, 10) : undefined,
        bookingStartedAt: booking.bookingStartedAt || store.bookingStartedAt || Date.now().toString()
      };
      
      let dbBookingId = null;
      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postBody),
        });
        const responseData = await response.json();
        if (responseData.success) {
          dbBookingId = responseData.bookingId;
          console.log("Successfully stored booking in database. ID:", dbBookingId);
          store.clearDbBookingId();
        } else {
          console.error("Booking API returned failure:", responseData.error || responseData);
        }
      } catch (err) {
        console.error("Failed saving booking to database:", err);
      }

      const confirmedBooking = {
        ...booking,
        bookingId: dbBookingId ? `DB-${dbBookingId}` : bookingId,
        audiNumber,
        pricing: {
          ticketCost,
          gstAmount,
          convenienceFee,
          finalTotal
        },
        confirmedAt: new Date().toISOString()
      };

      store.addConfirmedBooking(confirmedBooking);
      store.setBookingStartedAt(null);
      store.clearDbBookingId();
      store.clearPendingBooking();
    } catch (e) {
      console.error("Error confirming booking:", e);
    }
    router.push("/tickets");
  };

  const handleCancel = async () => {
    try {
      const store = useBookingStore.getState();
      const dbBookingId = store.dbBookingId;
      if (dbBookingId) {
        try {
          await fetch("/api/bookings", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: dbBookingId })
          });
        } catch (err) {
          console.error("Failed to delete booking in DB on cancel:", err);
        }
        store.clearDbBookingId();
      }
      store.setBookingStartedAt(null);
      store.clearPendingBooking();
    } catch (e) {
      console.error(e);
    }
    router.push("/");
  };

  const qrData = JSON.stringify({
    bookingId,
    event: event.title,
    seats: seats.map(s => s.label || s.id),
    name: user?.name
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6 py-12 w-full">
        <BookingTimer />
        <div className="w-full max-w-5xl mt-6">
          <PaymentGateway
            amount={finalTotal}
            booking={booking}
            onBack={() => setStep("review")}
            onSuccess={handleConfirm}
          />
        </div>
      </div>
    );
  }
  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Detailed Ticket Stub */}
          <div className="lg:col-span-7 bg-neutral-900/60 backdrop-blur-lg border border-neutral-800 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Ticket Cutouts */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-neutral-950 rounded-full border-r border-neutral-800 hidden lg:block"></div>
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-neutral-950 rounded-full border-l border-neutral-800 hidden lg:block"></div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-800/80 pb-4">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">E-Ticket Stub</span>
                <span className="text-xs text-neutral-500 font-mono">ID: {bookingId}</span>
              </div>

              <div>
                <h3 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent mb-2">
                  {event.title}
                </h3>
                 <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-2">
                  <span className="flex items-center gap-1">📅 {formatDate(event.date) || "July 15, 2026"}</span>
                  <span className="flex items-center gap-1">🕒 {formatTime(event.time, event.category) || "7:00 PM"}</span>
                  <span className="flex items-center gap-1">📍 {event.venue}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-neutral-800 my-4"></div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-neutral-500 block mb-1">SCREEN / AUDI</span>
                  <span className="font-semibold text-white text-base">{audiNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block mb-1">SEATS BOOKED</span>
                  <span className="font-semibold text-white text-base truncate block">
                    {seats.length > 0 ? seats.map(s => s.label || s.id).join(", ") : "General Admission"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-neutral-500 block mb-1">TICKET QUANTITY</span>
                  <span className="font-semibold text-white text-base">{totalTickets} {totalTickets === 1 ? "Ticket" : "Tickets"}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block mb-1">TICKET TYPE</span>
                  <span className="font-semibold text-white text-base font-medium">Standard Admission</span>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 pt-4">
                <span className="text-xs text-neutral-500 block mb-2">CUSTOMER DETAILS</span>
                <div className="bg-neutral-950/40 border border-neutral-800/60 rounded-2xl p-4 text-sm space-y-1.5">
                  <div className="flex justify-between text-neutral-300">
                    <span>Name</span>
                    <span className="font-semibold text-white">{user?.name}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Email</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{user?.email}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Phone</span>
                    <span className="font-semibold text-white">{user?.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-500 mt-6 pt-4 border-t border-neutral-800/60 text-center lg:text-left">
              * Please carry a digital copy of this ticket. Gates open 1 hour before showtime.
            </div>
          </div>

          {/* Booking Status & Actions */}
          <div className="lg:col-span-5 bg-neutral-900/60 backdrop-blur-lg border border-neutral-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-between text-center space-y-6">
            <div className="space-y-4 w-full">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20 mb-2">
                <CheckCircle2 size={36} className="text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Booking Confirmed!
              </h2>
              <p className="text-neutral-400 text-sm max-w-sm mx-auto">
                Thank you! Your ticket booking is confirmed. Your unique Booking ID is <strong className="text-white">{bookingId}</strong>.
              </p>
            </div>

            <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 w-full max-w-xs mx-auto">
              <img src={qrUrl} alt="Booking QR Code" className="w-40 h-40 rounded-xl border border-neutral-800 bg-white p-2 hover:scale-105 transition-transform duration-300" />
              <span className="text-[10px] text-neutral-500 font-mono tracking-wider">{bookingId}</span>
            </div>

            <div className="space-y-3 w-full">
              <div className="border-t border-neutral-800/80 pt-4 pb-2">
                <div className="flex justify-between items-center text-sm text-neutral-400">
                  <span>Total Amount Paid</span>
                  <span className="font-extrabold text-lg text-white">₹{finalTotal}</span>
                </div>
              </div>

               <button
                onClick={() => router.push("/")}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:opacity-95 hover:shadow-orange-500/30 transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6 py-12">
      <BookingTimer />
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Booking Card & Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-neutral-900/60 backdrop-blur-lg border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-1">Confirm Booking</span>
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-2">
                <span className="flex items-center gap-1"><Calendar size={14} className="text-rose-500" /> {formatDate(event.date) || "July 15, 2026"}</span>
                <span className="flex items-center gap-1"><Clock size={14} className="text-orange-500" /> {formatTime(event.time, event.category) || "7:00 PM"}</span>
                <span className="flex items-center gap-1"><MapPin size={14} className="text-rose-500" /> {event.venue}</span>
              </div>
            </div>

            {/* Show details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-neutral-950/40 p-4 border border-neutral-800/60 rounded-2xl">
                <span className="text-xs text-neutral-500 block mb-1">AUDI / SCREEN</span>
                <span className="font-semibold text-white">{audiNumber}</span>
              </div>
              <div className="bg-neutral-950/40 p-4 border border-neutral-800/60 rounded-2xl">
                <span className="text-xs text-neutral-500 block mb-1">SELECTED SEATS</span>
                <span className="font-semibold text-white truncate block">
                  {seats.length > 0 ? seats.map(s => s.label || s.id).join(", ") : "General Admission"}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-3">
              <h3 className="font-bold text-neutral-300 flex items-center gap-2"><User size={16} className="text-orange-500" /> Customer Information</h3>
              <div className="bg-neutral-950/40 border border-neutral-800/60 rounded-2xl p-4 space-y-2 text-sm text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Name</span>
                  <span className="font-medium text-white">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Email</span>
                  <span className="font-medium text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Phone</span>
                  <span className="font-medium text-white">{user?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-4 bg-neutral-900 border border-neutral-800 rounded-xl font-bold hover:bg-neutral-800 hover:text-red-400 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <XCircle size={18} className="text-red-500" />
              Cancel Booking
            </button>
          </div>
        </div>

        {/* Pricing Breakdown Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-neutral-900/60 backdrop-blur-lg border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6 sticky top-24">
            <h3 className="font-extrabold text-xl border-b border-neutral-800 pb-4 flex items-center gap-2"><FileText size={20} className="text-rose-500" /> Payment Summary</h3>
            
            <div className="space-y-5 text-base text-neutral-300">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Tickets ({totalTickets} x ₹{averagePrice})</span>
                <span className="font-semibold text-white">₹{ticketCost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">GST / Tax (18%)</span>
                <span className="font-semibold text-white">₹{gstAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Convenience Fee</span>
                <span className="font-semibold text-white">₹{convenienceFee}</span>
              </div>
              
              <div className="border-t border-neutral-800 pt-5 flex justify-between font-extrabold text-white text-lg">
                <span>Total Amount</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500 text-xl font-black">₹{finalTotal}</span>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex gap-3 text-xs text-orange-200">
              <AlertCircle size={18} className="shrink-0 text-orange-500" />
              <p>By confirming, you agree to our Terms of Service. Tickets are non-refundable once booked.</p>
            </div>

            <button
              onClick={() => setStep("payment")}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:opacity-95 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard size={18} />
              Proceed to Payment
            </button>
          </div>
        </div>

      </div>

      {/* Custom Cancel Warning Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-red-500/10 border-2 border-red-500/30 text-red-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Cancel Ticket Booking?</h3>
              <p className="text-sm text-neutral-400">
                Are you sure you want to cancel this booking? Doing so will immediately release your selected seats and abort your reservation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/20"
              >
                Yes, Cancel Booking
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 font-bold rounded-xl transition-all cursor-pointer"
              >
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
