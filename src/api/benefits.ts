import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import type { Benefit, EmployeeBenefit } from '@/types/benefits'

const db = () => getFirebaseDb()

export async function getBenefits(filters?: { countryId?: string; branchId?: string }) {
  let q = query(collection(db(), 'benefits'))
  if (filters?.countryId) q = query(q, where('countryId', '==', filters.countryId))
  if (filters?.branchId) q = query(q, where('branchId', '==', filters.branchId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Benefit))
}

export async function getEmployeeBenefits(userId: string) {
  const q = query(collection(db(), 'employeeBenefits'), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EmployeeBenefit))
}
