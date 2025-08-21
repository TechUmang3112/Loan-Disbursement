export const OTP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CashSnap OTP</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:linear-gradient(160deg,#000000,#0a0f1c); font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#f8fafc;">

  <!-- Centered Dark Glass Card -->
  <div style="max-width:600px; margin:40px auto; background:rgba(15,23,42,0.92); border-radius:20px; overflow:hidden; box-shadow:0 20px 45px rgba(0,0,0,0.8); border:1px solid rgba(59,130,246,0.25); backdrop-filter:blur(14px);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#111827,#1e293b); padding:35px 20px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.05);">
    <h1 style="margin:0; font-size:28px; font-weight:700;
    color:#e2e8f0; 
    background:rgba(59,130,246,0.1);
    padding:8px 18px;
    border-radius:12px;
    box-shadow:0 0 12px rgba(59,130,246,0.35) inset, 0 0 18px rgba(59,130,246,0.25);">
      CashSnap
    </h1>
    
      <p style="margin:8px 0 0; font-size:18px; font-weight:500; color:#cbd5e1;">Verify Your Account</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 35px; font-size:16px; line-height:1.7;">
      <p style="margin:0 0 12px;">Hello <strong style="color:#f9fafb;">{{username}}</strong>,</p>
      <p style="margin:0 0 25px; color:#cbd5e1;">Your one-time password (OTP) for verification is :</p>

      <!-- Glowing OTP -->
      <div style="background:linear-gradient(145deg,#0f172a,#1e293b); border:2px solid rgba(59,130,246,0.6); border-radius:14px; padding:30px; margin:25px 0; text-align:center; font-size:42px; font-weight:800; letter-spacing:12px; color:#3b82f6; text-shadow:0 0 12px rgba(59,130,246,0.9), 0 0 24px rgba(59,130,246,0.7); box-shadow:inset 0 0 25px rgba(59,130,246,0.15), 0 0 30px rgba(59,130,246,0.25);">
        {{otp}}
      </div>

      <p style="margin:0 0 25px; color:#94a3b8;">This OTP is valid for <strong style="color:#f9fafb;">5 minutes</strong>. For your security, do not share this code with anyone.</p>

      <p style="font-size:14px; color:#64748b; margin:35px 0 0;">
        Need help? Contact us anytime at 
        <a href="mailto:support@cashsnap.com" style="color:#60a5fa; font-weight:600; text-decoration:none;">support@cashsnap.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#0a0f1c; text-align:center; padding:18px; font-size:13px; color:#475569; border-top:1px solid rgba(255,255,255,0.05);">
      © 2025 CashSnap. All rights reserved.
    </div>
  </div>
</body>
</html>`;
