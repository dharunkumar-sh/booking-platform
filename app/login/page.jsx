"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Ticket,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState("phone_otp"); // "phone_otp" | "email_password_otp"

  // Form input states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP simulation states
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Forgot password states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "otp" | "reset" | "success"
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotOtpValues, setForgotOtpValues] = useState(["", "", "", "", "", ""]);
  const [forgotTimer, setForgotTimer] = useState(30);
  const [forgotError, setForgotError] = useState("");

  const inputRefs = useRef([]);
  const forgotInputRefs = useRef([]);

  // Handle OTP countdown timer for normal login
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Handle OTP countdown timer for forgot password
  useEffect(() => {
    let interval;
    if (isForgotMode && forgotStep === "otp" && forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isForgotMode, forgotStep, forgotTimer]);

  // Handle OTP digit input for login
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    // Move to next input automatically
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP digit input for forgot password
  const handleForgotOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...forgotOtpValues];
    newOtp[index] = value.substring(value.length - 1);
    setForgotOtpValues(newOtp);

    // Move to next input automatically
    if (value && index < 5 && forgotInputRefs.current[index + 1]) {
      forgotInputRefs.current[index + 1].focus();
    }
  };

  const handleForgotOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !forgotOtpValues[index] && index > 0) {
      forgotInputRefs.current[index - 1].focus();
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (authMethod === "email_password_otp" && (!email || !password)) return;
    if (authMethod === "phone_otp" && !phone) return;
    setOtpSent(true);
    setTimer(30);
    setOtpValues(["", "", "", "", "", ""]);
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(30);
      setOtpValues(["", "", "", "", "", ""]);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }, 1200);
  };

  // Forgot password handlers
  const handleSendForgotOtp = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setForgotStep("otp");
      setForgotTimer(30);
      setForgotOtpValues(["", "", "", "", "", ""]);
      setForgotError("");
    }, 800);
  };

  const handleResendForgotOtp = () => {
    if (forgotTimer === 0) {
      setForgotTimer(30);
      setForgotOtpValues(["", "", "", "", "", ""]);
    }
  };

  const handleVerifyForgotOtp = (e) => {
    e.preventDefault();
    const otpCode = forgotOtpValues.join("");
    if (otpCode.length < 6) {
      setForgotError("Please enter the complete 6-digit verification code.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setForgotStep("reset");
      setForgotError("");
    }, 1000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }
    setForgotError("");
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setForgotStep("success");
      setTimeout(() => {
        setIsForgotMode(false);
        setForgotStep("email");
        setAuthMethod("email_password_otp");
        // Clear forgot states
        setNewPassword("");
        setConfirmPassword("");
        setEmail("");
      }, 2000);
    }, 1200);
  };

  const resetMethodSwitch = (method) => {
    setAuthMethod(method);
    setOtpSent(false);
    setOtpValues(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Back Button */}
      <div className="w-full max-w-5xl mb-6 flex justify-between items-center z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-sm font-semibold text-neutral-300 hover:text-white transition-all backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft size={16} className="text-orange-500" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-neutral-900/60 border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* Left Banner Column (Hidden on smaller screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-linear-to-br from-orange-600/20 via-neutral-900 to-rose-600/20 p-10 flex-col justify-between relative border-r border-neutral-800/80 overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6 z-10">
            <div className="flex items-center gap-3 mb-4 select-none">
              <Image
                src="/logo.svg"
                alt="VibePass Logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                VibePass
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles size={14} />
              <span>Premium Access</span>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight">
              Unlock Your <br />
              <span className="bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Entertainment
              </span>
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Sign in to book the hottest concert tickets, blockbuster movies, live sporting events, and standup comedy shows across India.
            </p>
          </div>

          <div className="space-y-4 my-8 z-10">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-950/40 border border-neutral-800/60">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                <Ticket size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Instant E-Tickets</h4>
                <p className="text-xs text-neutral-400">Skip the lines with digital QR verification.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-950/40 border border-neutral-800/60">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
                <p className="text-xs text-neutral-400">Encrypted payments & verified organizers.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 z-10">
            <span>© {new Date().getFullYear()} VibePass</span>
            <span>Privacy · Terms</span>
          </div>
        </div>

        {/* Right Auth Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {isForgotMode ? (
            /* Forgot Password Flow */
            <div className="space-y-6">
              {forgotStep !== "success" && (
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-sm font-semibold text-neutral-300 hover:text-white transition-all backdrop-blur-md cursor-pointer mb-4"
                >
                  <ArrowLeft size={16} className="text-orange-500" />
                  <span>Back to Login</span>
                </button>
              )}

              {forgotStep === "email" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white">Reset Password</h2>
                    <p className="text-sm text-neutral-400 font-medium">
                      Enter your registered email address to receive a verification code.
                    </p>
                  </div>

                  {forgotError && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                      {forgotError}
                    </div>
                  )}

                  <form onSubmit={handleSendForgotOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 block">Email Address</label>
                      <div className="relative flex items-center">
                        <Mail size={18} className="absolute left-4 text-neutral-500" />
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-orange-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 active:scale-[0.99] font-bold text-sm text-white shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {forgotStep === "otp" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mb-2">
                      <Mail size={22} />
                    </div>
                    <h4 className="text-base font-bold text-white">Enter Verification Code</h4>
                    <p className="text-xs text-neutral-400 font-medium">
                      We sent a 6-digit code to <span className="text-orange-400 font-semibold">{email}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setForgotStep("email")}
                      className="text-[11px] text-rose-400 hover:underline inline-block pt-1 cursor-pointer bg-transparent border-0 focus:outline-none"
                    >
                      Change Email
                    </button>
                  </div>

                  {forgotError && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
                      {forgotError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyForgotOtp} className="space-y-6">
                    {/* 6 Digit OTP Input Boxes */}
                    <div className="flex justify-between gap-2 max-w-xs mx-auto">
                      {forgotOtpValues.map((val, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (forgotInputRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleForgotOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleForgotOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs">
                      {forgotTimer > 0 ? (
                        <span className="text-neutral-500">Resend code in <strong className="text-neutral-300">{forgotTimer}s</strong></span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendForgotOtp}
                          className="text-orange-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 focus:outline-none"
                        >
                          <RefreshCw size={12} />
                          <span>Resend OTP</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 active:scale-[0.99] font-bold text-sm text-white shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify OTP</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {forgotStep === "reset" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white">Choose New Password</h2>
                    <p className="text-sm text-neutral-400 font-medium">
                      Create a strong password that is at least 8 characters long.
                    </p>
                  </div>

                  {forgotError && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                      {forgotError}
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 block">New Password</label>
                      <div className="relative flex items-center">
                        <Lock size={18} className="absolute left-4 text-neutral-500" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="At least 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-orange-500 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 block">Confirm Password</label>
                      <div className="relative flex items-center">
                        <Lock size={18} className="absolute left-4 text-neutral-500" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Re-enter your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-orange-500 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 active:scale-[0.99] font-bold text-sm text-white shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Reset Password</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {forgotStep === "success" && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 animate-bounce">
                    <CheckCircle2 size={44} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Password Updated!</h3>
                  <p className="text-sm text-neutral-400 max-w-sm">
                    Your password has been reset successfully. Redirecting you to sign in page...
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Login Flow (Simplifies to two options) */
            <>
              {/* Method Switcher */}
              {!otpSent && !loginSuccess && (
                <div className="bg-neutral-950/80 p-1.5 rounded-2xl border border-neutral-800/80 flex mb-8">
                  <button
                    type="button"
                    onClick={() => resetMethodSwitch("phone_otp")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border-0 focus:outline-none ${
                      authMethod === "phone_otp"
                        ? "bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Phone size={16} />
                    <span>Mobile OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => resetMethodSwitch("email_password_otp")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border-0 focus:outline-none ${
                      authMethod === "email_password_otp"
                        ? "bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Mail size={16} />
                    <span>Email & Password</span>
                  </button>
                </div>
              )}

              {loginSuccess ? (
                <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 animate-bounce">
                    <CheckCircle2 size={44} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Welcome Back!</h3>
                  <p className="text-sm text-neutral-400 max-w-sm">
                    You have successfully authenticated. Redirecting you to the home dashboard...
                  </p>
                </div>
              ) : (
                <>
                  {/* Form Area */}
                  <form onSubmit={otpSent ? handleSubmit : handleSendOtp} className="space-y-5">
                    
                    {/* CREDENTIALS INPUT: MOBILE OTP FLOW */}
                    {authMethod === "phone_otp" && !otpSent && (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-neutral-400 block">Mobile Number</label>
                        <div className="relative flex items-center">
                          <Phone size={18} className="absolute left-4 text-neutral-500" />
                          <span className="absolute left-11 text-xs font-bold text-neutral-400 border-r border-neutral-800 pr-2">+91</span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                            className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-orange-500 rounded-2xl pl-20 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                          />
                        </div>
                        <p className="text-[11px] text-neutral-500 pt-1">We will send a 6-digit verification code to confirm your number.</p>
                      </div>
                    )}

                    {/* CREDENTIALS INPUT: EMAIL/PASSWORD OTP FLOW */}
                    {authMethod === "email_password_otp" && !otpSent && (
                      <>
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-semibold text-neutral-400 block">Email Address</label>
                          <div className="relative flex items-center">
                            <Mail size={18} className="absolute left-4 text-neutral-500" />
                            <input
                              type="email"
                              required
                              placeholder="name@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-orange-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-neutral-400">Password</label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotMode(true);
                                setForgotStep("email");
                                setForgotError("");
                              }}
                              className="text-xs font-semibold text-orange-400 hover:underline cursor-pointer bg-transparent border-0 focus:outline-none"
                            >
                              Forgot password?
                            </button>
                          </div>
                          <div className="relative flex items-center">
                            <Lock size={18} className="absolute left-4 text-neutral-500" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-orange-500 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0 focus:outline-none"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-orange-500 focus:ring-0 cursor-pointer"
                          />
                          <label htmlFor="remember" className="text-xs text-neutral-400 cursor-pointer select-none">
                            Remember me for 30 days
                          </label>
                        </div>
                      </>
                    )}

                    {/* OTP VERIFICATION VIEW (Common for Email & Phone OTP Sign In) */}
                    {otpSent && (
                      <div className="space-y-6 py-2 animate-fade-in">
                        <div className="text-center space-y-1">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mb-2">
                            {authMethod === "email_password_otp" ? <Mail size={22} /> : <Phone size={22} />}
                          </div>
                          <h4 className="text-base font-bold text-white">Enter Verification Code</h4>
                          <p className="text-xs text-neutral-400 font-medium">
                            {authMethod === "email_password_otp" ? (
                              <span>We sent a 2FA code to <span className="text-orange-400 font-semibold">{email}</span></span>
                            ) : (
                              <span>We sent an SMS OTP code to <span className="text-orange-400 font-semibold">+91 {phone}</span></span>
                            )}
                          </p>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-[11px] text-rose-400 hover:underline inline-block pt-1 cursor-pointer bg-transparent border-0 focus:outline-none"
                          >
                            Change {authMethod === "email_password_otp" ? "Email" : "Phone Number"}
                          </button>
                        </div>

                        {/* 6 Digit OTP Input Boxes */}
                        <div className="flex justify-between gap-2 max-w-xs mx-auto">
                          {otpValues.map((val, idx) => (
                            <input
                              key={idx}
                              ref={(el) => (inputRefs.current[idx] = el)}
                              type="text"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-11 h-12 text-center text-lg font-bold bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs">
                          {timer > 0 ? (
                            <span className="text-neutral-500">Resend code in <strong className="text-neutral-300">{timer}s</strong></span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-orange-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 focus:outline-none"
                            >
                              <RefreshCw size={12} />
                              <span>Resend OTP</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submit / Action Button */}
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 active:scale-[0.99] font-bold text-sm text-white shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>
                            {otpSent
                              ? "Verify & Login"
                              : authMethod === "phone_otp"
                              ? "Send Verification OTP"
                              : "Verify Password & Continue"}
                          </span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Login Separator */}
                  <div className="relative my-6 flex items-center justify-center">
                    <div className="w-full border-t border-neutral-800" />
                    <span className="absolute px-3 bg-neutral-900 text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
                      Or continue with
                    </span>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleSubmit({ preventDefault: () => {} })}
                      className="w-full py-3 px-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                    >
                      <img src="/google.png" alt="Google" className="w-4 h-4 object-contain" />
                      <span>Google</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
