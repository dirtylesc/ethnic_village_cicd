import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminHeader, AdminSidebar } from '@/components/layout/admin';

import '@/styles/admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <SidebarProvider>
        <div className="flex w-full justify-between align-top">
          <AdminSidebar />
          <main className="flex flex-1 flex-col">
            <AdminHeader />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </NuqsAdapter>
  );
}
