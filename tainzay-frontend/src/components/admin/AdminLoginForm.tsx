'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { SITE } from '@/lib/site-config';

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      const next = searchParams.get('next') || '/admin';
      router.replace(next);
      router.refresh();
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-logo" aria-hidden="true">
            {SITE.name.charAt(0)}
          </div>
          <div>
            <p className="admin-login-brand-name">{SITE.name}</p>
            <p className="admin-login-brand-tag">Admin access</p>
          </div>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-login-field" htmlFor="admin-password">
            <span className="admin-login-label">Password</span>
            <div className="admin-login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                disabled={isSubmitting}
                placeholder="Enter admin password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </label>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="admin-login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
