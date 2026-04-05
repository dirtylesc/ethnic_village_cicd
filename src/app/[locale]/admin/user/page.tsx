'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Pencil, Shield, Trash2 } from 'lucide-react';

import { UserAdmin } from '@/types/user.type';
import { useAdminUsers, useDeleteAdminUser } from '@/hooks/api/useUser';
import { useToast } from '@/hooks/use-toast';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SimplePagination } from '@/components/shared/simple-pagination';

export default function UserListPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const { toast } = useToast();

  const { data: usersData, isLoading, refetch } = useAdminUsers(page, 10, { search: searchFilter });
  const deleteUserMutation = useDeleteAdminUser();

  const handleEditUser = (user: UserAdmin) => {
    router.push(`/admin/user/${user.id}`);
  };

  const handleDeleteClick = (user: UserAdmin) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      toast({
        title: 'Thành công',
        description: 'Xóa người dùng thành công',
      });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Thất bại',
        description: error?.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (user: UserAdmin) => {
    if (user.personal?.firstName && user.personal?.lastName) {
      return `${user.personal.firstName[0]}${user.personal.lastName[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const users = usersData?.content || [];

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <p className="text-gray-600">Xem và quản lý tất cả khách hàng trong hệ thống</p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Tìm kiếm theo email hoặc tên..."
          value={searchInput}
          onChange={e => {
            setSearchInput(e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setSearchFilter(searchInput);
              setPage(0);
            }
          }}
          className="max-w-md"
        />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[200px]">Vai trò</TableHead>
              <TableHead className="w-[100px] text-center">Trạng thái</TableHead>
              <TableHead className="w-[120px] text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                  Không tìm thấy người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: UserAdmin) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.personal?.avatar} />
                        <AvatarFallback>{getInitials(user)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.personal?.fullName || 'Chưa cập nhật'}</p>
                        <p className="text-sm text-gray-500">{user.personal?.phoneNumber || 'Chưa có số điện thoại'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.slice(0, 2).map(role => (
                        <Badge key={role.id} variant="secondary" className="text-xs">
                          <Shield className="mr-1 h-3 w-3" />
                          {role.name}
                        </Badge>
                      ))}
                      {user.roles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.roles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={user.active ? 'default' : 'destructive'}>
                      {user.active ? 'Hoạt động' : 'Đã khóa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Chỉnh sửa">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(user)}
                        title="Xóa"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SimplePagination page={page} totalPages={usersData?.totalPages || 1} onPageChange={setPage} className="mt-4" />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng &quot;{selectedUser?.email}&quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
