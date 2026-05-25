import { app } from './dist/index.js';

const ALLOWED_ORIGINS = [
  'https://port-labs.appwrite.network',
  'https://portaldilabs.me',
  'https://www.portaldilabs.me',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getAllowedOrigin(reqHeaders) {
  const origin = reqHeaders?.['origin'] ?? '';
  if (!origin) return null;
  if (origin.endsWith('.appwrite.network')) return origin;
  const envOrigin = process.env.FRONTEND_URL ?? '';
  if (envOrigin && origin === envOrigin) return origin;
  return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

export default async ({ req, res, log, error }) => {
  try {
    const allowedOrigin = getAllowedOrigin(req.headers);

    const corsHeaders = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
    };

    // Handle CORS preflight immediately — no need to hit Elysia
    if (req.method === 'OPTIONS') {
      return res.send('', 204, corsHeaders);
    }

    // 1. Map request headers
    const requestHeaders = new Headers();
    if (req.headers) {
      for (const [key, value] of Object.entries(req.headers)) {
        requestHeaders.set(key, value);
      }
    }

    // 2. Map request URL
    const dummyHost = 'http://localhost';
    const path = req.path || '/';
    const queryString = req.queryString ? `?${req.queryString}` : '';
    const fullUrl = `${dummyHost}${path}${queryString}`;

    // 3. Map request Body (only if method is not GET/HEAD)
    let body = null;
    if (!['GET', 'HEAD'].includes(req.method)) {
      if (typeof req.bodyString === 'string' && req.bodyString.length > 0) {
        body = req.bodyString;
      } else if (req.body) {
        body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      }
    }

    // 4. Create standard Web Request
    const request = new Request(fullUrl, {
      method: req.method || 'GET',
      headers: requestHeaders,
      body: body,
    });

    // 5. Delegate request handling to Elysia
    const response = await app.handle(request);

    // 6. Map response headers — merge Elysia headers + our CORS headers
    const responseStatus = response.status || 200;
    const responseHeaders = { ...corsHeaders };
    response.headers.forEach((value, key) => {
      // CORS headers from our entrypoint take precedence
      if (!key.startsWith('access-control-')) {
        responseHeaders[key] = value;
      }
    });

    // 7. Get response body text
    const responseBody = await response.text();

    // 8. Return response to Appwrite client
    return res.send(responseBody, responseStatus, responseHeaders);
  } catch (err) {
    error('Appwrite Function Error:', err);
    return res.json({ success: false, error: err.message }, 500);
  }
};

