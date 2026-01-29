import { Menu, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface HeaderProps {
  onMenuClick: () => void
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, isAdmin } = useAuth()

  const role = user?.role ?? 'guest'
  const isAdminRole = isAdmin()

  const roleLabel = isAdminRole ? 'Admin' : role === 'user' ? 'User' : 'Guest'
  const roleClasses = isAdminRole
    ? 'bg-primary-600/10 text-primary-600 border border-primary-600/20'
    : role === 'user'
      ? 'bg-blue-50 text-blue-600 border border-blue-200'
      : 'bg-slate-100 text-slate-600 border border-slate-200'

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 transition-all">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-[400px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search here..."
            className="w-full h-10 rounded-lg border border-slate-200 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${roleClasses}`}
        >
          {roleLabel}
        </div>
      </div>
    </header>
  )
}

