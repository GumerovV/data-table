import type { TableProps } from 'antd'
import type { ColumnVisibilityConfig } from '@/features/column-visibility'
import type { DataTableColumns } from '@/types/column'

export interface DataTableProps<T extends object> extends Omit<
  TableProps<T>,
  'columns'
> {
  columns: DataTableColumns<T>
  columnVisibility?: ColumnVisibilityConfig
}
