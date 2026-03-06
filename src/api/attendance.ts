import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore'
import type { Timesheet } from '@/types/attendance'

const db = () => getFirebaseDb()

export async function getTimesheets(filters: { userId?: string; branchId?: string; dateFrom?: string; dateTo?: string }) {
  let q = query(collection(db(), 'timesheets'))
  if (filters.userId) q = query(q, where('userId', '==', filters.userId))
  if (filters.branchId) q = query(q, where('branchId', '==', filters.branchId))
  if (filters.dateFrom) q = query(q, where('date', '>=', filters.dateFrom))
  if (filters.dateTo) q = query(q, where('date', '<=', filters.dateTo))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Timesheet))
}

export async function getTimesheetByUserAndDate(userId: string, date: string): Promise<Timesheet | null> {
  const q = query(
    collection(db(), 'timesheets'),
    where('userId', '==', userId),
    where('date', '==', date)
  )
  const snap = await getDocs(q)
  const doc = snap.docs[0]
  if (!doc) return null
  return { id: doc.id, ...doc.data() } as Timesheet
}

export async function checkIn(userId: string, branchId: string, timezone: string): Promise<string> {
  const date = new Date().toISOString().slice(0, 10)
  const ref = await addDoc(collection(db(), 'timesheets'), {
    userId,
    branchId,
    date,
    checkIn: new Date().toISOString(),
    timezone,
  })
  return ref.id
}

export async function checkOut(timesheetId: string): Promise<void> {
  await updateDoc(doc(db(), 'timesheets', timesheetId), {
    checkOut: new Date().toISOString(),
  })
}
