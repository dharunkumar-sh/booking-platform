"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, ArrowRight, Calendar, MapPin } from "lucide-react";

export default function UserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Load pending booking details to show summary
    fetch("/api/redis?key=pendingBooking")
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setBookingDetails(res.data);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone Number must contain only numbers";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Phone Number must be at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // 1. Store user in Neon Database
        const dbRes = await fetch("/api/user-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const dbData = await dbRes.json();
        
        let finalUserPayload = { ...formData };
        if (dbRes.ok && dbData.userId) {
          finalUserPayload.userId = dbData.userId;
        }

        // 2. Sync to store
        await fetch("/api/redis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "bookingUser", value: finalUserPayload }),
        });
        
        if (bookingDetails) {
          const updatedBooking = { ...bookingDetails, user: finalUserPayload };
          await fetch("/api/redis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "pendingBooking", value: updatedBooking }),
          });
        }
      } catch (e) {
        console.error("Error storing booking details:", e);
      }

      router.push("/confirmation");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6 py-12">
      {/* Event Mini Summary if available */}
      {bookingDetails && (
        <div className="w-full max-w-md bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-3xl p-5 mb-6 text-sm flex flex-col gap-2">
          <h3 className="font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500 text-base">
            You're booking for:
          </h3>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white text-base">{bookingDetails.event.title}</span>
            <span className="text-neutral-400">₹{bookingDetails.total}</span>
          </div>
          <div className="flex gap-4 text-xs text-neutral-400 mt-1">
            <span className="flex items-center gap-1"><Calendar size={12} /> {bookingDetails.event.date || "July 15, 2026"}</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> {bookingDetails.event.venue}</span>
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            <strong>Seats:</strong> {bookingDetails.seats && bookingDetails.seats.length > 0 ? bookingDetails.seats.map(s => s.label || s.id).join(", ") : "General"}
          </div>
        </div>
      )}

      {/* Main Checkout Form Card */}
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-lg border border-neutral-800/80 rounded-3xl p-8 shadow-2xl hover:shadow-orange-500/5 transition-shadow duration-500">
        <h2 className="text-2xl font-bold text-center mb-2 bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
          Contact Details
        </h2>
        <p className="text-neutral-400 text-center text-sm mb-8">
          Enter your details to receive ticket confirmation and updates.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-300 block">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full bg-neutral-950/60 border ${
                  errors.name ? "border-red-500 focus:border-red-500" : "border-neutral-800 focus:border-orange-500"
                } rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all duration-300`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-300 block">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className={`w-full bg-neutral-950/60 border ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-neutral-800 focus:border-orange-500"
                } rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all duration-300`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-300 block">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full bg-neutral-950/60 border ${
                  errors.phone ? "border-red-500 focus:border-red-500" : "border-neutral-800 focus:border-orange-500"
                } rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all duration-300`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-8 py-4 bg-linear-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 group shadow-lg hover:shadow-orange-500/20 cursor-pointer"
          >
            Continue to Confirmation
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
