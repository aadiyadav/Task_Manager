import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

type CreateTaskInput = {
  title: string
  description: string
  assignee: string
}

type CreateTaskModalProps = {
  open: boolean
  onClose: () => void
  onCreate: (input: CreateTaskInput) => void
}

const schema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Description is required'),
  assignee: yup.string().required('Assignee is required'),
})

export const CreateTaskModal = ({
  open,
  onClose,
  onCreate,
}: CreateTaskModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      assignee: '',
    },
  })

  const [users, setUsers] = useState<import('../../services/authService').AuthUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    if (open) {
      import('../../services/authService').then(({ getAllUsers }) => {
        getAllUsers()
          .then(setUsers)
          .catch(() => { }) // Silent error or toast
          .finally(() => setLoadingUsers(false))
      })
    }
  }, [open])

  // Reset form when modal opens/closes if needed, or handle externally.
  // For now we just reset on submit.

  const onSubmit = (data: CreateTaskInput) => {
    onCreate(data)
    reset()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Task"
      className="max-w-[700px] p-0 overflow-hidden"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Task title
          </label>
          <input
            {...register('title')}
            className="w-full h-11 rounded-lg bg-white border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm hover:border-slate-300"
            placeholder="Enter the task title"
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
              • {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full h-[120px] rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-all shadow-sm hover:border-slate-300"
            placeholder="Briefly describe what needs to be done"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
              • {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Assigned User Dropdown
          </label>
          <div className="relative">
            <select
              {...register('assignee')}
              className="w-full h-11 appearance-none rounded-lg bg-white border border-slate-200 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm hover:border-slate-300 cursor-pointer"
            >
              <option value="">Assign to</option>
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

        <div className="flex justify-start gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-lg border-slate-200 text-white hover:bg-slate-50 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-none"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

