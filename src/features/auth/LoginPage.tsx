import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password, displayName)
      } else {
        await signIn(email, password)
      }
      // Redirect is handled by route when auth state updates (user is set)
    } catch (err) {
      setError(err instanceof Error ? err.message : (isSignUp ? 'Sign up failed' : 'Sign in failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-edmark-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-edmark-dark-blue">EDWORK</h1>
          <p className="text-edmark-neutral-700 mt-1">EDMARK HRIS</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md border border-edmark-neutral-200 p-6 space-y-4"
        >
          {error && (
            <div className="p-3 rounded-md bg-edmark-red/10 text-edmark-red text-sm">
              {error}
            </div>
          )}
          {isSignUp && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-edmark-dark-blue mb-1">
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={isSignUp}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md focus:ring-2 focus:ring-edmark-light-blue focus:border-edmark-light-blue"
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-edmark-dark-blue mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md focus:ring-2 focus:ring-edmark-light-blue focus:border-edmark-light-blue"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-edmark-dark-blue mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignUp ? 6 : undefined}
              className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md focus:ring-2 focus:ring-edmark-light-blue focus:border-edmark-light-blue"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            {isSignUp && (
              <p className="text-xs text-edmark-neutral-600 mt-1">At least 6 characters</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-edmark-dark-blue text-white font-medium rounded-md hover:bg-edmark-orange disabled:opacity-50 transition-colors"
          >
            {loading
              ? isSignUp
                ? 'Creating account...'
                : 'Signing in...'
              : isSignUp
                ? 'Sign up'
                : 'Sign in'}
          </button>
          <p className="text-center text-sm text-edmark-neutral-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-edmark-light-blue font-medium hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
