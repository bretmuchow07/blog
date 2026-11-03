'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setIsLight(true);
      document.body.classList.add('light-mode');
    } else {
      setIsLight(false);
      document.body.classList.remove('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  if (!mounted) {
    return <div className="w-7 h-7" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className="w-7 h-7 flex items-center justify-center rounded border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
    >
      {isLight ? (
        <Moon className="w-3.5 h-3.5" />
      ) : (
        <Sun className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
