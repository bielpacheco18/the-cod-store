import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, hasSupabaseConfig } from '../lib/supabase.js';
import { formatDate, formatPrice } from '../lib/utils.js';

function OrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadOrders() {
    if (!user) return;
    if (!hasSupabaseConfig || !supabase) {
      setMessage('Supabase is not configured.');
      return;
    }

    setLoading(true);
    setMessage('Loading your orders...');

    const { data: orderData, error } = await supabase
      .from('orders')
      .select('id, order_number, total, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error || !Array.isArray(orderData)) {
      setOrders([]);
      setMessage('Failed to load orders.');
      setLoading(false);
      return;
    }

    if (!orderData.length) {
      setOrders([]);
      setMessage('No orders found yet.');
      setLoading(false);
      return;
    }

    const ids = orderData.map((order) => order.id);
    const { data: itemsData } = await supabase
      .from('order_items')
      .select('order_id, product_title, quantity, line_total')
      .in('order_id', ids);

    const grouped = new Map();
    (itemsData || []).forEach((item) => {
      const current = grouped.get(item.order_id) || [];
      current.push(item);
      grouped.set(item.order_id, current);
    });

    setOrders(orderData.map((order) => ({ ...order, items: grouped.get(order.id) || [] })));
    setMessage('Your latest orders from Supabase.');
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <main className="container page">
        <section className="empty-state">
          <h1>My Orders</h1>
          <p>Please login to view your order history.</p>
          <Link className="btn btn-primary" to="/login">Go to Login</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container page">
      <section className="section-head">
        <h1>My Orders</h1>
        <button className="btn btn-ghost" onClick={loadOrders} disabled={loading}>Refresh</button>
      </section>
      <p className="hint-text">{message}</p>

      <section className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-top">
              <div>
                <h3>{order.order_number}</h3>
                <p>{formatDate(order.created_at)} | {order.status}</p>
              </div>
              <strong>{formatPrice(order.total)}</strong>
            </div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <p key={`${order.id}-${idx}`}>{item.quantity}x {item.product_title} ({formatPrice(item.line_total)})</p>
              ))}
            </div>
          </article>
        ))}
        {!orders.length && !loading ? <p className="empty-box">No orders to display.</p> : null}
      </section>
    </main>
  );
}

export default OrdersPage;
