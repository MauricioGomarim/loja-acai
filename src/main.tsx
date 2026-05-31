import { createRoot } from 'react-dom/client'
import { Routes } from './routes'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <SettingsProvider>
      <CartProvider>
        <Routes />
      </CartProvider>
    </SettingsProvider>
  </AuthProvider>
)
