import { formatPrice, gameLabel, subcategoryLabel } from '../lib/utils.js';

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="image-wrap">
        <span className="product-code-badge">{product.code || 'TC'}</span>
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="card-body">
        <div className="chips">
          <span>{gameLabel(product.game)}</span>
          <span>{subcategoryLabel(product.subcategory)}</span>
        </div>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-meta-line">Manual service · Secure delivery</p>
        <p className="product-description">{product.description}</p>
        <div className="card-foot">
          <div className="price-block">
            <span>Starting at</span>
            <strong>{formatPrice(product.price, product.currency)}</strong>
          </div>
          <button className="btn btn-primary card-cta" onClick={() => onAddToCart(product.id)}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
