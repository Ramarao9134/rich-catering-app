import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pkg, setPkg] = useState(null)

  useEffect(() => {
    axios.get(`/api/packages/${id}`).then(res => {
      setPkg(res.data)
    }).catch(console.error)
  }, [id])

  if (!pkg) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-gold-600 hover:text-gold-700">
        ← Back to Packages
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="h-96 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
            {pkg.images && pkg.images.length > 0 ? (
              <img src={pkg.images[0]} alt={pkg.title} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-white text-3xl font-bold">{pkg.title}</span>
            )}
          </div>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">{pkg.title}</h1>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-bold text-gold-600">₹{pkg.pricePerGuest}</span>
              <span className="text-xl text-gray-600">per guest</span>
            </div>
            <p className="text-gray-700 mb-4 text-lg">{pkg.description}</p>
            <p className="text-gray-600">
              <span className="font-semibold">Guest Range:</span> {pkg.minGuests} - {pkg.maxGuests} guests
            </p>
          </div>
          
          {pkg.includes && pkg.includes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">What's Included</h3>
              <ul className="space-y-2">
                {pkg.includes.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="text-gold-500 mr-3 text-xl">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {pkg.addOns && pkg.addOns.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Available Add-ons</h3>
              <ul className="space-y-2">
                {pkg.addOns.map((addon, idx) => (
                  <li key={idx} className="text-gray-700">
                    • {addon.name} - ₹{addon.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Link to={`/book/${pkg.id}`} className="btn-primary w-full text-center block text-lg py-3">
            Book This Package
          </Link>
        </div>
      </div>
    </div>
  )
}

