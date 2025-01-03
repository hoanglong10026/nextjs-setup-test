import { render, screen } from '@testing-library/react'
import Hello from './Hello'

describe('Hello component', () => {
  it('should render a greeting message', () => {
    render(<Hello name="John" />)
    const greetingElement = screen.getByText(/Hello, John!/i)
    expect(greetingElement).toBeInTheDocument()
  })

  it('should render a greeting message with another name', () => {
    render(<Hello name="Alice" />)
    const greetingElement = screen.getByText(/Hello, Alice!/i)
    expect(greetingElement).toBeInTheDocument()
  })
})
