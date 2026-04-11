import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Promotions from './pages/Promotions';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminQRCode from './pages/admin/QRCode';
import AdminAccounting from './pages/admin/Accounting';
import AdminPromotions from './pages/admin/Promotions';
import AdminSettings from './pages/admin/Settings';
import MobilePreview from './pages/MobilePreview';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <Home />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/menu" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <Menu />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/cart" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <Cart />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/orders" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <Orders />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/promotions" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <Promotions />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/profile" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <Profile />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/contact" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <Contact />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/about" element={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            <About />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/mobile-preview" element={<MobilePreview />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/qrcode" element={<AdminQRCode />} />
      <Route path="/admin/accounting" element={<AdminAccounting />} />
      <Route path="/admin/promotions" element={<AdminPromotions />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
    </Routes>
  );
}