import { formatPrice, gameLabel, subcategoryLabel } from '../lib/utils.js';

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="image-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
        <div className="image-badge">
          <span>{gameLabel(product.game)}</span>
          <strong>{product.code || 'TC'}</strong>
        </div>
      </div>

      <div className="card-body">
        <div className="chips">
          <span>{gameLabel(product.game)}</span>
          <span>{subcategoryLabel(product.subcategory)}</span>
        </div>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="card-foot">
          <strong>{formatPrice(product.price)}</strong>
          <button className="btn btn-ghost" onClick={() => onAddToCart(product.id)}>Add</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
