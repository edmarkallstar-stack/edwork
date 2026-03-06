import { useQuery } from '@tanstack/react-query'
import { getLeaveRequests } from '@/api/leave'
import { getOTRequests } from '@/api/ot'

export function ApprovalsQueuePage() {
  const { data: leavePending } = useQuery({
    queryKey: ['leaveRequests', 'pending'],
    queryFn: () => getLeaveRequests({ status: 'pending' }),
  })
  const { data: otPending } = useQuery({
    queryKey: ['otRequests', 'pending'],
    queryFn: () => getOTRequests({ status: 'pending' }),
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Pending approvals</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
          <h3 className="font-medium text-edmark-dark-blue mb-3">Leave requests</h3>
          <ul className="space-y-2">
            {(leavePending ?? []).map((r) => (
              <li key={r.id} className="text-sm">
                {r.start} – {r.end} ({r.days} days)
              </li>
            ))}
            {(!leavePending || leavePending.length === 0) && <li className="text-sm text-edmark-neutral-700">None.</li>}
          </ul>
        </div>
        <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
          <h3 className="font-medium text-edmark-dark-blue mb-3">OT requests</h3>
          <ul className="space-y-2">
            {(otPending ?? []).map((r) => (
              <li key={r.id} className="text-sm">
                {r.date} – {r.hours}h
              </li>
            ))}
            {(!otPending || otPending.length === 0) && <li className="text-sm text-edmark-neutral-700">None.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
