import React from 'react';

export type StatusBadgeType = 'PINNED' | 'NEW' | 'NOTE' | 'DRAFT';

interface StatusBadgeProps {
  type: StatusBadgeType;
  className?: string;
}

export default function StatusBadge({ type, className = '' }: StatusBadgeProps) {
  const isYellow = type === 'NOTE';

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-sm font-stamp text-[10px] tracking-wider uppercase select-none ${
        isYellow
          ? 'border border-[var(--accent-yellow)]/50 text-[var(--accent-yellow)] bg-[var(--accent-yellow)]/5'
          : 'border border-[var(--border-accent)] text-[var(--accent)] bg-[var(--accent)]/5'
      } ${className}`}
    >
      {type}
    </span>
  );
}
