import { ReactNode } from 'react';
import { cn } from '@/utils';

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray';
}

export function SectionContainer({ children, className, background = 'white' }: SectionContainerProps) {
  return (
    <section
      className={cn(
        'py-12 sm:py-16 lg:py-20',
        {
          'bg-white': background === 'white',
          'bg-gray-50': background === 'gray',
        },
        className,
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
