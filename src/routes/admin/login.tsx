import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/admin/login')({
  validateSearch: loginSearchSchema,
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const loginAction = useAction(api.authNode.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { token } = await loginAction({ username, password })
      login(token)
      void navigate({ to: redirect ?? '/admin' })
    } catch {
      setError('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 sm:p-10 w-full max-w-md">
        {/* Hotel name header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="font-[EB_Garamond] text-[30px] sm:text-[36px] leading-[1.2] text-primary mb-1">
            Kai Hotel Bar
          </h1>
          <p className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username field */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="username"
              className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
              placeholder="Enter username"
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
              placeholder="Enter password"
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="font-[Hanken_Grotesk] text-[13px] text-error text-center"
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span
                  className="material-symbols-outlined text-[18px] animate-spin"
                  aria-hidden="true"
                >
                  progress_activity
                </span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}


