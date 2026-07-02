"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

const footerLinks = [
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/support" },
      { label: "Cancellations", href: "/support/cancellations" },
      { label: "Refunds", href: "/support/refunds" },
      { label: "Payment Issues", href: "/support/payments" },
      { label: "Safety Guidelines", href: "/support/safety" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];


const Footer = () => {
  const pathname = usePathname();
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

  if (pathname !== "/") {
    return null;
  }

  return (
    <footer className="relative border-t border-neutral-800 bg-neutral-950 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-500/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="lg:col-span-1">
            <a href="/" className="group flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="VibePass Logo"
                width={44}
                height={44}
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div>
                <p className="text-2xl font-extrabold tracking-leading bg-linear-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                  VibePass
                </p>
                <p className="text-xs font-medium text-neutral-400">
                  Book Every Vibe with AI
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800/80 pt-8 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} VibePass Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="/privacy" className="transition hover:text-neutral-300">Privacy Policy</a>
            <a href="/terms" className="transition hover:text-neutral-300">Terms of Service</a>
            <a href="/cookies" className="transition hover:text-neutral-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
