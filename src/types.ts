import { LoaderFunction } from 'react-router-dom'

export type Cache = Record<string, boolean>

export interface ContactItem {
  id: string
  first?: string
  last?: string
  createdAt: number
  favorite?: boolean
  avatar?: string
  twitter?: string
  notes?: string
}

export type LoaderData<Fn extends LoaderFunction> = Awaited<ReturnType<Fn>> extends Response | infer D ? D : never
