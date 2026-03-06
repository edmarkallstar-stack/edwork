import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import type { OTRequest } from '@/types/ot'

const db = () => getFirebaseDb()

export async function getOTRequests(filters: { userId?: string; status?: string }) {
  let q = query(collection(db(), 'otRequests'))
  if (filters.userId) q = query(q, where('userId', '==', filters.userId))
  if (filters.status) q = query(q, where('status', '==', filters.status))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as OTRequest))
}

export async function createOTRequest(data: Omit<OTRequest, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db(), 'otRequests'), {
    ...data,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function updateOTRequest(id: string, data: Partial<OTRequest>): Promise<void> {
  await updateDoc(doc(db(), 'otRequests', id), data)
}
