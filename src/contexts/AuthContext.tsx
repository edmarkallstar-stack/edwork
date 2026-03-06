import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb, initFirebase } from '@/config/firebase'
import type { User } from '@/types'

interface AuthState {
  firebaseUser: FirebaseUser | null
  user: User | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
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
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const user = userDoc.exists()
        ? ({ id: userDoc.id, authUid: firebaseUser.uid, ...userDoc.data() } as User)
        : null
      setState({ firebaseUser, user, loading: false })
    })

    return () => unsub()
  }, [])

  const signIn = async (email: string, password: string) => {
    const auth = getFirebaseAuth()
    await signInWithEmailAndPassword(auth, email, password)
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
