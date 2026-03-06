import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLeaveTypes, getLeaveBalances, getLeaveRequests, createLeaveRequest } from '@/api/leave'
import { useAuth } from '@/contexts/AuthContext'

export function LeaveRequestPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [leaveTypeId, setLeaveTypeId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [comments, setComments] = useState('')

  const year = new Date().getFullYear()
  const { data: leaveTypes } = useQuery({
    queryKey: ['leaveTypes', user?.countryId],
    queryFn: () => getLeaveTypes(user?.countryId ?? undefined),
    enabled: !!user,
  })
  const { data: balances } = useQuery({
    queryKey: ['leaveBalances', user?.id, year],
    queryFn: () => (user ? getLeaveBalances(user.id, year) : []),
    enabled: !!user,
  })
  const { data: requests } = useQuery({
    queryKey: ['leaveRequests', user?.id],
    queryFn: () => (user ? getLeaveRequests({ userId: user.id }) : []),
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: () =>
      user
        ? createLeaveRequest({
            userId: user.id,
            leaveTypeId,
            start,
            end,
            days: Math.max(0, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1),
            status: 'pending',
            comments,
          })
        : Promise.reject(new Error('Not logged in')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] })
      setStart('')
      setEnd('')
      setComments('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate()
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Leave</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="bg-white border border-edmark-neutral-200 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-edmark-dark-blue">Request leave</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Leave type</label>
            <select
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
            >
              <option value="">Select</option>
              {(leaveTypes ?? []).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
              rows={2}
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-edmark-red text-white rounded-md hover:bg-edmark-red/90 disabled:opacity-50"
          >
            Submit request
          </button>
        </form>
        <div className="space-y-4">
          <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
            <h3 className="font-medium text-edmark-dark-blue mb-3">Leave balance ({year})</h3>
            <ul className="space-y-2">
              {(balances ?? []).map((b) => (
                <li key={b.id} className="text-sm text-edmark-neutral-700">
                  {leaveTypes?.find((t) => t.id === b.leaveTypeId)?.name ?? b.leaveTypeId}: {b.accrued - b.used} days
                </li>
              ))}
              {(!balances || balances.length === 0) && <li className="text-sm text-edmark-neutral-700">No balance data.</li>}
            </ul>
          </div>
          <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
            <h3 className="font-medium text-edmark-dark-blue mb-3">My leave requests</h3>
            <ul className="space-y-2">
              {(requests ?? []).map((r) => (
                <li key={r.id} className="text-sm">
                  {r.start} – {r.end} <span className="text-edmark-neutral-700">({r.status})</span>
                </li>
              ))}
              {(!requests || requests.length === 0) && <li className="text-sm text-edmark-neutral-700">No requests.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
