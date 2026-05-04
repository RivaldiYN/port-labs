import { app } from '../src/index';

// Export handler Elysia agar bisa dijalankan oleh Vercel Edge/Node
export default function handler(request: Request) {
  return app.handle(request);
}
