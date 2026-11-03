'use client';

import React, { useState } from 'react';
import { AlignLeft, ChevronDown, ChevronUp } from 'lucide-react';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!headings || headings.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="my-8 p-5 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] transition-colors"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
        >
          <AlignLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Table of Contents
          </span>
          <span className="text-[var(--text-muted)] font-normal">
            ({headings.length} sections)
          </span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)] ml-1" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] ml-1" />
          )}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-4 space-y-2 text-sm font-sans border-t border-[var(--border-color)] pt-3.5">
          {headings.map((heading, idx) => (
            <li
              key={`${heading.id}-${idx}`}
              className={heading.level === 3 ? 'pl-4 text-xs' : 'text-sm'}
            >
              <a
                href={`#${heading.id}`}
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-block leading-relaxed"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
