import { Link } from 'react-router-dom';
import { contactLinks } from '../lib/contact.js';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>THE COD STORE</h3>
          <p>Premium boosting and progression services for serious players.</p>
        </div>

        <div>
          <h4>Company</h4>
          <p><Link to="/">Store</Link></p>
          <p><Link to="/custom-order">Custom Order</Link></p>
          <p><Link to="/orders">My Orders</Link></p>
          <p><Link to="/booster">Booster Program</Link></p>
        </div>

        <div>
          <h4>Support</h4>
          <p>support@thecodstore.gg</p>
          <p>24/7 live assistance</p>
          <p><a href={contactLinks.telegram} target="_blank" rel="noreferrer">Telegram</a></p>
          <p><a href={contactLinks.discord} target="_blank" rel="noreferrer">Discord</a></p>
          <p><a href={contactLinks.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></p>
        </div>

        <div>
          <h4>Legal</h4>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
          <p>Refund Policy</p>
        </div>
      </div>
      <p className="container copyright">© 2026 The Cod Store</p>
    </footer>
  );
}

export default Footer;
