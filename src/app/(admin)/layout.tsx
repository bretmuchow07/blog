import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import ThemeToggle from '@/components/layout/ThemeToggle';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--canvas-bg)] text-[var(--text-primary)]">
      {/* Unified Admin Top Bar */}
      <header className="sticky top-0 z-50 bg-[var(--canvas-bg)]/90 border-b border-[var(--border-color)] backdrop-blur-md transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded bg-[var(--surface-bg)] border border-[var(--border-color)] text-[var(--accent)] font-mono font-bold text-xs flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
                B
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-semibold text-sm text-[var(--text-primary)] tracking-tight">
                  Bret Muchoni
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent)] text-[var(--canvas-bg)]">
                  Admin
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-1 font-mono text-xs">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-bg)] transition-colors"
              >
                Articles
              </Link>
              <Link
                href="/admin/new"
                className="px-3 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-bg)] transition-colors"
              >
                + New Draft
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>View Blog</span>
              <span className="text-[10px]">↗</span>
            </Link>

            <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

            <ThemeToggle />

            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="px-2.5 py-1 rounded text-[var(--text-muted)] hover:text-[var(--accent-secondary)] hover:bg-[var(--surface-subtle)] transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
