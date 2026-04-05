'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { PromotionStatus, PromotionType } from '@/types/promotion.type';
import { useCreateAdminPromotion } from '@/hooks/api/usePromotion';
import { useToast } from '@/hooks/use-toast';
import { tourApi } from '@/data/apis/tour.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function PromotionCreateContent() {
  const router = useRouter();
  const createPromotion = useCreateAdminPromotion();
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
    type: PromotionType.DIRECT_DISCOUNT,
    code: '',
    usageLimit: 100,
    tourIds: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Please enter promotion name', variant: 'destructive' });
      return;
    }

    if (formData.type === PromotionType.COUPON_CODE && !formData.code.trim()) {
      toast({ title: 'Coupon code is required for COUPON_CODE type', variant: 'destructive' });
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
      await createPromotion.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        discountPercent: formData.discountPercent,
        maxDiscountAmount: formData.maxDiscountAmount,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status,
        type: formData.type,
        code: formData.type === PromotionType.COUPON_CODE ? formData.code : undefined,
        usageLimit: formData.usageLimit,
        tourIds: formData.tourIds,
      });
      toast({ title: 'Promotion created successfully' });
      router.push('/admin/promotion');
    } catch (error: any) {
      toast({
        title: 'Failed to create promotion',
        description: error?.response?.data?.message || 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Promotion</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Information</CardTitle>
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
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: PromotionType) =>
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PromotionType.DIRECT_DISCOUNT}>Direct Discount</SelectItem>
                    <SelectItem value={PromotionType.COUPON_CODE}>Coupon Code</SelectItem>
                  </SelectContent>
                </Select>
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

            {formData.type === PromotionType.COUPON_CODE && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="SUMMER2024"
                />
              </div>
            )}

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
                  min={1}
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
              <Button type="submit" disabled={createPromotion.isPending}>
                {createPromotion.isPending ? 'Creating...' : 'Create Promotion'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
