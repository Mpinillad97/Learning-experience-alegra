import { Quote } from 'lucide-react'

interface KeyMessageProps {
  label: string
  message: string
}

export function KeyMessage({ label, message }: KeyMessageProps) {
  return (
    <figure className="relative overflow-hidden rounded-xl border border-indigo-200 bg-white p-6 shadow-xs">
      <div className="absolute inset-y-0 left-0 w-1 bg-indigo-600" />
      <figcaption className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        <Quote className="size-4" />
        {label}
      </figcaption>
      <blockquote className="mt-3 text-lg font-medium leading-snug tracking-tight text-slate-900 sm:text-xl">
        “{message}”
      </blockquote>
    </figure>
  )
}
