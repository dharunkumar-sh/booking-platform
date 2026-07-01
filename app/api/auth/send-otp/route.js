import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// In-memory OTP store (persists across hot-reloads in dev via global)
// In production, replace this with a distributed store + TTL keys.
// ---------------------------------------------------------------------------
if (!global.otpStore) {
  global.otpStore = new Map();
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// ---------------------------------------------------------------------------
// Nodemailer transporter (Gmail SMTP with App Password)
// ---------------------------------------------------------------------------
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ---------------------------------------------------------------------------
// Styled HTML email template for OTP
// ---------------------------------------------------------------------------
function buildOtpEmailHtml(otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VibePass Verification Code</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#050505;color:#ffffff;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;padding:40px 0;width:100%;">
    <tr>
      <td align="center">
        <!-- Outer Wrapper with subtle border and backdrop look -->
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;border-radius:24px;border:1px solid #1f1f1f;overflow:hidden;max-width:560px;width:100%;box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          <!-- Top Gradient Border Accent -->
          <tr>
            <td height="6" style="background:linear-gradient(90deg,#f97316,#ec4899,#a855f7);"></td>
          </tr>
          
          <!-- Header Area -->
          <tr>
            <td align="center" style="padding:40px 40px 20px;">
              <!-- App Title with Gradient Look -->
              <span style="font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#f97316;">
                VibePass
              </span>
              <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#ec4899;text-transform:uppercase;margin-top:6px;">
                Premium Event Access
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:0 40px 20px;text-align:left;">
              <p style="margin:0 0 10px;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.2px;">
                Your Verification Code
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#9ca3af;line-height:1.6;font-weight:400;">
                Use the security code below to complete your authentication. This code will expire in <strong style="color:#ffffff;">5 minutes</strong>.
              </p>

              <!-- OTP Box Section -->
              <div style="background-color:#141414;border:1px solid #242424;border-radius:16px;padding:32px 20px;text-align:center;margin-bottom:28px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#a1a1aa;text-transform:uppercase;margin-bottom:12px;">
                  Secure OTP Code
                </div>
                <div style="font-size:46px;font-weight:800;letter-spacing:12px;color:#ffffff;font-family:'Courier New',Courier,monospace;padding-left:12px;">
                  ${otp}
                </div>
              </div>

              <!-- Extra Info Banner -->
              <div style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.15);border-radius:12px;padding:16px;margin-bottom:28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="top" style="font-size:13px;color:#f97316;line-height:1.5;font-weight:500;">
                      🛡️ Security Notification
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:12px;color:#a1a1aa;line-height:1.5;padding-top:4px;">
                      If you didn't request this code, your account details may have been entered by mistake. You can safely ignore this email.
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- App Features Footer -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1f1f1f;padding-top:24px;">
                <tr>
                  <td align="center">
                    <span style="font-size:12px;font-weight:600;color:#71717a;">Why VibePass?</span>
                    <div style="margin-top:12px;">
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td style="font-size:11px;color:#a1a1aa;padding:0 12px;border-right:1px solid #27272a;">🎟️ E-Tickets</td>
                          <td style="font-size:11px;color:#a1a1aa;padding:0 12px;border-right:1px solid #27272a;">🔒 Secure Pay</td>
                          <td style="font-size:11px;color:#a1a1aa;padding:0 12px;">⚡ Live Updates</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Legal -->
          <tr>
            <td style="padding:20px 40px;background-color:#0a0a0a;border-top:1px solid #141414;text-align:center;">
              <p style="margin:0;font-size:11px;color:#52525b;line-height:1.5;">
                &copy; ${new Date().getFullYear()} VibePass. All rights reserved.<br />
                This is an automated security transmission. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Send SMS OTP via Fast2SMS
// ---------------------------------------------------------------------------
async function sendSmsOtp(phone, otp) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const otpId = process.env.FAST2SMS_OTP_ID;

  if (!apiKey || apiKey === "your_fast2sms_api_key_here") {
    throw new Error("FAST2SMS_API_KEY is not configured in .env");
  }
  if (!otpId || otpId === "your_otp_template_id_here") {
    throw new Error("FAST2SMS_OTP_ID is not configured in .env");
  }

  const response = await fetch("https://www.fast2sms.com/dev/otp/send", {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      mobile: phone,
      otp_id: otpId,
      otp: otp,
      otp_length: 6,
      otp_expiry: 5,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.return === false) {
    const errMsg =
      (Array.isArray(data.message) ? data.message.join(", ") : data.message) ||
      "Fast2SMS: Failed to send OTP.";
    throw new Error(errMsg);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Send Email OTP via Nodemailer (Gmail SMTP)
// ---------------------------------------------------------------------------
async function sendEmailOtp(email, otp) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `VibePass <${smtpUser}>`;

  if (!smtpUser || smtpUser === "your_gmail@gmail.com") {
    throw new Error("SMTP_USER is not configured in .env");
  }
  if (!smtpPass || smtpPass === "your_16char_app_password") {
    throw new Error("SMTP_PASS is not configured in .env");
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: smtpFrom,
    to: email,
    subject: `${otp} is your VibePass verification code`,
    html: buildOtpEmailHtml(otp),
    text: `Your VibePass verification code is: ${otp}\n\nThis code expires in 5 minutes. Do not share it with anyone.`,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Generate a secure random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    // ── 1. Mobile OTP via Fast2SMS (DISABLED — uncomment in git to re-enable) ─────
    // if (phone) { ... }

    // ── 2. Email OTP via Nodemailer ──────────────────────────────────────────
    if (email) {
      const emailLower = email.toLowerCase().trim();

      await sendEmailOtp(emailLower, otp);

      global.otpStore.set(`otp:email:${emailLower}`, { otp, expiresAt });

      return NextResponse.json({
        success: true,
        message: "Verification code sent to your email.",
      });
    }

    return NextResponse.json(
      { error: "Missing required email parameter." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[AUTH] Error in send-otp:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
