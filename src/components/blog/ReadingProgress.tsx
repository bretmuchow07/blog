'use client';

import React, { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(
          Number((currentProgress / scrollHeight).toFixed(3)) * 100
        );
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);
    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-[var(--accent)] z-50 transition-all duration-75 ease-out"
      style={{ width: `${completion}%` }}
      role="progressbar"
      aria-valuenow={completion}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
