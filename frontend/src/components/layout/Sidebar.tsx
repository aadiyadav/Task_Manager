import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, LogOut, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const linkBaseClasses =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200'

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Sidebar content component to reuse
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-slate-200 shadow-sm">
      <div className="px-6 h-16 flex items-center border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
            TM
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">TaskManage</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
          Platform
        </div>

        {/* Admin Links */}
        {isAdmin() && (
          <>
            <NavLink
              to="/admin"
              end
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/tasks"
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <ListChecks className="h-4 w-4" />
              Tasks
            </NavLink>
          </>
        )}

        {/* User Links */}
        {!isAdmin() && (
          <>
            <NavLink
              to="/user"
              end
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>

            <NavLink
              to="/user/tasks"
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <ListChecks className="h-4 w-4" />
              My Tasks
            </NavLink>
          </>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar (Slide-in) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="relative h-full">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar (Static) */}
      <aside className="fixed inset-y-0 left-0 hidden md:flex w-[260px] flex-col z-30">
        <SidebarContent />
      </aside>
    </>
  )
}

