import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  let errorText = <p>Unknown Error</p>

  if (isRouteErrorResponse(error)) {
    errorText = (
      <p>
        {error.status} {error.statusText}
      </p>
    )
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {errorText}
    </div>
  )
}
