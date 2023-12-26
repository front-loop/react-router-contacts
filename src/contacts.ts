import localforage from 'localforage'
import { Cache, ContactItem } from './types'
import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

let fakeCache: Cache = {}

async function fakeNetwork(key: string): Promise<void> {
  if (!key) fakeCache = {}

  if (fakeCache[key]) return

  return new Promise((res) => {
    setTimeout(res, Math.random() * 800)
  })
}

function set(contacts: ContactItem[]): Promise<ContactItem[]> {
  return localforage.setItem('contacts', contacts)
}

export async function getContacts(query?: string): Promise<ContactItem[]> {
  await fakeNetwork(`getContacts:${query}`)
  let contacts: ContactItem[] = (await localforage.getItem('contacts')) || []

  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] })
  }
  return contacts.sort(sortBy('last', 'createdAt'))
}

export async function getContact(id: string): Promise<ContactItem | null> {
  await fakeNetwork(`getContact:${id}`)
  const contacts: ContactItem[] = (await localforage.getItem('contacts')) || []
  return contacts.find((c) => c.id === id) ?? null
}

export async function createdContact(): Promise<ContactItem> {
  await fakeNetwork('')
  const id = Math.random().toString(36).substring(2, 9)
  const contact: ContactItem = { id, createdAt: Date.now() }
  const contacts = await getContacts()
  contacts.unshift(contact)
  await set(contacts)
  return contact
}

export async function updateContact(id: string, updates: Partial<ContactItem>): Promise<ContactItem> {
  await fakeNetwork('')
  const contacts: ContactItem[] = (await localforage.getItem('contacts')) || []
  const contact = contacts.find((c) => c.id === id)
  if (!contact) throw new Error(`No contact found for ${id}`)
  Object.assign(contact, updates)
  await set(contacts)
  return contact
}

export async function deleteContact(id: string): Promise<boolean> {
  const contacts: ContactItem[] = (await localforage.getItem('contacts')) || []
  const idx = contacts.findIndex((c) => c.id === id)
  if (idx > -1) {
    contacts.splice(idx, 1)
    await set(contacts)
    return true
  }
  return false
}
