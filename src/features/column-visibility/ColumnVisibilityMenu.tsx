import { useMemo, useState } from 'react'
import { Button, Checkbox, Divider, Dropdown, Input, Space } from 'antd'
import type { DataTableColumns } from '@/types/column'
import type { UseColumnVisibilityResult } from './useColumnVisibility'
import {
  getColumnLabel,
  getHideableLeafColumns,
} from './columnVisibility.utils'

interface ColumnVisibilityMenuProps<T extends object> {
  columns: DataTableColumns<T>
  visibility: UseColumnVisibilityResult
}

export function ColumnVisibilityMenu<T extends object>({
  columns,
  visibility,
}: ColumnVisibilityMenuProps<T>) {
  const [search, setSearch] = useState('')
  const leafColumns = useMemo(() => getHideableLeafColumns(columns), [columns])
  const filteredColumns = leafColumns.filter((column) =>
    getColumnLabel(column).toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <Dropdown
      trigger={['click']}
      popupRender={() => (
        <div
          style={{
            background: 'var(--ant-color-bg-elevated, #fff)',
            borderRadius: 8,
            boxShadow: '0 3px 6px -4px #0002, 0 6px 16px #0001',
            minWidth: 240,
            padding: 12,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Input
            allowClear
            aria-label="Search columns"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search columns"
            value={search}
          />
          <Space style={{ marginTop: 12 }} size="small">
            <Button onClick={visibility.showAll} size="small" type="link">
              Show all
            </Button>
            <Button onClick={visibility.hideAll} size="small" type="link">
              Hide all
            </Button>
            <Button onClick={visibility.reset} size="small" type="link">
              Reset
            </Button>
          </Space>
          <Divider style={{ margin: '8px 0' }} />
          <Space orientation="vertical" size="small">
            {filteredColumns.map((column) => (
              <Checkbox
                checked={visibility.isVisible(column.id)}
                key={column.id}
                onChange={(event) =>
                  visibility.setVisible(column.id, event.target.checked)
                }
              >
                {getColumnLabel(column)}
              </Checkbox>
            ))}
          </Space>
        </div>
      )}
    >
      <Button>Columns</Button>
    </Dropdown>
  )
}
