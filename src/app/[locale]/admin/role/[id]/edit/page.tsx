'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';

import { Permission } from '@/types/role.type';
import { useRoleById, useUpdateRole } from '@/hooks/api/useRole';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PermissionListSection } from '@/components/features/admin/role-management/role-create/PermissionListSection';
import { RoleNameSection } from '@/components/features/admin/role-management/role-create/RoleNameSection';
import { SelectedPermissionsSidebar } from '@/components/features/admin/role-management/role-create/SelectedPermissionsSidebar';
import { FormErrors } from '@/components/shared/form-errors';

const editRoleSchema = zod.object({
  roleName: zod
    .string()
    .min(2, 'Tên vai trò phải có ít nhất 2 ký tự')
    .max(50, 'Tên vai trò không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F\u1EA0-\u1EF9_]+$/, 'Tên vai trò chỉ được chứa chữ cái, số và khoảng trắng'),
  description: zod.string().max(255, 'Mô tả không được vượt quá 255 ký tự').optional(),
  selectedPermissions: zod
    .array(
      zod.object({
        id: zod.string().min(1),
        name: zod.string().min(1),
      }),
    )
    .min(1, 'Vui lòng chọn ít nhất một quyền'),
});

type EditRoleFormData = zod.infer<typeof editRoleSchema>;

export default function RoleEditPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('admin.role');
  const { toast } = useToast();

  const roleId = params.id as string;
  const { data: role, isLoading } = useRoleById(roleId);
  const updateRoleMutation = useUpdateRole();

  const methods = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: { roleName: '', description: '', selectedPermissions: [] },
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (role) {
      reset({
        roleName: role.name,
        description: role.description || '',
        selectedPermissions: role.permissions || [],
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: EditRoleFormData) => {
    try {
      await updateRoleMutation.mutateAsync({
        id: roleId,
        request: {
          name: data.roleName,
          description: data.description,
          permissionIds: data.selectedPermissions.map((p: Permission) => p.id),
        },
      });
      toast({
        title: 'Thành công',
        description: 'Cập nhật vai trò thành công',
      });
      router.push('/admin/role');
    } catch (error: any) {
      toast({
        title: 'Thất bại',
        description: error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="mb-8 h-6 w-96" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <p className="text-center text-gray-500">Không tìm thấy vai trò</p>
      </div>
    );
  }

  const isPending = isSubmitting || updateRoleMutation.isPending;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container mx-auto max-w-7xl p-6">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('edit.title')}</h1>
            <p className="text-gray-600">{t('edit.description')}</p>
          </div>

          {errors && <FormErrors errors={errors} />}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <RoleNameSection />
              <PermissionListSection />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/role')} disabled={isPending}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <SelectedPermissionsSidebar />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
