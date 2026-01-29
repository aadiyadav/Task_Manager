import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  name: string
}

export const Input = ({ label, error, name, className = '', ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`w-full h-11 rounded-lg bg-slate-950 border border-slate-700 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

