import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import MenuItemDetail from './pages/MenuItemDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import BookingWizard from './pages/BookingWizard'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminMenus from './pages/Admin/Menus'
import AdminPackages from './pages/Admin/Packages'
import AdminBookings from './pages/Admin/Bookings'
import AdminOrders from './pages/Admin/Orders'
import AdminGallery from './pages/Admin/Gallery'
import AdminReports from './pages/Admin/Reports'
import NotFound from './pages/NotFound'

function AppContent() {
  const location = useLocation()
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<MenuItemDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/book/:packageId" element={<BookingWizard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/menus" element={<AdminMenus />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App

