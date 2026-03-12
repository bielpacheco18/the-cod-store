const ordersHint = document.getElementById('orders-hint');
const ordersList = document.getElementById('orders-list');
const authStatus = document.getElementById('auth-status');
const authLink = document.getElementById('auth-link');
const refreshButton = document.getElementById('refresh-orders');

const supabaseStore = window.theCodStoreSupabase;
const supabaseClient = supabaseStore?.client ?? null;

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

function formatDate(value) {
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

function renderLoggedOut() {
  ordersHint.textContent = 'Login to view your order history.';
  ordersList.innerHTML = '<p class="rounded-xl border border-dashed border-slate-600 p-4 text-center text-slate-300">You are not logged in.</p>';
  authStatus.textContent = '';
  authLink.textContent = 'Login';
  authLink.href = 'login.html';
  delete authLink.dataset.authAction;
}

function renderOrders(orders) {
  if (!orders.length) {
    ordersList.innerHTML = '<p class="rounded-xl border border-dashed border-slate-600 p-4 text-center text-slate-300">No orders found yet.</p>';
    return;
  }

  ordersList.innerHTML = orders.map((order) => `
    <article class="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 class="text-sm font-bold">${order.order_number}</h3>
          <p class="text-xs text-slate-400">${formatDate(order.created_at)} | ${order.status}</p>
        </div>
        <strong class="text-emerald-300">${formatPrice(order.total)}</strong>
      </div>
      <div class="mt-3 grid gap-2 text-sm text-slate-300">
        ${(order.items || []).map((item) => `<p class="rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2">${item.quantity}x ${item.product_title} (${formatPrice(item.line_total)})</p>`).join('')}
      </div>
    </article>
  `).join('');
}

async function loadOrders() {
  if (!supabaseClient) {
    ordersHint.textContent = 'Supabase is not configured.';
    ordersList.innerHTML = '<p class="rounded-xl border border-dashed border-slate-600 p-4 text-center text-slate-300">Configure supabase-client.js first.</p>';
    return;
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const session = sessionData?.session ?? null;

  if (!session?.user) {
    renderLoggedOut();
    return;
  }

  authStatus.textContent = session.user.email || 'Signed in';
  authLink.textContent = 'Logout';
  authLink.href = '#';
  authLink.dataset.authAction = 'logout';

  ordersHint.textContent = 'Loading your orders...';
  const userId = session.user.id;

  const { data: orders, error: ordersError } = await supabaseClient
    .from('orders')
    .select('id, order_number, total, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (ordersError || !Array.isArray(orders)) {
    ordersHint.textContent = 'Failed to load orders.';
    ordersList.innerHTML = '<p class="rounded-xl border border-dashed border-slate-600 p-4 text-center text-slate-300">Could not load your orders right now.</p>';
    return;
  }

  if (!orders.length) {
    ordersHint.textContent = 'Your recent purchases synced from Supabase.';
    renderOrders([]);
    return;
  }

  const orderIds = orders.map((order) => order.id);
  const { data: items } = await supabaseClient
    .from('order_items')
    .select('order_id, product_title, quantity, line_total')
    .in('order_id', orderIds);

  const groupedItems = new Map();
  (items || []).forEach((item) => {
    const current = groupedItems.get(item.order_id) || [];
    current.push(item);
    groupedItems.set(item.order_id, current);
  });

  const fullOrders = orders.map((order) => ({
    ...order,
    items: groupedItems.get(order.id) || []
  }));

  ordersHint.textContent = 'Your recent purchases synced from Supabase.';
  renderOrders(fullOrders);
}

authLink.addEventListener('click', async (event) => {
  if (authLink.dataset.authAction !== 'logout') return;
  event.preventDefault();
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  renderLoggedOut();
});

refreshButton.addEventListener('click', () => {
  loadOrders();
});

loadOrders();
