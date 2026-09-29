import { useMemo, useState } from 'react'
import { Button, Divider, Input, Switch } from 'antd'
import type { DataTableColumns } from '@/types/column'
import type { UseColumnVisibilityResult } from './useColumnVisibility'
import {
  getColumnLabel,
  getHideableLeafColumns,
} from './columnVisibility.utils'

interface ColumnVisibilityPanelProps<T extends object> {
  columns: DataTableColumns<T>
  visibility: UseColumnVisibilityResult
}

export function ColumnVisibilityPanel<T extends object>({
  columns,
  visibility,
}: ColumnVisibilityPanelProps<T>) {
  const [search, setSearch] = useState('')
  const leafColumns = useMemo(() => getHideableLeafColumns(columns), [columns])
  const filteredColumns = leafColumns.filter((column) =>
    getColumnLabel(column).toLowerCase().includes(search.trim().toLowerCase()),
  )
  const allVisible = visibility.hiddenColumns.length === 0

  return (
    <div className="column-visibility-panel">
      <Input
        allowClear
        aria-label="Поиск столбцов"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Поиск..."
        value={search}
      />

      <div className="column-visibility-actions">
        <Button onClick={visibility.showAll} size="small" type="link">
          Показать все
        </Button>
        <Button onClick={visibility.hideAll} size="small" type="link">
          Скрыть все
        </Button>
        <Button onClick={visibility.reset} size="small" type="link">
          Сбросить
        </Button>
      </div>

      <Divider />

      <div className="column-visibility-list">
        <div className="column-visibility-row column-visibility-all">
          <span>Все столбцы</span>
          <Switch
            checked={allVisible}
            onChange={(checked) =>
              checked ? visibility.showAll() : visibility.hideAll()
            }
            size="small"
          />
        </div>
        {filteredColumns.map((column) => (
          <div className="column-visibility-row" key={column.id}>
            <span title={getColumnLabel(column)}>{getColumnLabel(column)}</span>
            <Switch
              checked={visibility.isVisible(column.id)}
              onChange={(checked) => visibility.setVisible(column.id, checked)}
              size="small"
            />
          </div>
        ))}
        {filteredColumns.length === 0 && search && (
          <span className="column-visibility-empty">Столбцы не найдены</span>
        )}
      </div>
    </div>
  )
}
