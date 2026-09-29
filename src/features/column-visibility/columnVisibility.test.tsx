import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { DataTableColumns } from '@/types/column'
import { applyColumnVisibility } from './applyColumnVisibility'
import { useColumnVisibility } from './useColumnVisibility'

interface Person {
  name: string
  email: string
  role: string
  id: string
}

const columns: DataTableColumns<Person> = [
  {
    id: 'identity',
    title: 'Identity',
    children: [
      { id: 'name', title: 'Name', dataIndex: 'name' },
      { id: 'email', title: 'Email', dataIndex: 'email' },
    ],
  },
  { id: 'role', title: 'Role', dataIndex: 'role' },
  { id: 'id', title: 'ID', dataIndex: 'id', hideable: false },
]

describe('useColumnVisibility', () => {
  it('initializes from defaultHidden and reset restores those defaults', () => {
    const { result } = renderHook(() =>
      useColumnVisibility(columns, { defaultHidden: ['email'] }),
    )

    expect(result.current.hiddenColumns).toEqual(['email'])
    act(() => result.current.toggle('role'))
    expect(result.current.hiddenColumns).toEqual(['email', 'role'])
    act(() => result.current.reset())
    expect(result.current.hiddenColumns).toEqual(['email'])
  })

  it('supports uncontrolled changes, toggle, showAll, and hideAll', () => {
    const { result } = renderHook(() => useColumnVisibility(columns, {}))

    act(() => result.current.toggle('email'))
    expect(result.current.isVisible('email')).toBe(false)
    act(() => result.current.showAll())
    expect(result.current.hiddenColumns).toEqual([])
    act(() => result.current.hideAll())
    expect(result.current.hiddenColumns).toEqual(['email', 'role'])
  })

  it('reports changes in controlled mode without mutating controlled state', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ hidden }: { hidden: string[] }) =>
        useColumnVisibility(columns, { hidden, onChange }),
      { initialProps: { hidden: [] as string[] } },
    )

    act(() => result.current.setVisible('email', false))
    expect(onChange).toHaveBeenCalledWith(['email'])
    expect(result.current.hiddenColumns).toEqual([])
    rerender({ hidden: ['email'] })
    expect(result.current.hiddenColumns).toEqual(['email'])
  })

  it('normalizes invalid and duplicate ids and ignores non-hideable columns', () => {
    const { result } = renderHook(() =>
      useColumnVisibility(columns, {
        defaultHidden: ['email', 'email', 'missing', 'id'],
      }),
    )

    expect(result.current.hiddenColumns).toEqual(['email'])
    act(() => result.current.setVisible('id', false))
    expect(result.current.hiddenColumns).toEqual(['email'])
  })

  it('does not allow hiding the last visible hideable column', () => {
    const { result } = renderHook(() =>
      useColumnVisibility(columns, { defaultHidden: ['email', 'role'] }),
    )

    expect(result.current.hiddenColumns).toEqual(['email', 'role'])
    act(() => result.current.setVisible('name', false))
    expect(result.current.hiddenColumns).toEqual(['email', 'role'])
  })
})

describe('applyColumnVisibility', () => {
  it('sets hidden on nested leaf columns and preserves groups/non-hideable columns', () => {
    const result = applyColumnVisibility(columns, ['email', 'id'])
    const group = result[0]
    if (!group || !('children' in group))
      throw new Error('Expected grouped column')

    expect(group.children?.[1]).toMatchObject({
      id: 'email',
      hidden: true,
    })
    expect(group.children?.[0]).toMatchObject({
      id: 'name',
      hidden: false,
    })
    expect(result[0]).not.toHaveProperty('hidden')
    expect(result[2]).toHaveProperty('hidden', false)
  })
})
