'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import { Permission, PermissionGroup } from '@/types/role.type';
import { useGroupedPermissions } from '@/hooks/api/usePermission';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export function PermissionListSection() {
  const {
    watch,
    setValue,
    trigger,
    formState: { isSubmitting },
  } = useFormContext();

  const selectedPermissions = watch('selectedPermissions') || [];
  const { data: permissionGroups, isLoading } = useGroupedPermissions();

  const onPermissionsChange = useCallback(
    (permissions: Permission[]) => {
      setValue('selectedPermissions', permissions, { shouldValidate: true });
      trigger('selectedPermissions');
    },
    [setValue, trigger],
  );

  const handleGroupToggle = useCallback(
    (group: PermissionGroup, checked: boolean) => {
      if (checked) {
        const newPermissions = [...selectedPermissions];
        group.permissions.forEach(permission => {
          if (!newPermissions.find(p => p.id === permission.id)) {
            newPermissions.push(permission);
          }
        });
        onPermissionsChange(newPermissions);
      } else {
        const groupPermissionIds = group.permissions.map(p => p.id);
        const filteredPermissions = selectedPermissions.filter(
          (permission: Permission) => !groupPermissionIds.includes(permission.id),
        );
        onPermissionsChange(filteredPermissions);
      }
    },
    [selectedPermissions, onPermissionsChange],
  );

  const handlePermissionToggle = useCallback(
    (permission: Permission, checked: boolean) => {
      if (checked) {
        onPermissionsChange([...selectedPermissions, permission]);
      } else {
        const filteredPermissions = selectedPermissions.filter((p: Permission) => p.id !== permission.id);
        onPermissionsChange(filteredPermissions);
      }
    },
    [selectedPermissions, onPermissionsChange],
  );

  const isPermissionSelected = useCallback(
    (permissionId: string): boolean => {
      return selectedPermissions.some((p: Permission) => p.id === permissionId);
    },
    [selectedPermissions],
  );

  const isGroupSelected = useCallback(
    (group: PermissionGroup): boolean => {
      if (!group.permissions.length) return false;
      return group.permissions.every((permission: Permission) =>
        selectedPermissions.some((p: Permission) => p.id === permission.id),
      );
    },
    [selectedPermissions],
  );

  const getPermissionDisplayName = (name: string): string => {
    if (name.endsWith('_READ')) return 'Xem';
    if (name.endsWith('_WRITE')) return 'Thêm/Sửa/Xóa';
    return name;
  };

  const t = useTranslations('admin.role.create');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-base font-semibold">{t('permissions_label')}</h2>

      <div className="w-full space-y-4">
        {permissionGroups?.map(group => (
          <div key={group.prefix} className="rounded-lg border p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Checkbox
                id={`group-${group.prefix}`}
                checked={isGroupSelected(group)}
                onCheckedChange={checked => handleGroupToggle(group, !!checked)}
                aria-label={`Select all ${group.displayName} permissions`}
                disabled={isSubmitting}
              />
              <Label htmlFor={`group-${group.prefix}`} className="font-semibold">
                {group.displayName}
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-6 pt-2">
              {group.permissions.map(permission => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={isPermissionSelected(permission.id)}
                    onCheckedChange={checked => handlePermissionToggle(permission, !!checked)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={permission.id}>{getPermissionDisplayName(permission.name)}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
