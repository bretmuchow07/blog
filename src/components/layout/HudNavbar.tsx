import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { ArrowUpRight } from 'lucide-react';

export default function HudNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--canvas-bg)]/90 border-b border-[var(--border-color)] backdrop-blur-md transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Engineering Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded bg-[var(--surface-bg)] border border-[var(--border-color)] text-[var(--accent)] font-mono font-bold text-xs flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--surface-subtle)] transition-all">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-sm text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent)] transition-colors leading-none">
              Bret Muchoni
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider">
              Blog
            </span>
          </div>
        </Link>

        {/* Navigation & Utilities */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium hover:text-[var(--accent)] transition-colors"
          >
            <span className="status-dot w-1.5 h-1.5" />
            <span>Articles</span>
          </Link>

          <a
            href="https://bretmuchoni.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>

          <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
