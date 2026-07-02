"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
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
  // Form input states
  const [email, setEmail] = useState("");

  // OTP flow states
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [googleClient, setGoogleClient] = useState(null);

  const inputRefs = useRef([]);

  // Load and initialize Google Identity Services client
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: "237277861490-o58m383op558nge14090njg6gn3h3eip.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              await handleGoogleLogin(tokenResponse.access_token);
            }
          },
        });
        setGoogleClient(client);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLogin = async (accessToken) => {
    setLoginError("");
    setIsVerifying(true);
    try {
      const response = await axios.post("/api/auth/google", { accessToken });
      if (response.data.success) {
        const user = response.data.user;
        sessionStorage.setItem("vibepass_user", JSON.stringify(user));
        
        // Dispatch custom storage event so Header updates immediately
        window.dispatchEvent(new Event("storage"));
        
        setLoginSuccess(true);
        setTimeout(() => {
          const redirect = sessionStorage.getItem("login_redirect") || "/";
          sessionStorage.removeItem("login_redirect");
          router.push(redirect);
        }, 1500);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Google sign-in failed. Please try again.";
      setLoginError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle OTP countdown timer for normal login
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);



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



  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!email) return;

    setIsVerifying(true);
    try {
      const response = await axios.post("/api/auth/send-otp", { email });
      if (response.data.success) {
        setOtpSent(true);
        setTimer(30);
        setOtpValues(["", "", "", "", "", ""]);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to send verification code.";
      setLoginError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer === 0) {
      setLoginError("");
      setIsVerifying(true);
      try {
        const response = await axios.post("/api/auth/send-otp", { email });
        if (response.data.success) {
          setTimer(30);
          setOtpValues(["", "", "", "", "", ""]);
        }
      } catch (error) {
        const msg = error.response?.data?.error || "Failed to resend verification code.";
        setLoginError(msg);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoginError("");
    const otpCode = otpValues.join("").trim();
    if (otpCode.length < 6) {
      setLoginError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifying(true);
    try {
      const payload = { email, otp: otpCode };
      const response = await axios.post("/api/auth/verify-otp", payload);
      
      if (response.data.success) {
        const user = response.data.user;
        sessionStorage.setItem("vibepass_user", JSON.stringify(user));
        
        // Dispatch custom storage event so Header updates immediately
        window.dispatchEvent(new Event("storage"));
        
        setLoginSuccess(true);
        setTimeout(() => {
          const redirect = sessionStorage.getItem("login_redirect") || "/";
          sessionStorage.removeItem("login_redirect");
          router.push(redirect);
        }, 1500);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Verification failed. Please try again.";
      setLoginError(msg);
    } finally {
      setIsVerifying(false);
    }
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
          
          <div className="space-y-6">
            {!otpSent && (
              <div className="space-y-2 text-left mb-6">
                <h2 className="text-3xl font-black tracking-tight text-white">
                  Sign In / Register
                </h2>
                <p className="text-sm text-neutral-400">
                  Enter your email address to continue to your tickets and events.
                </p>
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
                  {loginError && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
                      {loginError}
                    </div>
                  )}

                  {/* CREDENTIALS INPUT: EMAIL FLOW */}
                  {!otpSent && (
                    <div className="space-y-1.5 text-left animate-fade-in">
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
                      <p className="text-[11px] text-neutral-500 pt-1">We will send a 6-digit verification code to confirm your email.</p>
                    </div>
                  )}

                  {/* OTP VERIFICATION VIEW */}
                  {otpSent && (
                    <div className="space-y-6 py-2 animate-fade-in">
                      <div className="text-center space-y-1">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mb-2">
                          <Mail size={22} />
                        </div>
                        <h4 className="text-base font-bold text-white">Enter Verification Code</h4>
                        <p className="text-xs text-neutral-400 font-medium">
                          <span>We sent a verification code to <span className="text-orange-400 font-semibold">{email}</span></span>
                        </p>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-[11px] text-rose-400 hover:underline inline-block pt-1 cursor-pointer bg-transparent border-0 focus:outline-none"
                        >
                          Change Email
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
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-900/20 cursor-pointer"
                  >
                    <span>
                      {isVerifying ? "Processing..." : otpSent ? "Verify & Login" : "Send Verification Code"}
                    </span>
                    {!isVerifying && <ArrowRight size={18} />}
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
                    onClick={() => {
                      if (googleClient) {
                        googleClient.requestAccessToken();
                      } else {
                        setLoginError("Google Sign-In is initializing. Please try again in a moment.");
                      }
                    }}
                    disabled={isVerifying}
                    className="w-full py-4 px-6 rounded-2xl bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 text-sm font-bold text-neutral-300 hover:text-white flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <img src="/google.png" alt="Google" className="w-5 h-5 object-contain" />
                    <span>Google</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
