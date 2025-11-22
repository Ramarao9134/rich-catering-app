import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px] lg:min-h-[700px]">
          {/* Left Side - Login Form */}
          <div className="bg-gray-900 p-8 lg:p-12 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[700px] border-r-[100px] border-t-transparent border-r-orange-500 opacity-20"></div>
            <h1 className="text-5xl font-bold text-white mb-8">Login</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Login
              </button>
            </form>
            
            <p className="mt-6 text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 hover:text-orange-400 font-semibold underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Right Side - Welcome Message with Footer Info */}
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-6 lg:p-8 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-0 h-0 border-b-[700px] border-l-[100px] border-b-transparent border-l-gray-900 opacity-10"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Welcome Content */}
              <div className="flex-shrink-0">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">WELCOME BACK!</h2>
                <p className="text-sm lg:text-base leading-relaxed text-white/90 mb-6">
                  We are happy to have you with us again. If you need anything, we are here to help.
                </p>
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-white/90">Access your orders and bookings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-white/90">Track your payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-white/90">Manage your profile</span>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div className="mt-1 pt-1.5 border-t border-white/20">
                  <h4 className="font-semibold mb-1 text-sm text-white">Quick Links</h4>
                  <ul className="grid grid-cols-2 gap-1 text-sm text-white/90">
                    <li><Link to="/menu" className="hover:text-white transition-colors block">Menu</Link></li>
                    <li><Link to="/packages" className="hover:text-white transition-colors block">Packages</Link></li>
                    <li><Link to="/gallery" className="hover:text-white transition-colors block">Gallery</Link></li>
                    <li><Link to="/contact" className="hover:text-white transition-colors block">Contact</Link></li>
                  </ul>
                </div>
              </div>

              {/* Footer Content */}
              <div className="mt-auto pt-0.5 border-t-2 border-white/30 flex-shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* Contact */}
                  <div className="flex-shrink-0">
                    <h4 className="font-semibold mb-1 text-sm text-white">Contact</h4>
                    <ul className="space-y-1 text-white/90">
                      <li className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="break-words text-xs">+91 91338 50573</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="break-words text-xs">kandaramarao99@gmail.com</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="break-words text-xs">Rajahmundry, Andhra Pradesh</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Follow Us */}
                  <div className="flex-shrink-0">
                    <h4 className="font-semibold mb-1 text-sm text-white">Follow Us</h4>
                    <ul className="space-y-1 text-white/90">
                      <li>
                        <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                          <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span className="text-xs">Facebook</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                          <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          <span className="text-xs">Instagram</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                          <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          <span className="text-xs">Twitter</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/30 text-center text-white/90 text-xs">
                  <p>&copy; 2023 Rich & Catering. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
