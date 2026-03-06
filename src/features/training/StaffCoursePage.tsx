import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCourseById, getOrCreateCompletion, updateCompletion } from '@/api/training'
import { useAuth } from '@/contexts/AuthContext'

function isEmbedUrl(url: string): boolean {
  return /youtube\.com\/embed|vimeo\.com\/video/.test(url)
}

export function StaffCoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId,
  })

  const { data: completion, isLoading: completionLoading } = useQuery({
    queryKey: ['courseCompletion', user?.id, courseId],
    queryFn: () => (user && courseId ? getOrCreateCompletion(user.id, courseId) : Promise.reject(new Error('No user'))),
    enabled: !!user && !!courseId,
  })

  const markCompleteMutation = useMutation({
    mutationFn: () =>
      completion
        ? updateCompletion(completion.id, {
            status: 'completed',
            progress: 100,
            completedAt: new Date().toISOString(),
          })
        : Promise.reject(new Error('No completion record')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseCompletions'] })
      queryClient.invalidateQueries({ queryKey: ['courseCompletion', user?.id, courseId] })
    },
  })

  if (!courseId || !user) return null
  if (courseLoading || !course) {
    return (
      <div className="space-y-6">
        <div className="text-edmark-neutral-700">Loading course…</div>
      </div>
    )
  }

  const completed = completion?.status === 'completed'

  return (
    <div className="space-y-6">
      <Link
        to="/staff/training"
        className="text-sm text-edmark-light-blue hover:underline"
      >
        ← Back to Training
      </Link>
      <h2 className="text-xl font-semibold text-edmark-dark-blue">{course.title}</h2>
      {course.description && (
        <p className="text-edmark-neutral-700">{course.description}</p>
      )}
      <div className="bg-black/5 rounded-lg overflow-hidden aspect-video max-w-3xl">
        {isEmbedUrl(course.videoUrl) ? (
          <iframe
            src={course.videoUrl}
            title={course.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={course.videoUrl}
            controls
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {!completionLoading && (
        <div>
          {completed ? (
            <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800">
              Completed
            </span>
          ) : (
            <button
              type="button"
              onClick={() => markCompleteMutation.mutate()}
              disabled={markCompleteMutation.isPending}
              className="px-4 py-2 bg-edmark-dark-blue text-white rounded-md hover:bg-edmark-dark-blue/90 disabled:opacity-50"
            >
              {markCompleteMutation.isPending ? 'Saving…' : 'Mark as complete'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
