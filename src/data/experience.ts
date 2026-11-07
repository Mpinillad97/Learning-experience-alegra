import { Briefcase, Headset } from 'lucide-react'
import type { ExperienceMode, Role, RoleId } from '../types'

export const experience = {
  name: 'Learning Experience',
  product: 'Smart Reconciliation',
  durationMinutes: 25,
  description:
    'Una experiencia práctica para entender Smart Reconciliation y aprender a comunicar su valor con claridad en conversaciones reales con clientes.',
  outcomes: [
    'Qué problema resuelve Smart Reconciliation y para quién.',
    'Cómo explicar su funcionamiento sin prometer de más.',
    'Cómo actuar en situaciones reales con criterio y confianza.',
  ],
} as const

export const roles: Role[] = [
  {
    id: 'sales',
    name: 'Sales',
    tagline: 'Discovery, posicionamiento y gestión de expectativas.',
    description:
      'Identifica necesidades de conciliación, posiciona el producto frente al cliente y define expectativas realistas.',
    focus: ['Discovery', 'Posicionamiento', 'Expectativas'],
    icon: Briefcase,
  },
  {
    id: 'cx',
    name: 'Customer Experience',
    tagline: 'Orientación al usuario, manejo de sugerencias y resolución de situaciones.',
    description:
      'Guía al usuario en su día a día, interpreta las sugerencias del sistema y resuelve casos con empatía.',
    focus: ['Orientación', 'Sugerencias', 'Resolución'],
    icon: Headset,
  },
]

export const getRole = (id: RoleId): Role => roles.find((role) => role.id === id)!

export const modes: Record<ExperienceMode, { label: string; minutes: number; description: string }> = {
  full: {
    label: 'Experiencia completa',
    minutes: 25,
    description: 'Todas las lecciones y actividades, más la simulación evaluada.',
  },
  quick: {
    label: 'Demostración rápida',
    minutes: 13,
    description: 'Lecciones esenciales y la simulación evaluada completa.',
  },
}
