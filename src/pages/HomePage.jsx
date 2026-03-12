import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { gameLabel, subcategoryLabel } from '../lib/utils.js';

const reviews = [
  {
    initials: 'EM',
    name: 'Ethan Miller',
    source: '@ethanm | COD Ranked',
    quote: 'Reached Crimson faster than expected. Smooth communication and professional service throughout the order.'
  },
  {
    initials: 'OR',
    name: 'Olivia Reed',
    source: '@livplays | Marvel Rivals',
    quote: 'Bought a boost + unlock package and everything was delivered exactly on schedule. Highly recommended.'
  },
  {
    initials: 'NT',
    name: 'Noah Turner',
    source: '@noaht | Battlefield',
    quote: 'Clear process, safe account handling and very responsive support team. Will order again.'
  },
  {
    initials: 'SK',
    name: 'Sophia King',
    source: '@sking | Warzone',
    quote: 'Great value and transparent updates. The team delivered exactly what was promised.'
  }
];

const gameOptions = [
  {
    id: 'call-of-duty',
    name: 'Call of Duty',
    tagline: 'Ranked grind and camo unlocks',
    image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/capsule_616x353.jpg'
  },
  {
    id: 'marvel-rivals',
    name: 'Marvel Rivals',
    tagline: 'High-elo hero specialists',
    image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2767030/capsule_616x353.jpg'
  },
  {
    id: 'battlefield',
    name: 'Battlefield',
    tagline: 'Placement and progression queue',
    image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1517290/capsule_616x353.jpg'
  }
];

const rankLabels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Top Rank'];

const extraOptions = [
  { id: 'heroes', label: 'Specific Heroes', price: '+10%', detail: 'Pick mains and role priorities.' },
  { id: 'console', label: 'Console Queue', price: '+25%', detail: 'Dedicated controller-ready booster.' },
  { id: 'express', label: 'Express Delivery', price: '+30%', detail: 'Priority scheduling and shorter ETA.' },
  { id: 'duo', label: 'Duo Queue', price: '+100%', detail: 'Play together with your booster.' },
  { id: 'offline', label: 'Appear Offline', price: 'Free', detail: 'Low-visibility progress sessions.' }
];

function HomePage({ products, productsLoading, onAddToCart, onOpenChat }) {
  const [filter, setFilter] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');

  const [reviewIndex, setReviewIndex] = useState(0);

  const [cfgGame, setCfgGame] = useState('call-of-duty');
  const [cfgCurrentRank, setCfgCurrentRank] = useState(0);
  const [cfgDesiredRank, setCfgDesiredRank] = useState(1);
  const [cfgExtras, setCfgExtras] = useState({
    heroes: false,
    console: false,
    express: false,
    duo: false,
    offline: false
  });

  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 8), [products]);

  const subcategoryOptions = useMemo(() => {
    const source = filter === 'all' ? products : products.filter((item) => item.game === filter);
    return [...new Set(source.map((item) => item.subcategory))];
  }, [products, filter]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (filter !== 'all') list = list.filter((item) => item.game === filter);
    if (subcategory !== 'all') list = list.filter((item) => item.subcategory === subcategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        gameLabel(item.game).toLowerCase().includes(q) ||
        subcategoryLabel(item.subcategory).toLowerCase().includes(q)
      );
    }

    if (sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured));
    if (sort === 'price-asc') list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'price-desc') list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [products, filter, subcategory, search, sort]);

  const boostEstimate = useMemo(() => {
    if (cfgDesiredRank <= cfgCurrentRank) {
      return { total: '$0.00', note: 'Desired rank must be higher than current rank.' };
    }

    const baseByGame = {
      'call-of-duty': 60,
      'marvel-rivals': 55,
      battlefield: 50
    };

    let amount = baseByGame[cfgGame] + (cfgDesiredRank - cfgCurrentRank) * 45;
    let multiplier = 1;

    if (cfgExtras.heroes) multiplier += 0.1;
    if (cfgExtras.console) multiplier += 0.25;
    if (cfgExtras.express) multiplier += 0.3;
    if (cfgExtras.duo) multiplier += 1;

    amount = amount * multiplier;

    return {
      total: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount),
      note: `${gameLabel(cfgGame)} | ${cfgDesiredRank - cfgCurrentRank} rank steps | Includes selected extras`
    };
  }, [cfgGame, cfgCurrentRank, cfgDesiredRank, cfgExtras]);

  function handleFilter(game) {
    setFilter(game);
    if (game !== 'all' && subcategory !== 'all') {
      const gameHasSub = products.some((item) => item.game === game && item.subcategory === subcategory);
      if (!gameHasSub) setSubcategory('all');
    }
  }

  const review = reviews[reviewIndex % reviews.length];
  const selectedGame = gameOptions.find((game) => game.id === cfgGame) ?? gameOptions[0];
  const rankProgress = Math.max(cfgDesiredRank - cfgCurrentRank, 0);

  return (
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <article className="hero-panel">
            <p className="badge">ENGLISH STORE | WORLDWIDE SUPPORT</p>
            <div className="hero-trustbar" aria-label="Store trust metrics">
              <div className="hero-trustbar-section">
                <span className="hero-stars" aria-hidden="true">★★★★★</span>
                <strong>4.9</strong>
                <span>11,200+ reviews</span>
              </div>
              <div className="hero-trustbar-divider" aria-hidden="true" />
              <div className="hero-trustbar-section">
                <span className="hero-online-dot" aria-hidden="true" />
                <strong>485</strong>
                <span>players online</span>
              </div>
            </div>
            <h1>Premium Gaming Boosting Marketplace for Competitive Players</h1>
            <p>
              Professional boosting, unlock services and progression packages for Call of Duty, Marvel Rivals and Battlefield.
              Trusted by thousands of players worldwide.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#catalog">Start Shopping</a>
              <button className="btn btn-ghost" onClick={onOpenChat}>Talk to Support</button>
            </div>
            <div className="hero-stats">
              <div><strong>72h</strong><span>Average completion window</span></div>
              <div><strong>35+</strong><span>Countries served</span></div>
              <div><strong>Top-tier</strong><span>Manual boosting only</span></div>
            </div>
          </article>

          <aside className="hero-side">
            <h2>Live Highlights</h2>
            <ul>
              <li>COD Season Ranked Packs</li>
              <li>Marvel Rivals Hero Bundles</li>
              <li>Battlefield Placement Services</li>
            </ul>
            <p>Priority queues are active this week.</p>
          </aside>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Featured Services</h2>
          <p>Top-selling offers this week.</p>
        </div>
        <div className="product-grid">
          {productsLoading ? <p className="hint-text">Loading products...</p> : null}
          {!productsLoading && featured.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      <section id="catalog" className="container section catalog-wrap">
        <div className="section-head">
          <h2>Catalog</h2>
          <p>Filter by game, subcategory, search and sort.</p>
        </div>

        <div className="catalog-controls">
          <div className="chip-row">
            <button className={`chip-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>All</button>
            <button className={`chip-btn ${filter === 'call-of-duty' ? 'active' : ''}`} onClick={() => handleFilter('call-of-duty')}>Call of Duty</button>
            <button className={`chip-btn ${filter === 'marvel-rivals' ? 'active' : ''}`} onClick={() => handleFilter('marvel-rivals')}>Marvel Rivals</button>
            <button className={`chip-btn ${filter === 'battlefield' ? 'active' : ''}`} onClick={() => handleFilter('battlefield')}>Battlefield</button>
          </div>

          <div className="chip-row">
            <button className={`chip-btn ${subcategory === 'all' ? 'active' : ''}`} onClick={() => setSubcategory('all')}>All Subcategories</button>
            {subcategoryOptions.map((sub) => (
              <button
                key={sub}
                className={`chip-btn ${subcategory === sub ? 'active' : ''}`}
                onClick={() => setSubcategory(sub)}
              >
                {subcategoryLabel(sub)}
              </button>
            ))}
          </div>

          <div className="input-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
            />
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        <p className="results-count">{filtered.length} product{filtered.length === 1 ? '' : 's'}</p>

        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
          {!filtered.length ? <p className="empty-box">No products found for your filters.</p> : null}
        </div>
      </section>

      <section className="container section boost-section">
        <div className="boost-grid">
          <article className="boost-config">
            <div className="boost-header">
              <div>
                <p className="badge">LIVE CONFIGURATOR</p>
                <h2>Modern Rank Boost Planner</h2>
                <p>Choose your game, preview the route and build a cleaner custom order with visuals.</p>
              </div>
              <div className="boost-live-chip">
                <span className="hero-online-dot" aria-hidden="true" />
                <strong>24/7</strong>
                <span>booster coverage</span>
              </div>
            </div>

            <div className="game-picker" aria-label="Select game">
              {gameOptions.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  className={`game-card ${cfgGame === game.id ? 'active' : ''}`}
                  onClick={() => setCfgGame(game.id)}
                >
                  <img src={game.image} alt={game.name} />
                  <span className="game-card-overlay" aria-hidden="true" />
                  <span className="game-card-copy">
                    <strong>{game.name}</strong>
                    <span>{game.tagline}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="boost-rank-panel">
              <div className="boost-rank-head">
                <div>
                  <p className="boost-kicker">Boost Route</p>
                  <h3>{rankLabels[cfgCurrentRank]} to {rankLabels[cfgDesiredRank]}</h3>
                </div>
                <span className="boost-step-pill">{rankProgress} rank step{rankProgress === 1 ? '' : 's'}</span>
              </div>

              <div className="boost-rank-track" aria-hidden="true">
                {rankLabels.map((rank, index) => (
                  <span
                    key={rank}
                    className={[
                      'rank-node',
                      index === cfgCurrentRank ? 'current' : '',
                      index === cfgDesiredRank ? 'target' : '',
                      index > cfgCurrentRank && index < cfgDesiredRank ? 'path' : ''
                    ].filter(Boolean).join(' ')}
                  >
                    {rank.slice(0, 1)}
                  </span>
                ))}
              </div>

              <div className="boost-form-grid">
                <label>
                  Current Rank
                  <select value={cfgCurrentRank} onChange={(event) => setCfgCurrentRank(Number(event.target.value))}>
                    {rankLabels.map((rank, index) => (
                      <option key={rank} value={index}>{rank}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Desired Rank
                  <select value={cfgDesiredRank} onChange={(event) => setCfgDesiredRank(Number(event.target.value))}>
                    {rankLabels.slice(1).map((rank, offset) => (
                      <option key={rank} value={offset + 1}>{rank}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="boost-extras">
              {extraOptions.map((extra) => (
                <label key={extra.id} className={`extra-card ${cfgExtras[extra.id] ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={cfgExtras[extra.id]}
                    onChange={(e) => setCfgExtras((prev) => ({ ...prev, [extra.id]: e.target.checked }))}
                  />
                  <div>
                    <div className="extra-card-top">
                      <strong>{extra.label}</strong>
                      <span>{extra.price}</span>
                    </div>
                    <p>{extra.detail}</p>
                  </div>
                </label>
              ))}
            </div>
          </article>

          <article className="boost-summary">
            <div className="boost-summary-media">
              <img src={selectedGame.image} alt={selectedGame.name} />
              <div className="boost-summary-overlay" aria-hidden="true" />
              <div className="boost-summary-copy">
                <p>{selectedGame.name}</p>
                <h3>{boostEstimate.total}</h3>
                <span>{boostEstimate.note}</span>
              </div>
            </div>
            <div className="boost-summary-stats">
              <div><strong>{rankProgress}</strong><span>rank steps</span></div>
              <div><strong>~72h</strong><span>delivery target</span></div>
              <div><strong>Manual</strong><span>no botting</span></div>
            </div>
            <div className="boost-summary-list">
              <p>Included with this plan</p>
              <ul>
                <li>Private order tracking and live chat updates</li>
                <li>Game-specific boosters for {selectedGame.name}</li>
                <li>Flexible extras based on your queue preference</li>
              </ul>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#catalog">Buy Now</a>
              <button className="btn btn-ghost" onClick={onOpenChat}>Chat Before Purchase</button>
            </div>
          </article>
        </div>
      </section>

      <section className="container section review-section">
        <div className="section-head">
          <h2>Player Reviews</h2>
          <div className="review-nav">
            <button className="btn btn-ghost" onClick={() => setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}>Prev</button>
            <button className="btn btn-ghost" onClick={() => setReviewIndex((prev) => (prev + 1) % reviews.length)}>Next</button>
          </div>
        </div>

        <article className="review-card">
          <div>
            <div className="avatar">{review.initials}</div>
            <h3>{review.name}</h3>
            <p>{review.source}</p>
          </div>
          <p>★★★★★</p>
          <blockquote>{review.quote}</blockquote>
        </article>
      </section>

      <section className="container section faq-section">
        <div className="section-head">
          <h2>FAQ</h2>
          <p>Everything players ask before purchasing.</p>
        </div>

        <details>
          <summary>Is boosting safe?</summary>
          <p>Orders are handled by verified boosters with strict account safety practices and no cheat software.</p>
        </details>

        <details>
          <summary>How quickly do you start?</summary>
          <p>Most orders start shortly after payment confirmation, depending on queue and selected extras.</p>
        </details>

        <details>
          <summary>Can I track my progress?</summary>
          <p>Yes. You receive updates via chat and support tickets during your order lifecycle.</p>
        </details>
      </section>
    </main>
  );
}

export default HomePage;
