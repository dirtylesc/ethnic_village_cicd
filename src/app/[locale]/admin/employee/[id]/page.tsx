'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAdminEmployeeById, useUpdateAdminEmployee } from '@/hooks/api/useEmployee';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function EmployeeEditPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: employee, isLoading } = useAdminEmployeeById(id);
  const updateMutation = useUpdateAdminEmployee();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      description: '',
      isActive: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (employee) {
      setValue('firstName', employee.personal?.firstName || '');
      setValue('lastName', employee.personal?.lastName || '');
      setValue('phoneNumber', employee.personal?.phoneNumber || '');
      setValue('address', employee.personal?.address || '');
      setValue('description', employee.description || '');
      setValue('isActive', employee.isActive);
    }
  }, [employee, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast({ title: 'Thành công', description: 'Cập nhật nhân viên thành công' });
      router.push('/admin/employee');
    } catch {
      toast({ title: 'Lỗi', description: 'Có lỗi xảy ra khi cập nhật nhân viên', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Chỉnh sửa nhân viên</h1>
        <p className="text-gray-600">Cập nhật thông tin nhân viên</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input id="firstName" {...register('firstName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input id="lastName" {...register('lastName')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input id="phoneNumber" {...register('phoneNumber')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" {...register('address')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin công việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" {...register('description')} rows={4} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Trạng thái hoạt động</Label>
                  <p className="text-sm text-gray-500">Cho phép nhân viên truy cập hệ thống</p>
                </div>
                <Switch checked={watch('isActive')} onCheckedChange={checked => setValue('isActive', checked)} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {(isSubmitting || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
