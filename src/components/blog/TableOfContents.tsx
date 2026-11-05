'use client';

import React, { useState, useEffect } from 'react';
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
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="my-8 p-4 sm:p-5 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] transition-colors"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-sm transition-colors"
        >
          <AlignLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Contents
          </span>
          <span className="text-[var(--text-muted)] font-normal">
            ({headings.length})
          </span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)] ml-1" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] ml-1" />
          )}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-4 space-y-2 font-mono text-xs border-t border-[var(--border-color)] pt-3.5">
          {headings.map((heading, idx) => {
            const isActive = activeId === heading.id;
            return (
              <li
                key={`${heading.id}-${idx}`}
                className={heading.level === 3 ? 'pl-4' : ''}
              >
                <a
                  href={`#${heading.id}`}
                  className={`inline-block leading-relaxed transition-colors ${
                    isActive
                      ? 'text-[var(--accent)] font-medium'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="opacity-60 mr-1.5">{String(idx + 1).padStart(2, '0')}.</span>
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
