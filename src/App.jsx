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
import AdminKitchen from './pages/admin/Kitchen';
import AdminEmployees from './pages/admin/Employees';
import AdminInventory from './pages/admin/Inventory';
import AdminLoyalty from './pages/admin/Loyalty';
import AdminDeliveryZones from './pages/admin/DeliveryZones';
import AdminClients from './pages/admin/Clients';
import AdminCashier from './pages/admin/Cashier';
import AdminManualAccounting from './pages/admin/ManualAccounting';
import AdminQRMarketing from './pages/admin/QRMarketing';
import AdminFlyers from './pages/admin/Flyers';
import AdminAffiche from './pages/admin/Affiche';
import AdminMenuPublic from './pages/admin/MenuPublic';
import AdminAfficheTV from './pages/admin/AfficheTV';
import AdminWhatsAppOrders from './pages/admin/WhatsAppOrders';
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

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/qrcode" element={<AdminQRCode />} />
      <Route path="/admin/accounting" element={<AdminAccounting />} />
      <Route path="/admin/promotions" element={<AdminPromotions />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/kitchen" element={<AdminKitchen />} />
      <Route path="/admin/employees" element={<AdminEmployees />} />
      <Route path="/admin/inventory" element={<AdminInventory />} />
      <Route path="/admin/loyalty" element={<AdminLoyalty />} />
      <Route path="/admin/delivery" element={<AdminDeliveryZones />} />
      <Route path="/admin/clients" element={<AdminClients />} />
      <Route path="/admin/cashier" element={<AdminCashier />} />
      <Route path="/admin/manual-accounting" element={<AdminManualAccounting />} />
      <Route path="/admin/marketing/qr" element={<AdminQRMarketing />} />
      <Route path="/admin/marketing/flyers" element={<AdminFlyers />} />
      <Route path="/admin/marketing/affiche" element={<AdminAffiche />} />
      <Route path="/admin/marketing/menu" element={<AdminMenuPublic />} />
      <Route path="/admin/marketing/tv" element={<AdminAfficheTV />} />
      <Route path="/admin/whatsapp-orders" element={<AdminWhatsAppOrders />} />
      <Route path="/order-tracking" element={<OrderTracking />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}