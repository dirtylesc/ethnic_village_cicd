'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Option = {
  label: string;
  value: string;
}

type SearchableSelectProps = {
  placeholder?: string;
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  onSearch: (searchKey: string) => void;
  loading?: boolean;
  clearable?: boolean;
  loadOnMount?: boolean;
}

export const SearchableSelect = ({
  placeholder = 'Select option...',
  options,
  value,
  onValueChange,
  onSearch,
  loading = false,
  clearable = false,
  loadOnMount = true,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
      onSearch(searchKey.trim());
      setHasSearched(true);
    }, 300),
    [],
  );

  useEffect(() => {
    if (loadOnMount && !hasSearched) {
      debouncedSearch('');
    }
  }, [loadOnMount, debouncedSearch]);

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  const selectedOption = options.find(option => option.value === value);

  const handleClear = () => {
    onValueChange('');
    setSearchValue('');
    setHasSearched(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !hasSearched && options.length === 0) {
      debouncedSearch(searchValue);
    }
    if (!newOpen && searchValue) {
      setSearchValue('');
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <div className="flex items-center gap-1">
            {clearable && selectedOption && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={e => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Tìm kiếm..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            {loading ? (
              <div className="p-4 text-center text-sm">Đang tìm kiếm...</div>
            ) : (
              <>
                <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
                <CommandGroup>
                  {options.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={currentValue => {
                        onValueChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
