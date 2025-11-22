import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useLanguage } from '../../contexts/LanguageContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gold-400">Rich & Catering</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gold-400 transition-colors">{t('home')}</Link>
            <Link to="/menu" className="hover:text-gold-400 transition-colors">{t('menu')}</Link>
            <Link to="/packages" className="hover:text-gold-400 transition-colors">{t('packages')}</Link>
            <Link to="/gallery" className="hover:text-gold-400 transition-colors">{t('gallery')}</Link>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">{t('contact')}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-sm"
            >
              {language === 'en' ? 'తెలుగు' : 'English'}
            </button>

            <Link to="/cart" className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                    {t('admin')}
                  </Link>
                )}
                <Link to="/profile" className="hover:text-gold-400 transition-colors">{t('profile')}</Link>
                <button onClick={handleLogout} className="hover:text-gold-400 transition-colors">
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="hover:text-gold-400 transition-colors">{t('login')}</Link>
                <Link to="/register" className="btn-primary">{t('register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

