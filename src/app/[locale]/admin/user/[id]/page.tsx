'use client';

import { useParams } from 'next/navigation';

import UserEditContent from '@/components/features/admin/user-management/user-edit-content';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  return <UserEditContent userId={userId} />;
}
