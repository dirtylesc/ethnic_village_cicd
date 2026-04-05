import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';

import { ExportColumn, ExportConfig } from '@/types/export/export.types';
import { useExcelExport } from '@/hooks/use-excel-export';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import logger from '@/libs/logger';

import { ExportPreviewDialog } from './export-preview-dialog';

type DataExporterProps = {
  title: string;
  columns: ExportColumn[];
  onFetchAllData: (filters?: any) => Promise<any[]>;
  currentFilters?: any;
  className?: string;
}

export function DataExporter({ title, columns, onFetchAllData, currentFilters, className }: DataExporterProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const { exportToExcel, isExporting } = useExcelExport();
  const { toast } = useToast();

  const handleExportClick = async () => {
    setIsLoadingData(true);
    try {
      const allData = await onFetchAllData(currentFilters);

      const config: ExportConfig = {
        title,
        filename: `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
        columns: columns.filter(col => col.key !== 'actions'),
        data: allData,
        includeIndex: true,
      };

      setExportConfig(config);
      setIsPreviewOpen(true);
    } catch (error) {
      logger.error('Failed to fetch export data:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi khi tải dữ liệu',
        description: 'Không thể tải dữ liệu để xuất file. Vui lòng thử lại.',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleConfirmExport = () => {
    if (exportConfig) {
      exportToExcel(exportConfig);
      setIsPreviewOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportClick}
        disabled={isExporting || isLoadingData}
        className={className}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        {isLoadingData ? 'Đang tải...' : 'Export Excel'}
      </Button>

      {exportConfig && (
        <ExportPreviewDialog
          config={exportConfig}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onExport={handleConfirmExport}
          totalRecords={exportConfig.data.length}
          isLoading={isExporting}
        />
      )}
    </>
  );
}
