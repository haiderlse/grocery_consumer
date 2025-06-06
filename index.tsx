import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './hooks/useCart';
import { AuthProvider } from './hooks/useAuth'; // Import AuthProvider
import { FavouritesProvider } from './hooks/useFavourites'; // Import FavouritesProvider

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap CartProvider and App with AuthProvider */}
      <FavouritesProvider> {/* Wrap with FavouritesProvider */}
        <CartProvider>
          <App />
        </CartProvider>
      </FavouritesProvider>
    </AuthProvider>
  </React.StrictMode>
);