import { app } from './dist/index.js';

export default async ({ req, res, log, error }) => {
  try {
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
      body = req.bodyString || req.body || null;
    }

    // 4. Create standard Web Request
    const request = new Request(fullUrl, {
      method: req.method || 'GET',
      headers: requestHeaders,
      body: body,
    });

    // 5. Delegate request handling to Elysia
    const response = await app.handle(request);

    // 6. Map response headers and status
    const responseStatus = response.status || 200;
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
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
