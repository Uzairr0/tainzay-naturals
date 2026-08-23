export const ADMIN_SESSION_COOKIE = 'tainzay_admin_session';

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}
