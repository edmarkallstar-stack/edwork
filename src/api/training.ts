import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/config/firebase'
import type { Course, CourseCompletion, CourseCompletionStatus } from '@/types/training'

const db = () => getFirebaseDb()
const COURSES = 'courses'
const COMPLETIONS = 'courseCompletions'

const MOCK_COURSES: Omit<Course, 'id'>[] = [
  {
    title: 'Workplace Safety Essentials',
    description: 'Introduction to office and site safety, emergency procedures, and reporting.',
    videoUrl: 'https://www.youtube.com/embed/8jPQjJBbVzE',
    order: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'HR Policies & Code of Conduct',
    description: 'Company values, code of conduct, anti-harassment, and key HR policies.',
    videoUrl: 'https://www.youtube.com/embed/8jPQjJBbVzE',
    order: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Data Privacy & Information Security',
    description: 'Handling personal data, passwords, and confidential information.',
    videoUrl: 'https://www.youtube.com/embed/8jPQjJBbVzE',
    order: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Time & Attendance Guidelines',
    description: 'How to use the timesheet, leave, and OT request systems.',
    videoUrl: 'https://www.youtube.com/embed/8jPQjJBbVzE',
    order: 4,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Benefits Overview',
    description: 'Overview of company benefits and how to access them.',
    videoUrl: 'https://www.youtube.com/embed/8jPQjJBbVzE',
    order: 5,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
]

function mockCoursesWithIds(): Course[] {
  return MOCK_COURSES.map((c, i) => ({ ...c, id: `mock-${i + 1}` }))
}

export async function getCourses(isPublished?: boolean): Promise<Course[]> {
  try {
    let q = query(
      collection(db(), COURSES),
      orderBy('order', 'asc')
    )
    if (isPublished === true) {
      q = query(q, where('isPublished', '==', true))
    }
    const snap = await getDocs(q)
    const courses = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course))
    if (courses.length === 0 && isPublished === true) {
      return mockCoursesWithIds()
    }
    return courses
  } catch {
    if (isPublished === true) {
      return mockCoursesWithIds()
    }
    return []
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (id.startsWith('mock-')) {
    const mock = mockCoursesWithIds().find((c) => c.id === id)
    return mock ?? null
  }
  const ref = doc(db(), COURSES, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Course
}

export async function getCompletionsByUser(userId: string): Promise<CourseCompletion[]> {
  const q = query(
    collection(db(), COMPLETIONS),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseCompletion))
}

export async function getCompletion(userId: string, courseId: string): Promise<CourseCompletion | null> {
  const q = query(
    collection(db(), COMPLETIONS),
    where('userId', '==', userId),
    where('courseId', '==', courseId)
  )
  const snap = await getDocs(q)
  const doc = snap.docs[0]
  if (!doc) return null
  return { id: doc.id, ...doc.data() } as CourseCompletion
}

export async function createCompletion(
  userId: string,
  courseId: string,
  data: { status: CourseCompletionStatus; progress: number; completedAt?: string | null }
): Promise<string> {
  const ref = await addDoc(collection(db(), COMPLETIONS), {
    userId,
    courseId,
    status: data.status,
    progress: data.progress,
    completedAt: data.completedAt ?? null,
  })
  return ref.id
}

export async function updateCompletion(
  completionId: string,
  data: Partial<{ status: CourseCompletionStatus; progress: number; completedAt: string | null }>
): Promise<void> {
  await updateDoc(doc(db(), COMPLETIONS, completionId), data)
}

export async function getOrCreateCompletion(
  userId: string,
  courseId: string
): Promise<CourseCompletion> {
  const existing = await getCompletion(userId, courseId)
  if (existing) return existing
  const id = await createCompletion(userId, courseId, {
    status: 'in_progress',
    progress: 0,
    completedAt: null,
  })
  return {
    id,
    userId,
    courseId,
    status: 'in_progress',
    progress: 0,
    completedAt: null,
  }
}

export async function createCourse(data: Omit<Course, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db(), COURSES), {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  })
  return ref.id
}

export async function updateCourse(id: string, data: Partial<Omit<Course, 'id'>>): Promise<void> {
  if (id.startsWith('mock-')) return
  await updateDoc(doc(db(), COURSES, id), data)
}

export async function deleteCourse(id: string): Promise<void> {
  if (id.startsWith('mock-')) return
  await deleteDoc(doc(db(), COURSES, id))
}

export async function seedTrainingCourses(): Promise<void> {
  const snap = await getDocs(collection(db(), COURSES))
  if (snap.docs.length > 0) return
  for (const c of MOCK_COURSES) {
    await addDoc(collection(db(), COURSES), c)
  }
}
