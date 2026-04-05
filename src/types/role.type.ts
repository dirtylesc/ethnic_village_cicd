export type Permission = {
  id: string;
  name: string;
  url?: string;
  prefix?: string;
  parentId?: string;
  category?: string;
  code?: string;
}

export type PermissionCategory = {
  id: string;
  name: string;
  permissions: Permission[];
}

export type PermissionGroup = {
  prefix: string;
  displayName: string;
  permissions: Permission[];
}

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateRoleRequest = {
  name: string;
  description?: string;
  permissionIds: string[];
}

export type UpdateRoleRequest = {
  name: string;
  description?: string;
  permissionIds: string[];
}

export type CreateRoleFormData = {
  roleName: string;
  description?: string;
  selectedPermissions: Permission[];
}

export type CreateRoleState = {
  roleName: string;
  selectedPermissions: Permission[];
  isSubmitting: boolean;
  errors: {
    name?: string;
    permissions?: string;
    general?: string;
  };
}
