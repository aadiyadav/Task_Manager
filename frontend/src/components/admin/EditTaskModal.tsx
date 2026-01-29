import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useState, useEffect } from 'react'
import { LayoutList, FileText, UserCircle2 } from 'lucide-react'

type EditTaskInput = {
  title: string
  description: string
  assignee: string
}

type EditTaskModalProps = {
  open: boolean
  onClose: () => void
  task: {
    title: string
    description: string
    assignee: string
  }
  onSave: (input: EditTaskInput) => void
}

const schema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Description is required'),
  assignee: yup.string().required('Assignee is required'),
})

export const EditTaskModal = ({
  open,
  onClose,
  task,
  onSave,
}: EditTaskModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditTaskInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description,
      assignee: task.assignee,
    },
    values: {
      title: task.title,
      description: task.description,
      assignee: task.assignee,
    },
  })

  // State for users
  const [users, setUsers] = useState<import('../../services/authService').AuthUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    if (open) {
      import('../../services/authService').then(({ getAllUsers }) => {
        getAllUsers()
          .then(setUsers)
          .catch(() => { })
          .finally(() => setLoadingUsers(false))
      })
    }
  }, [open])

  const onSubmit = (data: EditTaskInput) => {
    onSave(data)
    reset(data)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Task"
      className="max-w-[540px] p-0 overflow-hidden"
    >
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Edit Task</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <LayoutList className="h-4 w-4 text-slate-400" />
            Task Title
          </label>
          <input
            {...register('title')}
            className="w-full h-11 rounded-xl bg-white border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm hover:border-slate-300"
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
              • {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full h-[120px] rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-all shadow-sm hover:border-slate-300"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
              • {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <UserCircle2 className="h-4 w-4 text-slate-400" />
            Assign To
          </label>
          <div className="relative">
            <select
              {...register('assignee')}
              className="w-full h-11 appearance-none rounded-xl bg-white border border-slate-200 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm hover:border-slate-300 cursor-pointer"
            >
              <option value="">Select assignee</option>
              {loadingUsers ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          {errors.assignee && (
            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
              • {errors.assignee.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="rounded-xl border-slate-200 text-white hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl shadow-lg shadow-primary-500/20"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

