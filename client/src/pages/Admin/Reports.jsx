import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

export default function AdminReports() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    loadStats()
  }, [user, navigate])

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/admin/reports')
      setStats(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-300 mt-2">View detailed reports and analytics</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
      
      {stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <h3 className="text-gray-600 mb-2">Today's Revenue</h3>
              <p className="text-3xl font-bold text-gold-600">₹{stats.todayRevenue}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-gray-600 mb-2">Today's Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.todayOrders}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-gray-600 mb-2">Upcoming Bookings</h3>
              <p className="text-3xl font-bold text-green-600">{stats.upcomingBookings}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-gray-600 mb-2">Pending Orders</h3>
              <p className="text-3xl font-bold text-red-600">{stats.pendingOrders}</p>
            </div>
          </div>

          {stats.popularItems && stats.popularItems.length > 0 && (
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">Popular Menu Items</h2>
              <div className="space-y-2">
                {stats.popularItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-gray-600 ml-2">({item.category})</span>
                    </div>
                    <span className="text-gold-600 font-semibold">{item.orderCount} orders</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Export Data</h2>
            <div className="flex gap-4">
              <button className="btn-outline">Export Orders (CSV)</button>
              <button className="btn-outline">Export Bookings (CSV)</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

