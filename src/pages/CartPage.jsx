import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// 购物车页
export default function CartPage() {
  const { cart, cartTotal, cartCount, updateQty, removeFromCart, clearCart } =
    useCart()

  // 空购物车：条件渲染
  if (cart.length === 0) {
    return (
      <div className="status">
        <p className="status-empty">🛒 购物车还是空的，去挑几件吧</p>
        <Link to="/" className="retry-btn">
          去逛商品
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="cart-head">
        <h1>购物车</h1>
        <button className="clear-btn" onClick={clearCart}>
          清空购物车
        </button>
      </div>

      {/* 商品清单：map 渲染，每行一个条目 */}
      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.product.id}>
            {/* 缩略图（emoji + 渐变） */}
            <div className="cart-thumb">{item.product.emoji}</div>

            {/* 中间：名称 + 分类 + 单价 */}
            <div className="cart-info">
              <div className="cart-name">{item.product.title}</div>
              <div className="cart-unit">单价 ¥{item.product.price.toFixed(2)}</div>
            </div>

            {/* 数量控制：- / 数字 / + */}
            <div className="cart-qty">
              <button
                className="qty-btn"
                onClick={() => updateQty(item.product.id, item.qty - 1)}
              >
                −
              </button>
              <span className="qty-num">{item.qty}</span>
              <button
                className="qty-btn"
                onClick={() => updateQty(item.product.id, item.qty + 1)}
              >
                +
              </button>
            </div>

            {/* 小计：单价 × 数量 */}
            <div className="cart-subtotal">
              ¥{(item.product.price * item.qty).toFixed(2)}
            </div>

            {/* 删除 */}
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.product.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 底部结算栏 */}
      <div className="cart-footer">
        <span className="cart-footer-count">
          共 {cartCount} 件商品
        </span>
        <span className="cart-footer-total">
          合计：<strong>¥{cartTotal.toFixed(2)}</strong>
        </span>
        <button className="checkout-btn">去结算</button>
      </div>
    </div>
  )
}