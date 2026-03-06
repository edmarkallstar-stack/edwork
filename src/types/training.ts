export interface Course {
  id: string
  title: string
  description: string
  videoUrl: string
  order: number
  isPublished: boolean
  createdAt: string
  createdBy?: string
}

export type CourseCompletionStatus = 'not_started' | 'in_progress' | 'completed'

export interface CourseCompletion {
  id: string
  userId: string
  courseId: string
  status: CourseCompletionStatus
  progress: number
  completedAt: string | null
}
