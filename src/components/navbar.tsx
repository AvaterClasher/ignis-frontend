'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

// Page title mapping
const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/playground': 'Playground',
  '/api-keys': 'API Keys',
  '/webhooks': 'Webhooks',
};

export default function NavBar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Get current page title
  const currentPageTitle = pageTitles[pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-50 w-full rounded-md bg-background/95">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - Sidebar trigger and page title */}
        <div className="flex items-center gap-4">
          <Button
            className="h-8 w-8 p-0"
            onClick={toggleSidebar}
            size="sm"
            variant="ghost"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <h1 className="font-semibold text-lg">{currentPageTitle}</h1>
        </div>

        <ThemeSwitcher
          defaultValue="system"
          onChange={setTheme}
          value={theme}
        />
      </div>
    </header>
  );
}
