import * as React from 'react';
import { cn } from '@/utils';
import { Check, PlusCircle, XCircle } from 'lucide-react';

import type { Option } from '@/types/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

type EthnicFilterProps = {
  title: string;
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}

export function EthnicFilter({ title, options, selectedValues, onSelectionChange }: EthnicFilterProps) {
  const [open, setOpen] = React.useState(false);
  const selectedSet = new Set(selectedValues);

  const handleItemSelect = React.useCallback(
    (option: Option, isSelected: boolean) => {
      const newSelectedValues = new Set(selectedSet);
      if (isSelected) {
        newSelectedValues.delete(option.value);
      } else {
        newSelectedValues.add(option.value);
      }
      onSelectionChange(Array.from(newSelectedValues));
    },
    [selectedSet, onSelectionChange],
  );

  const handleReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      onSelectionChange([]);
    },
    [onSelectionChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {selectedSet.size > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={handleReset}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          {title}
          {selectedSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedSet.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedSet.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedSet.size} selected
                  </Badge>
                ) : (
                  options
                    .filter(option => selectedSet.has(option.value))
                    .map(option => (
                      <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
              {options.map(option => {
                const isSelected = selectedSet.has(option.value);

                return (
                  <CommandItem key={option.value} onSelect={() => handleItemSelect(option, isSelected)}>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary' : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && <option.icon />}
                    <span className="truncate">{option.label}</span>
                    {option.count && <span className="ml-auto font-mono text-xs">{option.count}</span>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => handleReset()} className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
