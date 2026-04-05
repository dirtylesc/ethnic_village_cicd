'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { PromotionStatus } from '@/types/promotion.type';
import {
  useAdminPromotionDetail,
  useUpdateAdminPromotion,
} from '@/hooks/api/usePromotion';
import { useToast } from '@/hooks/use-toast';
import { tourApi } from '@/data/apis/tour.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

type PromotionEditContentProps = {
  id: string;
}

export default function PromotionEditContent({ id }: PromotionEditContentProps) {
  const router = useRouter();
  const { data: promotion, isLoading } = useAdminPromotionDetail(id);
  const updatePromotion = useUpdateAdminPromotion();
  const { toast } = useToast();

  const { data: toursData, isLoading: isLoadingTours } = useQuery({
    queryKey: ['tours-for-promotion'],
    queryFn: () => tourApi.getTourList({ page: 0, size: 1000 }),
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountPercent: 0,
    maxDiscountAmount: 0,
    startDate: '',
    endDate: '',
    status: PromotionStatus.ACTIVE,
    usageLimit: 100,
    tourIds: [] as string[],
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name,
        description: promotion.description || '',
        discountPercent: promotion.discountPercent,
        maxDiscountAmount: promotion.maxDiscountAmount,
        startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
        endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
        status: promotion.status,
        usageLimit: promotion.usageLimit,
        tourIds: promotion.tours?.map(tour => tour.id) || [],
      });
    }
  }, [promotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Please enter promotion name', variant: 'destructive' });
      return;
    }

    if (formData.discountPercent <= 0 || formData.discountPercent > 100) {
      toast({ title: 'Discount percent must be between 1-100', variant: 'destructive' });
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast({ title: 'Please select start and end dates', variant: 'destructive' });
      return;
    }

    try {
      await updatePromotion.mutateAsync({
        id,
        request: {
          name: formData.name,
          description: formData.description || undefined,
          discountPercent: formData.discountPercent,
          maxDiscountAmount: formData.maxDiscountAmount,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          status: formData.status,
          usageLimit: formData.usageLimit,
          tourIds: formData.tourIds,
        },
      });
      toast({ title: 'Promotion updated successfully' });
      router.push('/admin/promotion');
    } catch (error: any) {
      toast({
        title: 'Failed to update promotion',
        description: error?.response?.data?.message || 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!promotion) {
    return <div className="p-6">Promotion not found</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Promotion</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Information</CardTitle>
          <div className="text-sm text-gray-500">
            Type: <span className="font-medium">{promotion.type}</span> | Code:{' '}
            <code className="rounded bg-gray-100 px-2 py-1">{promotion.code || '-'}</code>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter promotion name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Usage Count</Label>
                <div className="flex h-10 items-center rounded-md border px-3 text-sm">
                  {promotion.usedCount} / {promotion.usageLimit}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter promotion description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="discountPercent">Discount Percent (%) *</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  value={formData.discountPercent}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, discountPercent: parseInt(e.target.value) || 0 }))
                  }
                  min={1}
                  max={100}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="maxDiscountAmount">Max Discount Amount (VND) *</Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      maxDiscountAmount: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={0}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="usageLimit">Usage Limit *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 1 }))
                  }
                  min={promotion.usedCount}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PromotionStatus) =>
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PromotionStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={PromotionStatus.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={PromotionStatus.EXPIRED}>Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tours (Leave empty for universal promotion)</Label>
              {isLoadingTours ? (
                <div className="text-sm text-muted-foreground">Loading tours...</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
                    {toursData?.data?.content?.map(tour => (
                      <div key={tour.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tour.id}
                          checked={formData.tourIds.includes(tour.id)}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              tourIds: checked
                                ? [...prev.tourIds, tour.id]
                                : prev.tourIds.filter(id => id !== tour.id)
                            }));
                          }}
                        />
                        <label
                          htmlFor={tour.id}
                          className="text-sm cursor-pointer select-none flex-1"
                        >
                          {tour.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.tourIds.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      ℹ️ No tours selected - this promotion will apply to ALL tours
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {formData.tourIds.length} tour(s) selected
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatePromotion.isPending}>
                {updatePromotion.isPending ? 'Updating...' : 'Update Promotion'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
