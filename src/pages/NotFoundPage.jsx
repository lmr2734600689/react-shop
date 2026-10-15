import { Link } from 'react-router-dom'

// 404 兜底页
export default function NotFoundPage() {
  return (
    <div className="placeholder">
      <h1>404 · 页面不存在</h1>
      <p>你访问的地址没有对应的页面。</p>
      <p style={{ marginTop: 24 }}>
        <Link to="/" style={{ color: 'var(--primary)' }}>
          ← 回到首页
        </Link>
      </p>
    </div>
  )
}
