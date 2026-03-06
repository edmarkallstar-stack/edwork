import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import type { Payslip, PayrollRun } from '@/types/payroll'

const db = () => getFirebaseDb()

export async function getPayslipsByUser(userId: string) {
  const q = query(collection(db(), 'payslips'), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payslip))
}

export async function getPayrollRuns(cycleId?: string) {
  let q = query(collection(db(), 'payrollRuns'))
  if (cycleId) q = query(q, where('payrollCycleId', '==', cycleId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PayrollRun))
}
