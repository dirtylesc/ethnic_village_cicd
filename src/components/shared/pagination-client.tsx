'use client';

import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { createSearchParams } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { QueryConfig } from '@/types/query.type';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

const DEFAULT_RANGE = 2;

type PaginationClientProps = {
  queryConfig: QueryConfig;
  pageSize: number;
  range?: number;
  showFirstLast?: boolean;
};

export default function PaginationClient({
  queryConfig,
  pageSize,
  range = DEFAULT_RANGE,
  showFirstLast = false,
}: PaginationClientProps) {
  const pathname = usePathname();
  const page = Number(queryConfig.page || '1');

  const createPageUrl = useCallback(
    (pageNumber: number) => ({
      pathname,
      query: createSearchParams({
        ...queryConfig,
        page: pageNumber.toString(),
      }).toString(),
    }),
    [pathname, queryConfig],
  );

  const pages = useMemo(() => {
    const items: React.ReactNode[] = [];
    const shouldShowFirst = showFirstLast && page > 1 + range;
    const shouldShowLast = showFirstLast && page < pageSize - range;

    if (shouldShowFirst) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink href={createPageUrl(1)}>1</PaginationLink>
        </PaginationItem>,
      );
    }

    let startPage = Math.max(1, page - range);
    let endPage = Math.min(pageSize, page + range);
    const visiblePages = range * 2 + 1;
    const currentVisible = endPage - startPage + 1;

    if (currentVisible < visiblePages) {
      if (startPage === 1) {
        endPage = Math.min(pageSize, startPage + visiblePages - 1);
      } else if (endPage === pageSize) {
        startPage = Math.max(1, endPage - visiblePages + 1);
      }
    }

    const ellipsisOffset = showFirstLast ? 1 : 0;
    if (startPage > 1 + ellipsisOffset) {
      items.push(
        <PaginationItem key="ellipsis-before">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={createPageUrl(i)}
            isActive={i === page}
            aria-label={i === page ? `Trang hiện tại, trang ${i}` : `Đi tới trang ${i}`}
            aria-current={i === page ? 'page' : undefined}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < pageSize - ellipsisOffset) {
      items.push(
        <PaginationItem key="ellipsis-after">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (shouldShowLast) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink href={createPageUrl(pageSize)}>{pageSize}</PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [page, pageSize, range, showFirstLast, createPageUrl]);

  if (pageSize <= 1) {
    return null;
  }

  const disabledIconClass = 'flex h-9 w-9 items-center justify-center text-muted-foreground';
  const isFirstPage = page === 1;
  const isLastPage = page === pageSize;

  return (
    <nav aria-label="Phân trang">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {isFirstPage ? (
              <span className={disabledIconClass} aria-label="Trang trước (không khả dụng)">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : (
              <PaginationLink href={createPageUrl(page - 1)} aria-label={`Đi tới trang ${page - 1}`}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </PaginationLink>
            )}
          </PaginationItem>

          {pages}

          <PaginationItem>
            {isLastPage ? (
              <span className={disabledIconClass} aria-label="Trang sau (không khả dụng)">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : (
              <PaginationLink href={createPageUrl(page + 1)} aria-label={`Đi tới trang ${page + 1}`}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </nav>
  );
}
