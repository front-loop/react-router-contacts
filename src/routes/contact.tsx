import { FC } from 'react'
import { Form, LoaderFunction, useLoaderData } from 'react-router-dom'
import { getContact } from '../contacts'
import { LoaderData } from '../types'

export const loader = (async ({ params }) => {
  const contact = await getContact(params.contactId!)
  return { contact }
}) satisfies LoaderFunction

const Contact: FC = () => {
  const { contact } = useLoaderData() as LoaderData<typeof loader>

  return (
    <div id="contact">
      <div>
        <img key={contact?.avatar} src={contact?.avatar} />
      </div>

      <div>
        <h1>
          {contact?.first || contact?.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
        </h1>

        {contact?.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact?.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Contact
