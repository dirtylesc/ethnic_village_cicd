export type ExportColumn = {
  key: string;
  title: string;
  dataType?: 'string' | 'number' | 'date' | 'boolean';
  formatter?: (value: any) => string;
}

export type ExportConfig = {
  title: string;
  filename: string;
  columns: ExportColumn[];
  data: Record<string, any>[];
  includeIndex?: boolean;
  excludeColumns?: string[];
}

export type ExportPreviewProps = {
  config: ExportConfig;
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  totalRecords: number;
  isLoading?: boolean;
}
