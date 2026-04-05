import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Input } from '@/components/ui/input';

type SearchFilterProps = {
  title: string;
  defaultValue: string;
  onChange: (updates: Record<string, string | string[] | undefined>) => void;
}

export function SearchFilter({ title, defaultValue, onChange }: SearchFilterProps) {
  const [currentSearch, setCurrentSearch] = useState(defaultValue);

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    onChange({ search: value || undefined });
  }, 500);

  const handleSearchChange = useCallback(
    (value: string) => {
      setCurrentSearch(value);
      debouncedSearchChange(value);
    },
    [debouncedSearchChange],
  );

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={title}
        value={currentSearch}
        onChange={e => handleSearchChange(e.target.value)}
        className="h-8 w-40 pl-8 lg:w-56"
      />
    </div>
  );
}
