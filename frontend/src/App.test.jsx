import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows successful backend connectivity', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'UP', service: 'thortful-catalog-service' }),
    })

    render(<App />)

    expect(await screen.findByText('Backend connected')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/health', expect.any(Object))
  })

  it('shows an unavailable state when the backend request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'))

    render(<App />)

    expect(await screen.findByText('Backend unavailable')).toBeInTheDocument()
  })
})
