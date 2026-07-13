import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

const card = {
  id: 1200,
  title: 'Bright Birthday - Big Happy Wishes',
  artist: 'Maya Patel',
  category: 'BIRTHDAY',
  price: 3.49,
  createdAt: '2025-01-02T05:00:00',
}

function catalogPage({ content = [card], page = 0, totalElements = content.length, totalPages = 1 } = {}) {
  return {
    content,
    page,
    size: 12,
    totalElements,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
  }
}

function response(body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: vi.fn().mockResolvedValue(body) }
}

describe('App', () => {
  afterEach(() => vi.restoreAllMocks())

  it('loads a paginated catalog and displays the total', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(catalogPage({ totalElements: 1200, totalPages: 100 })))

    render(<App />)

    expect(await screen.findByText(card.title)).toBeInTheDocument()
    expect(screen.getByText('1,200 results')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 100')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/cards?page=0&size=12', expect.any(Object))
  })

  it('debounces search before requesting the first page', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(catalogPage()))
      .mockResolvedValueOnce(response(catalogPage()))

    render(<App />)
    await screen.findByText(card.title)

    fireEvent.change(screen.getByLabelText('Search title or artist'), { target: { value: 'Maya Patel' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2), { timeout: 1000 })
    expect(fetchMock.mock.calls[1][0]).toBe('/api/cards?page=0&size=12&search=Maya+Patel')
  })

  it('filters by category and resets to the first page', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(catalogPage()))
      .mockResolvedValueOnce(response(catalogPage()))

    render(<App />)
    await screen.findByText(card.title)
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'WEDDING' } })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(fetchMock.mock.calls[1][0]).toBe('/api/cards?page=0&size=12&category=WEDDING')
  })

  it('requests the next page', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(catalogPage({ totalElements: 24, totalPages: 2 })))
      .mockResolvedValueOnce(response(catalogPage({ page: 1, totalElements: 24, totalPages: 2 })))

    render(<App />)
    await screen.findByText(card.title)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(fetchMock.mock.calls[1][0]).toBe('/api/cards?page=1&size=12')
    expect(await screen.findByText('Page 2 of 2')).toBeInTheDocument()
  })

  it('adds a card and refreshes the catalog', async () => {
    const created = { ...card, id: 1201, title: 'A Brilliant New Adventure', artist: 'Jamie Stone' }
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(catalogPage()))
      .mockResolvedValueOnce(response(created, { status: 201 }))
      .mockResolvedValueOnce(response(catalogPage({ content: [created, card], totalElements: 1201, totalPages: 101 })))

    render(<App />)
    await screen.findByText(card.title)
    fireEvent.click(screen.getByRole('button', { name: 'Add card' }))

    const form = screen.getByRole('heading', { name: 'Add a card' }).closest('form')
    fireEvent.change(within(form).getByLabelText('Title'), { target: { value: created.title } })
    fireEvent.change(within(form).getByLabelText('Artist'), { target: { value: created.artist } })
    fireEvent.change(within(form).getByLabelText('Category'), { target: { value: 'CONGRATULATIONS' } })
    fireEvent.click(within(form).getByRole('button', { name: 'Add to catalog' }))

    expect(await screen.findByText(`“${created.title}” was added.`)).toBeInTheDocument()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    expect(fetchMock.mock.calls[1][0]).toBe('/api/cards')
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: 'POST' })
  })

  it('asks for confirmation before deleting and refreshes after success', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(catalogPage()))
      .mockResolvedValueOnce({ ok: true, status: 204, json: vi.fn() })
      .mockResolvedValueOnce(response(catalogPage({ content: [] })))
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<App />)
    await screen.findByText(card.title)
    fireEvent.click(screen.getByRole('button', { name: `Delete ${card.title}` }))

    expect(confirm).toHaveBeenCalledWith(`Delete “${card.title}”?`)
    expect(await screen.findByText(`“${card.title}” was removed.`)).toBeInTheDocument()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    expect(fetchMock.mock.calls[1]).toEqual([`/api/cards/${card.id}`, { method: 'DELETE' }])
  })

  it('renders empty and error states', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(catalogPage({ content: [] })))
      .mockResolvedValueOnce(response({ detail: 'Catalog unavailable' }, { ok: false, status: 503 }))

    const { unmount } = render(<App />)
    expect(await screen.findByText('No cards found')).toBeInTheDocument()
    unmount()

    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Catalog unavailable')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
