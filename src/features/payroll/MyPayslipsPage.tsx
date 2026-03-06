import { useQuery } from '@tanstack/react-query'
import { getPayslipsByUser } from '@/api/payroll'
import { useAuth } from '@/contexts/AuthContext'

export function MyPayslipsPage() {
  const { user } = useAuth()
  const { data: payslips } = useQuery({
    queryKey: ['payslips', user?.id],
    queryFn: () => (user ? getPayslipsByUser(user.id) : []),
    enabled: !!user,
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">My payslips</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Period</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {(payslips ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm">{p.payrollRunId?.slice(0, 8) ?? '-'}</td>
                <td className="px-4 py-3 text-sm">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!payslips || payslips.length === 0) && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">No payslips yet.</div>
        )}
      </div>
    </div>
  )
}
