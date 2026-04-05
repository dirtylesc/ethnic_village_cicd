export type QueryConfig = Partial<{
  page: number;
  perPage: number;
  limit: string;
  sort_by: string;
  order: 'asc' | 'desc';
  search: string;
  status: string[];
  e: string[];
  p: string[] | 'on_sale';
  l: string[];
  t: string[];
  d: string;
  r: string;
  min: number;
  max: number;
  date: string;
  start_date: string;
  end_date: string;

  tourId: string;
  tourAvailableDateIds: string[];

  employee_ids: string[];
}>;

export type BookingQueryConfig = Partial<{
  page: number;
  pending_page: number;
  other_page: number;
  perPage: number;
  limit: string;
  sort_by: string;
  order: 'asc' | 'desc';
  status: string[];
  e: string[];
  start_date: string;
  end_date: string;
}>;

export type OrderTourQueryConfig = Partial<{
  tour: string;
  availableDate: number;
  adult: number;
  child: number;
}>;
