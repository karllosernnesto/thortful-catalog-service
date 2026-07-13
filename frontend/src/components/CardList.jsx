import { categoryLabel } from '../constants.js'

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

export default function CardList({ cards, deletingId, onDelete }) {
  return (
    <ul className="card-grid" aria-label="Card results">
      {cards.map((card) => (
        <li className="catalog-card" key={card.id}>
          <div>
            <span className="category-tag">{categoryLabel(card.category)}</span>
            <h3>{card.title}</h3>
            <p>by {card.artist}</p>
          </div>
          <div className="card-footer">
            <strong>{currency.format(card.price)}</strong>
            <button
              type="button"
              className="delete-button"
              disabled={deletingId === card.id}
              onClick={() => onDelete(card)}
              aria-label={`Delete ${card.title}`}
            >
              {deletingId === card.id ? 'Removing…' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
