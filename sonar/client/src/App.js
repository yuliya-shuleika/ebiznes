import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { CartProvider } from './contexts/CartContext';
import Catalog from './Catalog';
import Cart from './Cart';
import PaymentPage from './PaymentPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
