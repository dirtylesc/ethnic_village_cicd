import { useState } from 'react';
import { EntityType } from '@/core/constants/entity';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { cn } from '@/utils/classnames';
import { Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useApiBookmarkAdd, useApiBookmarkRemove } from '@/hooks/api/useBookmark';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type BookmarkButtonProps = {
  entityId: string;
  entityType: EntityType;
  isBookmarkedDefault?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'icon' | 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export const BookmarkButton = ({
  entityId,
  entityType,
  isBookmarkedDefault = false,
  className,
  variant = 'ghost',
  size = 'icon',
  showText = false,
}: BookmarkButtonProps) => {
  const t = useTranslations('bookmark');
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedDefault);

  const { mutate: addBookmark, isPending: isAdding } = useApiBookmarkAdd();
  const { mutate: removeBookmark, isPending: isRemoving } = useApiBookmarkRemove();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { setUserBookmark, removeUserBookmark } = useUserStore();

  const isLoading = isAdding || isRemoving;
  const labelText = isBookmarked ? t('saved') : t('save');
  const tooltipText = isBookmarked ? t('remove_tooltip') : t('add_tooltip');

  const handleToggleBookmark = () => {
    if (isLoading) return;

    if (!user) {
      toast({
        title: t('auth_required'),
        variant: 'destructive',
      });
      return;
    }

    const request = { entityId, entityType };
    if (isBookmarked) {
      removeBookmark(request, {
        onSuccess: response => {
          setIsBookmarked(false);
          toast({
            title: response.message,
          });

          if (response.data?.bookmark) {
            removeUserBookmark(response.data.bookmark.entityId, response.data.bookmark.entityType);
          } else {
            removeUserBookmark(Number(entityId), entityType);
          }
        },
        onError: (error: any) => {
          toast({
            title: error.message,
            variant: 'destructive',
          });
        },
      });
    } else {
      addBookmark(request, {
        onSuccess: response => {
          setIsBookmarked(true);
          toast({
            title: response.message,
          });

          if (!response.data) return;
          setUserBookmark(response.data.bookmark);
        },
        onError: (error: any) => {
          toast({
            title: error.message,
            variant: 'destructive',
          });
        },
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn(
              'group gap-2 transition-all duration-300',
              {
                'border-primary text-primary hover:text-primary': isBookmarked,
                'hover:border-primary-500/80 hover:text-primary': variant === 'outline',
                'hover:text-primary': !isBookmarked,
              },
              className,
            )}
            onClick={handleToggleBookmark}
            disabled={isLoading}
            aria-label={tooltipText}
            aria-pressed={isBookmarked}
          >
            <Bookmark
              className={cn(
                'h-[1.2rem] w-[1.2rem] transition-transform group-hover:scale-110',
                isBookmarked ? 'fill-current' : 'fill-none',
              )}
              aria-hidden="true"
            />
            {showText && labelText}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
