export default function Pagination({ page, totalPages, first, last, disabled, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Catalog pages">
      <button type="button" disabled={first || disabled} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>Page {page + 1} of {totalPages}</span>
      <button type="button" disabled={last || disabled} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </nav>
  )
}
