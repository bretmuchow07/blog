import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 text-center space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <span className="text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
          404 Error
        </span>
        <h1 className="text-3xl font-sans font-bold text-[var(--text-primary)]">
          Page Not Found
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The article or page you are looking for doesn&apos;t exist, was renamed, or has been removed.
        </p>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium bg-[var(--surface-bg)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to all articles</span>
        </Link>
      </div>
    </div>
  );
}
