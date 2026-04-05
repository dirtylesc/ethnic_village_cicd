import { SidebarTrigger } from '@/components/ui/sidebar';
import SearchCommand from '@/components/features/admin/search-command';
import { NotificationBell } from '@/components/features/notification';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-16 w-full px-4">
        <div className="flex h-full items-center justify-between">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-end gap-3">
            <SearchCommand />
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  );
}
