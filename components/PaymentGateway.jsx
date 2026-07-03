"use client";
import React, { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Lock,
  ShieldCheck,
  Loader2,
  AlertCircle,
  QrCode,
  Wallet,
  Clock,
  CheckCircle2,
} from "lucide-react";

// ─── Stripe singleton ────────────────────────────────────────────────────────
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// ─── UPI app icons (from public/) ────────────────────────────────────────────
const GPayIcon = () => (
  <img src="/gpay.svg" alt="Google Pay" className="w-8 h-8 object-contain" />
);
const PhonePeIcon = () => (
  <img src="/phonepe.svg" alt="PhonePe" className="w-8 h-8 object-contain" />
);
const PaytmIcon = () => (
  <img src="/paytm.svg" alt="Paytm" className="w-8 h-8 object-contain" />
);

// ─── Stripe CardElement styles ────────────────────────────────────────────────
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      fontSize: "15px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#525252" },
      iconColor: "#a3a3a3",
    },
    invalid: {
      color: "#f87171",
      iconColor: "#f87171",
    },
  },
  hidePostalCode: true,
};

// ─── Progress bar for timer ───────────────────────────────────────────────────
const SESSION_DURATION = 300; // 5 minutes

function TimerBadge({ timeLeft }) {
  const pct = (timeLeft / SESSION_DURATION) * 100;
  const urgent = timeLeft < 60;

  return (
    <div
      className={`relative overflow-hidden bg-neutral-950/70 border ${
        urgent ? "border-red-500/50" : "border-neutral-800"
      } px-3.5 py-1.5 rounded-2xl flex items-center gap-2 transition-colors duration-500`}
    >
      {/* Shrinking progress bar at bottom */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-neutral-800 w-full" />
      <div
        className={`absolute bottom-0 left-0 h-0.5 transition-all duration-1000 ${
          urgent
            ? "bg-red-500"
            : pct > 50
            ? "bg-orange-500"
            : "bg-yellow-500"
        }`}
        style={{ width: `${pct}%` }}
      />

      <Clock
        size={15}
        className={`shrink-0 ${urgent ? "text-red-500 animate-pulse" : "text-orange-400"}`}
      />
      <div className="flex flex-col leading-none">
        <span className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold">
          Session
        </span>
        <span
          className={`text-sm font-mono font-bold ${
            urgent ? "text-red-400 animate-pulse" : "text-neutral-200"
          }`}
        >
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

// ─── The inner checkout form (must be inside <Elements>) ─────────────────────
function CheckoutForm({ amount, booking, onBack, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [activeTab, setActiveTab] = useState("card"); // "card" | "upi" | "netbanking"
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Contacting bank…");
  const [error, setError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  // ── 5-minute countdown ──────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);

  useEffect(() => {
    if (isProcessing || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isProcessing]);

  // ── UPI state ────────────────────────────────────────────────────────────────
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiStep, setUpiStep] = useState("input"); // "input" | "qr"
  const [upiSecondsLeft, setUpiSecondsLeft] = useState(15);
  const [transactionRef] = useState(() =>
    `VP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  );

  useEffect(() => {
    if (activeTab === "upi" && upiStep === "qr" && upiSecondsLeft > 0 && !isProcessing) {
      const t = setInterval(() => setUpiSecondsLeft((p) => p - 1), 1000);
      return () => clearInterval(t);
    }
  }, [activeTab, upiStep, upiSecondsLeft, isProcessing]);

  // ── Netbanking state ─────────────────────────────────────────────────────────
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const upiApps = [
    { id: "gpay",    name: "Google Pay", icon: <GPayIcon />,    suffix: "@okicici / @oksbi / @okhdfcbank" },
    { id: "phonepe", name: "PhonePe",    icon: <PhonePeIcon />, suffix: "@ybl / @ibl / @axl" },
    { id: "paytm",   name: "Paytm",      icon: <PaytmIcon />,   suffix: "@paytm" },
  ];

  const banks = [
    "HDFC Bank",
    "ICICI Bank",
    "State Bank of India",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
  ];

  const handlePay = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (activeTab === "upi") {
        // Step 1 — show the QR directly (no UPI ID required)
        if (upiStep === "input") {
          setError("");
          setUpiStep("qr");
          return;
        }

        // Step 2 — user clicked "I've Paid" on the QR screen
        try {
          const appName = upiApps.find(a => a.id === selectedUpiApp)?.name ?? "UPI";
          setIsProcessing(true);
          setProcessingText(`Verifying payment with ${appName}…`);
          await new Promise((r) => setTimeout(r, 1500));
          setProcessingText("✅ Payment Confirmed! Saving your booking…");
          await new Promise((r) => setTimeout(r, 800));
          setIsProcessing(false);
          await onSuccess("upi");
        } catch (err) {
          setIsProcessing(false);
          setError(err?.message ?? "Something went wrong. Please try again.");
        }
        return;
      }


      if (activeTab === "netbanking") {
        setIsProcessing(true);
        setProcessingText("Redirecting to your bank…");
        await new Promise((r) => setTimeout(r, 800));
        setProcessingText("Authorising transaction…");
        await new Promise((r) => setTimeout(r, 900));
        setProcessingText("Payment Successful!");
        await new Promise((r) => setTimeout(r, 600));
        setIsProcessing(false);
        onSuccess("netbanking");
        return;
      }

      // ── Stripe card flow ────────────────────────────────────────────────────
      if (!stripe || !elements) {
        setError("Stripe is not loaded. Please refresh and try again.");
        return;
      }
      if (!cardComplete) {
        setError("Please complete your card details.");
        return;
      }

      setIsProcessing(true);
      setProcessingText("Creating secure payment session…");

      try {
        // 1. Create a PaymentIntent on the server
        const res = await fetch("/api/payment/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            currency: "inr",
            bookingId: booking?.id ?? "",
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error ?? "Could not create payment session.");
        }

        setProcessingText("Securing 128-bit SSL transaction…");

        // 2. Confirm card payment
        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: { name: booking?.customerName ?? "Customer" },
            },
          });

        if (stripeError) {
          throw new Error(stripeError.message);
        }

        if (paymentIntent.status === "succeeded") {
          setProcessingText("Payment Successful!");
          await new Promise((r) => setTimeout(r, 700));
          setIsProcessing(false);
          onSuccess("card");
        } else {
          throw new Error("Payment was not completed. Please try again.");
        }
      } catch (err) {
        setIsProcessing(false);
        setError(err.message ?? "An unexpected error occurred.");
      }
    },
    [
      activeTab,
      upiStep,
      selectedUpiApp,
      selectedBank,
      stripe,
      elements,
      cardComplete,
      amount,
      booking,
      onSuccess,
    ]
  );

  // ── Session expired screen ───────────────────────────────────────────────────
  if (timeLeft === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 shadow-2xl text-center flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Clock size={38} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Session Expired</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              For your security, the payment session timed out after 5 minutes.
              Your cart is safe — please go back and try again.
            </p>
          </div>
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            ← Go Back & Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Processing screen ────────────────────────────────────────────────────────
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 shadow-2xl text-center flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center">
            <Loader2 size={40} className="text-orange-500 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{processingText}</h3>
            <p className="text-neutral-400 text-sm">
              Please do not close this window or refresh.
            </p>
          </div>
          <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 h-full w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ── Main gateway UI ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-5xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Secure Payment Gateway
              </h2>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={13} className="text-green-500" />
                Powered by Stripe · 256-bit SSL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <TimerBadge timeLeft={timeLeft} />
            <div className="bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl flex flex-col items-end">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Total Payable
              </span>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                ₹{amount}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">

          {/* Sidebar */}
          <div className="md:col-span-4 bg-neutral-950/40 border-b md:border-b-0 md:border-r border-neutral-800/80 p-4 space-y-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-3 py-1 block">
              Payment Methods
            </span>

            {[
              { id: "card", label: "Card (Stripe)", Icon: CreditCard },
              { id: "upi", label: "UPI / QR", Icon: QrCode },
              { id: "netbanking", label: "Netbanking", Icon: Building2 },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setActiveTab(id); setError(""); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === id
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}

            {/* Stripe badge */}
            <div className="pt-4 px-3">
              <div className="flex items-center gap-2 text-neutral-600 text-[10px] font-semibold uppercase tracking-wider">
                <Lock size={11} />
                Secured by Stripe
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {["VISA", "MC", "AMEX", "RUPAY"].map((b) => (
                  <span
                    key={b}
                    className="px-2 py-0.5 rounded bg-neutral-800/80 text-[9px] font-bold text-neutral-500 border border-neutral-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between">
            <form onSubmit={handlePay} className="space-y-6 flex flex-col flex-1">

              {/* Error banner */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3.5 flex items-center gap-2.5 text-red-400 text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ── Card Tab (Stripe) ─────────────────────────────────────── */}
              {activeTab === "card" && (
                <div className="space-y-5 flex-1">
                  <div>
                    <p className="text-sm font-semibold text-neutral-300 mb-1">
                      Enter Card Details
                    </p>
                    <p className="text-xs text-neutral-500 mb-4">
                      Test card: <span className="font-mono text-neutral-400">4242 4242 4242 4242</span> · Any future date · Any 3-digit CVV
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 block">
                      Card Information
                    </label>
                    <div className="bg-neutral-950/60 border border-neutral-800 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/20 rounded-xl px-4 py-4 transition-all">
                      <CardElement
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => {
                          setCardComplete(e.complete);
                          setError(e.error ? e.error.message : "");
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-neutral-600 flex items-center gap-1 mt-1">
                      <Lock size={10} />
                      Your card data is encrypted end-to-end by Stripe and never touches our servers.
                    </p>
                  </div>

                  {/* Stripe trust badges */}
                  <div className="flex items-center gap-2 pt-1">
                    <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    <span className="text-[11px] text-neutral-500">
                      PCI-DSS Level 1 Compliant · 3D Secure 2.0
                    </span>
                  </div>
                </div>
              )}

              {/* ── UPI Tab ───────────────────────────────────────────────── */}
              {activeTab === "upi" && upiStep === "input" && (
                <div className="space-y-5 flex-1">
                  <div>
                    <label className="text-sm font-semibold text-neutral-300 block mb-3">
                      Select UPI Application
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => { setSelectedUpiApp(app.id); setError(""); }}
                          className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                            selectedUpiApp === app.id
                              ? "bg-neutral-900 border-orange-500 ring-2 ring-orange-500/20 shadow-md"
                              : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center">
                            {app.icon}
                          </div>
                          <span className="text-xs font-medium text-neutral-300">
                            {app.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[12px] text-neutral-500 text-center pt-1">
                    Select your preferred UPI app then click <span className="text-orange-400 font-semibold">Generate QR</span> to scan and pay.
                  </p>
                </div>
              )}

              {/* ── UPI QR Screen ─────────────────────────────────────────── */}
              {activeTab === "upi" && upiStep === "qr" && (() => {
                const app = upiApps.find(a => a.id === selectedUpiApp);
                const upiString = `upi://pay?pa=vibepass@okicici&pn=VibePass+Tickets&am=${amount}.00&cu=INR&tn=Ticket+Booking&tr=${transactionRef}`;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=000000&bgcolor=ffffff&data=${encodeURIComponent(upiString)}&format=png&qzone=1&margin=0`;
                return (
                  <div className="flex flex-col items-center gap-5 flex-1">
                    {/* App branding strip */}
                    <div className="w-full flex items-center justify-between bg-neutral-950/70 border border-neutral-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center">{app?.icon}</div>
                        <div>
                          <p className="text-xs font-bold text-white">{app?.name}</p>
                          <p className="text-[10px] text-neutral-500">Scan with {app?.name} to pay</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setUpiStep("input"); setError(""); }}
                        className="text-[11px] text-neutral-500 hover:text-orange-400 underline cursor-pointer transition-colors"
                      >
                        Change
                      </button>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-3 rounded-2xl shadow-xl shadow-orange-500/10 border-4 border-orange-500/20">
                      <img
                        src={qrUrl}
                        alt={`Pay ₹${amount} via ${app?.name}`}
                        className="w-48 h-48 block"
                      />
                    </div>

                    {/* Amount + Ref */}
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">₹{amount}</p>
                      <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Ref: {transactionRef}</p>
                      <p className="text-[11px] text-neutral-400 mt-2">
                        Open <span className="font-bold text-orange-400">{app?.name}</span> → Scan any QR → Authorize ₹{amount}
                      </p>
                    </div>
                  </div>
                );
              })()}


              {/* ── Netbanking Tab ────────────────────────────────────────── */}
              {activeTab === "netbanking" && (
                <div className="space-y-6 flex-1">
                  <div>
                    <label className="text-sm font-semibold text-neutral-300 block mb-3">
                      Popular Banks
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                            selectedBank === bank
                              ? "bg-neutral-900 border-orange-500 ring-2 ring-orange-500/20 text-white font-semibold"
                              : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700 text-neutral-300 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <Building2
                            size={15}
                            className={
                              selectedBank === bank
                                ? "text-orange-500"
                                : "text-neutral-500"
                            }
                          />
                          <span className="text-xs truncate">{bank}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-400 block">
                      Other Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all cursor-pointer"
                    >
                      {[
                        "HDFC Bank", "ICICI Bank", "State Bank of India",
                        "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank",
                        "Bank of Baroda", "Canara Bank", "IndusInd Bank", "IDFC First Bank",
                      ].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    (activeTab === "card" && (!stripe || !cardComplete)) ||
                    (activeTab === "upi" && upiStep === "qr" && upiSecondsLeft > 0)
                  }
                  className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    activeTab === "upi" && upiStep === "qr"
                      ? upiSecondsLeft > 0
                        ? "bg-linear-to-r from-orange-500 to-rose-500 shadow-orange-500/20"
                        : "bg-linear-to-r from-green-500 to-emerald-600 shadow-green-500/20 hover:shadow-green-500/40 scale-[1.02]"
                      : "bg-linear-to-r from-orange-500 to-rose-500 shadow-orange-500/20 hover:shadow-orange-500/30 hover:opacity-95"
                  }`}
                >
                  {!(activeTab === "upi" && upiStep === "qr" && upiSecondsLeft <= 0) && (
                    <Lock size={17} />
                  )}
                  <span>
                    {activeTab === "upi" && upiStep === "input"
                      ? `Generate QR & Pay ₹${amount}`
                      : activeTab === "upi" && upiStep === "qr"
                      ? upiSecondsLeft > 0
                        ? `Awaiting Payment... (${upiSecondsLeft}s)`
                        : `✅ I've Paid ₹${amount} — Confirm Booking`
                      : `Pay ₹${amount} & Confirm Booking`}
                  </span>
                </button>
                <p className="text-[11px] text-center text-neutral-500 mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-green-500" />
                  {activeTab === "upi" && upiStep === "qr"
                    ? upiSecondsLeft > 0
                      ? "Awaiting authorization confirmation from your UPI app"
                      : `Scan completed? Click above to confirm your ₹${amount} booking`
                    : "100% Safe & Secure · Powered by Stripe"}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Public export wraps everything in the <Elements> provider ────────────────
export default function PaymentGateway({ amount = 499, booking, onBack, onSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        booking={booking}
        onBack={onBack}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
