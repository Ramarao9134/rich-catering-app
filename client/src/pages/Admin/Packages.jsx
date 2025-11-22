import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

export default function AdminPackages() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    loadPackages()
  }, [user, navigate])

  const loadPackages = async () => {
    try {
      const response = await axios.get('/api/packages')
      setPackages(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Manage Packages</h1>
          <p className="text-gray-300 mt-2">Manage event packages and pricing</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="card p-6">
            <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
            <div className="mb-4">
              <span className="text-2xl font-bold text-gold-600">₹{pkg.pricePerGuest}</span>
              <span className="text-gray-600"> per guest</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {pkg.minGuests} - {pkg.maxGuests} guests
            </p>
            <button className="btn-outline w-full">Edit Package</button>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

