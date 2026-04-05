'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tourApi } from '@/data/apis/tour.api';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CategoryStatus } from '@/types/category.type';
import {
  useAddToursToCategory,
  useCategoryDetail,
  useRemoveToursFromCategory,
  useUpdateCategory,
} from '@/hooks/api/useCategory';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function CategoryEditContent() {
  const t = useTranslations('admin');
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { toast } = useToast();

  const { data: categoryResponse, isLoading } = useCategoryDetail(categoryId);
  const updateCategory = useUpdateCategory();
  const addTours = useAddToursToCategory();
  const removeTours = useRemoveToursFromCategory();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
    enabled: false,
  });

  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState<{ tourId: string; title: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const category = categoryResponse?.data;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        displayOrder: category.displayOrder,
        enabled: category.status === CategoryStatus.ENABLED,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Category name is required', variant: 'destructive' });
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id: categoryId,
        request: {
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          displayOrder: formData.displayOrder,
          status: formData.enabled ? CategoryStatus.ENABLED : CategoryStatus.DISABLED,
        },
      });
      toast({ title: 'Category updated successfully' });
    } catch {
      toast({ title: 'Failed to update category', variant: 'destructive' });
    }
  };

  const handleSearchTours = async () => {
    if (!searchKey.trim()) return;
    setIsSearching(true);
    try {
      const response = await tourApi.getAdminTourList({ searchKey, page: 0, size: 10 });
      const tours = response.data?.content || [];
      setSearchResults(tours.map(tour => ({ tourId: tour.id, title: tour.title })));
    } catch {
      toast({ title: 'Failed to search tours', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTour = async (tourId: string) => {
    try {
      await addTours.mutateAsync({
        id: categoryId,
        request: { tourIds: [tourId] },
      });
      toast({ title: 'Tour added to category' });
      setDialogOpen(false);
      setSearchKey('');
      setSearchResults([]);
    } catch {
      toast({ title: 'Failed to add tour', variant: 'destructive' });
    }
  };

  const handleRemoveTour = async (tourId: string) => {
    try {
      await removeTours.mutateAsync({
        id: categoryId,
        request: { tourIds: [tourId] },
      });
      toast({ title: 'Tour removed from category' });
    } catch {
      toast({ title: 'Failed to remove tour', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!category) {
    return <div className="p-6">Category not found</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t('category.edit_title')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('category.category_info')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t('category.name')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">{t('category.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="imageUrl">{t('category.image_url')}</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="displayOrder">{t('category.display_order')}</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={e => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, enabled: checked }))}
                />
                <Label htmlFor="enabled">{t('category.enable_on_homepage')}</Label>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={updateCategory.isPending}>
                  {updateCategory.isPending ? t('category.saving') : t('category.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('category.tours_in_category')}</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 size-4" />
                  {t('category.add_tour')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('category.add_tour_dialog_title')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Input
                      value={searchKey}
                      onChange={e => setSearchKey(e.target.value)}
                      placeholder={t('category.search_tour_placeholder')}
                      onKeyDown={e => e.key === 'Enter' && handleSearchTours()}
                    />
                    <Button onClick={handleSearchTours} disabled={isSearching}>
                      {isSearching ? '...' : t('category.search')}
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map(tour => (
                      <div
                        key={tour.tourId}
                        className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-muted"
                        onClick={() => handleAddTour(tour.tourId)}
                      >
                        <span className="truncate">{tour.title}</span>
                        <Plus className="size-4 text-green-600" />
                      </div>
                    ))}
                    {searchResults.length === 0 && searchKey && !isSearching && (
                      <p className="py-4 text-center text-muted-foreground">{t('category.no_results')}</p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {category.tours.map(tour => (
                <div key={tour.id} className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-3">
                    {tour.imageUrl && (
                      <img src={tour.imageUrl} alt={tour.title} className="size-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-medium">{tour.title}</p>
                      <p className="text-sm text-muted-foreground">{tour.duration} ngày</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveTour(tour.id)}>
                    <X className="size-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {category.tours.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">{t('category.no_tours')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
