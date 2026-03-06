import { useQuery } from '@tanstack/react-query'
import { getLeaveRequests } from '@/api/leave'
import { getOTRequests } from '@/api/ot'
import { getExpenseClaims } from '@/api/expenses'
import { useAuth } from '@/contexts/AuthContext'

export function MyRequestsPage() {
  const { user } = useAuth()
  const { data: leaveRequests } = useQuery({
    queryKey: ['leaveRequests', user?.id],
    queryFn: () => (user ? getLeaveRequests({ userId: user.id }) : []),
    enabled: !!user,
  })
  const { data: otRequests } = useQuery({
    queryKey: ['otRequests', user?.id],
    queryFn: () => (user ? getOTRequests({ userId: user.id }) : []),
    enabled: !!user,
  })
  const { data: expenseClaims } = useQuery({
    queryKey: ['expenseClaims', user?.id],
    queryFn: () => (user ? getExpenseClaims({ userId: user.id }) : []),
    enabled: !!user,
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">My requests</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
          <h3 className="font-medium text-edmark-dark-blue mb-3">Leave</h3>
          <ul className="space-y-2 text-sm">
            {(leaveRequests ?? []).map((r) => (
              <li key={r.id}>{r.start} – {r.end} <span className="text-edmark-neutral-700">({r.status})</span></li>
            ))}
            {(!leaveRequests || leaveRequests.length === 0) && <li className="text-edmark-neutral-700">None</li>}
          </ul>
        </div>
        <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
          <h3 className="font-medium text-edmark-dark-blue mb-3">OT</h3>
          <ul className="space-y-2 text-sm">
            {(otRequests ?? []).map((r) => (
              <li key={r.id}>{r.date} – {r.hours}h <span className="text-edmark-neutral-700">({r.status})</span></li>
            ))}
            {(!otRequests || otRequests.length === 0) && <li className="text-edmark-neutral-700">None</li>}
          </ul>
        </div>
        <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
          <h3 className="font-medium text-edmark-dark-blue mb-3">Expenses</h3>
          <ul className="space-y-2 text-sm">
            {(expenseClaims ?? []).map((c) => (
              <li key={c.id}>{c.id.slice(0, 8)} <span className="text-edmark-neutral-700">({c.status})</span></li>
            ))}
            {(!expenseClaims || expenseClaims.length === 0) && <li className="text-edmark-neutral-700">None</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
