
import { ComponentPropsWithoutRef, ReactElement } from 'react';
import { cn } from '@/utils';

type ValidElement<Props = any> =
  | keyof Pick<HTMLElementTagNameMap, 'div' | 'header' | 'footer' | 'section' | 'main'>
  | ((props: Props) => ReactElement);

function Container<T extends ValidElement>({
  as,
  ...props
}: { as: T } & Omit<ComponentPropsWithoutRef<T>, 'as'>): ReactElement;
function Container({ as, ...props }: { as?: undefined } & ComponentPropsWithoutRef<'div'>): ReactElement;

function Container<T extends ValidElement>({
  as,
  className,
  ...props
}: { as?: T } & Omit<ComponentPropsWithoutRef<T>, 'as'>) {
  const Component = as ?? 'div';

  return <Component className={cn('mx-auto w-full max-w-[1960px] px-3 md:px-6', className)} {...props} />;
}

export default Container;
