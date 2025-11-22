import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const { t } = useLanguage()
  const [packages, setPackages] = useState([])

  useEffect(() => {
    axios.get('/api/packages').then(res => {
      setPackages(res.data.slice(0, 3))
    }).catch(console.error)
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('welcome')}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gold-400">{t('tagline')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary text-lg px-8 py-3">
              {t('orderNow')}
            </Link>
            <Link to="/packages" className="btn-secondary text-lg px-8 py-3">
              {t('bookEvent')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Menu</h3>
              <p className="text-gray-600">Exquisite dishes crafted with finest ingredients</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Planning</h3>
              <p className="text-gray-600">Complete event solutions for all occasions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">Consistent excellence in every service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-cream-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map(pkg => (
              <div key={pkg.id} className="card">
                <div className="h-48 bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Package {pkg.id}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gold-600">₹{pkg.pricePerGuest}</span>
                    <span className="text-gray-500">per guest</span>
                  </div>
                  <Link to={`/packages/${pkg.id}`} className="btn-primary w-full text-center block">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/packages" className="btn-outline">
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Event Memorable?</h2>
          <p className="text-xl text-gray-300 mb-8">Contact us today for a personalized quote</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary text-lg px-8 py-3">
              Get in Touch
            </Link>
            <Link to="/packages" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3">
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

