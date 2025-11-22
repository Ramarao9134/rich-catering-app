import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Packages() {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    axios.get('/api/packages').then(res => {
      setPackages(res.data)
    }).catch(console.error)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Event Packages</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Choose from our carefully curated packages or customize your own event. All packages include premium catering and professional service.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map(pkg => (
          <div key={pkg.id} className="card">
            <div className="h-64 bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              {pkg.images && pkg.images.length > 0 ? (
                <img src={pkg.images[0]} alt={pkg.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">{pkg.title}</span>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2">{pkg.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-gold-600">₹{pkg.pricePerGuest}</span>
                  <span className="text-gray-500">per guest</span>
                </div>
                <p className="text-sm text-gray-600">
                  Min: {pkg.minGuests} guests | Max: {pkg.maxGuests} guests
                </p>
              </div>
              
              {pkg.includes && pkg.includes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Includes:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {pkg.includes.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-gold-500 mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                    {pkg.includes.length > 3 && (
                      <li className="text-gray-500">+ {pkg.includes.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
              
              <Link to={`/packages/${pkg.id}`} className="btn-primary w-full text-center block">
                View Details & Book
              </Link>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No packages available</p>
        </div>
      )}
    </div>
  )
}

