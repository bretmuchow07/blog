import React from 'react';
import Link from 'next/link';

export default function HudFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[var(--text-secondary)] font-semibold">Bret Muchoni</span> — Software developer, writer &amp; builder.
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://bretmuchoni.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Portfolio
          </a>
          <span>•</span>
          <a
            href="https://github.com/bretmuchoni"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href="https://linkedin.com/in/bretmuchoni"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            LinkedIn
          </a>
          <span>•</span>
          <Link href="/rss.xml" className="hover:text-[var(--text-primary)] transition-colors">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
