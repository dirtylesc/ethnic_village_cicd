import dayjs from 'dayjs';

import 'dayjs/locale/vi';

type FormatTourDatesOptions = {
  locale?: 'en' | 'vi';
  dateFormat?: string;
}

export function formatTourDates(
  startDate: Date | string | undefined,
  endDate: Date | string | undefined,
  options: FormatTourDatesOptions = {},
) {
  if (!startDate || !endDate) return { startDate: '', endDate: '', duration: '', durationShort: '' };

  const { locale = 'vi', dateFormat = 'MMM DD, YYYY' } = options;

  if (typeof startDate === 'string') {
    startDate = new Date(startDate);
  }
  if (typeof endDate === 'string') {
    endDate = new Date(endDate);
  }

  dayjs.locale(locale);

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const days = end.diff(start, 'day') + 1;
  const nights = days - 1;

  return {
    startDate: start.format(dateFormat),
    endDate: end.format(dateFormat),
    duration: locale === 'en' ? `${days}D-${nights}N` : `${days} ngày ${nights} đêm`,
    durationShort: `${days}D-${nights}N`,
  };
}

export function splitDateStr(date?: string) {
  if (!date) return ['', ''];

  const formatted_date = new Date(date).toLocaleString();
  return formatted_date.split(', ');
}

export function formatDate(date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}

export function formatTimeAgo(timestamp: Date, locale = 'vi-VN') {
  let value;
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    value = rtf.format(0 - years, 'year');
  } else if (months > 0) {
    value = rtf.format(0 - months, 'month');
  } else if (days > 0) {
    value = rtf.format(0 - days, 'day');
  } else if (hours > 0) {
    value = rtf.format(0 - hours, 'hour');
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, 'minute');
  } else {
    value = rtf.format(0 - diff, 'second');
  }
  return value;
}
