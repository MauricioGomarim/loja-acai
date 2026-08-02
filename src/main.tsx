import { createRoot } from 'react-dom/client'
import { Routes } from './routes'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { StoreProvider } from './context/StoreContext'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <StoreProvider>
      <SettingsProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </SettingsProvider>
    </StoreProvider>
  </AuthProvider>
)
