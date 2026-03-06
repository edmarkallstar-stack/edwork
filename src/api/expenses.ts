import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import type { ExpenseClaim } from '@/types/expenses'

const db = () => getFirebaseDb()

export async function getExpenseClaims(filters: { userId?: string; status?: string }) {
  let q = query(collection(db(), 'expenseClaims'))
  if (filters.userId) q = query(q, where('userId', '==', filters.userId))
  if (filters.status) q = query(q, where('status', '==', filters.status))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ExpenseClaim))
}

export async function createExpenseClaim(userId: string): Promise<string> {
  const ref = await addDoc(collection(db(), 'expenseClaims'), {
    userId,
    status: 'draft',
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function updateExpenseClaim(id: string, data: Partial<ExpenseClaim>): Promise<void> {
  await updateDoc(doc(db(), 'expenseClaims', id), data)
}
