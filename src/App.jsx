import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import BoosterPage from './pages/BoosterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { fallbackProducts } from './data/fallbackProducts.js';
import { supabase, hasSupabaseConfig } from './lib/supabase.js';

function botReplyFor(text) {
  const value = text.toLowerCase();
  if (value.includes('price') || value.includes('cost')) {
    return 'Pricing depends on game and target rank. Share your current rank and your target, and I can suggest the best package.';
  }
  if (value.includes('boost') || value.includes('rank')) {
    return 'Our verified boosters can usually start shortly after payment confirmation. Completion time depends on your target rank.';
  }
  if (value.includes('delivery') || value.includes('code')) {
    return 'Most digital deliveries are completed quickly after checkout approval.';
  }
  if (value.includes('paypal') || value.includes('stripe') || value.includes('payment')) {
    return 'We use secure payment processing and encrypted connections for all transactions.';
  }
  if (value.includes('discord') || value.includes('support') || value.includes('ticket')) {
    return 'Support is available 24/7. You can also open a Discord ticket after checkout.';
  }
  return 'Thanks for the message. Tell me your game and goal, and I will recommend the fastest service path.';
}

function App() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(hasSupabaseConfig);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const user = session?.user ?? null;

  useEffect(() => {
    let alive = true;

    async function loadProducts() {
      if (!hasSupabaseConfig || !supabase) {
        setProducts(fallbackProducts);
        setProductsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, game, subcategory, title, description, price, featured, code, image')
        .order('featured', { ascending: false })
        .order('id', { ascending: true });

      if (!alive) return;

      if (error || !Array.isArray(data) || !data.length) {
        setProducts(fallbackProducts);
      } else {
        setProducts(data);
      }
      setProductsLoading(false);
    }

    loadProducts();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setAuthLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadUserCart() {
      if (!user || !hasSupabaseConfig || !supabase) return;

      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', user.id);

      if (!alive) return;

      if (error || !Array.isArray(data)) {
        setCart([]);
        return;
      }

      setCart(data.map((item) => ({ product_id: item.product_id, quantity: item.quantity })));
    }

    if (user) {
      loadUserCart();
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem('thecodstore_cart') || '[]');
        if (Array.isArray(saved)) {
          const normalized = saved
            .map((item) => {
              if (
                typeof item?.product_id === 'number' &&
                typeof item?.quantity === 'number'
              ) {
                return { product_id: item.product_id, quantity: item.quantity };
              }

              if (
                typeof item?.id === 'number' &&
                typeof item?.qty === 'number'
              ) {
                return { product_id: item.id, quantity: item.qty };
              }

              return null;
            })
            .filter(Boolean);
          setCart(normalized);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
    }

    return () => {
      alive = false;
    };
  }, [user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem('thecodstore_cart', JSON.stringify(cart));
  }, [cart, user]);

  useEffect(() => {
    let alive = true;

    async function loadChat() {
      if (user && hasSupabaseConfig && supabase) {
        setChatLoading(true);
        const { data } = await supabase
          .from('chat_messages')
          .select('role, message, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(80);

        if (!alive) return;

        if (Array.isArray(data) && data.length) {
          setChatMessages(data.map((item) => ({ role: item.role, message: item.message })));
        } else {
          setChatMessages([{ role: 'bot', message: 'Welcome to The Cod Store support. How can we help you today?' }]);
        }
        setChatLoading(false);
        return;
      }

      try {
        const saved = JSON.parse(localStorage.getItem('thecodstore_live_chat') || '[]');
        if (Array.isArray(saved) && saved.length) {
          setChatMessages(saved);
        } else {
          setChatMessages([{ role: 'bot', message: 'Welcome to The Cod Store support. How can we help you today?' }]);
        }
      } catch {
        setChatMessages([{ role: 'bot', message: 'Welcome to The Cod Store support. How can we help you today?' }]);
      }
    }

    loadChat();

    return () => {
      alive = false;
    };
  }, [user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem('thecodstore_live_chat', JSON.stringify(chatMessages.slice(-80)));
  }, [chatMessages, user]);

  const productsById = useMemo(() => {
    const map = new Map();
    products.forEach((product) => map.set(product.id, product));
    return map;
  }, [products]);

  const cartDetailed = useMemo(() => {
    return cart
      .map((item) => {
        const product = productsById.get(item.product_id);
        return product ? { ...item, product } : null;
      })
      .filter(Boolean);
  }, [cart, productsById]);

  async function persistCartItem(productId, quantity) {
    if (!user || !supabase) return;

    if (quantity <= 0) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      return;
    }

    await supabase.from('cart_items').upsert(
      {
        user_id: user.id,
        product_id: productId,
        quantity,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,product_id' }
    );
  }

  async function addToCart(productId) {
    setCheckoutMessage('');
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === productId);
      if (existing) {
        const nextQty = existing.quantity + 1;
        if (user) persistCartItem(productId, nextQty);
        return prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: nextQty }
            : item
        );
      }

      if (user) persistCartItem(productId, 1);
      return [...prev, { product_id: productId, quantity: 1 }];
    });
    setCartOpen(true);
  }

  async function changeCartQty(productId, delta) {
    setCheckoutMessage('');
    setCart((prev) => {
      const current = prev.find((item) => item.product_id === productId);
      if (!current) return prev;

      const nextQty = current.quantity + delta;
      if (nextQty <= 0) {
        if (user) persistCartItem(productId, 0);
        return prev.filter((item) => item.product_id !== productId);
      }

      if (user) persistCartItem(productId, nextQty);
      return prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: nextQty }
          : item
      );
    });
  }

  async function clearCart() {
    if (user && supabase) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
    setCart([]);
  }

  async function handleCheckout({ name, email, country }) {
    if (!user || !supabase) {
      setCheckoutMessage('Please sign in before checkout.');
      navigate('/login');
      return;
    }

    if (!cartDetailed.length) {
      setCheckoutMessage('Your cart is empty.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutMessage('Processing your order...');

    const { data, error } = await supabase.rpc('create_order_from_cart', {
      p_customer_name: name,
      p_customer_email: email,
      p_customer_country: country
    });

    if (error) {
      setCheckoutMessage('Checkout failed. Please try again.');
      setCheckoutLoading(false);
      return;
    }

    await clearCart();
    setCheckoutLoading(false);
    setCheckoutMessage(`Order ${data?.order_number || 'created'} confirmed successfully.`);
    navigate('/orders');
  }

  async function sendChatMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = { role: 'user', message: trimmed };
    setChatMessages((prev) => [...prev, userMessage]);

    if (user && supabase) {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'user',
        message: trimmed
      });
    }

    const botText = botReplyFor(trimmed);

    window.setTimeout(async () => {
      const botMessage = { role: 'bot', message: botText };
      setChatMessages((prev) => [...prev, botMessage]);

      if (user && supabase) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'bot',
          message: botText
        });
      }
    }, 420);
  }

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setCart([]);
    setChatMessages([{ role: 'bot', message: 'You have signed out. Need help with anything else?' }]);
    navigate('/');
  }

  return (
    <div className="app-shell">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      <Header
        user={user}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onSignOut={signOut}
      />

      {!hasSupabaseConfig ? (
        <div className="config-banner">
          Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable auth and cloud data.
        </div>
      ) : null}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              productsLoading={productsLoading}
              onAddToCart={addToCart}
              onOpenChat={() => setChatOpen(true)}
            />
          }
        />
        <Route
          path="/login"
          element={<AuthPage user={user} authLoading={authLoading} />}
        />
        <Route
          path="/orders"
          element={<OrdersPage user={user} />}
        />
        <Route
          path="/profile"
          element={<ProfilePage user={user} authLoading={authLoading} />}
        />
        <Route
          path="/booster"
          element={<BoosterPage user={user} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartDetailed}
        onChangeQty={changeCartQty}
        onCheckout={handleCheckout}
        checkoutMessage={checkoutMessage}
        checkoutLoading={checkoutLoading}
        user={user}
      />

      <ChatWidget
        open={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
        messages={chatMessages}
        onSend={sendChatMessage}
        loading={chatLoading}
      />
    </div>
  );
}

export default App;
