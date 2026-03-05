'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { useMe } from '@/modules/auth/hooks/use-queries';
import { AppSidebar } from '@/modules/shared/components/layouts/app-sidebar';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bootstrap the authenticated user into the Zustand store
  useMe();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
