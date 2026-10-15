import { createContext, useContext, useEffect, useState } from 'react'

// localStorage 的 key，存整个购物车数组
const STORAGE_KEY = 'react-shop-cart'

// 从 localStorage 读取购物车（懒初始化）
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return [] // 数据损坏时安全兜底
  }
}

// Context 容器：跨组件共享购物车状态（详情页加购 / 顶栏角标 / 购物车页）
const CartContext = createContext(null)

// Provider：把购物车提供给所有子组件
export function CartProvider({ children }) {
  // 购物车数据：数组，每一项是 { product, qty }；懒初始化读本地存储
  const [cart, setCart] = useState(loadCartFromStorage)

  // 持久化：只要 cart 一变，就同步写进 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // 加入购物车：已有该商品则数量 +1，没有则追加一条
  const addToCart = (product, qty = 1) => {
    // 函数式更新：基于上一次的 state 计算新值
    setCart((prev) => {
      const found = prev.find((item) => item.product.id === product.id)
      if (found) {
        // 已存在 → 数量累加（不可变更新：返回新对象，不改原对象）
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      }
      // 不存在 → 追加新条目
      return [...prev, { product, qty }]
    })
  }

  // 修改数量：购物车页的 + / - 按钮用；qty 小于 1 时自动移除该商品
  const updateQty = (productId, qty) => {
    setCart((prev) => {
      if (qty < 1) return prev.filter((item) => item.product.id !== productId)
      return prev.map((item) =>
        item.product.id === productId ? { ...item, qty } : item
      )
    })
  }

  // 删除某件商品
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  // 清空购物车
  const clearCart = () => setCart([])

  // 总件数（顶栏角标用）：reduce 现算
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // 总金额（购物车页底部用）：reduce 现算
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// 自定义 Hook：让任何组件一行代码拿到购物车
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart 必须在 <CartProvider> 内部使用')
  return ctx
}