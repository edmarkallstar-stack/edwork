import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOTRequests, createOTRequest } from '@/api/ot'
import { useAuth } from '@/contexts/AuthContext'

export function OTRequestPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [date, setDate] = useState('')
  const [hours, setHours] = useState(1)
  const [reason, setReason] = useState('')

  const { data: requests } = useQuery({
    queryKey: ['otRequests', user?.id],
    queryFn: () => (user ? getOTRequests({ userId: user.id }) : []),
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: () =>
      user ? createOTRequest({ userId: user.id, date, hours, reason, status: 'pending' }) : Promise.reject(new Error('Not logged in')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otRequests'] })
      setDate('')
      setHours(1)
      setReason('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate()
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">OT requests</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="bg-white border border-edmark-neutral-200 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-edmark-dark-blue">Submit OT request</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hours</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
              rows={2}
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-edmark-dark-blue text-white rounded-md hover:bg-edmark-orange disabled:opacity-50 transition-colors"
          >
            Submit
          </button>
        </form>
        <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
          <h3 className="font-medium text-edmark-dark-blue mb-3">My OT requests</h3>
          <ul className="space-y-2">
            {(requests ?? []).map((r) => (
              <li key={r.id} className="text-sm">
                {r.date} – {r.hours}h <span className="text-edmark-neutral-700">({r.status})</span>
              </li>
            ))}
            {(!requests || requests.length === 0) && <li className="text-sm text-edmark-neutral-700">No requests.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
