// 路由表：URL 匹配到哪个 path，就渲染哪个页面
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      {/* 布局：子页面都渲染在 <Outlet/> 里 */}
      <Route element={<Layout />}>
        {/* 首页 */}
        <Route path="/" element={<HomePage />} />
        {/* 详情页：:id 动态参数，用 useParams() 读取 */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        {/* 购物车页 */}
        <Route path="/cart" element={<CartPage />} />
        {/* 404 兜底 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
