export enum CategoryStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  status: CategoryStatus;
  displayOrder: number;
  tourCount?: number;
}

export type CategoryTourBasic = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  duration: number;
  adultPrice: number;
  discountPercent?: number;
}

export type CategoryWithTours = {
  tours: CategoryTourBasic[];
} & Omit<Category, 'tourCount'>

export type CategoryCreateRequest = {
  name: string;
  description?: string;
  imageUrl?: string;
  status?: CategoryStatus;
  displayOrder?: number;
}

export type CategoryUpdateRequest = {
  name?: string;
  description?: string;
  imageUrl?: string;
  status?: CategoryStatus;
  displayOrder?: number;
}

export type CategoryTourRequest = {
  tourIds: string[];
}
