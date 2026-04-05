import { ExportColumn } from '@/types/export/export.types';

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function processExportData(data: any[], columns: ExportColumn[]): Record<string, any>[] {
  return data.map(row => {
    const processedRow: Record<string, any> = {};

    columns.forEach(column => {
      const value = getNestedValue(row, column.key);
      processedRow[column.key] = column.formatter ? column.formatter(value) : value;
    });

    return processedRow;
  });
}

export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export function generateFilename(title: string): string {
  const sanitizedTitle = sanitizeFilename(title);
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitizedTitle}_${timestamp}`;
}
