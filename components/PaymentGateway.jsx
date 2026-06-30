"use client";
import React, { useState } from "react";
import { 
  ArrowLeft, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Wallet
} from "lucide-react";

// Custom SVG Icons for UPI Apps
const GPayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFFFFF"/>
    <path d="M17.5 12.25c0-.43-.035-.85-.1-1.25H12v2.375h3.09c-.13.7-.53 1.295-1.125 1.69v1.4h1.82c1.065-.98 1.68-2.42 1.68-4.215z" fill="#4285F4"/>
    <path d="M12 17.825c1.575 0 2.9-.52 3.865-1.4l-1.82-1.4c-.505.34-1.15.545-2.045.545-1.575 0-2.91-1.065-3.385-2.5H6.715v1.45A5.82 5.82 0 0012 17.825z" fill="#34A853"/>
    <path d="M8.615 13.07a3.493 3.493 0 010-2.22v-1.45H6.715a5.821 5.821 0 000 5.12l1.9-1.45z" fill="#FBBC05"/>
    <path d="M12 8.63c.855 0 1.625.295 2.23.87l1.675-1.675C14.895 6.88 13.57 6.175 12 6.175A5.82 5.82 0 006.715 9.4l1.9 1.45c.475-1.435 1.81-2.5 3.385-2.5z" fill="#EA4335"/>
  </svg>
);

const PhonePeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#5F259F"/>
    <path d="M7.5 7.5h9v3h-9v-3z" fill="#FFFFFF"/>
    <path d="M10.5 10.5h6v6a3 3 0 01-6 0v-6z" fill="#FFFFFF"/>
    <circle cx="13.5" cy="13.5" r="1.5" fill="#5F259F"/>
  </svg>
);

const PaytmIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#002E6E"/>
    <circle cx="9" cy="12" r="3" fill="#00B9F5"/>
    <circle cx="15" cy="12" r="3" fill="#00B9F5"/>
    <path d="M7.5 10h9v4h-9v-4z" fill="#00B9F5"/>
    <path d="M9.5 12h5v1h-5v-1z" fill="#FFFFFF"/>
  </svg>
);

const BhimIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#F97316"/>
    <path d="M6 18l6-12 6 12h-3.5l-2.5-5-2.5 5H6z" fill="#FFFFFF"/>
    <path d="M10.5 13l1.5-3 1.5 3h-3z" fill="#138808"/>
  </svg>
);

export default function PaymentGateway({ amount = 499, booking, onBack, onSuccess }) {
  const [activeTab, setActiveTab] = useState("upi"); // "upi" | "debit" | "credit" | "netbanking"
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Initiating Payment...");
  const [error, setError] = useState("");

  // Form states
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    }
    return value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePay = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (activeTab === "upi") {
      if (!upiId && !selectedUpiApp) {
        setError("Please enter a valid UPI ID or select an app.");
        return;
      }
    } else if (activeTab === "debit" || activeTab === "credit") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardName.trim()) {
        setError("Please enter cardholder name.");
        return;
      }
      if (cardExpiry.length < 5) {
        setError("Please enter valid expiry date (MM/YY).");
        return;
      }
      if (cardCvv.length < 3) {
        setError("Please enter a valid CVV.");
        return;
      }
    }

    setIsProcessing(true);
    setProcessingText("Contacting Bank Server...");

    setTimeout(() => {
      setProcessingText("Securing 128-bit SSL Transaction...");
    }, 600);

    setTimeout(() => {
      setProcessingText("Payment Successful!");
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1600);
  };

  const upiApps = [
    { id: "gpay", name: "Google Pay", icon: <GPayIcon /> },
    { id: "phonepe", name: "PhonePe", icon: <PhonePeIcon /> },
    { id: "paytm", name: "Paytm", icon: <PaytmIcon /> },
    { id: "bhim", name: "BHIM UPI", icon: <BhimIcon /> },
  ];

  const banks = [
    "HDFC Bank",
    "ICICI Bank",
    "State Bank of India",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank"
  ];

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 shadow-2xl text-center flex flex-col items-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-linear-to-tr from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center relative">
            <Loader2 size={40} className="text-orange-500 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">{processingText}</h3>
            <p className="text-neutral-400 text-sm">Please do not close this window or hit refresh.</p>
          </div>
          <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 h-full w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-5xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                <ShieldCheck size={14} className="text-green-500" /> 128-bit SSL Encrypted Transaction
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl flex flex-col items-end">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Total Payable</span>
            <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">₹{amount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
          
          {/* Payment Method Sidebar / Tabs */}
          <div className="md:col-span-4 bg-neutral-950/40 border-b md:border-b-0 md:border-r border-neutral-800/80 p-4 space-y-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-3 py-1 block">Payment Methods</span>
            
            <button
              type="button"
              onClick={() => { setActiveTab("upi"); setError(""); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === "upi"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent"
              }`}
            >
              <QrCode size={18} />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("debit"); setError(""); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === "debit"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent"
              }`}
            >
              <CreditCard size={18} />
              <span>Debit Card</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("credit"); setError(""); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === "credit"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent"
              }`}
            >
              <Wallet size={18} />
              <span>Credit Card</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("netbanking"); setError(""); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === "netbanking"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent"
              }`}
            >
              <Building2 size={18} />
              <span>Netbanking</span>
            </button>
          </div>

          {/* Form Content Area */}
          <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between">
            <form onSubmit={handlePay} className="space-y-6">
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3.5 flex items-center gap-2.5 text-red-400 text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* UPI Tab */}
              {activeTab === "upi" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="text-sm font-semibold text-neutral-300 block mb-3">Select UPI Application</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                            selectedUpiApp === app.id
                              ? "bg-neutral-900 border-orange-500 ring-2 ring-orange-500/20 shadow-md"
                              : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center filter drop-shadow-sm hover:scale-105 transition-transform duration-200">
                            {app.icon}
                          </div>
                          <span className="text-xs font-medium text-neutral-300">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-neutral-800"></div>
                    <span className="flex-shrink mx-4 text-neutral-500 text-xs uppercase font-semibold">Or Enter VPA</span>
                    <div className="flex-grow border-t border-neutral-800"></div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-400 block">Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      placeholder="username@okaxis / 9876543210@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                    />
                    <p className="text-[11px] text-neutral-500">Enter your registered UPI ID to receive a payment request on your phone.</p>
                  </div>
                </div>
              )}

              {/* Debit & Credit Card Tabs */}
              {(activeTab === "debit" || activeTab === "credit") && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-neutral-300">
                      {activeTab === "debit" ? "Enter Debit Card Details" : "Enter Credit Card Details"}
                    </span>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-400 border border-neutral-700">VISA</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-400 border border-neutral-700">MC</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-400 border border-neutral-700">RUPAY</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 block">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4532 •••• •••• 8976"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-orange-500 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                      />
                      <CreditCard size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 block">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="JOHN DOE"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 block">Valid Thru</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 block">CVV</label>
                      <div className="relative">
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-orange-500 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                        />
                        <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking Tab */}
              {activeTab === "netbanking" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="text-sm font-semibold text-neutral-300 block mb-3">Popular Banks</label>
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
                          <Building2 size={16} className={selectedBank === bank ? "text-orange-500" : "text-neutral-500"} />
                          <span className="text-xs truncate">{bank}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-400 block">Other Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all cursor-pointer"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="IndusInd Bank">IndusInd Bank</option>
                      <option value="IDFC First Bank">IDFC First Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:opacity-95 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock size={18} />
                  <span>Pay ₹{amount} & Confirm Booking</span>
                </button>
                <p className="text-[11px] text-center text-neutral-500 mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-green-500" /> Guaranteed 100% Safe & Secure Checkout
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
