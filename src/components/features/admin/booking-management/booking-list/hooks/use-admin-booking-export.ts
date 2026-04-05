import { useCallback } from 'react';
import { bookingAdminApi } from '@/data/apis/booking.admin.api';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/number';
import { useTranslations } from 'next-intl';
import logger from '@/libs/logger';

import { AdminBookingListRequest } from '@/types/booking/booking.admin';
import { ExportColumn } from '@/types/export/export.types';

export function useAdminBookingExport() {
  const t = useTranslations('admin.booking.list');
  const statusT = useTranslations('admin.booking.list.status');

  const exportColumns: ExportColumn[] = [
    {
      key: 'bookingId',
      title: t('table.booking_id') || 'Mã Booking',
      dataType: 'string',
    },
    {
      key: 'bookerDetail.name',
      title: t('table.booker_name') || 'Tên khách hàng',
      dataType: 'string',
      formatter: value => value || 'N/A',
    },
    {
      key: 'bookerDetail.email',
      title: 'Email',
      dataType: 'string',
    },
    {
      key: 'bookerDetail.phone',
      title: t('table.booker_phone') || 'Số điện thoại',
      dataType: 'string',
    },
    {
      key: 'tour.title',
      title: t('table.tour_name') || 'Tên tour',
      dataType: 'string',
    },
    {
      key: 'tourAvailableDate.startDate',
      title: t('table.tour_date') || 'Ngày tour',
      dataType: 'date',
      formatter: value => {
        if (!value) return '-';
        return formatDate(value, { month: 'numeric', day: 'numeric', year: 'numeric' }) || '-';
      },
    },
    {
      key: 'tourAvailableDate.endDate',
      title: 'Ngày kết thúc',
      dataType: 'date',
      formatter: value => {
        if (!value) return '-';
        return formatDate(value, { month: 'numeric', day: 'numeric', year: 'numeric' }) || '-';
      },
    },
    {
      key: 'personCount',
      title: t('table.participants') || 'Số người',
      dataType: 'string',
      formatter: value => {
        if (!value) return '-';
        const adult = value.adult || 0;
        const child = value.child || 0;
        return `${adult + child} người (NL: ${adult}, TE: ${child})`;
      },
    },
    {
      key: 'totalPrice',
      title: t('table.total_price') || 'Tổng tiền',
      dataType: 'number',
      formatter: value => formatCurrency(value, { locale: 'vi' }),
    },
    {
      key: 'discountAmountApplied',
      title: 'Giảm giá',
      dataType: 'number',
      formatter: value => (value ? formatCurrency(value, { locale: 'vi' }) : '-'),
    },
    {
      key: 'status',
      title: t('table.status') || 'Trạng thái',
      dataType: 'string',
      formatter: value => {
        if (!value) return '-';
        const translatedStatus = statusT(value.toLowerCase());
        return translatedStatus !== value.toLowerCase() ? translatedStatus : value;
      },
    },
    {
      key: 'bookingDate',
      title: 'Ngày đặt tour',
      dataType: 'date',
      formatter: value =>
        value ? formatDate(value, { month: 'numeric', day: 'numeric', year: 'numeric' }) || '-' : '-',
    },
    {
      key: 'createdAt',
      title: t('table.created_at') || 'Ngày tạo',
      dataType: 'date',
      formatter: value =>
        value
          ? formatDate(value, {
              month: 'numeric',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }) || '-'
          : '-',
    },
  ];

  const fetchAllBookings = useCallback(async (filters?: AdminBookingListRequest) => {
    try {
      const allBookings = [];
      let currentPage = 0;
      let hasMoreData = true;

      while (hasMoreData) {
        const response = await bookingAdminApi.getAdminBookingList({
          ...filters,
          page: currentPage,
          size: 100,
        });

        if (response.data) {
          allBookings.push(...response.data.content);
          hasMoreData = !response.data.last;
        } else {
          break;
        }
        currentPage++;

        if (currentPage > 100) {
          logger.warn('Reached maximum page limit (100), stopping fetch');
          break;
        }
      }

      return allBookings;
    } catch (error) {
      logger.error('Failed to fetch all bookings for export:', error);
      throw error;
    }
  }, []);

  return {
    exportColumns,
    fetchAllBookings,
  };
}
