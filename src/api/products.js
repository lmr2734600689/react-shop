import { PRODUCTS, CATEGORIES } from '../data/products'

// 模拟网络延迟：让 loading 状态真实可见（真实后端里换成真网络请求）
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 获取商品列表（支持搜索 / 分类 / 分页）
 * @param {object} params { page, size, keyword, category }
 */
export async function fetchProducts({ page = 1, size = 8, keyword = '', category = '' } = {}) {
  await delay(400)

  // 搜索 + 分类过滤（真实后端里发生在数据库，这里在内存里模拟）
  let list = PRODUCTS

  if (keyword.trim()) {
    const kw = keyword.trim().toLowerCase()
    list = list.filter((p) => p.title.toLowerCase().includes(kw))
  }

  if (category) {
    list = list.filter((p) => p.category === category)
  }

  // 分页：按页码切片
  const total = list.length
  const pages = Math.max(1, Math.ceil(total / size))
  const safePage = Math.min(page, pages) // 超出最大页时落到最后一页
  const start = (safePage - 1) * size
  const items = list.slice(start, start + size)

  return { items, total, pages, page: safePage }
}

/**
 * 获取单个商品详情
 * @param {number|string} id
 */
export async function fetchProductById(id) {
  await delay(300)

  const product = PRODUCTS.find((p) => p.id === Number(id))
  if (!product) {
    // 模拟真实后端的 404 错误，抛给前端统一处理
    const err = new Error('商品不存在（404）')
    err.status = 404
    throw err
  }
  return product
}

/** 获取分类列表 */
export async function fetchCategories() {
  await delay(150)
  return [...CATEGORIES]
}