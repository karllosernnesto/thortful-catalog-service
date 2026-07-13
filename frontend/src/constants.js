export const CATEGORIES = [
  { value: 'ANNIVERSARY', label: 'Anniversary' },
  { value: 'BIRTHDAY', label: 'Birthday' },
  { value: 'CONGRATULATIONS', label: 'Congratulations' },
  { value: 'NEW_BABY', label: 'New baby' },
  { value: 'THANK_YOU', label: 'Thank you' },
  { value: 'WEDDING', label: 'Wedding' },
]

export function categoryLabel(value) {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value
}
