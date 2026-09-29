import type { DataTableColumn, DataTableColumns } from '@/types/column'

export function getHideableLeafColumns<T extends object>(
  columns: DataTableColumns<T>,
): DataTableColumn<T>[] {
  return columns.flatMap((column) => {
    if ('children' in column && column.children) {
      return getHideableLeafColumns(column.children)
    }

    return column.hideable === false ? [] : [column]
  })
}

export function normalizeHiddenColumns<T extends object>(
  hiddenColumns: string[] | undefined,
  columns: DataTableColumns<T>,
): string[] {
  const hideableIds = getHideableLeafColumns(columns).map(({ id }) => id)
  const allowedIds = new Set(hideableIds)
  const seen = new Set<string>()
  const normalized = (hiddenColumns ?? []).filter((id) => {
    if (!allowedIds.has(id) || seen.has(id)) return false
    seen.add(id)
    return true
  })

  if (hideableIds.length > 0 && normalized.length === hideableIds.length) {
    return normalized.filter((id) => id !== hideableIds[0])
  }

  return normalized
}

export function getColumnLabel<T extends object>(column: DataTableColumn<T>) {
  const title = column.title
  if (title == null || typeof title === 'function') return column.id
  return typeof title === 'string' || typeof title === 'number'
    ? String(title)
    : column.id
}
