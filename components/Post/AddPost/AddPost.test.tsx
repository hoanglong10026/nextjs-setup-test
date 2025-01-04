import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import AddPost from './AddPost'
import { wrapper } from '@/mocks/react-query'
import { server } from '@/mocks/server'

describe('AddPost Component', () => {
  it('renders the form correctly', () => {
    render(<AddPost />, { wrapper })

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('successfully submits the form', async () => {
    const user = userEvent.setup()

    render(<AddPost />, { wrapper })

    // Fill in the form
    const titleInput = screen.getByLabelText(/title/i)
    const bodyInput = screen.getByLabelText(/body/i)

    await user.clear(titleInput)
    await user.type(titleInput, 'Test Title')

    await user.clear(bodyInput)
    await user.type(bodyInput, 'Test Body')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /submit/i }))

    // Check if loading state is shown
    expect(screen.getByText(/submitting/i)).toBeInTheDocument()

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/post created successfully/i)).toBeInTheDocument()
    })

    // Check if form is cleared
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
    expect(screen.getByLabelText(/body/i)).toHaveValue('')
  })

  it('displays specific error message when Error instance is received', async () => {
    const user = userEvent.setup()

    // Override the default handler to return a specific error
    server.use(
      http.post('https://jsonplaceholder.typicode.com/posts', () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        })
      })
    )

    render(<AddPost />, { wrapper })

    // Fill and submit form
    const titleInput = screen.getByLabelText(/title/i)
    const bodyInput = screen.getByLabelText(/body/i)

    await user.clear(titleInput)
    await user.type(titleInput, 'Test Title')

    await user.clear(bodyInput)
    await user.type(bodyInput, 'Test Body')

    await user.click(screen.getByRole('button', { name: /submit/i }))

    // Wait for and check the specific error message
    await waitFor(() => {
      expect(
        screen.getByText(/Error: Request failed with status code 500/i)
      ).toBeInTheDocument()
    })
  })

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup()

    render(<AddPost />, { wrapper })

    // Fill in the form
    const titleInput = screen.getByTestId(/title/i)
    const bodyInput = screen.getByTestId(/body/i)

    await user.type(titleInput, 'Test Title')
    await user.type(bodyInput, 'Test Body')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Submit the form
    await user.click(submitButton)

    // Check if button is disabled during submission
    expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })
})
