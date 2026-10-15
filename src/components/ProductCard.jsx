import { Link } from 'react-router-dom'

// 单个商品卡片：父组件通过 props 传入商品数据
export default function ProductCard({ product }) {
  return (
    // 整张卡片可点击，跳转详情页
    <Link to={`/product/${product.id}`} className="card">
      {/* 封面：emoji + 渐变底色 */}
      <div className="card-cover">{product.emoji}</div>

      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-desc">{product.description}</p>

        <div className="card-meta">
          <span className="card-category">{product.category}</span>
          {/* 评分保留一位小数 */}
          <span className="card-rating">★ {product.rating.toFixed(1)}</span>
        </div>

        <div className="card-price">¥{product.price.toFixed(2)}</div>
      </div>
    </Link>
  )
}