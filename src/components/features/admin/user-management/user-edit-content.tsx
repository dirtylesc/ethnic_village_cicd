'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';

import { useRoles } from '@/hooks/api/useRole';
import { useAdminUserById, useUpdateAdminUser } from '@/hooks/api/useUser';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

const updateUserSchema = zod.object({
  email: zod.string().email('Email không hợp lệ'),
  password: zod.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').optional().or(zod.literal('')),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  phoneNumber: zod.string().optional(),
  address: zod.string().optional(),
  active: zod.boolean(),
  roleIds: zod.array(zod.string()).min(1, 'Vui lòng chọn ít nhất một vai trò'),
});

type UpdateUserFormData = zod.infer<typeof updateUserSchema>;

type UserEditContentProps = {
  userId: string;
}

export default function UserEditContent({ userId }: UserEditContentProps) {
  const router = useRouter();
  const updateUserMutation = useUpdateAdminUser();
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useAdminUserById(userId);
  const { data: rolesData, isLoading: rolesLoading } = useRoles(0, 100);

  const methods = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      active: true,
      roleIds: [],
    },
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedRoles = watch('roleIds');
  const isActive = watch('active');

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        password: '',
        firstName: user.personal?.firstName || '',
        lastName: user.personal?.lastName || '',
        phoneNumber: user.personal?.phoneNumber || '',
        address: user.personal?.address || '',
        active: user.active,
        roleIds: user.roles.map(r => r.id),
      });
    }
  }, [user, reset]);

  const handleRoleToggle = (roleId: string) => {
    const current = selectedRoles || [];
    if (current.includes(roleId)) {
      setValue(
        'roleIds',
        current.filter(id => id !== roleId),
      );
    } else {
      setValue('roleIds', [...current, roleId]);
    }
  };

  const onSubmit = useCallback(
    async (data: UpdateUserFormData) => {
      try {
        await updateUserMutation.mutateAsync({
          id: userId,
          request: {
            email: data.email,
            password: data.password || undefined,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            address: data.address,
            active: data.active,
            roleIds: data.roleIds,
          },
        });
        toast({
          title: 'Thành công',
          description: 'Cập nhật khách hàng thành công',
        });
        router.push('/admin/user');
      } catch (error: any) {
        toast({
          title: 'Thất bại',
          description: error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khách hàng',
          variant: 'destructive',
        });
      }
    },
    [updateUserMutation, userId, router, toast],
  );

  const roles = rolesData?.content || [];

  if (userLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Skeleton className="mb-6 h-10 w-24" />
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="mb-8 h-6 w-48" />
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.push('/admin/user')}>
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Chỉnh sửa khách hàng</h1>
        <p className="text-gray-600">Cập nhật thông tin tài khoản khách hàng</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đăng nhập</CardTitle>
              <CardDescription>Email và mật khẩu để đăng nhập</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="example@email.com" {...register('email')} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu mới</Label>
                  <Input id="password" type="password" placeholder="Để trống nếu không đổi" {...register('password')} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Thông tin bổ sung của người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input id="firstName" placeholder="Nguyễn" {...register('firstName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input id="lastName" placeholder="Văn A" {...register('lastName')} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input id="phoneNumber" placeholder="0912345678" {...register('phoneNumber')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" placeholder="Hà Nội, Việt Nam" {...register('address')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái tài khoản</CardTitle>
              <CardDescription>Bật/tắt tài khoản người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Switch checked={isActive} onCheckedChange={checked => setValue('active', checked)} />
                <Label>{isActive ? 'Tài khoản đang hoạt động' : 'Tài khoản đã bị khóa'}</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân quyền</CardTitle>
              <CardDescription>Chọn vai trò cho người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {roles.map((role: any) => (
                    <div key={role.id} className="flex items-center space-x-3 rounded-lg border p-3">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles?.includes(role.id)}
                        onCheckedChange={() => handleRoleToggle(role.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`role-${role.id}`} className="cursor-pointer font-medium">
                          {role.name}
                        </Label>
                        {role.description && <p className="text-xs text-gray-500">{role.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {errors.roleIds && <p className="mt-2 text-sm text-destructive">{errors.roleIds.message}</p>}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/user')}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || updateUserMutation.isPending}>
              {(isSubmitting || updateUserMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
