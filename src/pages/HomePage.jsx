import { useState, useEffect } from 'react'
import { fetchProducts, fetchCategories } from '../api/products'
import ProductCard from '../components/ProductCard'

// 商品列表页
export default function HomePage() {
  // 输入框即时值（每次按键都变）
  const [input, setInput] = useState('')
  // 真正生效的搜索词（防抖后更新）
  const [query, setQuery] = useState('')
  // 分类筛选，'' 表示全部
  const [category, setCategory] = useState('')
  // 当前页码
  const [page, setPage] = useState(1)
  // 三态：loading / error / data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ items: [], total: 0, pages: 1 })
  // 重试序号：点"重试" +1，触发重新请求
  const [reloadKey, setReloadKey] = useState(0)
  // 分类下拉选项
  const [categories, setCategories] = useState([])

  // 进页面拉一次分类列表（依赖数组为空 = 只在挂载时执行）
  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  // 搜索防抖：连续打字时等 400ms 没有再输入，才提交到 query
  // cleanup 会清掉上一个定时器，实现"停手才搜索"
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(input)
      // 搜索词变了，回到第 1 页
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [input])

  // 拉取商品数据：query / category / page 任一变化都重新请求
  useEffect(() => {
    let cancelled = false // 竞态保护：旧请求的响应不覆盖新结果
    setLoading(true)
    setError('')

    fetchProducts({ page, keyword: query, category })
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // cleanup：依赖变化重新执行前，旧请求标记为无效
    return () => {
      cancelled = true
    }
  }, [query, category, page, reloadKey])

  // 分页切换
  const goTo = (p) => setPage(p)

  return (
    <div>
      {/* 页头：标题 + 搜索框 */}
      <section className="page-head">
        <h1>商品列表</h1>
        <p className="page-sub">共 {data.total} 件商品</p>

        {/* 受控输入：value 来自 state，输入时 onChange 写回 */}
        <input
          className="search-input"
          type="text"
          placeholder="搜索商品，如：耳机"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </section>

      {/* 分类筛选栏 */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${category === '' ? 'active' : ''}`}
          onClick={() => {
            setCategory('')
            setPage(1)
          }}
        >
          全部
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-btn ${category === c ? 'active' : ''}`}
            onClick={() => {
              setCategory(c)
              setPage(1)
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 三态处理：加载中 / 报错 / 空结果 / 正常 */}
      {loading ? (
        <div className="status">
          <div className="spinner" />
          <p>加载中…</p>
        </div>
      ) : error ? (
        <div className="status">
          <p className="status-error">⚠ 加载失败：{error}</p>
          <button className="retry-btn" onClick={() => setReloadKey((k) => k + 1)}>
            重试
          </button>
        </div>
      ) : data.items.length === 0 ? (
        <div className="status">
          <p className="status-empty">没有找到匹配的商品，换个关键词试试？</p>
        </div>
      ) : (
        <>
          {/* 商品网格：map 渲染，key 用商品 id */}
          <div className="grid">
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* 分页 */}
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page <= 1}
              onClick={() => goTo(page - 1)}
            >
              ← 上一页
            </button>
            <span className="page-info">
              {page} / {data.pages}
            </span>
            <button
              className="page-btn"
              disabled={page >= data.pages}
              onClick={() => goTo(page + 1)}
            >
              下一页 →
            </button>
          </div>
        </>
      )}
    </div>
  )
}