import * as React from 'react';
import { cn, hashStringToNumber } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        gray: 'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200',
        blue: 'border-transparent bg-blue-50 text-blue-700 hover:bg-blue-100',
        amber: 'border-transparent bg-amber-50 text-amber-700 hover:bg-amber-100',
        green: 'border-transparent bg-green-50 text-green-700 hover:bg-green-100',
        purple: 'border-transparent bg-purple-50 text-purple-700 hover:bg-purple-100',
        red: 'border-transparent bg-red-50 text-red-700 hover:bg-red-100',
        indigo: 'border-transparent bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
        pink: 'border-transparent bg-pink-50 text-pink-700 hover:bg-pink-100',
        orange: 'border-transparent bg-orange-50 text-orange-700 hover:bg-orange-100',
        teal: 'border-transparent bg-teal-50 text-teal-700 hover:bg-teal-100',
        sky: 'border-transparent bg-sky-50 text-sky-700 hover:bg-sky-100',
        lime: 'border-transparent bg-lime-50 text-lime-700 hover:bg-lime-100',
      },
      size: {
        default: '',
        sm: 'h-5 px-2 py-0 text-xs',
        lg: 'h-7 px-3 py-1 text-sm',
      },
      shape: {
        default: 'rounded-md',
        rounded: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  autoVariant?: boolean;
}

const colorVariants = [
  'gray',
  'blue',
  'amber',
  'green',
  'purple',
  'red',
  'indigo',
  'pink',
  'orange',
  'teal',
  'sky',
  'lime',
] as const;

function Badge({ className, variant, size, shape, autoVariant, children, ...props }: BadgeProps) {
  let computedVariant = variant;

  if (autoVariant && !variant) {
    if (typeof children === 'string') {
      const hashValue = hashStringToNumber(children);
      const colorIndex = hashValue % colorVariants.length;
      computedVariant = colorVariants[colorIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * colorVariants.length);
      computedVariant = colorVariants[randomIndex];
    }
  }

  return (
    <div className={cn(badgeVariants({ variant: computedVariant, size, shape }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
