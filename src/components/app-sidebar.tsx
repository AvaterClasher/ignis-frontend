'use client'; // Required for usePathname hook

import clsx from 'clsx'; // A utility for constructing className strings conditionally
import { Home, Key, Play, PlayCircle, Webhook } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import HeaderSvg from './header-svg';
import SidebarUser from './sidebar-user';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

// Menu items (no changes needed here).
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Playground',
    url: '/playground',
    icon: Play,
  },
  {
    title: 'API Keys',
    url: '/api-keys',
    icon: Key,
  },
  {
    title: 'Webhooks',
    url: '/webhooks',
    icon: Webhook,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="mt-2 flex items-center justify-center">
          <a className="flex items-center justify-center font-mono" href="/">
            <HeaderSvg />
          </a>
        </div>
        <Separator />
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        {/* Primary Call-to-Action Button */}
        <div className="px-4 py-2">
          <Button
            className="w-full font-semibold text-md"
            onClick={() => router.push('/playground')}
            variant="default"
          >
            <PlayCircle />
            Execute
          </Button>
        </div>

        {/* Navigation Menu */}
        <SidebarMenu className="mt-4 flex-1 space-y-1 px-4">
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <a
                  className={clsx(
                    'flex items-center gap-3 rounded-md p-2 font-semibold text-md transition-all',
                    {
                      // Active state styles
                      'bg-accent text-accent-foreground hover:bg-accent/90':
                        isActive,
                      // Inactive state styles
                      'text-muted-foreground hover:bg-accent hover:text-accent-foreground':
                        !isActive,
                    }
                  )}
                  href={item.url}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
