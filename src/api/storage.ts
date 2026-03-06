import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '@/config/firebase'

const storage = () => getFirebaseStorage()

export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage(), path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export function documentPath(branchId: string, userId: string, type: string, filename: string): string {
  return `${branchId}/${userId}/${type}/${filename}`
}
