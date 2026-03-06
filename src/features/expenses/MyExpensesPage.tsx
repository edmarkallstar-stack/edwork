import { useQuery } from '@tanstack/react-query'
import { getExpenseClaims } from '@/api/expenses'
import { useAuth } from '@/contexts/AuthContext'

export function MyExpensesPage() {
  const { user } = useAuth()
  const { data: claims } = useQuery({
    queryKey: ['expenseClaims', user?.id],
    queryFn: () => (user ? getExpenseClaims({ userId: user.id }) : []),
    enabled: !!user,
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">My expenses</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Claim</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {(claims ?? []).map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-sm">{c.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-sm">{c.status}</td>
                <td className="px-4 py-3 text-sm">{c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!claims || claims.length === 0) && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">No expense claims yet.</div>
        )}
      </div>
    </div>
  )
}
