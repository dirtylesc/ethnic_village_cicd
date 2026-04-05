import { useState } from 'react';
import { getNestedValue } from '@/utils/export-helpers';
import * as XLSX from 'xlsx';
import logger from '@/libs/logger';

import { ExportConfig } from '@/types/export/export.types';

export function useExcelExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async (config: ExportConfig) => {
    setIsExporting(true);

    try {
      const exportData = config.data.map((row, index) => {
        const newRow: Record<string, any> = {};

        if (config.includeIndex) {
          newRow['STT'] = index + 1;
        }

        config.columns.forEach(column => {
          const value = getNestedValue(row, column.key);
          newRow[column.title] = column.formatter ? column.formatter(value) : value || '';
        });

        return newRow;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      const colWidths = [];
      if (config.includeIndex) {
        colWidths.push({ wch: 5 });
      }
      config.columns.forEach(() => {
        colWidths.push({ wch: 20 });
      });
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, config.title);

      const fileName = `${config.filename}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      logger.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToExcel, isExporting };
}
