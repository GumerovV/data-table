import {
  AppstoreOutlined,
  FilterOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Drawer, Empty, Table } from 'antd'
import { useState } from 'react'
import {
  ColumnVisibilityPanel,
  applyColumnVisibility,
  useColumnVisibility,
} from '@/features/column-visibility'
import type { DataTableProps } from './DataTable.types'
import styles from './DataTable.module.scss'

const settingsTabs = [
  { id: 'columns', label: 'Столбцы', icon: <AppstoreOutlined /> },
  { id: 'filters', label: 'Фильтры', icon: <FilterOutlined /> },
  { id: 'settings', label: 'Настройки', icon: <SettingOutlined /> },
  { id: 'help', label: 'Помощь', icon: <QuestionCircleOutlined /> },
] as const

type SettingsTab = (typeof settingsTabs)[number]['id']

export function DataTable<T extends object>({
  columns,
  columnVisibility,
  ...tableProps
}: DataTableProps<T>) {
  const [activeTab, setActiveTab] = useState<SettingsTab | null>(null)
  const visibility = useColumnVisibility(columns, columnVisibility ?? {})
  const visibleColumns = columnVisibility
    ? applyColumnVisibility(columns, visibility.hiddenColumns)
    : columns

  const currentTab = settingsTabs.find(({ id }) => id === activeTab)

  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <Table<T> {...tableProps} columns={visibleColumns} />
      </div>

      <nav className={styles.settingsRail} aria-label="Настройки таблицы">
        {settingsTabs.map(({ id, label, icon }) => (
          <button
            aria-expanded={activeTab === id}
            aria-label={label}
            className={`${styles.settingsTab} ${activeTab === id ? styles.active : ''}`}
            key={id}
            onClick={() => setActiveTab(activeTab === id ? null : id)}
            type="button"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <Drawer
        getContainer={false}
        onClose={() => setActiveTab(null)}
        open={activeTab !== null}
        size={320}
        styles={{
          mask: { right: 44 },
          wrapper: { right: 44, maxWidth: 'calc(100% - 44px)' },
        }}
        title={
          currentTab && (
            <span>
              {currentTab.icon} {currentTab.label}
            </span>
          )
        }
      >
        {activeTab === 'columns' && columnVisibility ? (
          <ColumnVisibilityPanel columns={columns} visibility={visibility} />
        ) : (
          <Empty
            description="Этот раздел пока пуст"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Drawer>
    </div>
  )
}
