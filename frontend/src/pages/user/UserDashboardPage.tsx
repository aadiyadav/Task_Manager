import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { CheckCircle2, Clock, LayoutList, ListTodo } from 'lucide-react'
import { getMyTasks, type Task } from '../../services/taskService'
import { Skeleton } from '../../components/common/Skeleton'

export const UserDashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyTasks()
        setTasks(data)
      } catch (error: unknown) {
        const message =
          (error as any)?.response?.data?.message ?? 'Failed to load your tasks'
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
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Tasks</h1>
        <p className="text-slate-500">
          Snapshot of the work assigned to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="All Tasks"
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
    </div>
  )
}

