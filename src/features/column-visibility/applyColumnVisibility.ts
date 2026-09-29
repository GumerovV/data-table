import type { DataTableColumns } from '@/types/column'

export function applyColumnVisibility<T extends object>(
  columns: DataTableColumns<T>,
  hiddenColumns: string[],
): DataTableColumns<T> {
  const hiddenIds = new Set(hiddenColumns)

  return columns.map((column) => {
    if ('children' in column && column.children) {
      return {
        ...column,
        children: applyColumnVisibility(column.children, hiddenColumns),
      }
    }

    return {
      ...column,
      hidden: column.hideable === false ? false : hiddenIds.has(column.id),
    }
  })
}
