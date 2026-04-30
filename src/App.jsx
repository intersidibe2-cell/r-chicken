import { Routes, Route, Navigate } from 'react-router-dom';
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
import AdminLogin from './pages/admin/Login';
import NewAdmin from './pages/admin/NewAdmin';
import OrderTracking from './pages/OrderTracking';
import NotificationsPage from './pages/Notifications';
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
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* ADMIN UNIQUE v3.0 */}
      <Route path="/admin" element={<NewAdmin />} />
      <Route path="/admin2" element={<Navigate to="/admin" replace />} />
      
      <Route path="/order-tracking" element={<OrderTracking />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}