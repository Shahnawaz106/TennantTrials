import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReviewCard from '../components/ReviewCard.jsx'

describe('ReviewCard', () => {
  it('renders the review body', () => {
    render(
      <ReviewCard
        rating={4}
        body="Great building."
        date="2026-04-02"
        author="James Chen"
      />
    )
    expect(screen.getByText('Great building.')).toBeInTheDocument()
  })

  it('renders the correct number of filled stars', () => {
    render(
      <ReviewCard rating={3} body="OK place." date="2026-01-01" author="Sara" />
    )
    const stars = screen.getAllByText('★')
    expect(stars.length).toBe(3)
  })

  it('renders the author name', () => {
    render(
      <ReviewCard rating={5} body="Loved it." date="2026-03-01" author="James Chen" />
    )
    expect(screen.getByText('James Chen')).toBeInTheDocument()
  })

  it('renders the date', () => {
    render(
      <ReviewCard rating={4} body="Good." date="2026-04-02" author="Alex" />
    )
    expect(screen.getByText('2026-04-02')).toBeInTheDocument()
  })

  it('does not render edit/delete buttons when not owner', () => {
    render(
      <ReviewCard rating={4} body="Good." date="2026-04-02" author="Alex" isOwner={false} />
    )
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
})
