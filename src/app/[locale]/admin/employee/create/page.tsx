'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateAdminEmployee } from '@/hooks/api/useEmployee';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EmployeeCreatePage() {
  const router = useRouter();
  const createMutation = useCreateAdminEmployee();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast({ title: 'Thành công', description: 'Thêm nhân viên thành công' });
      router.push('/admin/employee');
    } catch {
      toast({ title: 'Lỗi', description: 'Có lỗi xảy ra khi thêm nhân viên', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Thêm nhân viên mới</h1>
        <p className="text-gray-600">Tạo tài khoản và thông tin cho nhân viên mới</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đăng nhập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('email')} placeholder="example@company.com" />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input id="password" type="password" {...register('password')} placeholder="Tối thiểu 6 ký tự" />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </CardContent>
          </Card>

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
                <Textarea id="description" {...register('description')} rows={4} placeholder="Mô tả về nhân viên..." />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              {(isSubmitting || createMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm nhân viên
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
