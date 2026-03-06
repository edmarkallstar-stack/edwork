import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb, initFirebase } from '@/config/firebase'
import type { User } from '@/types'

interface AuthState {
  firebaseUser: FirebaseUser | null
  user: User | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  hasRole: (...roles: import('@/types').Role[]) => boolean
  isStaffAreaOnly: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    user: null,
    loading: true,
  })

  useEffect(() => {
    initFirebase()
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setState({ firebaseUser: null, user: null, loading: false })
        return
      }
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userRef)
      let user: User | null
      if (userDoc.exists()) {
        user = { id: userDoc.id, authUid: firebaseUser.uid, ...userDoc.data() } as User
      } else {
        // Create default user doc (staff) so accounts created outside the app can log in
        const now = new Date().toISOString()
        const defaultUser = {
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
          role: 'employee' as const,
          branchId: null,
          countryId: null,
          departmentId: null,
          jobTitle: null,
          employeeId: null,
          managerId: null,
          joinDate: null,
          status: 'active' as const,
          photoURL: firebaseUser.photoURL ?? null,
          createdAt: now,
          updatedAt: now,
        }
        await setDoc(userRef, defaultUser)
        user = { id: firebaseUser.uid, authUid: firebaseUser.uid, ...defaultUser }
      }
      setState({ firebaseUser, user, loading: false })
    })

    return () => unsub()
  }, [])

  const signIn = async (email: string, password: string) => {
    const auth = getFirebaseAuth()
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    const userRef = doc(db, 'users', firebaseUser.uid)
    const now = new Date().toISOString()
    await setDoc(userRef, {
      email: firebaseUser.email ?? email,
      displayName: displayName.trim() || email.split('@')[0],
      role: 'employee', // staff – new registrants are added as staff
      branchId: null,
      countryId: null,
      departmentId: null,
      jobTitle: null,
      employeeId: null,
      managerId: null,
      joinDate: null,
      status: 'active',
      photoURL: null,
      createdAt: now,
      updatedAt: now,
    })
  }

  const signOut = async () => {
    const auth = getFirebaseAuth()
    await firebaseSignOut(auth)
  }

  const hasRole = (...roles: import('@/types').Role[]) =>
    state.user ? roles.includes(state.user.role) : false

  const isStaffAreaOnly =
    state.user?.role === 'employee'

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    hasRole,
    isStaffAreaOnly,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
