'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme';
import { Button } from './ui/button';

/**
 * ThemeToggle component
 * Displays theme toggle button (Moon/Sun icon)
 * Cycles through: light → dark → system → light
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button size="icon" variant="outline" className="h-9 w-9" disabled />;
  }

  const handleClick = () => {
    const themes: Array<'light' | 'dark' | 'system'> = [
      'light',
      'dark',
      'system',
    ];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="h-9 w-9"
      onClick={handleClick}
      title={`Theme: ${theme}`}
      aria-label={`Current theme: ${theme}. Click to change theme.`}
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
