"use client";

import React, { useState } from "react";
import {
  MapPin,
  Gift,
  Users,
  Mail,
  Phone,
  Smartphone,
  Globe,
  Share2,
  Radio,
  X,
  Sparkles,
} from "lucide-react";

const footerLinks = [
  {
    title: "Discover",
    links: [
      { label: "Movies", href: "/movies" },
      { label: "Live Events", href: "/events" },
      { label: "Concerts", href: "/concerts" },
      { label: "Comedy Shows", href: "/comedy" },
      { label: "Sports", href: "/sports" },
      { label: "Travel Experiences", href: "/travel" },
    ],
  },
  {
    title: "OTT & Entertainment",
    links: [
      { label: "Browse OTT Platforms", href: "/ott" },
      { label: "New Releases", href: "/ott/new-releases" },
      { label: "Trending Now", href: "/trending" },
      { label: "Mood Based Picks", href: "/moods" },
      { label: "Watchlists", href: "/watchlist" },
      { label: "Cross-OTT Search", href: "/ott/search" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/support" },
      { label: "Booking Status", href: "/bookings" },
      { label: "Cancellations", href: "/support/cancellations" },
      { label: "Refunds", href: "/support/refunds" },
      { label: "Payment Issues", href: "/support/payments" },
      { label: "Safety Guidelines", href: "/support/safety" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Share2 },
  { label: "Facebook", href: "https://facebook.com", icon: Globe },
  { label: "X", href: "https://x.com", icon: X },
  { label: "YouTube", href: "https://youtube.com", icon: Radio },
];

const appLinks = [
  { label: "iPhone", href: "/download/ios" },
  { label: "Android", href: "/download/android" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("Thanks for subscribing. We will keep you posted.");
    setEmail("");
  };

  return (
    <footer className="relative border-t border-neutral-800 bg-neutral-950 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-500/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="lg:col-span-1">
            <a href="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-orange-500 to-rose-500 font-black text-white shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
                VP
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                  VibePass
                </p>
                <p className="text-xs font-medium text-neutral-400">
                  Book every vibe
                </p>
              </div>
            </a>

            <p className="mt-5 max-w-md text-sm leading-6 text-neutral-400">
              Discover and book movies, concerts, comedy nights, OTT releases,
              travel experiences, and local events across your favorite cities.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-neutral-300 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="mailto:support@vibepass.in"
                className="flex items-center gap-2 transition-colors hover:text-orange-400"
              >
                <Mail size={16} className="text-orange-500" />
                support@vibepass.in
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 transition-colors hover:text-orange-400"
              >
                <Phone size={16} className="text-orange-500" />
                +91 98765 43210
              </a>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin size={16} className="text-orange-500" />
                Chennai, India
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-neutral-800 hover:text-orange-400"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {footerLinks.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-neutral-100">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-orange-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500/70" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-2xl backdrop-blur sm:p-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  Plan smarter with VibePass
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Get early access to offers, new releases, and city-specific
                  experiences.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage("");
              }}
              placeholder="Enter your email"
              className="min-h-11 flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-500/70"
            />
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-linear-to-r from-orange-500 to-rose-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-90 active:scale-95"
            >
              Subscribe
            </button>
            {message && (
              <p className="text-sm text-orange-300 sm:flex-[0_0_100%]">
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="mt-10 grid gap-6 border-t border-neutral-800 pt-6 text-sm text-neutral-400 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="transition hover:text-white">
              Terms of Service
            </a>
            <a href="/cookies" className="transition hover:text-white">
              Cookie Policy
            </a>
          </div>

          <p className="text-center">
            © {new Date().getFullYear()} VibePass. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-end gap-x-4 gap-y-2">
            <a
              href="/download"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Smartphone size={16} />
              App
            </a>
            <a
              href="/gift-cards"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Gift size={16} />
              Gift Cards
            </a>
            <a
              href="/loyalty"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Users size={16} />
              Loyalty
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
