import { useCallback, useMemo, useState } from 'react'
import type { DataTableColumns } from '@/types/column'
import type { ColumnVisibilityConfig } from './columnVisibility.types'
import {
  getHideableLeafColumns,
  normalizeHiddenColumns,
} from './columnVisibility.utils'

export interface UseColumnVisibilityResult {
  hiddenColumns: string[]
  isVisible: (columnId: string) => boolean
  setVisible: (columnId: string, visible: boolean) => void
  toggle: (columnId: string) => void
  showAll: () => void
  hideAll: () => void
  reset: () => void
}

export function useColumnVisibility<T extends object>(
  columns: DataTableColumns<T>,
  config: ColumnVisibilityConfig,
): UseColumnVisibilityResult {
  const [defaultHidden] = useState(() => config.defaultHidden ?? [])
  const [uncontrolledHidden, setUncontrolledHidden] = useState(() =>
    normalizeHiddenColumns(config.defaultHidden, columns),
  )
  const hideableColumns = useMemo(
    () => getHideableLeafColumns(columns),
    [columns],
  )
  const controlled = config.hidden !== undefined
  const hiddenColumns = useMemo(
    () =>
      normalizeHiddenColumns(
        controlled ? config.hidden : uncontrolledHidden,
        columns,
      ),
    [columns, config.hidden, controlled, uncontrolledHidden],
  )
  const hideableIds = useMemo(
    () => new Set(hideableColumns.map(({ id }) => id)),
    [hideableColumns],
  )

  const commit = useCallback(
    (nextHidden: string[]) => {
      const normalized = normalizeHiddenColumns(nextHidden, columns)
      if (!controlled) setUncontrolledHidden(normalized)
      config.onChange?.(normalized)
    },
    [columns, config, controlled],
  )

  const isVisible = useCallback(
    (columnId: string) => !hiddenColumns.includes(columnId),
    [hiddenColumns],
  )

  const setVisible = useCallback(
    (columnId: string, visible: boolean) => {
      if (!hideableIds.has(columnId)) return
      const current = new Set(hiddenColumns)

      if (visible) current.delete(columnId)
      else {
        if (hiddenColumns.length >= hideableIds.size - 1) return
        current.add(columnId)
      }

      commit([...current])
    },
    [commit, hiddenColumns, hideableIds],
  )

  const toggle = useCallback(
    (columnId: string) => setVisible(columnId, !isVisible(columnId)),
    [isVisible, setVisible],
  )

  const showAll = useCallback(() => commit([]), [commit])

  const hideAll = useCallback(() => {
    const [, ...rest] = hideableColumns
    commit(rest.map(({ id }) => id))
  }, [commit, hideableColumns])

  const reset = useCallback(
    () => commit(normalizeHiddenColumns(defaultHidden, columns)),
    [columns, commit, defaultHidden],
  )

  return {
    hiddenColumns,
    isVisible,
    setVisible,
    toggle,
    showAll,
    hideAll,
    reset,
  }
}
