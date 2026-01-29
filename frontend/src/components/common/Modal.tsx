import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export const Modal = ({ open, title, onClose, children, className }: ModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 animate-in fade-in-0 zoom-in-95 ${className ?? ''}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-slate-600">{children}</div>
      </div>
    </div>
  )
}

