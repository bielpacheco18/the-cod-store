import { contactLinks, hasRealContactLinks } from '../lib/contact.js';

function ContactButton({ href, label, caption }) {
  return (
    <a className="contact-card" href={href} target="_blank" rel="noreferrer">
      <strong>{label}</strong>
      <span>{caption}</span>
    </a>
  );
}

function CustomOrderPage() {
  return (
    <main className="container page">
      <section className="custom-order-grid">
        <article className="custom-order-copy">
          <p className="badge">CUSTOM ORDER</p>
          <h1>Need a package outside the catalog?</h1>
          <p>
            Send your game, platform, target, budget and preferred delivery time. We can prepare a private
            quote for boosting, unlocks, accounts, bundles or special event requests.
          </p>

          <div className="custom-order-points">
            <div><strong>1</strong><span>Tell us exactly what you want to buy.</span></div>
            <div><strong>2</strong><span>We reply with price, ETA and the safest delivery plan.</span></div>
            <div><strong>3</strong><span>You approve the package and we start your custom order.</span></div>
          </div>

          {!hasRealContactLinks ? (
            <p className="hint-text">
              Update `VITE_TELEGRAM_URL`, `VITE_DISCORD_URL` and `VITE_WHATSAPP_URL` in `.env` with your real links.
            </p>
          ) : null}
        </article>

        <aside className="custom-order-panel">
          <h2>Contact Channels</h2>
          <p>Choose the platform you want to use and send your request directly.</p>

          <div className="contact-card-grid">
            <ContactButton href={contactLinks.telegram} label="Telegram" caption="Best for direct private orders" />
            <ContactButton href={contactLinks.discord} label="Discord" caption="Best for quick chat and screenshots" />
            <ContactButton href={contactLinks.whatsapp} label="WhatsApp" caption="Best for mobile follow-up" />
          </div>

          <div className="custom-order-note">
            <strong>Suggested message</strong>
            <p>Hi, I want a custom order for [game], [service], [platform], [target], and I need it by [date].</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CustomOrderPage;
