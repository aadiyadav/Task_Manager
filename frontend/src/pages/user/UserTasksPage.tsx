import { useEffect, useMemo, useState } from 'react'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Button } from '../../components/common/Button'
import { TaskDetailsModal } from '../../components/tasks/TaskDetailsModal'
import { UpdateStatusModal } from '../../components/tasks/UpdateStatusModal'
import { Skeleton } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { ClipboardList, LayoutGrid } from 'lucide-react'
import {
  getMyTasks,
  updateTask,
  type Task as ApiTask,
  type TaskStatus,
} from '../../services/taskService'
import { toast } from 'react-hot-toast'

type StatusFilter = 'all' | 'pending' | 'inProgress' | 'completed'

const filters: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

export const UserTasksPage = () => {
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)

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

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  )

  const filteredTasks = useMemo(() => {
    const byFilter =
      activeFilter === 'all'
        ? tasks
        : tasks.filter((t) => t.status === activeFilter)

    const q = search.trim().toLowerCase()
    if (!q) return byFilter

    return byFilter.filter((t) => {
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q)
      )
    })
  }, [tasks, activeFilter, search])

  const handleStatusUpdate = async (taskId: string, status: TaskStatus) => {
    try {
      const updated = await updateTask(taskId, { status })
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)))
      toast.success('Task status updated')
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? 'Failed to update status'
      toast.error(message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Tasks</h1>
        <p className="text-slate-500">
          Track and update your assigned tasks.
        </p>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
        <div className="w-full max-w-xs relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID or title..."
            className="w-full h-10 rounded-xl bg-white border border-slate-200 px-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
          />
          <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
            <LayoutGrid className="h-4 w-4" /> {/* Just an icon placeholder */}
          </div>
        </div>
      </div>

      {/* Mobile Card View (md:hidden) */}
      <div className="grid gap-4 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description={search ? "Try adjusting your search filters." : "You have no tasks assigned yet."}
            icon={ClipboardList}
          />
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-primary-500/20">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">#{task.id}</span>
                <StatusBadge status={task.status} />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">{task.title}</h3>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                Created on {new Date(task.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3 pt-2 border-t border-slate-100 mt-2">
                <Button
                  variant="secondary"
                  className="flex-1 h-9 text-sm"
                  onClick={() => {
                    setSelectedTaskId(task.id)
                    setDetailsOpen(true)
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 h-9 text-sm"
                  onClick={() => {
                    setSelectedTaskId(task.id)
                    setUpdateOpen(true)
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50/80 backdrop-blur border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Task ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assigned By
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Created On
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto rounded-lg" /></td>
                </tr>
              ))
            ) : filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="No tasks found"
                    description={search ? "We couldn't find any tasks matching your filters." : "You have no tasks assigned yet."}
                    icon={ClipboardList}
                  />
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">#{task.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {task.assignedTo}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        className="h-8 px-3 shadow-sm bg-white hover:bg-slate-50 border border-slate-200"
                        onClick={() => {
                          setSelectedTaskId(task.id)
                          setDetailsOpen(true)
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        className="h-8 px-3 text-xs shadow-sm shadow-primary-500/20"
                        onClick={() => {
                          setSelectedTaskId(task.id)
                          setUpdateOpen(true)
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTask && (
        <>
          <TaskDetailsModal
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            task={{
              id: selectedTask.id,
              title: selectedTask.title,
              assignedBy: selectedTask.assignedTo,
              status: selectedTask.status,
              description: selectedTask.description,
            }}
            onStatusChange={(status) =>
              void handleStatusUpdate(selectedTask.id, status)
            }
          />

          <UpdateStatusModal
            open={updateOpen}
            onClose={() => setUpdateOpen(false)}
            task={{
              id: selectedTask.id,
              title: selectedTask.title,
              assignedBy: selectedTask.assignedTo,
              status: selectedTask.status,
            }}
            onSave={(status) => void handleStatusUpdate(selectedTask.id, status)}
          />
        </>
      )}
    </div>
  )
}

