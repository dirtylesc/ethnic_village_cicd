'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CategoryStatus } from '@/types/category.type';
import { useCreateCategory } from '@/hooks/api/useCategory';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function CategoryCreateContent() {
  const t = useTranslations('admin');
  const router = useRouter();
  const createCategory = useCreateCategory();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Vui lòng nhập tên danh mục', variant: 'destructive' });
      return;
    }

    try {
      await createCategory.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        displayOrder: formData.displayOrder,
        status: formData.enabled ? CategoryStatus.ENABLED : CategoryStatus.DISABLED,
      });
      toast({ title: 'Tạo danh mục thành công' });
      router.push('/admin/category');
    } catch {
      toast({ title: 'Tạo danh mục thất bại', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t('category.create_title')}</h1>
      </div>

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
                placeholder={t('category.name_placeholder')}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">{t('category.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('category.description_placeholder')}
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="imageUrl">{t('category.image_url')}</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
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

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {t('category.cancel')}
              </Button>
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending ? t('category.creating') : t('category.create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
