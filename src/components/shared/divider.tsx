import { cn } from '@/utils';

type DividerProps = {
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

const Divider = ({ direction = 'horizontal', className }: DividerProps) => {
  return (
    <div
      className={cn(
        'h-full w-[1px] bg-gray-20',
        {
          'h-[1px] w-full': direction === 'vertical',
        },
        className,
      )}
    />
  );
};

export default Divider;
