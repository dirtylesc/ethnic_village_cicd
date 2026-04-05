import { cn } from '@/utils';
import { Star } from 'lucide-react';

type StarRatingProps = {
  average: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ average = 0, readOnly = false, onChange, size = 'sm' }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (newValue: number) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          className={cn(
            'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            !readOnly && 'cursor-pointer hover:scale-110',
            readOnly && 'cursor-default',
          )}
          disabled={readOnly}
          type="button"
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= average ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
              'transition-colors',
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
