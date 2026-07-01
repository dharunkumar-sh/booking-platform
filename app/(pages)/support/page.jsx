"use client";

import React, { useState } from "react";
import { Search, HelpCircle, Ticket, CreditCard, RefreshCw, ShieldAlert, MessageSquare, PhoneCall, ChevronDown, ChevronUp, ArrowRight, Phone } from "lucide-react";

const faqs = [
  {
    category: "bookings",
    question: "Where can I find my ticket QR code after booking?",
    answer: "Your ticket QR code and confirmation details are saved immediately to your device's browser storage. You can view and download them anytime by visiting the 'Booking Status' link in the footer or going to your Tickets page.",
  },
  {
    category: "cancellations",
    question: "Can I cancel or reschedule my movie or concert ticket?",
    answer: "Cancellations depend on the organizer's policy. Most movie tickets can be cancelled up to 2 hours before showtime for a refund or credit voucher. Concert and live event tickets may be non-refundable unless the event is postponed or cancelled by the venue.",
  },
  {
    category: "payments",
    question: "My payment was deducted but the ticket status shows pending?",
    answer: "If money was debited from your bank account or UPI without confirmation, our gateway reconciles transactions within 15-30 minutes. If verified, your ticket will generate automatically; otherwise, an automatic full refund is initiated to your source account within 3-5 business days.",
  },
  {
    category: "safety",
    question: "What ID verification is required at the venue gate?",
    answer: "Please carry a government-issued photo ID (Aadhaar, PAN, Passport, or Driving License) matching the booking name, along with the digital QR code on your phone.",
  },
  {
    category: "bookings",
    question: "How does the AI Vibe recommendation engine work?",
    answer: "Our AI evaluates local event trends, venue acoustics, show schedules, and your city preference to suggest tailored experiences without tracking cross-site personal data.",
  },
];

const supportCategories = [
  { id: "bookings", title: "Booking Status & QR", desc: "Access digital tickets, seating charts, and booking confirmations.", icon: Ticket, href: "/bookings" },
  { id: "cancellations", title: "Cancellations Guide", desc: "Understand organizer cancellation cut-off times and procedures.", icon: RefreshCw, href: "/support/cancellations" },
  { id: "refunds", title: "Refund Timelines", desc: "Check processing SLAs for UPI, credit cards, and net banking.", icon: CreditCard, href: "/support/refunds" },
  { id: "payments", title: "Payment Issues", desc: "Resolve failed transactions, double debits, or gateway errors.", icon: CreditCard, href: "/support/payments" },
  { id: "safety", title: "Venue Safety & Rules", desc: "Entry protocols, emergency guidelines, and prohibited items.", icon: ShieldAlert, href: "/support/safety" },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
          <HelpCircle size={14} />
          24/7 Vibe Support
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          How can we <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">help you?</span>
        </h1>
        
        {/* Search Bar */}
        <div className="relative mx-auto mt-8 max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, refund timelines, QR codes..."
            className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/80 py-4 pl-14 pr-6 text-sm text-white shadow-2xl placeholder:text-neutral-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Quick Category Grid */}
      <div className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Browse Help Topics</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supportCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href={cat.href}
                className="group flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 transition hover:border-orange-500/50 hover:bg-neutral-900/80"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 transition group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white group-hover:text-orange-400 transition">{cat.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">{cat.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-orange-400">
                  Explore topic <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mx-auto mt-20 max-w-4xl">
        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-neutral-400">Quick answers to the most common booking inquiries.</p>

        <div className="mt-8 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8 text-center text-neutral-400">
              No articles found matching "{searchQuery}". Try searching for another keyword or check our topics above.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-white sm:p-6"
                  >
                    <span className="pr-4">{faq.question}</span>
                    {isOpen ? <ChevronUp className="shrink-0 text-orange-400" size={20} /> : <ChevronDown className="shrink-0 text-neutral-500" size={20} />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-neutral-800/60 bg-neutral-950/40 px-5 pb-6 pt-4 text-sm leading-relaxed text-neutral-300 sm:px-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Still Need Help CTA */}
      <div className="mx-auto mt-20 max-w-4xl rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/15 via-neutral-900/90 to-rose-500/15 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-white">Still need support with a live ticket?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-300">
          Our AI assistant and human support specialists are available around the clock to resolve venue entry or refund matters.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:support@vibepass.in"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition hover:opacity-90 active:scale-95"
          >
            <MessageSquare size={16} /> Email Priority Support
          </a>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            <Phone size={16} /> Call +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}
