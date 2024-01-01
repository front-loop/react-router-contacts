import { FC, useEffect, useState } from 'react'
import { Form, LoaderFunction, NavLink, Outlet, useLoaderData, useNavigation, useSubmit } from 'react-router-dom'
import { createdContact, getContacts } from '../contacts'
import { LoaderData } from '../types'

export const loader = (async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') || ''
  const contacts = await getContacts(q)
  return { contacts, q }
}) satisfies LoaderFunction

export const action = async () => {
  const contact = await createdContact()
  return { contact }
}

const Root: FC = () => {
  const { contacts, q } = useLoaderData() as LoaderData<typeof loader>
  const [query, setQuery] = useState(q)
  const navigation = useNavigation()
  const submit = useSubmit()
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    setQuery(q)
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={query}
              onChange={(e) => {
                setQuery(e.target.value)
                submit(e.currentTarget.form, {
                  replace: q == null,
                })
              }}
              className={searching ? 'loading' : ''}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          {/* action 会响应这个 post 请求 */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          <ul>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      to={`contacts/${contact.id}`}
                      className={({ isActive, isPending }) => (isActive ? 'active' : isPending ? 'pending' : '')}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{' '}
                      {contact.favorite && <span>★</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No contacts</p>
            )}
          </ul>
        </nav>
      </div>
      <div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  )
}

export default Root
