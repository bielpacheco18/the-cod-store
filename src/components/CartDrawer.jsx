import { useMemo, useState } from 'react';
import { cartTotals, formatPrice } from '../lib/utils.js';

function CartDrawer({ open, onClose, items, onChangeQty, onCheckout, checkoutMessage, checkoutLoading, user }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');

  const totals = useMemo(() => {
    return cartTotals(items.map((item) => ({ price: item.product.price, quantity: item.quantity })));
  }, [items]);

  function submit(event) {
    event.preventDefault();
    onCheckout({ name: name.trim(), email: email.trim(), country: country.trim() });
  }

  return (
    <>
      <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer-head">
          <h2>Your Cart</h2>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div className="drawer-body">
          {!items.length ? <p className="empty-box">Your cart is empty.</p> : null}

          {items.map((item) => (
            <article key={item.product_id} className="cart-item">
              <img src={item.product.image} alt={item.product.title} loading="lazy" />
              <div>
                <h3>{item.product.title}</h3>
                <p>{formatPrice(item.product.price)}</p>
                <div className="qty-controls">
                  <button onClick={() => onChangeQty(item.product_id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onChangeQty(item.product_id, 1)}>+</button>
                </div>
              </div>
              <strong>{formatPrice(item.product.price * item.quantity)}</strong>
            </article>
          ))}
        </div>

        <div className="drawer-totals">
          <p><span>Subtotal</span><strong>{formatPrice(totals.subtotal)}</strong></p>
          <p><span>Shipping</span><strong>{formatPrice(totals.shipping)}</strong></p>
          <p><span>Tax (8%)</span><strong>{formatPrice(totals.tax)}</strong></p>
          <p className="total-row"><span>Total</span><strong>{formatPrice(totals.total)}</strong></p>
        </div>

        <form className="checkout-form" onSubmit={submit}>
          <h3>Checkout</h3>
          {!user ? <p className="warning-text">Sign in to complete checkout.</p> : null}
          <label>
            Full Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Country
            <input value={country} onChange={(e) => setCountry(e.target.value)} required />
          </label>
          <button className="btn btn-primary full" type="submit" disabled={checkoutLoading}>
            {checkoutLoading ? 'Processing...' : 'Place Order'}
          </button>
          {checkoutMessage ? <p className="hint-text">{checkoutMessage}</p> : null}
        </form>
      </aside>

      {open ? <button className="overlay" onClick={onClose} aria-label="Close cart overlay" /> : null}
    </>
  );
}

export default CartDrawer;
