import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// 所有页面共用的外壳（顶部导航 + 内容区）
export default function Layout() {
  // 全局购物车总件数，角标用
  const { cartCount } = useCart()

  return (
    <div className="app">
      <header className="topbar">
        {/* 品牌入口，点击回首页 */}
        <Link to="/" className="brand">
           Zleap商城
        </Link>
        {/* 导航 */}
        <nav>
          <NavLink to="/" end>
            商品
          </NavLink>
          <NavLink to="/cart">
            购物车
            {/* 数量角标：>0 才显示 */}
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </nav>
      </header>

      <main className="content">
        {/* 子页面渲染位置 */}
        <Outlet />
      </main>
    </div>
  )
}
