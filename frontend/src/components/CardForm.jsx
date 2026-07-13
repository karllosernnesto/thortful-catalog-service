import { useState } from 'react'
import { CATEGORIES } from '../constants.js'

const INITIAL_FORM = { title: '', artist: '', category: 'BIRTHDAY', price: '3.49' }

export default function CardForm({ onCreate }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await onCreate({ ...form, price: Number(form.price) })
      setForm(INITIAL_FORM)
      setOpen(false)
    } catch {
      // The parent renders the API error and keeps the form values for correction.
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return <button type="button" className="primary-button add-button" onClick={() => setOpen(true)}>Add card</button>
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>Add a card</h2>
        <button type="button" className="text-button" onClick={() => setOpen(false)}>Cancel</button>
      </div>
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input name="title" value={form.title} onChange={updateField} maxLength="120" required />
        </label>
        <label>
          <span>Artist</span>
          <input name="artist" value={form.artist} onChange={updateField} maxLength="80" required />
        </label>
        <label>
          <span>Category</span>
          <select name="category" value={form.category} onChange={updateField} required>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Price (£)</span>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={updateField}
            min="0.01"
            max="999.99"
            step="0.01"
            required
          />
        </label>
      </div>
      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add to catalog'}
      </button>
    </form>
  )
}
