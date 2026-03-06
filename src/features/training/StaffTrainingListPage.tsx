import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCourses, getCompletionsByUser } from '@/api/training'
import { useAuth } from '@/contexts/AuthContext'

export function StaffTrainingListPage() {
  const { user } = useAuth()
  const { data: courses } = useQuery({
    queryKey: ['courses', true],
    queryFn: () => getCourses(true),
    enabled: !!user,
  })
  const { data: completions } = useQuery({
    queryKey: ['courseCompletions', user?.id],
    queryFn: () => (user ? getCompletionsByUser(user.id) : []),
    enabled: !!user,
  })

  const getStatus = (courseId: string) => {
    const c = completions?.find((x) => x.courseId === courseId)
    if (!c) return 'not_started'
    return c.status
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Training</h2>
      <p className="text-edmark-neutral-700">
        Complete the video courses below. Your progress is saved automatically.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((course) => {
          const status = getStatus(course.id)
          return (
            <Link
              key={course.id}
              to={`/staff/training/${course.id}`}
              className="block bg-white border border-edmark-neutral-200 rounded-lg p-5 hover:border-edmark-light-blue/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-edmark-dark-blue">{course.title}</h3>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-edmark-neutral-100 text-edmark-neutral-700'
                  }`}
                >
                  {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In progress' : 'Not started'}
                </span>
              </div>
              <p className="mt-2 text-sm text-edmark-neutral-700 line-clamp-2">{course.description}</p>
            </Link>
          )
        })}
      </div>
      {(!courses || courses.length === 0) && (
        <div className="rounded-lg border border-edmark-neutral-200 bg-white p-8 text-center text-edmark-neutral-700">
          No training courses available yet.
        </div>
      )}
    </div>
  )
}
