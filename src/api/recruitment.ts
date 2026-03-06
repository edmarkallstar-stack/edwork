import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore'
import type { JobPosting, Application } from '@/types/recruitment'

const db = () => getFirebaseDb()

export async function getJobPostings(filters?: { branchId?: string; status?: string }) {
  let q = query(collection(db(), 'jobPostings'))
  if (filters?.branchId) q = query(q, where('branchId', '==', filters.branchId))
  if (filters?.status) q = query(q, where('status', '==', filters.status))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobPosting))
}

export async function getJobPosting(id: string): Promise<JobPosting | null> {
  const ref = doc(db(), 'jobPostings', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as JobPosting
}

export async function createJobPosting(
  data: Omit<JobPosting, 'id' | 'createdAt'> & { createdAt?: string }
): Promise<string> {
  const ref = await addDoc(collection(db(), 'jobPostings'), {
    ...data,
    createdAt: data.createdAt ?? new Date().toISOString(),
  })
  return ref.id
}

export async function updateJobPosting(id: string, data: Partial<JobPosting>): Promise<void> {
  await updateDoc(doc(db(), 'jobPostings', id), data)
}

export async function getApplications(jobId?: string) {
  let q = query(collection(db(), 'applications'))
  if (jobId) q = query(q, where('jobId', '==', jobId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application))
}

export async function createApplication(data: Omit<Application, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db(), 'applications'), {
    ...data,
    appliedAt: new Date().toISOString(),
  })
  return ref.id
}

export async function updateApplication(id: string, data: Partial<Application>): Promise<void> {
  await updateDoc(doc(db(), 'applications', id), data)
}
