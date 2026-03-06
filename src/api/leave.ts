import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import type { LeaveType, LeaveBalance, LeaveRequest } from '@/types/leave'

const db = () => getFirebaseDb()

export async function getLeaveTypes(countryId?: string) {
  let q = query(collection(db(), 'leaveTypes'))
  if (countryId) q = query(q, where('countryId', '==', countryId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeaveType))
}

export async function getLeaveBalances(userId: string, year?: number) {
  let q = query(collection(db(), 'leaveBalances'), where('userId', '==', userId))
  if (year != null) q = query(q, where('year', '==', year))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeaveBalance))
}

export async function getLeaveRequests(filters: { userId?: string; status?: string }) {
  let q = query(collection(db(), 'leaveRequests'))
  if (filters.userId) q = query(q, where('userId', '==', filters.userId))
  if (filters.status) q = query(q, where('status', '==', filters.status))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeaveRequest))
}

export async function createLeaveRequest(data: Omit<LeaveRequest, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db(), 'leaveRequests'), {
    ...data,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function updateLeaveRequest(id: string, data: Partial<LeaveRequest>): Promise<void> {
  await updateDoc(doc(db(), 'leaveRequests', id), data)
}
