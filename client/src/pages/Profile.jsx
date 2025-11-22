import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('online')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadData()
  }, [user, navigate])

  const loadData = () => {
    axios.get('/api/orders').then(res => {
      setOrders(res.data)
    }).catch(console.error)

    axios.get('/api/bookings').then(res => {
      setBookings(res.data)
    }).catch(console.error)
  }

  const handlePayment = async (type, id) => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount')
      return
    }

    try {
      if (type === 'order') {
        await axios.post(`/api/payments/order/${id}`, {
          amount: paymentAmount,
          paymentMethod
        })
      } else {
        await axios.post(`/api/payments/booking/${id}`, {
          amount: paymentAmount,
          paymentMethod
        })
      }
      alert('Payment processed successfully!')
      setSelectedPayment(null)
      setPaymentAmount('')
      loadData()
    } catch (error) {
      alert('Payment failed. Please try again.')
      console.error(error)
    }
  }

  if (!user) return null

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      'in progress': 'bg-purple-100 text-purple-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    }
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const getApprovalColor = (approval) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return colors[approval?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800'
    }
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>
      
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> <span className="capitalize">{user.role}</span></p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-gold-500 text-gold-600' : 'text-gray-600'}`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-semibold ${activeTab === 'bookings' ? 'border-b-2 border-gold-500 text-gold-600' : 'text-gray-600'}`}
          >
            My Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-600">No orders yet</p>
            </div>
          ) : (
            orders.map(order => {
              const remaining = order.total - (order.paidAmount || 0)
              return (
                <div key={order.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {order.adminApproval && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(order.adminApproval)}`}>
                          {order.adminApproval}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700">
                        <span>{item.name} x {item.qty}</span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t mb-4">
                    <div>
                      <span className="text-gray-600 text-sm">{order.address}</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Paid: ₹{order.paidAmount || 0} | Remaining: ₹{remaining}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-gold-600">₹{order.total}</span>
                  </div>
                  {remaining > 0 && order.adminApproval === 'approved' && (
                    <button
                      onClick={() => setSelectedPayment({ type: 'order', id: order.id, total: order.total, paid: order.paidAmount || 0, remaining })}
                      className="btn-primary w-full"
                    >
                      Pay ₹{remaining}
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-600">No bookings yet</p>
            </div>
          ) : (
            bookings.map(booking => {
              const remaining = booking.totalEstimate - (booking.paidAmount || 0)
              return (
                <div key={booking.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Booking #{booking.id}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {booking.adminApproval && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(booking.adminApproval)}`}>
                          {booking.adminApproval}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus || 'pending'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-700 mb-4">
                    <p><span className="font-semibold">Guests:</span> {booking.guestCount}</p>
                    <p><span className="font-semibold">Estimated Total:</span> ₹{booking.totalEstimate}</p>
                    <p className="text-sm text-gray-600">
                      Paid: ₹{booking.paidAmount || 0} | Remaining: ₹{remaining}
                    </p>
                    {booking.addOns && booking.addOns.length > 0 && (
                      <p><span className="font-semibold">Add-ons:</span> {booking.addOns.join(', ')}</p>
                    )}
                  </div>
                  {remaining > 0 && booking.adminApproval === 'approved' && (
                    <button
                      onClick={() => setSelectedPayment({ type: 'booking', id: booking.id, total: booking.totalEstimate, paid: booking.paidAmount || 0, remaining })}
                      className="btn-primary w-full"
                    >
                      Pay ₹{remaining}
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Make Payment</h3>
            <div className="mb-4">
              <p className="text-gray-600">{selectedPayment.type === 'order' ? 'Order' : 'Booking'} #{selectedPayment.id}</p>
              <p className="text-lg font-semibold">Total: ₹{selectedPayment.total}</p>
              <p className="text-sm text-gray-600">Paid: ₹{selectedPayment.paid}</p>
              <p className="text-sm text-gray-600">Remaining: ₹{selectedPayment.remaining}</p>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input-field"
              >
                <option value="online">Online Payment</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Payment Amount (₹)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder={`Max: ₹${selectedPayment.remaining}`}
                className="input-field"
                max={selectedPayment.remaining}
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePayment(selectedPayment.type, selectedPayment.id)}
                className="btn-primary flex-1"
              >
                Pay Now
              </button>
              <button
                onClick={() => {
                  setSelectedPayment(null)
                  setPaymentAmount('')
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
