export type ApiErrorCode =
  | 'rate-limited'
  | 'upstream-unavailable'
  | 'blocked-content'
  | 'bad-request'
  | 'internal'
  | 'budget-exhausted';

function statusOf(error: unknown): number | undefined {
  if (!error || typeof error !== 'object' || !('status' in error)) return undefined;
  return typeof error.status === 'number' ? error.status : undefined;
}

export function mapError(error: unknown): ApiErrorCode {
  if (
    error instanceof DOMException &&
    (error.name === 'AbortError' || error.name === 'TimeoutError')
  )
    return 'upstream-unavailable';
  const status = statusOf(error);
  if (status === 429) return 'rate-limited';
  if (status === 400 || status === 403) return 'blocked-content';
  if (status === 408 || status === 502 || status === 503 || status === 504)
    return 'upstream-unavailable';
  return 'internal';
}

export function publicMessage(code: ApiErrorCode): string {
  switch (code) {
    case 'rate-limited':
      return 'Too many requests. Please try again later.';
    case 'upstream-unavailable':
      return 'The upstream service is temporarily unavailable. Please try again later.';
    case 'blocked-content':
      return 'This request could not be processed.';
    case 'bad-request':
      return 'Invalid request.';
    case 'budget-exhausted':
      return 'This service has reached its daily processing limit. Please try again tomorrow.';
    default:
      return 'Something went wrong. Please try again later.';
  }
}

export function errorStatus(code: ApiErrorCode): number {
  if (code === 'rate-limited') return 429;
  if (code === 'budget-exhausted' || code === 'upstream-unavailable') return 503;
  if (code === 'bad-request' || code === 'blocked-content') return 400;
  return 500;
}
