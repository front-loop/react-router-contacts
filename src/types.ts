import { LoaderFunction } from 'react-router-dom'

export type Cache = Record<string, boolean>

export interface ContactItem {
  id: string
  createdAt: number
  last?: string
  first?: string
  favorite?: boolean
  avatar?: string
  twitter?: string
  notes?: string
}

export type LoaderData<Fn extends LoaderFunction> = Awaited<ReturnType<Fn>> extends Response | infer D ? D : never
