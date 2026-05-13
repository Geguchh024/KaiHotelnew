import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AdminAuthContextType {
  sessionToken: string | null
  login: (token: string) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminSessionToken')
    }
    return null
  })

  const login = useCallback((token: string) => {
    localStorage.setItem('adminSessionToken', token)
    setSessionToken(token)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('adminSessionToken')
    setSessionToken(null)
    // Navigate to login — use window.location to avoid needing useNavigate at provider level
    window.location.href = '/admin/login'
  }, [])

  return (
    <AdminAuthContext.Provider value={{ sessionToken, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
