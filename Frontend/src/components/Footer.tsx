import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is required');

const FROM_EMAIL = 'NONEAA <subscriptions@noneaa.com>';
const SUBJECT = 'Thank You For Subscribing';

const EMAIL_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Subscribing</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: #111827;
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }
    .body {
      padding: 40px 32px;
    }
    .body h2 {
      margin-top: 0;
      font-size: 22px;
      font-weight: 700;
      color: #111827;
    }
    .body h3 {
      margin-top: 24px;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    .body p {
      font-size: 16px;
      line-height: 1.6;
      color: #374151;
      margin: 16px 0;
    }
    .footer {
      padding: 24px 32px;
      background: #f9fafb;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .footer strong {
      color: #111827;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Subscribing!</h1>
    </div>
    <div class="body">
      <h2>Welcome to the NONEAA community!</h2>
      <p>
        We're excited to have you with us. Your subscription has been received successfully,
        and you'll now be among the first to receive updates about our platform, new features,
        educational resources, product announcements, and important news.
      </p>
      <p>
        At NONEAA, we're committed to transforming education through innovative technology and
        supporting schools, educators, parents, and learners every step of the way.
      </p>
      <p>
        Thank you for choosing to stay connected with us. We look forward to sharing our journey with you!
      </p>
    </div>
    <div class="footer">
      <strong>The NONEAA Team</strong>
    </div>
  </div>
</body>
</html>
`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  let payload: { email?: string };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const email = (payload.email ?? '').trim();
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'A valid "email" is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: SUBJECT,
        html: EMAIL_HTML,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('Resend error', { status: res.status, data });
      return new Response(
        JSON.stringify({ error: 'Failed to send email', status: res.status, details: data }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(JSON.stringify({ ok: true, email, resend: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
