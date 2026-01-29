import { useState } from 'react'
import { Modal } from '../common/Modal'
import { StatusBadge } from '../common/StatusBadge'
import { Button } from '../common/Button'
import { UpdateStatusModal } from './UpdateStatusModal'
import { Calendar, UserCircle2, FileText, Clock } from 'lucide-react'

type Status = 'pending' | 'inProgress' | 'completed'

type ActivityItem = {
  id: string
  label: string
  at: string
}

type TaskDetailsModalProps = {
  open: boolean
  onClose: () => void
  task: {
    id: string
    title: string
    assignedBy: string
    status: Status
    description: string
    activity?: ActivityItem[]
  }
  onStatusChange?: (status: Status) => void
  onEdit?: () => void
  onDelete?: () => void
}

export const TaskDetailsModal = ({
  open,
  onClose,
  task,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) => {
  const [updateOpen, setUpdateOpen] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<Status>(task.status)

  const handleStatusSave = (status: Status) => {
    setCurrentStatus(status)
    onStatusChange?.(status)
    setUpdateOpen(false)
  }

  const activity = task.activity ?? [
    {
      id: '1',
      label: 'Task created',
      at: '2026-01-15 09:12',
    },
    {
      id: '2',
      label: 'Assigned to you',
      at: '2026-01-15 09:15',
    },
  ]

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Task Overview"
        className="max-w-[600px] p-0 overflow-hidden"
      >
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-500 font-mono text-xs">
              #{task.id}
            </div> */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Task Details</h2>
              <p className="text-xs text-slate-500 font-medium">View and manage task information</p>
            </div>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <FileText className="h-3.5 w-3.5" />
                Title
              </label>
              <div className="text-lg font-semibold text-slate-900 leading-snug">
                {task.title}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <UserCircle2 className="h-3.5 w-3.5" />
                  Assigned By
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    {task.assignedBy.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{task.assignedBy}</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Created Date
                </label>
                <div className="text-sm font-medium text-slate-700">
                  Jan 15, 2026
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Description
              </label>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              Recent Activity
            </h3>
            <div className="relative space-y-0 pl-1">
              <div className="absolute top-2 bottom-2 left-[5.5px] w-px bg-slate-200" />
              {activity.map((item) => (
                <div key={item.id} className="relative flex items-start gap-3 pb-4 last:pb-0 group">
                  <div className="relative z-10 h-3 w-3 rounded-full bg-slate-200 ring-4 ring-white mt-1 group-hover:bg-primary-500 transition-colors" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 group-hover:text-primary-700 transition-colors">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.at}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              {onDelete && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    onClose()
                    onDelete()
                  }}
                  className="rounded-xl border-transparent text-red-500 hover:bg-red-50 hover:text-red-600 px-4"
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="rounded-xl border-slate-200 text-white hover:bg-slate-50"
              >
                Close
              </Button>
              {onEdit && (
                <Button
                  onClick={() => {
                    onClose()
                    onEdit()
                  }}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                >
                  Edit Task
                </Button>
              )}
              <Button
                onClick={() => setUpdateOpen(true)}
                variant="secondary"
                className="rounded-xl border-slate-200 text-white hover:bg-slate-50"
              >
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <UpdateStatusModal
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        task={{ ...task, status: currentStatus }}
        onSave={handleStatusSave}
      />
    </>
  )
}

