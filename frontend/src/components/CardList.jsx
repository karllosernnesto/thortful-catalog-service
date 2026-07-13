import { categoryLabel } from '../constants.js'

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

export default function CardList({ cards, deletingId, highlightedId, onDelete }) {
  return (
    <ul className="card-grid" aria-label="Card results">
      {cards.map((card) => (
        <li
          className={`catalog-card ${highlightedId === card.id ? 'catalog-card--highlighted' : ''}`}
          data-card-id={card.id}
          key={card.id}
        >
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
              aria-label={deletingId === card.id ? `Removing ${card.title}` : `Delete ${card.title}`}
              title={`Delete ${card.title}`}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-1 11H8L7 9Zm3 2v6h2v-6h-2Zm4 0v6h2v-6h-2Z" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
