import { useEffect, useMemo, useState } from 'react'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Button } from '../../components/common/Button'
import { TaskDetailsModal } from '../../components/tasks/TaskDetailsModal'
import { CreateTaskModal } from '../../components/admin/CreateTaskModal'
import { EditTaskModal } from '../../components/admin/EditTaskModal'
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal'
import { Skeleton } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { ClipboardList, Plus, Search } from 'lucide-react'
import {
  deleteTask,
  getAllTasks,
  type Task as ApiTask,
  type TaskStatus,
  updateTask,
  createTask,
} from '../../services/taskService'
import { toast } from 'react-hot-toast'

type StatusFilter = 'all' | 'pending' | 'inProgress' | 'completed'

const filters: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

export const AdminAllTasksPage = () => {
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

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
        t.title.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q)
      )
    })
  }, [tasks, activeFilter, search])

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
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

  const handleCreate = async (input: {
    title: string
    description: string
    assignee: string
  }) => {
    try {
      const created = await createTask({
        title: input.title,
        description: input.description,
        assignedTo: input.assignee,
      })
      setTasks((prev) => [created, ...prev])
      toast.success('Task created')
      setCreateOpen(false)
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? 'Failed to create task'
      toast.error(message)
    }
  }

  const handleEditSave = async (input: {
    title: string
    description: string
    assignee: string
  }) => {
    if (!selectedTask) return
    try {
      const updated = await updateTask(selectedTask.id, {
        title: input.title,
        description: input.description,
        assignedTo: input.assignee,
      })
      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updated : t)))
      toast.success('Task updated')
      setEditOpen(false)
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? 'Failed to update task'
      toast.error(message)
    }
  }

  const handleDelete = async () => {
    if (!selectedTask) return
    try {
      await deleteTask(selectedTask.id)
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id))
      toast.success('Task deleted')
      setDeleteOpen(false)
      setDetailsOpen(false)
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? 'Failed to delete task'
      toast.error(message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Tasks</h1>
          <p className="text-slate-500">
            View and manage every task across your organization.
          </p>
        </div>
        <Button
          className="h-11 px-5 text-sm shadow-lg shadow-primary-500/20"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Filters & Search */}
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
            placeholder="Search tasks or assignees..."
            className="w-full h-10 rounded-xl bg-white border border-slate-200 px-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
          />
          <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Mobile Card Grid */}
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
              </div>
            </div>
          ))
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description={search ? "No tasks match your search." : "No tasks have been created yet."}
            icon={ClipboardList}
            action={!search ? <Button onClick={() => setCreateOpen(true)}>Create First Task</Button> : undefined}
          />
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-primary-500/20">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">#{task.id}</span>
                <StatusBadge status={task.status} />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">{task.title}</h3>
              <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium text-slate-600">{task.assignedTo}</span>
                <span>•</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <Button
                  variant="secondary"
                  className="w-full h-9 text-sm"
                  onClick={() => {
                    setSelectedTaskId(task.id)
                    setDetailsOpen(true)
                  }}
                >
                  Manage Task
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
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
                Assigned To
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
                    description={search ? "No tasks match your search." : "No tasks have been created yet."}
                    icon={ClipboardList}
                    action={!search ? <Button onClick={() => setCreateOpen(true)}>Create First Task</Button> : undefined}
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
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-medium text-xs">
                      {task.assignedTo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="secondary"
                      className="h-8 px-3 text-xs shadow-sm bg-white hover:bg-slate-50 border border-slate-200"
                      onClick={() => {
                        setSelectedTaskId(task.id)
                        setDetailsOpen(true)
                      }}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

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
              void handleStatusChange(selectedTask.id, status)
            }
            onEdit={() => {
              setDetailsOpen(false)
              setEditOpen(true)
            }}
            onDelete={() => {
              setDetailsOpen(false)
              setDeleteOpen(true)
            }}
          />

          <EditTaskModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            task={{
              title: selectedTask.title,
              description: selectedTask.description,
              assignee: selectedTask.assignedTo,
            }}
            onSave={handleEditSave}
          />

          <DeleteConfirmModal
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  )
}

