# AGENTS.md

## Project Overview

This project is a reusable data table library built with:

- React
- TypeScript
- Ant Design (`antd`)

The main public component is `DataTable`.

The goal is to provide a thin, reusable abstraction over Ant Design Table and add functionality that Ant Design does not provide or that needs a better library-level API.

The project must remain simple and maintainable.

Do not introduce unnecessary abstractions, frameworks, registries, engines, or state-management layers.

---

# Core Architecture

The central architectural principle is:

> Use Ant Design Table whenever Ant Design already provides the required functionality. Build custom features only where they are actually needed.

`DataTable` is a wrapper around Ant Design's `Table`.

Ant Design remains responsible for native table behavior.

Our library adds missing functionality through small, isolated features.

Conceptually:

```text
DataTable
│
├── custom features
│   ├── column visibility
│   ├── column ordering
│   ├── column resizing
│   ├── row reordering
│   ├── advanced search
│   └── other custom functionality
│
└── Ant Design Table
    ├── sorting
    ├── filtering
    ├── pagination
    ├── row selection
    ├── sticky header
    ├── fixed columns
    ├── grouped columns
    ├── expandable rows
    └── other native functionality

Do not reimplement functionality that Ant Design already supports well.

Project Structure

The preferred structure is:

src/
├── components/
│   └── DataTable/
│       ├── DataTable.tsx
│       ├── DataTable.types.ts
│       ├── DataTable.module.css
│       ├── components/
│       │   ├── TableHeader/
│       │   ├── TableBody/
│       │   ├── TableCell/
│       │   ├── TableToolbar/
│       │   └── ...
│       └── index.ts
│
├── features/
│   ├── column-visibility/
│   ├── column-order/
│   ├── column-resizing/
│   ├── row-selection/
│   ├── row-reorder/
│   ├── editing/
│   ├── search/
│   └── virtualization/
│
├── hooks/
│   ├── useDataTable.ts
│   └── ...
│
├── utils/
│   ├── columns.ts
│   ├── rows.ts
│   └── ...
│
├── types/
│   ├── column.ts
│   ├── row.ts
│   └── table.ts
│
└── index.ts

Not every directory must exist from the beginning.

Create files and directories only when they are needed.

DataTable

DataTable is the main public component.

It should stay relatively thin.

It is responsible for:

accepting the public API;
composing custom features;
passing native Ant Design props to Table;
applying feature-specific transformations;
rendering custom DataTable UI such as toolbars when necessary.

Do not turn DataTable into a large monolithic implementation.

When the component starts accumulating unrelated logic, extract that logic into the corresponding feature or hook.

Example:

<DataTable
  dataSource={users}
  columns={columns}
  columnVisibility={{
    defaultHidden: ['phone'],
  }}
/>

DataTable should extend Ant Design's TableProps<T> wherever practical instead of manually reproducing the entire Ant Design API.

For example:

export interface DataTableProps<T extends object>
  extends Omit<TableProps<T>, 'columns'> {
  columns: DataTableColumns<T>;
}

This allows native Ant Design features to remain accessible.

Ant Design First

Before implementing a feature, check whether Ant Design already provides it.

Prefer:

Ant Design API

over:

custom implementation

Examples:

Feature	Implementation
Sorting	Ant Design sorter
Filtering	Ant Design filters / onFilter
Pagination	Ant Design pagination
Row selection	Ant Design rowSelection
Sticky header	Ant Design sticky
Fixed columns	Ant Design fixed
Column groups	Ant Design children
Expandable rows	Ant Design expandable API
Hidden columns	Ant Design hidden
Virtualization	Ant Design / external solution where appropriate
Column ordering	Custom
Column resizing	Custom
Row reordering	Custom
Advanced global search	Custom
Advanced editing	Custom

Do not wrap native Ant Design functionality in a custom abstraction unless there is a concrete reason.

External Libraries

External libraries are allowed when they solve a specialized problem well.

Examples:

@dnd-kit/* for drag-and-drop;
@tanstack/react-virtual for virtualization if Ant Design's capabilities are insufficient.

Do not introduce a dependency for functionality that can be implemented simply with React and Ant Design.

Do not introduce TanStack Table as the table engine.

Ant Design Table is the table engine for this project.

Column Model

Columns have a stable library-level id.

The id is our identifier for a column and must not depend exclusively on dataIndex.

Example:

{
  id: 'email',
  key: 'email',
  title: 'Email',
  dataIndex: 'email',
}

The stable id will later be used by:

column visibility;
column ordering;
column resizing;
column pinning;
persistence;
other column state.

Do not use dataIndex as the universal identifier.

Column Types

The preferred column model is:

import type {
  ColumnGroupType,
  ColumnType,
} from 'antd/es/table';

export interface DataTableColumnBase {
  id: string;
  hideable?: boolean;
}

export type DataTableLeafColumn<T> =
  ColumnType<T> &
  DataTableColumnBase & {
    children?: never;
  };

export type DataTableGroupColumn<T> =
  ColumnGroupType<T> &
  DataTableColumnBase & {
    children: DataTableColumn<T>[];
  };

export type DataTableColumn<T> =
  | DataTableLeafColumn<T>
  | DataTableGroupColumn<T>;

export type DataTableColumns<T> =
  DataTableColumn<T>[];

Keep this type model simple.

Do not build a separate internal column engine.

Nested / Grouped Columns

Ant Design supports grouped columns using children.

Example:

const columns = [
  {
    id: 'user',
    title: 'User',
    children: [
      {
        id: 'name',
        title: 'Name',
        dataIndex: 'name',
      },
      {
        id: 'email',
        title: 'Email',
        dataIndex: 'email',
      },
    ],
  },
];

Custom features that operate on columns must account for nested columns.

Do not assume all columns are flat.

When a feature only applies to actual data columns, operate on leaf columns.

Group columns should generally preserve their structure.

Features

Each custom feature lives in its own directory:

features/
└── feature-name/
    ├── useFeature.ts
    ├── FeatureComponent.tsx
    ├── feature.types.ts
    ├── feature.utils.ts
    └── index.ts

Not every feature needs all of these files.

Use only what is necessary.

A feature should own:

its state;
its feature-specific types;
its utilities;
its UI, if needed;
its public API.

Avoid coupling one feature to another unless there is a real dependency.

Feature Hooks

Feature hooks should expose a small and explicit API.

Example:

const visibility = useColumnVisibility({
  columns,
  config,
});

The hook may return:

{
  hiddenColumns,
  isVisible,
  setVisible,
  toggle,
  showAll,
  hideAll,
  reset,
}

Do not expose internal implementation details.

Controlled and Uncontrolled State

Custom stateful features should support both controlled and uncontrolled usage when it makes sense.

Example:

Uncontrolled
<DataTable
  columnVisibility={{
    defaultHidden: ['email'],
  }}
/>
Controlled
<DataTable
  columnVisibility={{
    hidden: hiddenColumns,
    onChange: setHiddenColumns,
  }}
/>

Semantics:

defaultX initializes internal state;
x is controlled state;
onChange reports changes.

Do not continuously synchronize defaultX after initialization.

Column Visibility

The first custom feature is columnVisibility.

Its public API is:

export interface ColumnVisibilityConfig {
  defaultHidden?: string[];
  hidden?: string[];
  onChange?: (hiddenColumns: string[]) => void;
}

Usage:

<DataTable
  columns={columns}
  columnVisibility={{
    defaultHidden: ['email'],
  }}
/>

Controlled:

<DataTable
  columns={columns}
  columnVisibility={{
    hidden: hiddenColumns,
    onChange: setHiddenColumns,
  }}
/>

The presence of columnVisibility enables the feature.

Do not require a redundant enabled: true property.

Column Visibility Semantics

A column is hideable by default.

Use:

hideable: false

to make a column permanently visible.

Example:

{
  id: 'id',
  title: 'ID',
  dataIndex: 'id',
  hideable: false,
}

Non-hideable columns should not appear in the visibility menu.

They must also not be hideable through the programmatic feature API.

Last Visible Column

Do not allow the user to hide every hideable column.

At least one hideable column must remain visible.

A permanently visible column (hideable: false) also satisfies this condition.

This prevents the table from entering an unusable state with zero visible columns.

Ant Design hidden

For column visibility, use Ant Design's native hidden column property.

Do not manually remove columns from the array unless there is a concrete reason to do so.

Conceptually:

hiddenColumns
      ↓
map columns
      ↓
column.hidden
      ↓
Ant Design Table

This keeps visibility integrated with Ant Design's native column model.

Grouped Columns and Visibility

Visibility is currently controlled at the leaf-column level.

Example:

User
├── Name
└── Email

The visibility menu should expose:

Name
Email

not the User group itself.

If all children of a group are hidden, the group naturally becomes empty according to the resulting Ant Design column configuration.

Do not add group-level tri-state visibility unless explicitly requested.

Avoid unnecessary complexity.

Column Visibility UI

The default visibility UI should be an Ant Design Dropdown.

The menu should provide:

search;
list of hideable columns;
checkbox per column;
Show all;
Hide all;
Reset.

Example conceptual UI:

┌──────────────────────────────┐
│ Search columns...            │
├──────────────────────────────┤
│ Show all   Hide all   Reset  │
├──────────────────────────────┤
│ ☑ Name                       │
│ ☑ Email                      │
│ ☐ Phone                      │
│ ☑ Company                    │
└──────────────────────────────┘

Use Ant Design components for the UI:

Dropdown
Button
Checkbox
Input
Space
Divider
etc.

Do not create a custom dropdown implementation.

Column Visibility API

The hook should expose:

interface UseColumnVisibilityResult {
  hiddenColumns: string[];

  isVisible: (columnId: string) => boolean;

  setVisible: (
    columnId: string,
    visible: boolean,
  ) => void;

  toggle: (columnId: string) => void;

  showAll: () => void;

  hideAll: () => void;

  reset: () => void;
}

The feature should normalize unknown column IDs.

Invalid IDs supplied through hidden or defaultHidden should not break the table.

Duplicate IDs in hidden state should be removed.

reset Semantics

reset() restores the initial visibility configuration.

For example:

columnVisibility={{
  defaultHidden: ['email'],
}}

If the user later hides phone and company, then:

reset();

must result in:

email  → hidden
phone  → visible
company → visible

reset is not equivalent to showAll.

showAll and hideAll

showAll() makes all hideable columns visible.

hideAll() hides all hideable columns except the one necessary to keep the table usable.

Non-hideable columns remain visible.

Public API

The package root should re-export public functionality.

Example:

export * from './components/DataTable';
export * from './types/column';
export * from './features/column-visibility';

Avoid exporting internal implementation details unless they are intentionally part of the public API.

React Guidelines

Use standard React patterns.

Prefer:

useState
useMemo
useCallback

where they provide a real benefit.

Do not add memoization everywhere without a reason.

Do not introduce a global state manager.

Feature state should remain local unless the feature is explicitly controlled by the consumer.

TypeScript Guidelines

Use strict TypeScript.

Prefer explicit domain types over any.

Do not use:

any

to bypass type problems.

If Ant Design types are awkward, solve the typing problem locally rather than weakening the entire type system.

Keep generic types flowing through:

DataTable<T>
DataTableColumn<T>
DataTableColumns<T>
Component Design

Components should have one clear responsibility.

Good:

DataTable
ColumnVisibilityMenu
TableToolbar
TableCell

Avoid components such as:

UniversalTableEngine
TableFeatureManager
TableStateController
TableOrchestrator

unless a real problem emerges that requires them.

Do not create abstractions speculatively.

State Ownership

Prefer this hierarchy:

DataTable
    │
    ├── AntD state / behavior
    │
    └── feature hooks
          ├── useColumnVisibility
          ├── useColumnOrder
          ├── useColumnResize
          └── ...

Each feature owns its own state.

Do not create one giant table state object containing every feature unless future requirements prove it necessary.

Styling

Use Ant Design components and tokens where possible.

Avoid introducing a large custom design system.

Custom CSS should only handle styling that Ant Design does not reasonably provide.

If component-specific CSS is required, keep it close to the component:

DataTable/
├── DataTable.tsx
├── DataTable.module.css
Performance

Do not optimize prematurely.

First make the API correct and maintainable.

Use memoization when:

an expensive transformation is repeated;
stable references are important;
a component is demonstrably re-rendering unnecessarily.

For large-data virtualization, prefer a specialized virtualization library rather than implementing virtualization from scratch.

Testing

Custom features should have tests.

For columnVisibility, test at least:

default hidden columns;
controlled state;
uncontrolled state;
onChange;
toggling;
showAll;
hideAll;
reset;
hideable: false;
invalid column IDs;
duplicate hidden IDs;
nested/grouped columns;
last visible column protection.

Tests should focus primarily on feature behavior rather than implementation details.

Development Order

Features should generally be implemented in this order:

column visibility
column ordering
column resizing
row reordering
search
editing
virtualization
additional features as required

This order is not absolute, but column identity should remain stable before implementing features that depend on it.

Future Features

Potential custom features include:

column visibility
column ordering
column resizing
row ordering
global search
advanced filtering
editing
row drag-and-drop
column drag-and-drop
column persistence
table presets
virtualization

Before implementing any feature:

Check whether Ant Design already supports it.
If yes, use Ant Design.
If not, isolate it under features/<feature-name>.
Keep its public API small.
Support controlled/uncontrolled state where appropriate.
Avoid introducing global infrastructure unless necessary.
Important Architectural Rules
Rule 1

Ant Design Table is the underlying table implementation.

Do not replace it with TanStack Table.

Rule 2

Do not build a custom table engine.

Rule 3

Do not create a feature registry.

Rule 4

Do not create a plugin architecture.

Rule 5

Do not create a generic abstraction for every possible feature.

Rule 6

Prefer small feature hooks and components.

Rule 7

Use stable column IDs.

Rule 8

Respect nested Ant Design columns.

Rule 9

Use Ant Design functionality whenever available.

Rule 10

Keep DataTable thin.

Rule 11

Do not solve hypothetical future problems before they exist.

Rule 12

When requirements are ambiguous, prefer the simplest behavior consistent with the existing architecture.

Code Quality Expectations

Before considering a feature complete:

TypeScript must compile without errors.
No unnecessary any.
Public types must be exported intentionally.
Existing Ant Design behavior must continue to work.
Custom feature state must be predictable.
Controlled and uncontrolled behavior must be consistent.
Nested columns must be considered where applicable.
The implementation should remain easy to understand for another developer.

When adding a feature, prefer a small number of understandable files over a highly abstract architecture.
```
