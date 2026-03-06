import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getJobPostings } from '@/api/recruitment'

export function JobPostingsPage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobPostings'],
    queryFn: () => getJobPostings(),
  })

  if (isLoading) return <div className="text-edmark-neutral-700">Loading job postings...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-edmark-dark-blue">Job postings</h2>
        <Link
          to="/admin/recruitment/jobs/new"
          className="px-4 py-2 bg-edmark-dark-blue text-white text-sm font-medium rounded-md hover:bg-edmark-orange transition-colors"
        >
          New job
        </Link>
      </div>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Department</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {(jobs ?? []).map((j) => (
              <tr key={j.id}>
                <td className="px-4 py-3 text-sm">
                  <Link to={`/admin/recruitment/jobs/${j.id}`} className="text-edmark-light-blue hover:underline">
                    {j.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-edmark-neutral-700">{j.department}</td>
                <td className="px-4 py-3 text-sm text-edmark-neutral-700">{j.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!jobs || jobs.length === 0) && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">No job postings yet.</div>
        )}
      </div>
    </div>
  )
}
