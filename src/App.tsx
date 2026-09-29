import { DataTable } from '@/components/DataTable'
import type { DataTableColumns } from '@/types/column'

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  office: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Avery Johnson',
    email: 'avery.johnson@example.com',
    role: 'Product designer',
    office: 'New York',
  },
  {
    id: 2,
    name: 'Morgan Lee',
    email: 'morgan.lee@example.com',
    role: 'Frontend engineer',
    office: 'Seattle',
  },
  {
    id: 3,
    name: 'Jordan Patel',
    email: 'jordan.patel@example.com',
    role: 'Product manager',
    office: 'Austin',
  },
  {
    id: 4,
    name: 'Taylor Kim',
    email: 'taylor.kim@example.com',
    role: 'Data analyst',
    office: 'Chicago',
  },
]

const columns: DataTableColumns<TeamMember> = [
  {
    id: 'identity',
    title: 'Team member',
    children: [
      { id: 'name', title: 'Name', dataIndex: 'name' },
      { id: 'email', title: 'Email', dataIndex: 'email' },
    ],
  },
  { id: 'role', title: 'Role', dataIndex: 'role' },
  { id: 'office', title: 'Office', dataIndex: 'office' },
  {
    id: 'id',
    title: 'ID',
    dataIndex: 'id',
    hideable: false,
    width: 80,
  },
]

export function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">DataTable example</p>
        <h1>Team directory</h1>
        <p className="app-description">
          Choose which columns to display. Email starts hidden, and ID is always
          visible.
        </p>
      </header>

      <DataTable
        columns={columns}
        dataSource={teamMembers}
        rowKey="id"
        columnVisibility={{ defaultHidden: ['email'] }}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        bordered
      />
    </main>
  )
}
