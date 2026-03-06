import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/api/firestore'

export function EmployeeListPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  })

  if (isLoading) return <div className="text-edmark-neutral-700">Loading employees...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Employees</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {(users ?? []).map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 text-sm text-edmark-dark-blue">{u.displayName}</td>
                <td className="px-4 py-3 text-sm text-edmark-neutral-700">{u.email}</td>
                <td className="px-4 py-3 text-sm text-edmark-neutral-700">{u.role}</td>
                <td className="px-4 py-3 text-sm text-edmark-neutral-700">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">No employees yet.</div>
        )}
      </div>
    </div>
  )
}
