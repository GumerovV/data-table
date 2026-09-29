export interface ColumnVisibilityConfig {
  defaultHidden?: string[]
  hidden?: string[]
  onChange?: (hiddenColumns: string[]) => void
}
