import { AdminAPI, API } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse } from '@/types/api.type';
import {
  Category,
  CategoryCreateRequest,
  CategoryTourRequest,
  CategoryUpdateRequest,
  CategoryWithTours,
} from '@/types/category.type';

export const categoryApi = {
  getEnabledCategories: async (): Promise<ApiResponse<CategoryWithTours[]>> => {
    try {
      const { data } = await api.get<ApiResponse<CategoryWithTours[]>>(API.CATEGORY.ENABLED);
      return data;
    } catch {
      throw new Error('Failed to get enabled categories');
    }
  },

  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const { data } = await api.get<ApiResponse<Category[]>>(AdminAPI.CATEGORY.LIST);
      return data;
    } catch {
      throw new Error('Failed to get all categories');
    }
  },

  getCategoryById: async (id: string): Promise<ApiResponse<CategoryWithTours>> => {
    try {
      const { data } = await api.get<ApiResponse<CategoryWithTours>>(`${AdminAPI.CATEGORY.DETAIL}/${id}`);
      return data;
    } catch {
      throw new Error('Failed to get category');
    }
  },

  createCategory: async (request: CategoryCreateRequest): Promise<ApiResponse<Category>> => {
    try {
      const { data } = await api.post<ApiResponse<Category>>(AdminAPI.CATEGORY.CREATE, request);
      return data;
    } catch {
      throw new Error('Failed to create category');
    }
  },

  updateCategory: async (id: string, request: CategoryUpdateRequest): Promise<ApiResponse<Category>> => {
    try {
      const { data } = await api.put<ApiResponse<Category>>(`${AdminAPI.CATEGORY.UPDATE}/${id}`, request);
      return data;
    } catch {
      throw new Error('Failed to update category');
    }
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await api.delete<ApiResponse<void>>(`${AdminAPI.CATEGORY.DELETE}/${id}`);
      return data;
    } catch {
      throw new Error('Failed to delete category');
    }
  },

  addToursToCategory: async (id: string, request: CategoryTourRequest): Promise<ApiResponse<Category>> => {
    try {
      const { data } = await api.post<ApiResponse<Category>>(`${AdminAPI.CATEGORY.ADD_TOURS}/${id}/tours`, request);
      return data;
    } catch {
      throw new Error('Failed to add tours to category');
    }
  },

  removeToursFromCategory: async (id: string, request: CategoryTourRequest): Promise<ApiResponse<Category>> => {
    try {
      const { data } = await api.delete<ApiResponse<Category>>(`${AdminAPI.CATEGORY.REMOVE_TOURS}/${id}/tours`, {
        data: request,
      });
      return data;
    } catch {
      throw new Error('Failed to remove tours from category');
    }
  },

  toggleCategoryStatus: async (id: string): Promise<ApiResponse<Category>> => {
    try {
      const { data } = await api.patch<ApiResponse<Category>>(`${AdminAPI.CATEGORY.TOGGLE_STATUS}/${id}/toggle-status`);
      return data;
    } catch {
      throw new Error('Failed to toggle category status');
    }
  },
};
