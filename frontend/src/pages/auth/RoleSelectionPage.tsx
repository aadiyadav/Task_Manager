import { ShieldCheck, UserCircle2, ChevronRight, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export const RoleSelectionPage = () => {
  const { updateUserRole } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = async (role: 'admin' | 'user') => {
    try {
      await updateUserRole(role)
      if (role === 'admin') {
        toast.success('Welcome, Admin!')
        navigate('/admin')
      } else {
        toast.success('Welcome, User!')
        navigate('/user')
      }
    } catch {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[900px]">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Choose Your Role</h1>
          <p className="mt-2 text-slate-500">
            Select how you want to use the task management system.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-0.5">Important Note</p>
            <p className="text-amber-700/90">
              Admin access grants full control over the workspace. Regular users
              can only manage their own assigned tasks.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Admin card */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <ShieldCheck className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Admin</h2>
                <p className="text-sm text-slate-500">
                  Team leads & managers
                </p>
              </div>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Create and assign tasks, manage team workloads, and get a high-level view
              of progress across the organization.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Manage all users and tasks',
                'Configure workflows',
                'View analytics reports'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2.5" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleRoleSelect('admin')}
              className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all shadow-lg shadow-primary-500/20"
            >
              Continue as Admin
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* User card */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-400 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                <UserCircle2 className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">User</h2>
                <p className="text-sm text-slate-500">
                  Individual contributors
                </p>
              </div>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Track your personal tasks, update statuses, and collaborate with your team
              on shared work efficiently.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Manage personal tasks',
                'Update status & progress',
                'Collaborate with team'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2.5" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleRoleSelect('user')}
              className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium transition-all"
            >
              Continue as User
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

