import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gold-400 mb-4">Rich & Catering</h3>
            <p className="text-gray-400">
              Exquisite cuisine and memorable events. Your trusted partner for dining and celebrations.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/menu" className="hover:text-gold-400 transition-colors">{t('menu')}</Link></li>
              <li><Link to="/packages" className="hover:text-gold-400 transition-colors">{t('packages')}</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-400 transition-colors">{t('gallery')}</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +91 91338 50573</li>
              <li>✉️ kandaramarao99@gmail.com</li>
              <li>📍 Rajahmundry, Andhra Pradesh</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Rich & Catering. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

