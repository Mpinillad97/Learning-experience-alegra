import type { Accent } from '../types'

interface AccentStyles {
  badge: string
  soft: string
  solid: string
  text: string
  ring: string
}

/** Static class maps so Tailwind can detect every class at build time. */
export const accentStyles: Record<Accent, AccentStyles> = {
  indigo: {
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    soft: 'bg-indigo-50 text-indigo-600',
    solid: 'bg-indigo-600 text-white',
    text: 'text-indigo-600',
    ring: 'ring-indigo-200',
  },
  violet: {
    badge: 'bg-violet-50 text-violet-700 ring-violet-100',
    soft: 'bg-violet-50 text-violet-600',
    solid: 'bg-violet-600 text-white',
    text: 'text-violet-600',
    ring: 'ring-violet-200',
  },
}
