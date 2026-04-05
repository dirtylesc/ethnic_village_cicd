import { useState } from 'react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

type TourItineraryProps = {
  form: UseFormReturn<TourCreateFormValues>;
};

export default function TourItinerary({ form }: TourItineraryProps) {
  const t = useTranslations();
  const [itineraryTitle, setItineraryTitle] = useState('');
  const [itineraryDesc, setItineraryDesc] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const itinerary = form.watch('itinerary');

  const handleAddOrUpdateItinerary = () => {
    if (itineraryTitle && itineraryDesc) {
      const currentItinerary = form.getValues('itinerary') || [];
      if (editIndex !== null) {
        const updatedItinerary = [...currentItinerary];
        updatedItinerary[editIndex] = { title: itineraryTitle, description: itineraryDesc };
        form.setValue('itinerary', updatedItinerary);
        setEditIndex(null);
      } else {
        form.setValue('itinerary', [...currentItinerary, { title: itineraryTitle, description: itineraryDesc }]);
      }
      setItineraryTitle('');
      setItineraryDesc('');
      setIsPopoverOpen(false);
    }
  };

  const handleEdit = (index: number) => {
    const item = itinerary[index];
    setItineraryTitle(item.title);
    setItineraryDesc(item.description);
    setEditIndex(index);
    setIsPopoverOpen(true);
  };

  const handleDelete = (index: number) => {
    const currentItinerary = form.getValues('itinerary') || [];
    const updatedItinerary = currentItinerary.filter((_, i) => i !== index);
    form.setValue('itinerary', updatedItinerary);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setEditIndex(null);
      setItineraryTitle('');
      setItineraryDesc('');
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel className="font-semibold">{t('tourCreate.itinerary')}</FormLabel>
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <Input
                placeholder={t('tourCreate.itineraryTitle')}
                value={itineraryTitle}
                onChange={e => setItineraryTitle(e.target.value)}
              />
              <Textarea
                placeholder={t('tourCreate.itineraryDescription')}
                value={itineraryDesc}
                onChange={e => setItineraryDesc(e.target.value)}
              />
              <Button type="button" onClick={handleAddOrUpdateItinerary}>
                {editIndex !== null ? t('Common.button.save' as any) : t('tourCreate.addItinerary')}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        {itinerary?.map((item, index) => (
          <div key={index} className="flex items-start justify-between rounded border p-2">
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(index)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDelete(index)}>
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
