async function request(path, options = {}) {
  const response = await fetch(path, options)
  if (response.status === 204) return null

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const fieldMessage = body?.errors ? Object.values(body.errors)[0] : null
    throw new Error(fieldMessage ?? body?.detail ?? 'Something went wrong. Please try again.')
  }
  return body
}

export function getCards({ search, category, page, size, minPrice, maxPrice }, signal) {
  const query = new URLSearchParams({ page: String(page), size: String(size) })
  if (search) query.set('search', search)
  if (category) query.set('category', category)
  if (minPrice) query.set("min_price", minPrice)
  if (maxPrice) query.set("max_price", maxPrice)
  return request(`/api/cards?${query}`, { signal })
}

export function createCard(card) {
  return request('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
}

export function deleteCard(id) {
  return request(`/api/cards/${id}`, { method: 'DELETE' })
}
