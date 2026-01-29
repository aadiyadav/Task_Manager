import type { LucideIcon } from 'lucide-react'
import { FileQuestion } from 'lucide-react'

interface EmptyStateProps {
    title: string
    description?: string
    icon?: LucideIcon
    action?: React.ReactNode
}

export const EmptyState = ({
    title,
    description,
    icon: Icon = FileQuestion,
    action,
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                <Icon className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-slate-500 max-w-sm">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}
