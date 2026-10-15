import { useState, useEffect } from 'react'

// 自定义 Hook：把"发请求 + loading + 报错"封装成公共逻辑
// 用法：const { data, loading, error } = useFetch(fetcher, deps)
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false // 竞态保护：旧请求的响应不该覆盖新结果

    setLoading(true)
    setError('')

    fetcher()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // 依赖变化重新执行前，把旧请求标记为无效
    return () => {
      cancelled = true
    }
    // 注意：fetcher 不能放进依赖数组（每次渲染都是新函数，会死循环）
    // 约定：把 fetcher 用到的变量都放进 deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}