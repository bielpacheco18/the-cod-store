const gameImages = {
  'call-of-duty': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/capsule_616x353.jpg',
  'marvel-rivals': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2767030/capsule_616x353.jpg',
  battlefield: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1517290/capsule_616x353.jpg'
};

const products = [
  { id: 301, game: 'call-of-duty', subcategory: 'rank-boost', title: 'Rank Boost Package - Basic', price: 99, featured: true, hue: 208, code: 'CO', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/capsule_616x353.jpg', description: 'Entry-level ranked progression service.' },
  { id: 302, game: 'call-of-duty', subcategory: 'camo-unlock', title: 'Camo Unlock Package - Standard', price: 149, featured: true, hue: 178, code: 'CO', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/capsule_616x353.jpg', description: 'Popular camo unlock option for multiplayer.' },
  { id: 303, game: 'call-of-duty', subcategory: 'prestige-leveling', title: 'Prestige Leveling - Advanced', price: 249, featured: false, hue: 224, code: 'CO', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/capsule_616x353.jpg', description: 'Fast prestige progression with status updates.' },
  { id: 304, game: 'call-of-duty', subcategory: 'special-items', title: 'Special Items Bundle', price: 129, featured: false, hue: 188, code: 'CO', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/capsule_616x353.jpg', description: 'Bundle service for limited unlock targets.' },

  { id: 305, game: 'marvel-rivals', subcategory: 'rank-boost', title: 'Rank Boost Package - Basic', price: 89, featured: true, hue: 330, code: 'MR', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2767030/capsule_616x353.jpg', description: 'Entry-level ranked progression service.' },
  { id: 306, game: 'marvel-rivals', subcategory: 'rank-boost', title: 'Rank Boost Package - Pro', price: 179, featured: false, hue: 336, code: 'MR', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2767030/capsule_616x353.jpg', description: 'High-efficiency boost for competitive ranks.' },
  { id: 307, game: 'marvel-rivals', subcategory: 'camo-unlock', title: 'Skin/Cosmetic Unlock Service', price: 119, featured: false, hue: 318, code: 'MR', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2767030/capsule_616x353.jpg', description: 'Unlock-focused service for selected cosmetics.' },
  { id: 308, game: 'marvel-rivals', subcategory: 'special-items', title: 'Event Rewards Completion', price: 139, featured: false, hue: 322, code: 'MR', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2767030/capsule_616x353.jpg', description: 'Complete event objectives and claim rewards.' },

  { id: 309, game: 'battlefield', subcategory: 'rank-boost', title: 'Rank Boost Package - Standard', price: 109, featured: true, hue: 112, code: 'BF', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1517290/capsule_616x353.jpg', description: 'Steady rank progression with safe routing.' },
  { id: 310, game: 'battlefield', subcategory: 'rank-boost', title: 'Placement Matches Service', price: 79, featured: false, hue: 116, code: 'BF', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1517290/capsule_616x353.jpg', description: 'Placement completion by verified players.' },
  { id: 311, game: 'battlefield', subcategory: 'special-items', title: 'Challenge Completion Pack', price: 129, featured: false, hue: 124, code: 'BF', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1517290/capsule_616x353.jpg', description: 'Objective and challenge-based completion service.' },
  { id: 312, game: 'battlefield', subcategory: 'service-fee', title: 'Priority Queue Add-on', price: 19, featured: false, hue: 132, code: 'BF', image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1517290/capsule_616x353.jpg', description: 'Prioritized assignment for faster service start.' }
];

const state = {
  filter: 'all',
  subcategory: 'all',
  search: '',
  sort: 'featured',
  cart: loadCart()
};

const featuredGrid = document.getElementById('featured-grid');
const catalogGrid = document.getElementById('catalog-grid');
const filters = document.getElementById('filters');
const subfilters = document.getElementById('subfilters');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const resultsCount = document.getElementById('results-count');
const reviewsTrack = document.getElementById('reviews-track');
const reviewsPrev = document.getElementById('reviews-prev');
const reviewsNext = document.getElementById('reviews-next');

const cartDrawer = document.getElementById('cart-drawer');
const openCartBtn = document.getElementById('open-cart');
const openCartHeroBtn = document.getElementById('open-cart-hero');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');

const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping-cost');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');

const checkoutForm = document.getElementById('checkout-form');
const checkoutMessage = document.getElementById('checkout-message');
const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

function gameLabel(game) {
  if (game === 'call-of-duty') return 'Call of Duty';
  if (game === 'marvel-rivals') return 'Marvel Rivals';
  if (game === 'battlefield') return 'Battlefield';
  return game;
}

function subcategoryLabel(subcategory) {
  if (subcategory === 'rank-boost') return 'Rank Boost';
  if (subcategory === 'camo-unlock') return 'Camo Unlock';
  if (subcategory === 'special-items') return 'Special Items';
  if (subcategory === 'nuke-services') return 'Nuke Services';
  if (subcategory === 'dark-ops') return 'Dark Ops';
  if (subcategory === 'service-fee') return 'Service Fee';
  if (subcategory === 'prestige-leveling') return 'Prestige Leveling';
  return subcategory;
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function getSubcategoryOptions() {
  const source = state.filter === 'all'
    ? products
    : products.filter((item) => item.game === state.filter);

  return [...new Set(source.map((item) => item.subcategory))].sort((a, b) =>
    subcategoryLabel(a).localeCompare(subcategoryLabel(b))
  );
}

function renderSubfilters() {
  const options = getSubcategoryOptions();
  const buttons = [
    `<button class="filter ${state.subcategory === 'all' ? 'active' : ''}" data-subfilter="all" type="button">All Subcategories</button>`,
    ...options.map((sub) =>
      `<button class="filter ${state.subcategory === sub ? 'active' : ''}" data-subfilter="${sub}" type="button">${subcategoryLabel(sub)}</button>`
    )
  ];
  subfilters.innerHTML = buttons.join('');
}

function cardTemplate(product) {
  return `
    <article class="product-card">
      <div class="thumb" style="--hue:${product.hue};">
        <img src="${product.image || gameImages[product.game]}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='${gameImages[product.game]}'" />
        <div class="thumb-overlay">
          <strong>${gameLabel(product.game)}</strong>
          <span>${product.code}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="tags-row">
          <span class="tag">${gameLabel(product.game)}</span>
          <span class="tag subtag">${subcategoryLabel(product.subcategory)}</span>
        </div>
        <h3 class="card-title">${product.title}</h3>
        <p class="desc">${product.description}</p>
        <div class="price-row">
          <span class="price">${formatPrice(product.price)}</span>
          <button class="add-btn" data-id="${product.id}" type="button">Add</button>
        </div>
      </div>
    </article>
  `;
}

function getFilteredProducts() {
  let list = [...products];

  if (state.filter !== 'all') {
    list = list.filter((item) => item.game === state.filter);
  }

  if (state.subcategory !== 'all') {
    list = list.filter((item) => item.subcategory === state.subcategory);
  }

  if (state.search) {
    const query = state.search.toLowerCase();
    list = list.filter((item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      gameLabel(item.game).toLowerCase().includes(query) ||
      subcategoryLabel(item.subcategory).toLowerCase().includes(query)
    );
  }

  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'name-asc') list.sort((a, b) => a.title.localeCompare(b.title));
  if (state.sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured));

  return list;
}

function renderFeatured() {
  featuredGrid.innerHTML = products.filter((p) => p.featured).map(cardTemplate).join('');
}

function renderCatalog() {
  const filtered = getFilteredProducts();
  resultsCount.textContent = `${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
  catalogGrid.innerHTML = filtered.length
    ? filtered.map(cardTemplate).join('')
    : '<p class="empty-cart">No products found for your filters.</p>';
}

function saveCart() {
  localStorage.setItem('thecodstore_cart', JSON.stringify(state.cart));
}

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem('thecodstore_cart') || '[]');
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: productId, qty: 1 });
  }
  checkoutMessage.textContent = '';
  saveCart();
  renderCart();
}

function changeQty(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeItem(productId) {
  state.cart = state.cart.filter((entry) => entry.id !== productId);
  saveCart();
  renderCart();
}

function getCartDetailed() {
  return state.cart.map((entry) => {
    const product = products.find((p) => p.id === entry.id);
    return {
      ...entry,
      product,
      lineTotal: product ? product.price * entry.qty : 0
    };
  }).filter((entry) => entry.product);
}

function cartTotals() {
  const items = getCartDetailed();
  const subtotal = items.reduce((acc, item) => acc + item.lineTotal, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 120 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { items, subtotal, shipping, tax, total };
}

function renderCart() {
  const { items, subtotal, shipping, tax, total } = cartTotals();

  cartCount.textContent = String(items.reduce((acc, item) => acc + item.qty, 0));

  if (!items.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add items from catalog.</p>';
  } else {
    cartItems.innerHTML = items.map((item) => `
      <article class="cart-item">
        <h4>${item.product.title}</h4>
        <p>${gameLabel(item.product.game)} | ${formatPrice(item.product.price)} each</p>
        <div class="item-row">
          <div class="qty-controls">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}" type="button">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}" type="button">+</button>
          </div>
          <strong>${formatPrice(item.lineTotal)}</strong>
        </div>
        <button class="remove-btn" data-action="remove" data-id="${item.id}" type="button">Remove</button>
      </article>
    `).join('');
  }

  subtotalEl.textContent = formatPrice(subtotal);
  shippingEl.textContent = formatPrice(shipping);
  taxEl.textContent = formatPrice(tax);
  totalEl.textContent = formatPrice(total);
}

function setFilter(filter) {
  state.filter = filter;

  const options = getSubcategoryOptions();
  if (state.subcategory !== 'all' && !options.includes(state.subcategory)) {
    state.subcategory = 'all';
  }

  document.querySelectorAll('#filters .filter').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  renderSubfilters();
  renderCatalog();
}

function setSubcategory(subcategory) {
  state.subcategory = subcategory;
  renderSubfilters();
  renderCatalog();
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  overlay.hidden = true;
}

function validateCheckout(name, email, country) {
  if (!name || !email || !country) return 'Please fill all checkout fields.';
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return 'Please enter a valid email.';
  if (state.cart.length === 0) return 'Your cart is empty.';
  return '';
}

function handleCheckout(event) {
  event.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const email = document.getElementById('customer-email').value.trim();
  const country = document.getElementById('customer-country').value.trim();

  const error = validateCheckout(name, email, country);
  if (error) {
    checkoutMessage.textContent = error;
    return;
  }

  const orderId = `DT-${Date.now().toString().slice(-6)}`;
  checkoutMessage.textContent = `Order ${orderId} confirmed for ${name}. Confirmation sent to ${email}.`;
  state.cart = [];
  saveCart();
  renderCart();
  checkoutForm.reset();
}

function initReviewsCarousel() {
  if (!reviewsTrack || !reviewsPrev || !reviewsNext) return;

  let autoplayId = null;

  function scrollStep() {
    const firstCard = reviewsTrack.firstElementChild;
    if (!firstCard) return 320;
    const gap = Number.parseFloat(getComputedStyle(reviewsTrack).columnGap || '0');
    return firstCard.getBoundingClientRect().width + gap;
  }

  function scrollNext() {
    const step = scrollStep();
    const maxLeft = reviewsTrack.scrollWidth - reviewsTrack.clientWidth;
    const isAtEnd = reviewsTrack.scrollLeft >= maxLeft - 2;
    if (isAtEnd) {
      reviewsTrack.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    reviewsTrack.scrollBy({ left: step, behavior: 'smooth' });
  }

  function scrollPrev() {
    const step = scrollStep();
    const isAtStart = reviewsTrack.scrollLeft <= 2;
    if (isAtStart) {
      reviewsTrack.scrollTo({ left: reviewsTrack.scrollWidth, behavior: 'smooth' });
      return;
    }
    reviewsTrack.scrollBy({ left: -step, behavior: 'smooth' });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = window.setInterval(scrollNext, 3500);
  }

  function stopAutoplay() {
    if (!autoplayId) return;
    window.clearInterval(autoplayId);
    autoplayId = null;
  }

  reviewsNext.addEventListener('click', () => {
    scrollNext();
    startAutoplay();
  });

  reviewsPrev.addEventListener('click', () => {
    scrollPrev();
    startAutoplay();
  });

  reviewsTrack.addEventListener('mouseenter', stopAutoplay);
  reviewsTrack.addEventListener('mouseleave', startAutoplay);
  reviewsTrack.addEventListener('focusin', stopAutoplay);
  reviewsTrack.addEventListener('focusout', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  startAutoplay();
}

function loadChatMessages() {
  try {
    const parsed = JSON.parse(localStorage.getItem('thecodstore_live_chat') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveChatMessages(items) {
  localStorage.setItem('thecodstore_live_chat', JSON.stringify(items.slice(-40)));
}

function botReplyFor(text) {
  const value = text.toLowerCase();
  if (value.includes('price') || value.includes('cost')) {
    return 'Prices vary by game and target rank. Tell me your game and current rank so I can suggest the best package.';
  }
  if (value.includes('boost') || value.includes('rank')) {
    return 'Our verified boosters can start right after payment confirmation. Average completion depends on your target rank.';
  }
  if (value.includes('delivery') || value.includes('code')) {
    return 'Most digital codes are delivered by email within minutes after payment approval.';
  }
  if (value.includes('paypal') || value.includes('stripe') || value.includes('payment')) {
    return 'We support secure checkout with Stripe and PayPal. Your payment details are protected with encryption.';
  }
  if (value.includes('discord') || value.includes('support') || value.includes('ticket')) {
    return 'After checkout, join our Discord and open a support ticket. We are online 24/7.';
  }
  return 'Thanks for your message. Share your game and goal rank, and I will guide you to the right service.';
}

function appendChatMessage(role, text) {
  const item = document.createElement('p');
  item.className = `chat-msg ${role}`;
  item.textContent = text;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function initChat() {
  if (!chatToggle || !chatWidget || !chatClose || !chatForm || !chatInput || !chatMessages) return;

  let messages = loadChatMessages();
  if (!messages.length) {
    messages = [
      { role: 'bot', text: 'Welcome to The Cod Store support. How can we help you today?' }
    ];
    saveChatMessages(messages);
  }

  messages.forEach((msg) => appendChatMessage(msg.role, msg.text));

  function openChat() {
    chatWidget.classList.add('open');
    chatWidget.setAttribute('aria-hidden', 'false');
    chatInput.focus();
  }

  function closeChatWidget() {
    chatWidget.classList.remove('open');
    chatWidget.setAttribute('aria-hidden', 'true');
  }

  chatToggle.addEventListener('click', openChat);
  chatClose.addEventListener('click', closeChatWidget);

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendChatMessage('user', text);
    messages.push({ role: 'user', text });
    saveChatMessages(messages);
    chatInput.value = '';

    const reply = botReplyFor(text);
    window.setTimeout(() => {
      appendChatMessage('bot', reply);
      messages.push({ role: 'bot', text: reply });
      saveChatMessages(messages);
    }, 500);
  });
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('.filter');
  if (!button) return;
  setFilter(button.dataset.filter);
});

subfilters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-subfilter]');
  if (!button) return;
  setSubcategory(button.dataset.subfilter);
});

searchInput.addEventListener('input', () => {
  state.search = searchInput.value.trim();
  renderCatalog();
});

sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  renderCatalog();
});

document.body.addEventListener('click', (event) => {
  const addBtn = event.target.closest('.add-btn');
  if (addBtn) {
    addToCart(Number(addBtn.dataset.id));
    return;
  }

  const qtyBtn = event.target.closest('.qty-btn');
  if (qtyBtn) {
    const id = Number(qtyBtn.dataset.id);
    const action = qtyBtn.dataset.action;
    if (action === 'increase') changeQty(id, 1);
    if (action === 'decrease') changeQty(id, -1);
    return;
  }

  const removeBtn = event.target.closest('.remove-btn');
  if (removeBtn) {
    removeItem(Number(removeBtn.dataset.id));
  }
});

openCartBtn.addEventListener('click', openCart);
openCartHeroBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
checkoutForm.addEventListener('submit', handleCheckout);

renderFeatured();
renderSubfilters();
renderCatalog();
renderCart();
initReviewsCarousel();
initChat();
