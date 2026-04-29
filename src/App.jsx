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

      {/* NOUVEL ADMIN v2.0 - Sécurisé */}
      <Route path="/admin2" element={<NewAdmin />} />

      {/* Admin Routes Legacy */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/qrcode" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminQRCode /> : <Navigate to="/" />} />
      <Route path="/admin/accounting" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminAccounting /> : <Navigate to="/" />} />
      <Route path="/admin/promotions" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminPromotions /> : <Navigate to="/" />} />
      <Route path="/admin/settings" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminSettings /> : <Navigate to="/" />} />
      <Route path="/admin/kitchen" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminKitchen /> : <Navigate to="/" />} />
      <Route path="/admin/employees" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminEmployees /> : <Navigate to="/" />} />
      <Route path="/admin/inventory" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminInventory /> : <Navigate to="/" />} />
      <Route path="/admin/loyalty" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminLoyalty /> : <Navigate to="/" />} />
      <Route path="/admin/delivery" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminDeliveryZones /> : <Navigate to="/" />} />
      <Route path="/admin/clients" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminClients /> : <Navigate to="/" />} />
      <Route path="/admin/cashier" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminCashier /> : <Navigate to="/" />} />
      <Route path="/admin/manual-accounting" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminManualAccounting /> : <Navigate to="/" />} />
      <Route path="/admin/marketing/qr" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminQRMarketing /> : <Navigate to="/" />} />
      <Route path="/admin/marketing/flyers" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminFlyers /> : <Navigate to="/" />} />
      <Route path="/admin/marketing/affiche" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminAffiche /> : <Navigate to="/" />} />
      <Route path="/admin/marketing/menu" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminMenuPublic /> : <Navigate to="/" />} />
      <Route path="/admin/marketing/tv" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminAfficheTV /> : <Navigate to="/" />} />
      <Route path="/admin/whatsapp-orders" element={localStorage.getItem('rchicken_admin') === 'intersidibe2@gmail.com' ? <AdminWhatsAppOrders /> : <Navigate to="/" />} />
      <Route path="/order-tracking" element={<OrderTracking />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}