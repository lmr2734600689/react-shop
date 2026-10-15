import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'

// 入口：把整棵组件树挂载到 index.html 的 #root
createRoot(document.getElementById('root')).render(
  // StrictMode：开发模式下双执行，帮助发现隐藏 bug
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
