import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1e1b4b',
          color: '#fff',
          borderRadius: '12px',
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: { iconTheme: { primary: '#a78bfa', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } },
      }}
    />
  </BrowserRouter>
)