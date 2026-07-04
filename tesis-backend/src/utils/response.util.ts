export const ok = <T>(message: string, data: T) => ({
  success: true,
  message,
  data,
});

export const fail = (message: string, code = "INTERNAL_ERROR", details?: unknown) => ({
  success: false,
  message,
  error: { code, ...(details ? { details } : {}) },
});
