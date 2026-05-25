import { app } from './dist/index.js';

// ── Allowed origins ───────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  'https://port-labs.appwrite.network',
  'https://portaldilabs.me',
  'https://www.portaldilabs.me',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function resolveOrigin(reqHeaders) {
  const origin = (reqHeaders?.['origin'] ?? reqHeaders?.['Origin'] ?? '').trim();
  if (!origin) return '*'; // no origin header → allow (e.g. curl, server-side)
  if (origin.endsWith('.appwrite.network')) return origin;
  const envOrigin = (process.env.FRONTEND_URL ?? '').trim();
  if (envOrigin && origin === envOrigin) return origin;
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

function buildCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
    ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async ({ req, res, log, error }) => {
  // Resolve CORS origin FIRST — outside try/catch so it's always available
  const allowedOrigin = resolveOrigin(req.headers);
  const corsHeaders = buildCorsHeaders(allowedOrigin);

  // Handle CORS preflight immediately
  if (req.method === 'OPTIONS') {
    return res.send('', 204, corsHeaders);
  }

  try {
    // 1. Forward all incoming headers to the internal Elysia request
    const requestHeaders = new Headers();
    if (req.headers) {
      for (const [key, value] of Object.entries(req.headers)) {
        requestHeaders.set(key, String(value));
      }
    }

    // 2. Reconstruct full URL
    const path = req.path || '/';
    const queryString = req.queryString ? `?${req.queryString}` : '';
    const fullUrl = `http://localhost${path}${queryString}`;

    // 3. Attach body for non-GET/HEAD requests
    let body = null;
    if (!['GET', 'HEAD'].includes(req.method)) {
      if (typeof req.bodyString === 'string' && req.bodyString.length > 0) {
        body = req.bodyString;
      } else if (req.body) {
        body = typeof req.body === 'object' ? JSON.stringify(req.body) : String(req.body);
      }
    }

    // 4. Build a standard Web API Request and delegate to Elysia
    const request = new Request(fullUrl, {
      method: req.method || 'GET',
      headers: requestHeaders,
      body,
    });

    const response = await app.handle(request);

    // 5. Merge CORS headers on top of Elysia's response headers
    //    Our entrypoint CORS headers take precedence over anything Elysia sets.
    const status = response.status || 200;
    const headers = { ...corsHeaders };
    response.headers.forEach((value, key) => {
      if (!key.startsWith('access-control-') && key !== 'vary') {
        headers[key] = value;
      }
    });

    const responseBody = await response.text();
    return res.send(responseBody, status, headers);

  } catch (err) {
    // IMPORTANT: always include CORS headers even on 500 so the browser
    // can actually read the error response instead of reporting a CORS failure.
    error('Appwrite Function Error:', err);
    return res.send(
      JSON.stringify({ success: false, error: String(err?.message ?? err) }),
      500,
      { ...corsHeaders, 'Content-Type': 'application/json' },
    );
  }
};
