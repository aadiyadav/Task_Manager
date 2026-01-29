type Status = 'pending' | 'inProgress' | 'completed'

type StatusBadgeProps = {
  status: Status
}

const statusConfig: Record<
  Status,
  { label: string; classes: string }
> = {
  pending: {
    label: 'Pending',
    classes:
      'bg-pending-100/10 text-pending-700 border border-pending-700/40',
  },
  inProgress: {
    label: 'In Progress',
    classes:
      'bg-inProgress-100/10 text-inProgress-700 border border-inProgress-700/40',
  },
  completed: {
    label: 'Completed',
    classes:
      'bg-completed-100/10 text-completed-700 border border-completed-700/40',
  },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const cfg = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  )
}

