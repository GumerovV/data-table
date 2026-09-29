import { Space, Table } from 'antd'
import {
  ColumnVisibilityMenu,
  applyColumnVisibility,
  useColumnVisibility,
} from '@/features/column-visibility'
import type { DataTableProps } from './DataTable.types'

export function DataTable<T extends object>({
  columns,
  columnVisibility,
  ...tableProps
}: DataTableProps<T>) {
  const visibility = useColumnVisibility(columns, columnVisibility ?? {})
  const visibleColumns = columnVisibility
    ? applyColumnVisibility(columns, visibility.hiddenColumns)
    : columns

  return (
    <>
      {columnVisibility && (
        <Space
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 12,
          }}
        >
          <ColumnVisibilityMenu columns={columns} visibility={visibility} />
        </Space>
      )}
      <Table<T> {...tableProps} columns={visibleColumns} />
    </>
  )
}
