export type Cache = Record<string, boolean>

export interface ContactItem {
  id: string
  first?: string
  last?: string
  createdAt: number
}
