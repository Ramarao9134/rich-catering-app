import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

export default function AdminOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    loadOrders()
  }, [user, navigate])

  const loadOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders')
      setOrders(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/orders/${id}`, { status })
      loadOrders()
    } catch (error) {
      alert('Failed to update status')
      console.error(error)
    }
  }

  const updateApproval = async (id, approval) => {
    try {
      await axios.put(`/api/admin/orders/${id}`, { adminApproval: approval })
      loadOrders()
    } catch (error) {
      alert('Failed to update approval')
      console.error(error)
    }
  }

  const recordPayment = async (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount')
      return
    }
    const newPaidAmount = (order.paidAmount || 0) + parseFloat(paymentAmount)
    try {
      await axios.put(`/api/admin/orders/${orderId}/payment`, { paidAmount: newPaidAmount })
      setSelectedOrder(null)
      setPaymentAmount('')
      loadOrders()
      alert('Payment recorded successfully')
    } catch (error) {
      alert('Failed to record payment')
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
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

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Manage Orders</h1>
          <p className="text-gray-300 mt-2">Approve orders and track payments</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(order.adminApproval)}`}>
                    {order.adminApproval || 'pending'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.paymentStatus)}`}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{item.name} x {item.qty}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold">{order.address}</p>
                  <p className="text-sm text-gray-600 mt-1">Payment Method: {order.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gold-600">₹{order.total}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Paid: ₹{order.paidAmount || 0} | 
                    Remaining: ₹{order.total - (order.paidAmount || 0)}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateApproval(order.id, 'approved')}
                    disabled={order.adminApproval === 'approved'}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      order.adminApproval === 'approved'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Approve Order
                  </button>
                  <button
                    onClick={() => updateApproval(order.id, 'rejected')}
                    disabled={order.adminApproval === 'rejected'}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      order.adminApproval === 'rejected'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Reject Order
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-gold-600 text-white rounded-lg font-semibold hover:bg-gold-700 transition-colors"
                  >
                    Record Payment
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Order Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="input-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600">No orders yet</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Record Payment</h3>
            <div className="mb-4">
              <p className="text-gray-600">Order #{selectedOrder.id}</p>
              <p className="text-lg font-semibold">Total: ₹{selectedOrder.total}</p>
              <p className="text-sm text-gray-600">Paid: ₹{selectedOrder.paidAmount || 0}</p>
              <p className="text-sm text-gray-600">Remaining: ₹{selectedOrder.total - (selectedOrder.paidAmount || 0)}</p>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Payment Amount (₹)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="input-field"
                max={selectedOrder.total - (selectedOrder.paidAmount || 0)}
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => recordPayment(selectedOrder.id)}
                className="btn-primary flex-1"
              >
                Record Payment
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null)
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
