export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function gameLabel(slug) {
  if (slug === 'call-of-duty') return 'Call of Duty';
  if (slug === 'marvel-rivals') return 'Marvel Rivals';
  if (slug === 'battlefield') return 'Battlefield';
  return slug;
}

export function subcategoryLabel(slug) {
  if (slug === 'rank-boost') return 'Rank Boost';
  if (slug === 'camo-unlock') return 'Camo Unlock';
  if (slug === 'special-items') return 'Special Items';
  if (slug === 'service-fee') return 'Service Fee';
  if (slug === 'prestige-leveling') return 'Prestige Leveling';
  return slug;
}

export function cartTotals(items) {
  const subtotal = items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 120 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

export function makeOrderNumber() {
  return `TC-${Date.now().toString().slice(-7)}`;
}
