import { Link, NavLink } from 'react-router-dom';

function Header({ user, cartCount, onOpenCart, onSignOut }) {
  const displayName = user?.user_metadata?.full_name?.trim() || user?.email || 'Signed in';

  return (
    <header className="site-header">
      <div className="topline">
        <div className="container topline-inner">
          <p>GLOBAL GAMING SERVICES MARKETPLACE</p>
          <p>100,000+ Players Served | Trusted by Competitive Communities</p>
        </div>
      </div>

      <div className="container nav-wrap">
        <Link to="/" className="brand">THE COD STORE</Link>

        <nav className="main-nav" aria-label="Primary">
          <NavLink to="/">Store</NavLink>
          <NavLink to="/orders">My Orders</NavLink>
          <NavLink to="/booster">Join as Booster</NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link className="user-pill" to="/profile" title={displayName}>{displayName}</Link>
              <Link className="btn btn-ghost" to="/profile">Edit Profile</Link>
              <button className="btn btn-ghost" onClick={onSignOut}>Logout</button>
            </>
          ) : (
            <Link className="btn btn-ghost" to="/login">Login</Link>
          )}
          <button className="btn btn-primary" onClick={onOpenCart}>Cart ({cartCount})</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
