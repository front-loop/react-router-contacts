import { FC } from 'react'
import { Form, Link, LoaderFunction, Outlet, useLoaderData } from 'react-router-dom'
import { createdContact, getContacts } from '../contacts'
import { LoaderData } from '../types'

export const loader = (async () => {
  const contacts = await getContacts()
  return { contacts }
}) satisfies LoaderFunction

export const action = async () => {
  const contact = await createdContact()
  return { contact }
}

const Root: FC = () => {
  const { contacts } = useLoaderData() as LoaderData<typeof loader>

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
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
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{' '}
                      {contact.favorite && <span>★</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No contacts</p>
            )}
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  )
}

export default Root
