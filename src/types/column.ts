import type { ColumnGroupType, ColumnType } from 'antd/es/table'

export interface DataTableColumnBase {
  id: string
  hideable?: boolean
}

export type DataTableLeafColumn<T extends object> = ColumnType<T> &
  DataTableColumnBase & {
    children?: never
  }

export type DataTableGroupColumn<T extends object> = Omit<
  ColumnGroupType<T>,
  'children'
> &
  DataTableColumnBase & {
    children: DataTableColumn<T>[]
  }

export type DataTableColumn<T extends object> =
  DataTableLeafColumn<T> | DataTableGroupColumn<T>

export type DataTableColumns<T extends object> = DataTableColumn<T>[]
