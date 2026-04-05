import { getNestedValue } from '@/utils/export-helpers';
import { FileSpreadsheet, X } from 'lucide-react';

import { ExportPreviewProps } from '@/types/export/export.types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ExportPreviewDialog({
  config,
  isOpen,
  onClose,
  onExport,
  totalRecords,
  isLoading,
}: ExportPreviewProps) {
  const previewData = config.data.slice(0, 10);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-7xl flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              <DialogTitle>Export Preview - {config.title}</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>Xem trước dữ liệu sẽ được export. Tổng cộng: {totalRecords} bản ghi</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full overflow-auto rounded-md border">
            <div className="min-w-max">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50">
                    {config.includeIndex && (
                      <th className="min-w-[60px] border border-gray-200 p-2 text-left font-medium">STT</th>
                    )}
                    {config.columns.map(column => (
                      <th
                        key={column.key}
                        className="min-w-[120px] whitespace-nowrap border border-gray-200 p-2 text-left font-medium"
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {config.includeIndex && <td className="min-w-[60px] border border-gray-200 p-2">{index + 1}</td>}
                      {config.columns.map(column => {
                        const value = getNestedValue(row, column.key);
                        return (
                          <td
                            key={column.key}
                            className="min-w-[120px] max-w-[200px] truncate border border-gray-200 p-2"
                            title={column.formatter ? column.formatter(value) : String(value || '')}
                          >
                            {column.formatter ? column.formatter(value) : String(value || '')}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalRecords > 10 && (
              <div className="sticky bottom-0 border-t bg-white p-4 text-center text-sm text-muted-foreground">
                ... và {totalRecords - 10} bản ghi khác
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={onExport} disabled={isLoading}>
            {isLoading ? 'Đang export...' : 'Tải xuống Excel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
