'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState<boolean>(false);

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
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--code-border)] bg-[var(--surface-bg)] text-xs font-mono text-[var(--text-muted)]">
        <span className="text-[11px] uppercase tracking-wider">Code</span>

        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[var(--accent)]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Surface */}
      <pre
        {...props}
        className="p-4 overflow-x-auto text-sm font-mono text-[var(--text-primary)] leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}
