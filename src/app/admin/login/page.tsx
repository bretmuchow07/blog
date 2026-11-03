'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Incorrect password. Please verify the credentials.');
        return;
      }

      router.push('/admin');
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 p-8 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              Admin Access
            </span>
          </div>
          <h1 className="text-2xl font-sans font-bold text-[var(--text-primary)] tracking-tight">
            Sign In
          </h1>
          <p className="text-xs font-sans text-[var(--text-secondary)]">
            Enter the admin passphrase to manage publications.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider"
            >
              Passphrase
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              placeholder="••••••••••••"
              className="w-full bg-[var(--surface-subtle)] border border-[var(--border-color)] rounded-md px-3.5 py-2.5 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-[var(--accent-secondary)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full font-mono text-xs font-medium py-2.5 rounded-md bg-[var(--accent)] text-[var(--canvas-bg)] hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-[var(--border-color)]">
          <Link
            href="/"
            className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Return to blog
          </Link>
        </div>
      </div>
    </div>
  );
}
