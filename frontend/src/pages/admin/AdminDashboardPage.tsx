import { useEffect, useState } from 'react'
import { ArrowRight, LayoutList, PlusCircle, CheckCircle2, Clock, ListTodo } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getAllTasks, type Task } from '../../services/taskService'
import { useNavigate } from 'react-router-dom'
import { CreateTaskModal } from '../../components/admin/CreateTaskModal'
import { Skeleton } from '../../components/common/Skeleton'

export const AdminDashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllTasks()
        setTasks(data)
      } catch (error: unknown) {
        const message =
          (error as any)?.response?.data?.message ?? 'Failed to load tasks'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const total = tasks.length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const inProgress = tasks.filter((t) => t.status === 'inProgress').length
  const completed = tasks.filter((t) => t.status === 'completed').length

  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  const handleCreate = async (input: {
    title: string
    description: string
    assignee: string
  }) => {
    try {
      const created = await import('../../services/taskService').then(m => m.createTask({
        title: input.title,
        description: input.description,
        assignedTo: input.assignee,
      }))
      setTasks((prev) => [created, ...prev])
      toast.success('Task created')
      setCreateOpen(false)
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? 'Failed to create task'
      toast.error(message)
    }
  }

  const StatCard = ({ title, count, icon: Icon, color, bgClass }: any) => (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md group`}>
      <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full ${bgClass} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? <Skeleton className="h-9 w-16" /> : count}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${bgClass} ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className={`mt-4 h-1 w-full rounded-full bg-slate-100 overflow-hidden`}>
        <div className={`h-full rounded-full ${bgClass} opacity-80`} style={{ width: loading ? '0%' : '70%' }} />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Overview of task activity across your workspace.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          count={total}
          icon={LayoutList}
          color="text-indigo-600"
          bgClass="bg-indigo-500"
        />
        <StatCard
          title="Pending"
          count={pending}
          icon={Clock}
          color="text-amber-600"
          bgClass="bg-amber-500"
        />
        <StatCard
          title="In Progress"
          count={inProgress}
          icon={ListTodo}
          color="text-blue-600"
          bgClass="bg-blue-500"
        />
        <StatCard
          title="Completed"
          count={completed}
          icon={CheckCircle2}
          color="text-emerald-600"
          bgClass="bg-emerald-500"
        />
      </div>

      {/* Quick actions */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 tracking-wide">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/admin/tasks')}
            className="group relative overflow-hidden rounded-2xl p-8 text-left bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20"
          >
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
            <div className="relative flex items-start gap-5">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <LayoutList className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">All Tasks</p>
                <p className="mt-1 text-indigo-100 text-sm leading-relaxed max-w-sm">
                  View and manage every task across your organization in a single powerful view.
                </p>
              </div>
            </div>
            <div className="relative mt-8 flex items-center text-sm font-medium text-white/90 group-hover:text-white">
              Go to tasks <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="group relative overflow-hidden rounded-2xl p-8 text-left bg-gradient-to-br from-indigo-900 to-slate-900 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-500/20"
          >
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-colors" />
            <div className="relative flex items-start gap-5">
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Create New Task</p>
                <p className="mt-1 text-slate-300 text-sm leading-relaxed max-w-sm">
                  Quickly create a new task and assign it to a team member or yourself.
                </p>
              </div>
            </div>
            <div className="relative mt-8 flex items-center text-sm font-medium text-white/90 group-hover:text-white">
              Create task <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
