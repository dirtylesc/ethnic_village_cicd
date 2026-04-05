'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RoleNameSection() {
  const t = useTranslations('admin.role.create');
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor="roleName" className="text-base font-semibold">
        {t('role_name_label')}
      </Label>
      <Input
        id="roleName"
        {...register('roleName')}
        disabled={isSubmitting}
        placeholder={t('role_name_placeholder')}
        className="mt-1"
      />
    </div>
  );
}
