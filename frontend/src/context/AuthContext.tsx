import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import * as authService from '../services/authService'

type User = authService.AuthUser | null

type AuthContextValue = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (input: {
    name: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => void
  isAdmin: () => boolean
  updateUserRole: (role: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = authService.getToken()
        if (token) {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch {
        authService.clearToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    void initialize()
  }, [])

  const login = async (email: string, password: string) => {
    const { user: loggedInUser } = await authService.login({ email, password })
    setUser(loggedInUser)
    return loggedInUser
  }

  const signup = async (input: {
    name: string
    email: string
    password: string
  }) => {
    const { user: createdUser } = await authService.signup(input)
    setUser(createdUser)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUserRole = async (role: string) => {
    const { user: updatedUser } = await authService.updateRole(role)
    setUser(updatedUser)
  }

  const isAdmin = () => user?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

