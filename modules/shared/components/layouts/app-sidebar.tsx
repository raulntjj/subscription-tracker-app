'use client';

import { useEffect, useState } from 'react';

import { useLogout } from '@/modules/auth/hooks/use-commands';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { useTranslation } from '@/modules/shared/hooks/use-translation';
import { ChevronsUpDown, Coins, CreditCard, LogOut, Webhook } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

function getInitials(name?: string | null, surname?: string | null): string {
  const first = name?.charAt(0) ?? '';
  const last = surname?.charAt(0) ?? '';
  return (first + last).toUpperCase() || '?';
}

export function AppSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/subscriptions">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Coins className="size-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-foreground">{t('appName')}</span>
                    <span className="text-xs text-muted-foreground">{t('appTagline')}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent />
        <SidebarFooter />
        <SidebarRail />
      </Sidebar>
    );
  }

  const navItems = [
    {
      label: t('navSubscriptions'),
      href: '/subscriptions',
      icon: CreditCard,
    },
    {
      label: t('navWebhooks'),
      href: '/webhooks',
      icon: Webhook,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/subscriptions">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Coins className="size-4 text-white" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-foreground">{t('appName')}</span>
                  <span className="text-xs text-muted-foreground">{t('appTagline')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={user?.profile_path ?? undefined} alt={user?.name ?? 'User'} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
                      {getInitials(user?.name, user?.surname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {isLoading
                        ? t('loading')
                        : user
                          ? `${user.name} ${user.surname}`
                          : t('guest')}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ''}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={user?.profile_path ?? undefined} alt={user?.name ?? 'User'} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
                      {getInitials(user?.name, user?.surname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user ? `${user.name} ${user.surname}` : ''}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ''}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="text-destructive-foreground focus:text-destructive-foreground"
                >
                  <LogOut className="mr-2 size-4" />
                  {isLoggingOut ? t('signingOut') : t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
