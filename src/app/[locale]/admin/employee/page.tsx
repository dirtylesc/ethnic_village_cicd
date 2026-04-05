'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';

import type { EmployeeAdmin, EmployeeFilters } from '@/types/employee.type';
import { useAdminEmployees, useDeleteAdminEmployee, useUpdateAdminEmployee } from '@/hooks/api/useEmployee';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SimplePagination } from '@/components/shared/simple-pagination';

export default function EmployeeListPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [actionEmployee, setActionEmployee] = useState<{ employee: EmployeeAdmin; type: 'delete' | 'restore' } | null>(null);

  const { data, isLoading } = useAdminEmployees(page, 10, filters);
  const deleteEmployeeMutation = useDeleteAdminEmployee();
  const updateEmployeeMutation = useUpdateAdminEmployee();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchValue });
    setPage(0);
  };

  const handleCreateEmployee = () => {
    router.push('/admin/employee/create');
  };

  const handleEditEmployee = (employee: EmployeeAdmin) => {
    router.push(`/admin/employee/${employee.id}`);
  };

  const handleActionEmployee = async () => {
    if (!actionEmployee) return;
    try {
      if (actionEmployee.type === 'delete') {
        await deleteEmployeeMutation.mutateAsync(actionEmployee.employee.id);
        toast({ title: 'Thành công', description: 'Đã vô hiệu hóa nhân viên' });
      } else {
        await updateEmployeeMutation.mutateAsync({ id: actionEmployee.employee.id, data: { isActive: true } });
        toast({ title: 'Thành công', description: 'Đã bỏ vô hiệu hóa nhân viên' });
      }
      setActionEmployee(null);
    } catch {
      if (actionEmployee.type === 'delete') {
        toast({ title: 'Lỗi', description: 'Không thể vô hiệu hóa nhân viên', variant: 'destructive' });
      } else {
        toast({ title: 'Lỗi', description: 'Không thể bỏ vô hiệu hóa nhân viên', variant: 'destructive' });
      }
      setActionEmployee(null);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
          <p className="text-gray-600">Xem và quản lý tất cả nhân viên trong hệ thống</p>
        </div>
        <Button onClick={handleCreateEmployee} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm nhân viên
        </Button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : data?.content?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data?.content?.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.personal?.fullName || employee.personal?.firstName || 'N/A'}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.personal?.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.roles?.map(role => (
                        <Badge key={role.id} variant="secondary">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.isActive ? 'default' : 'destructive'}>
                      {employee.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        {employee.isActive ? (
                          <DropdownMenuItem onClick={() => setActionEmployee({ employee, type: 'delete' })} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Vô hiệu hóa
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setActionEmployee({ employee, type: 'restore' })}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Bỏ vô hiệu hóa
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SimplePagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} className="mt-4" />

      <AlertDialog open={!!actionEmployee} onOpenChange={() => setActionEmployee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionEmployee?.type === 'delete' ? 'Vô hiệu hóa nhân viên' : 'Bỏ vô hiệu hóa nhân viên'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionEmployee?.type === 'delete'
                ? 'Bạn có chắc chắn muốn vô hiệu hóa nhân viên này không?'
                : 'Bạn có chắc chắn muốn bỏ vô hiệu hóa nhân viên này không?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleActionEmployee}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
