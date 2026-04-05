'use client';

import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import { Loader, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

type DeleteTourDialogProps = {
  tours: Row<Tour>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
} & React.ComponentPropsWithoutRef<typeof Dialog>

export default function DeleteTourDialog({ tours, showTrigger = true, onSuccess, ...props }: DeleteTourDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const { toast } = useToast();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const t = useTranslations('admin.tour.list');

  function onDelete() {
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              {t('delete')} ({tours.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('are_you_sure')}</DialogTitle>
            <DialogDescription>{t('delete_warning', { count: tours.length })}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">{t('cancel')}</Button>
            </DialogClose>
            <Button aria-label={t('delete')} variant="destructive" onClick={onDelete} disabled={isDeletePending}>
              {isDeletePending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            {t('delete')} ({tours.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t('are_you_sure')}</DrawerTitle>
          <DrawerDescription>{t('delete_warning', { count: tours.length })}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">{t('cancel')}</Button>
          </DrawerClose>
          <Button aria-label={t('delete')} variant="destructive" onClick={onDelete} disabled={isDeletePending}>
            {isDeletePending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            {t('delete')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
