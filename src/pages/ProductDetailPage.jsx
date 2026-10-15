import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import useFetch from '../hooks/useFetch'
import { useCart } from '../context/CartContext'

// 商品详情页
export default function ProductDetailPage() {
  // 从 URL 读取商品 id：/product/42 → id = "42"
  const { id } = useParams()

  // 自定义 Hook 拉详情：id 变化时自动重新请求
  const { data: product, loading, error } = useFetch(
    () => fetchProductById(id),
    [id]
  )

  // 购物车（Context 提供）
  const { addToCart } = useCart()

  // 加购反馈：按钮短暂显示"已加入"
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  // 三态：加载中（提前 return 挡住未就绪状态）
  if (loading) {
    return (
      <div className="status">
        <div className="spinner" />
        <p>加载中…</p>
      </div>
    )
  }

  // 三态：报错（如 /product/999 触发 404）
  if (error) {
    return (
      <div className="status">
        <p className="status-error">⚠ {error}</p>
        <Link to="/" className="retry-btn">
          ← 返回商品列表
        </Link>
      </div>
    )
  }

  // 正常：渲染详情
  return (
    <div>
      {/* 面包屑：返回列表 */}
      <Link to="/" className="back-link">
        ← 返回商品列表
      </Link>

      <div className="detail-card">
        {/* 左侧：大封面 */}
        <div className="detail-cover">{product.emoji}</div>

        {/* 右侧：商品信息 */}
        <div className="detail-info">
          <span className="card-category">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-stats">
            <span className="card-rating">★ {product.rating.toFixed(1)}</span>
            <span className="detail-stock">
              {product.stock > 0 ? `库存 ${product.stock} 件` : '暂时缺货'}
            </span>
          </div>

          <div className="detail-price">¥{product.price.toFixed(2)}</div>

          {/* 加购按钮：点击后短暂反馈 */}
          <button
            className="add-btn"
            onClick={handleAddToCart}
            disabled={added || product.stock <= 0}
          >
            {added ? '✓ 已加入购物车' : '加入购物车'}
          </button>
        </div>
      </div>
    </div>
  )
}