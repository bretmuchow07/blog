'use client';

import React, { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100)));
      }
    };

    window.addEventListener('scroll', updateScrollCompletion, { passive: true });
    updateScrollCompletion();
    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);

  return (
    <div
      className="fixed top-16 left-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-magenta)] z-50 pointer-events-none transition-all duration-75 ease-out"
      style={{ width: `${completion}%` }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(completion)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
