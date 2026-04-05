'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Shield, Trash2, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Role } from '@/types/role.type';
import { useDeleteRole, useRoles } from '@/hooks/api/useRole';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DEFAULT_ROLES = ['ADMIN', 'USER', 'TOUR_AGENCY'];

export default function RoleListPage() {
  const router = useRouter();
  const t = useTranslations('admin.role');
  const [page, setPage] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { toast } = useToast();

  const { data: rolesData, isLoading, refetch } = useRoles(page, 10);
  const deleteRoleMutation = useDeleteRole();

  const handleCreateRole = () => {
    router.push('/admin/role/create');
  };

  const handleEditRole = (role: Role) => {
    router.push(`/admin/role/${role.id}/edit`);
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;

    try {
      await deleteRoleMutation.mutateAsync(selectedRole.id);
      toast({
        title: 'Thành công',
        description: 'Xóa vai trò thành công',
      });
      setDeleteDialogOpen(false);
      setSelectedRole(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Thất bại',
        description: error?.response?.data?.message || 'Có lỗi xảy ra khi xóa vai trò',
        variant: 'destructive',
      });
    }
  };

  const isDefaultRole = (roleName: string) => DEFAULT_ROLES.includes(roleName);

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

  const roles = rolesData?.content || [];

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('list.title')}</h1>
          <p className="text-gray-600">{t('list.description')}</p>
        </div>
        <Button onClick={handleCreateRole} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('list.createNew')}
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">{t('list.table.name')}</TableHead>
              <TableHead>{t('list.table.description')}</TableHead>
              <TableHead className="w-[120px] text-center">{t('list.table.permissions')}</TableHead>
              <TableHead className="w-[120px] text-center">{t('list.table.users')}</TableHead>
              <TableHead className="w-[120px] text-right">{t('list.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                  {t('list.empty')}
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role: Role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {role.name}
                      {isDefaultRole(role.name) && (
                        <Badge variant="secondary" className="text-xs">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{role.description || '-'}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{role.permissions?.length || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {role.userCount || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRole(role)}
                        title={t('list.actions.edit')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {!isDefaultRole(role.name) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(role)}
                          title={t('list.actions.delete')}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {rolesData && rolesData.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            Trước
          </Button>
          <span className="text-sm text-gray-600">
            Trang {page + 1} / {rolesData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= rolesData.totalPages - 1}
          >
            Sau
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('delete.description', { name: selectedRole?.name ?? '' })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
