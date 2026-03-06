import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTimesheetByUserAndDate, checkIn, checkOut } from '@/api/attendance'
import { getTimesheets } from '@/api/attendance'
import { useAuth } from '@/contexts/AuthContext'

export function MyTimesheetPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [date] = useState(() => new Date().toISOString().slice(0, 10))

  const { data: today } = useQuery({
    queryKey: ['timesheet', user?.id, date],
    queryFn: () => (user ? getTimesheetByUserAndDate(user.id, date) : null),
    enabled: !!user,
  })

  const checkInMutation = useMutation({
    mutationFn: () =>
      user && user.branchId
        ? checkIn(user.id, user.branchId, Intl.DateTimeFormat().resolvedOptions().timeZone)
        : Promise.reject(new Error('No branch')),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timesheet'] }),
  })

  const checkOutMutation = useMutation({
    mutationFn: (timesheetId: string) => checkOut(timesheetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timesheet'] }),
  })

  if (!user) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">My timesheet</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6 max-w-md">
        <p className="text-sm text-edmark-neutral-700 mb-4">Today: {date}</p>
        {!today ? (
          <button
            type="button"
            onClick={() => checkInMutation.mutate()}
            disabled={checkInMutation.isPending}
            className="px-4 py-2 bg-edmark-green text-white rounded-md hover:bg-edmark-green/90 disabled:opacity-50"
          >
            Check in
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">Checked in: {today.checkIn ? new Date(today.checkIn).toLocaleTimeString() : '-'}</p>
            {!today.checkOut ? (
              <button
                type="button"
                onClick={() => checkOutMutation.mutate(today.id)}
                disabled={checkOutMutation.isPending}
                className="px-4 py-2 bg-edmark-red text-white rounded-md hover:bg-edmark-red/90 disabled:opacity-50"
              >
                Check out
              </button>
            ) : (
              <p className="text-sm text-edmark-green">Checked out: {new Date(today.checkOut).toLocaleTimeString()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function TimesheetHistoryPage() {
  const { user } = useAuth()
  const [dateFrom] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 14)
    return d.toISOString().slice(0, 10)
  })
  const [dateTo] = useState(() => new Date().toISOString().slice(0, 10))

  const { data: entries } = useQuery({
    queryKey: ['timesheets', user?.id, dateFrom, dateTo],
    queryFn: () => (user ? getTimesheets({ userId: user.id, dateFrom, dateTo }) : []),
    enabled: !!user,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Timesheet history</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Check in</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Check out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {(entries ?? []).map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3 text-sm">{e.date}</td>
                <td className="px-4 py-3 text-sm">{e.checkIn ? new Date(e.checkIn).toLocaleTimeString() : '-'}</td>
                <td className="px-4 py-3 text-sm">{e.checkOut ? new Date(e.checkOut).toLocaleTimeString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!entries || entries.length === 0) && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">No entries in this period.</div>
        )}
      </div>
    </div>
  )
}
