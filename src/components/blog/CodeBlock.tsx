'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Extract language from children if available
  let language = 'CODE';
  if (React.isValidElement(children) && (children.props as any)?.className) {
    const cls = (children.props as any).className as string;
    const match = cls.match(/language-(\w+)/);
    if (match) {
      language = match[1].toUpperCase();
    }
  }

  const handleCopy = () => {
    let codeString = '';
    if (typeof children === 'string') {
      codeString = children;
    } else if (React.isValidElement(children) && (children.props as any)?.children) {
      const inner = (children.props as any).children;
      codeString = typeof inner === 'string' ? inner : String(inner || '');
    } else {
      codeString = (props as any)['data-code'] || '';
    }

    if (codeString) {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-6 rounded-md border border-[var(--code-border)] bg-[var(--code-bg)] overflow-hidden">
      {/* Code Header Bar with Language Tab & Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--code-border)] bg-[var(--surface-bg)] text-xs font-mono text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]/40" />
          <span className="text-xs font-mono tracking-wider text-[var(--text-secondary)]">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[var(--accent)]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre
        {...props}
        className="p-4 overflow-x-auto text-sm font-mono text-[var(--text-primary)] leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}
