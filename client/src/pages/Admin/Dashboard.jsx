import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

export default function AdminDashboard() {
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
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 mt-2">Manage orders, bookings, and track payments</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/menus" className="card p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Manage Menus</h3>
          <p className="text-gray-600">Add, edit, or remove menu items</p>
        </Link>
        <Link to="/admin/packages" className="card p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Manage Packages</h3>
          <p className="text-gray-600">Manage event packages</p>
        </Link>
        <Link to="/admin/bookings" className="card p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Manage Bookings</h3>
          <p className="text-gray-600">View and manage event bookings</p>
        </Link>
        <Link to="/admin/orders" className="card p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
          <p className="text-gray-600">View and process food orders</p>
        </Link>
        <Link to="/admin/gallery" className="card p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Manage Gallery</h3>
          <p className="text-gray-600">Upload and manage gallery images</p>
        </Link>
        <Link to="/admin/reports" className="card p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
          <p className="text-gray-600">View detailed reports and analytics</p>
        </Link>
      </div>

      {/* Popular Items */}
      {stats && stats.popularItems && stats.popularItems.length > 0 && (
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Popular Menu Items</h2>
          <div className="space-y-2">
            {stats.popularItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">{item.name}</span>
                <span className="text-gold-600">{item.orderCount} orders</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

