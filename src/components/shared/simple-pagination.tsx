'use client';

import { cn } from '@/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type SimplePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({ page, totalPages, onPageChange, className }: SimplePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        className="hidden size-8 lg:flex"
        onClick={() => onPageChange(0)}
        disabled={page === 0}
        aria-label="Trang đầu"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Trang {page + 1} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="hidden size-8 lg:flex"
        onClick={() => onPageChange(totalPages - 1)}
        disabled={page >= totalPages - 1}
        aria-label="Trang cuối"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
