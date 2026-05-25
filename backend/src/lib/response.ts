/**
 * Shared response helpers — imported by route modules.
 * Keeping these in a separate file breaks the circular dependency:
 *   index.ts → routes → ...routes → index.ts (ok/fail)
 */
export function ok<T>(data: T, message = 'OK', meta?: Record<string, unknown>) {
  return { success: true, data, message, ...(meta ? { meta } : {}) }
}

export function fail(message: string, status = 400) {
  return { success: false, data: null, message, status }
}
