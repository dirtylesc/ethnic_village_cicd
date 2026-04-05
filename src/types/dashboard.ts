export type DashboardStats = {
  totalRevenue: number;
  newBookingsCount: number;
  upcomingDeparturesCount: number;
  pendingBookingsCount: number;
  revenueGrowthPercent: number | null;
}

export type UpcomingDeparture = {
  tourId: string;
  availableDateId: string;
  tourTitle: string;
  startDate: string;
  endDate: string;
  bookedSlots: number;
  maxSlots: number;
  status: 'FULL' | 'SUFFICIENT' | 'NEED_MORE' | 'AVAILABLE';
}

export type RevenueChartData = {
  date: string;
  currentRevenue: number;
  previousRevenue: number;
}

export type TopDestination = {
  locationId: string;
  locationName: string;
  percentage: number;
  bookingCount: number;
}

export type RecentBooking = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  tourTitle: string | null;
  departureDate: string | null;
  totalPrice: number;
  status: string;
}
