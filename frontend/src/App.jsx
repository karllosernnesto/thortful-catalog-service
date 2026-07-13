import { useEffect, useState } from 'react'
import { createCard, deleteCard, getCards } from './api.js'
import CardForm from './components/CardForm.jsx'
import CardList from './components/CardList.jsx'
import Pagination from './components/Pagination.jsx'
import { CATEGORIES } from './constants.js'

const PAGE_SIZE = 12
const EMPTY_PAGE = {
  content: [],
  page: 0,
  size: PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
}

export default function App() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(0)
  const [catalog, setCatalog] = useState(EMPTY_PAGE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [highlightedId, setHighlightedId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(0)
      setSearch(searchInput.trim())
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    const controller = new AbortController()

    async function loadCatalog() {
      setLoading(true)
      setError('')
      try {
        const result = await getCards({ search, category, page, size: PAGE_SIZE }, controller.signal)
        setCatalog(result)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadCatalog()
    return () => controller.abort()
  }, [search, category, page, refreshKey])

  useEffect(() => {
    if (!highlightedId) return undefined

    const newCard = document.querySelector(`[data-card-id="${highlightedId}"]`)
    if (!newCard) return undefined

    const bounds = newCard.getBoundingClientRect()
    const isVisible = bounds.top >= 0 && bounds.bottom <= window.innerHeight
    if (!isVisible) {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      newCard.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' })
    }

    const timeout = window.setTimeout(() => setHighlightedId(null), 3000)
    return () => window.clearTimeout(timeout)
  }, [highlightedId, catalog.content])

  function handleCategoryChange(event) {
    setCategory(event.target.value)
    setPage(0)
  }

  async function handleCreate(values) {
    setError('')
    setSuccess('')
    try {
      const created = await createCard(values)
      setSuccess(`“${created.title}” was added.`)
      setHighlightedId(created.id)
      setSearchInput('')
      setSearch('')
      setCategory('')
      setPage(0)
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  async function handleDelete(card) {
    if (!window.confirm(`Delete “${card.title}”?`)) return

    setDeletingId(card.id)
    setError('')
    setSuccess('')
    try {
      await deleteCard(card.id)
      setSuccess(`“${card.title}” was removed.`)
      if (catalog.content.length === 1 && page > 0) {
        setPage((current) => current - 1)
      } else {
        setRefreshKey((current) => current + 1)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main>
      <header className="page-header">
        <div>
          <p className="eyebrow">Greeting card collection</p>
          <h1>Card catalog</h1>
          <p className="intro">Find, add, and manage cards without loading the entire catalog.</p>
        </div>
        <CardForm onCreate={handleCreate} />
      </header>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <div>
            <h2 id="catalog-title">Cards</h2>
            <p className="result-count" aria-live="polite">
              {loading && catalog.totalElements === 0
                ? 'Loading results…'
                : `${catalog.totalElements.toLocaleString()} result${catalog.totalElements === 1 ? '' : 's'}`}
            </p>
          </div>

          <div className="filters" role="search">
            <label>
              <span>Search title or artist</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Try Maya Patel"
              />
            </label>
            <label>
              <span>Category</span>
              <select value={category} onChange={handleCategoryChange}>
                <option value="">All categories</option>
                {CATEGORIES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {success && <p className="notice notice--success" role="status">{success}</p>}
        {error && (
          <div className="notice notice--error" role="alert">
            <span>{error}</span>
            <button type="button" className="text-button" onClick={() => setRefreshKey((key) => key + 1)}>
              Try again
            </button>
          </div>
        )}
        {loading && catalog.content.length > 0 && <p className="loading-bar" role="status">Updating results…</p>}

        {loading && catalog.content.length === 0 ? (
          <div className="state-panel" role="status">Loading cards…</div>
        ) : catalog.content.length === 0 && !error ? (
          <div className="state-panel">
            <h3>No cards found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <CardList
            cards={catalog.content}
            deletingId={deletingId}
            highlightedId={highlightedId}
            onDelete={handleDelete}
          />
        )}

        {!error && catalog.content.length > 0 && (
          <Pagination
            page={catalog.page}
            totalPages={catalog.totalPages}
            first={catalog.first}
            last={catalog.last}
            disabled={loading}
            onPageChange={setPage}
          />
        )}
      </section>
    </main>
  )
}
