import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  type DocumentData,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/config/firebase'

const db = () => getFirebaseDb()

export async function getDocById<T>(collectionName: string, id: string): Promise<T | null> {
  const ref = doc(db(), collectionName, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as T
}

export async function getCollection<T>(
  collectionName: string,
  constraints: { field: string; op: '==' | 'in'; value: unknown }[] = []
): Promise<T[]> {
  let q = query(collection(db(), collectionName))
  for (const c of constraints) {
    if (c.op === '==') q = query(q, where(c.field, '==', c.value))
    if (c.op === 'in') q = query(q, where(c.field, 'in', c.value as unknown[]))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T))
}

export async function createDoc(
  collectionName: string,
  data: DocumentData,
  id?: string
): Promise<string> {
  if (id) {
    await setDoc(doc(db(), collectionName, id), data)
    return id
  }
  const ref = await addDoc(collection(db(), collectionName), data)
  return ref.id
}

export async function updateDocById(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> {
  await updateDoc(doc(db(), collectionName, id), data)
}

export async function deleteDocById(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db(), collectionName, id))
}

export async function getCountries() {
  return getCollection<import('@/types').Country>('countries')
}

export async function getBranches(countryId?: string) {
  const constraints = countryId ? [{ field: 'countryId', op: '==' as const, value: countryId }] : []
  return getCollection<import('@/types').Branch>('branches', constraints)
}

export async function getDepartments(branchId?: string) {
  const constraints = branchId ? [{ field: 'branchId', op: '==' as const, value: branchId }] : []
  return getCollection<import('@/types').Department>('departments', constraints)
}

export async function getUsers(filters?: { branchId?: string; countryId?: string }) {
  let constraints: { field: string; op: '==' | 'in'; value: unknown }[] = []
  if (filters?.branchId) constraints.push({ field: 'branchId', op: '==', value: filters.branchId })
  if (filters?.countryId) constraints.push({ field: 'countryId', op: '==', value: filters.countryId })
  return getCollection<import('@/types').User>('users', constraints)
}
