import { AlertTriangle } from 'lucide-react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

type DeleteConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-[420px] p-0 py-8 px-6 text-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-1 ring-8 ring-red-50">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Delete this task?
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
            This action cannot be undone. The task and all related history will
            be permanently removed.
          </p>
        </div>
        <div className="flex w-full justify-center gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            className="w-full justify-center rounded-xl shadow-lg shadow-red-500/20"
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  )
}

