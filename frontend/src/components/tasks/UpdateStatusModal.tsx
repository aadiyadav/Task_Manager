import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { CheckCircle2 } from 'lucide-react'

type Status = 'pending' | 'inProgress' | 'completed'

type UpdateStatusModalProps = {
  open: boolean
  onClose: () => void
  task: {
    id: string
    title: string
    assignedBy: string
    status: Status
  }
  onSave: (status: Status) => void
}

export const UpdateStatusModal = ({
  open,
  onClose,
  task,
  onSave,
}: UpdateStatusModalProps) => {
  const [status, setStatus] = useState<Status>(task.status)

  useEffect(() => {
    setStatus(task.status)
  }, [task.status, task.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(status)
  }

  const StatusOption = ({ value, label }: { value: Status, label: string }) => (
    <label className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${status === value
        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}>
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="status"
          value={value}
          checked={status === value}
          onChange={() => setStatus(value)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
        />
        <span className={`text-sm font-medium ${status === value ? 'text-primary-900' : 'text-slate-700'}`}>
          {label}
        </span>
      </div>
      {status === value && <CheckCircle2 className="h-5 w-5 text-primary-600" />}
    </label>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Status"
      className="max-w-[480px] p-0 overflow-hidden"
    >
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Update Task Status</h2>
        <p className="mt-1 text-sm text-slate-500">Choose the new status for this task.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Task</p>
          <p className="font-medium text-slate-900 truncate">{task.title}</p>
        </div>

        <div className="space-y-3">
          <StatusOption value="pending" label="Pending" />
          <StatusOption value="inProgress" label="In Progress" />
          <StatusOption value="completed" label="Completed" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-xl shadow-lg shadow-primary-500/20"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}

