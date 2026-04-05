'use client';

import { useState } from 'react';
import { cn } from '@/utils';
import { Filter, SettingsIcon, Star, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

type FilterBarProps = {
  className?: string;
  onFilterChange?: (filters: FilterValues) => void;
}

type FilterValues = {
  budget: number[];
  people: number;
  rating5: boolean;
  rating4: boolean;
}

export function FilterBar({ className, onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    budget: [0, 10000000],
    people: 1,
    rating5: false,
    rating4: false,
  });

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="flex gap-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn('gap-2 rounded-full bg-primary-200 px-4 py-2 hover:bg-primary-300', className)}
          >
            <span className="text-primary-900">Bộ lọc</span>
            <SettingsIcon className="h-4 w-4 text-primary-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tùy chọn bộ lọc</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Khoảng giá (VNĐ)</label>
              <Slider
                defaultValue={filters.budget}
                max={10000000}
                step={100000}
                onValueChange={value => handleFilterChange('budget', value)}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.budget[0].toLocaleString('vi-VN')}đ</span>
                <span>{filters.budget[1].toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Số người</label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  value={filters.people}
                  onChange={e => handleFilterChange('people', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          className="bg-primary-100 data-[state=checked]:bg-green-300 data-[state=checked]:text-green-700"
          checked={filters.rating5}
          onCheckedChange={checked => handleFilterChange('rating5', checked)}
        />
        <span className="flex items-center gap-1 text-white">
          5 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </span>
      </label>

      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          className="bg-primary-100 data-[state=checked]:bg-green-300 data-[state=checked]:text-green-700"
          checked={filters.rating4}
          onCheckedChange={checked => handleFilterChange('rating4', checked)}
        />
        <span className="flex items-center gap-1 text-white">
          4 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </span>
      </label>
    </div>
  );
}
