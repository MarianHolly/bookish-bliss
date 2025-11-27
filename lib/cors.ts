/**
 * CORS validation and header management
 * Validates origins and sets appropriate CORS headers
 */

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
  'http://localhost:3001',
];

export function validateCors(request: Request): boolean {
  const origin = request.headers.get('origin');
  return origin ? ALLOWED_ORIGINS.includes(origin) : true;
}

export function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}
