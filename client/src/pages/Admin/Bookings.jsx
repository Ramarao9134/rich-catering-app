import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

export default function AdminBookings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [packages, setPackages] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [availability, setAvailability] = useState({})

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    loadBookings()
    loadPackages()
  }, [user, navigate])

  const loadBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings')
      setBookings(response.data)
      
      // Check availability for each pending booking
      const pendingBookings = response.data.filter(b => b.adminApproval === 'pending')
      for (const booking of pendingBookings) {
        checkAvailability(booking.id, booking.date, booking.timeSlot)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const checkAvailability = async (bookingId, date, timeSlot) => {
    try {
      const response = await axios.get('/api/bookings/availability', {
        params: { date, timeSlot }
      })
      setAvailability(prev => ({ ...prev, [bookingId]: response.data }))
    } catch (error) {
      console.error('Error checking availability:', error)
    }
  }

  const loadPackages = async () => {
    try {
      const response = await axios.get('/api/packages')
      setPackages(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/bookings/${id}`, { status })
      loadBookings()
    } catch (error) {
      alert('Failed to update status')
      console.error(error)
    }
  }

  const updateApproval = async (id, approval) => {
    try {
      await axios.put(`/api/admin/bookings/${id}`, { adminApproval: approval })
      loadBookings()
    } catch (error) {
      alert('Failed to update approval')
      console.error(error)
    }
  }

  const recordPayment = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId)
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount')
      return
    }
    try {
      await axios.put(`/api/admin/bookings/${bookingId}/payment`, { 
        paidAmount: parseFloat(paymentAmount),
        paymentNotes: paymentNotes || undefined
      })
      setSelectedBooking(null)
      setPaymentAmount('')
      setPaymentNotes('')
      loadBookings()
      alert('Payment recorded successfully')
    } catch (error) {
      alert('Failed to record payment')
      console.error(error)
    }
  }

  const getPackageName = (packageId) => {
    const pkg = packages.find(p => p.id === packageId)
    return pkg ? pkg.title : `Package #${packageId}`
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      'in progress': 'bg-purple-100 text-purple-800'
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
          <h1 className="text-4xl font-bold">Manage Bookings</h1>
          <p className="text-gray-300 mt-2">Approve bookings and track payments</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Booking #{booking.id}</h3>
                  <p className="text-gray-600">{getPackageName(booking.packageId)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                  </p>
                  {booking.adminApproval === 'pending' && availability[booking.id] && (
                    <div className={`mt-2 p-2 rounded text-xs ${
                      availability[booking.id].available 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {availability[booking.id].available ? (
                        <span>✓ Slot available</span>
                      ) : (
                        <span>⚠ {availability[booking.id].conflictingBookings.length} conflicting booking(s)</span>
                      )}
                    </div>
                  )}
                  {booking.paymentNotes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <p className="font-semibold text-gray-700">Payment Notes:</p>
                      <p className="text-gray-600 whitespace-pre-wrap">{booking.paymentNotes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(booking.adminApproval)}`}>
                    {booking.adminApproval || 'pending'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-semibold">{booking.guestCount}</p>
                  {booking.addOns && booking.addOns.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Add-ons</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {booking.addOns.map((addon, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">{addon}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Estimate</p>
                  <p className="text-2xl font-bold text-gold-600">₹{booking.totalEstimate}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Paid: ₹{booking.paidAmount || 0} | 
                    Remaining: ₹{booking.totalEstimate - (booking.paidAmount || 0)}
                  </p>
                </div>
              </div>

              {booking.contactDetails && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold mb-1">Contact Details</p>
                  <p className="text-sm text-gray-700">{booking.contactDetails.name}</p>
                  <p className="text-sm text-gray-700">{booking.contactDetails.email}</p>
                  <p className="text-sm text-gray-700">{booking.contactDetails.phone}</p>
                  <p className="text-sm text-gray-700 mt-1">{booking.contactDetails.address}</p>
                </div>
              )}
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateApproval(booking.id, 'approved')}
                    disabled={booking.adminApproval === 'approved'}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      booking.adminApproval === 'approved'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Approve Booking
                  </button>
                  <button
                    onClick={() => updateApproval(booking.id, 'rejected')}
                    disabled={booking.adminApproval === 'rejected'}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      booking.adminApproval === 'rejected'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Reject Booking
                  </button>
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-4 py-2 bg-gold-600 text-white rounded-lg font-semibold hover:bg-gold-700 transition-colors"
                  >
                    Record Payment
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Booking Status</label>
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    className="input-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600">No bookings yet</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Record Payment</h3>
            <div className="mb-4">
              <p className="text-gray-600">Booking #{selectedBooking.id}</p>
              <p className="text-lg font-semibold">Total: ₹{selectedBooking.totalEstimate}</p>
              <p className="text-sm text-gray-600">Paid: ₹{selectedBooking.paidAmount || 0}</p>
              <p className="text-sm text-gray-600">Remaining: ₹{selectedBooking.totalEstimate - (selectedBooking.paidAmount || 0)}</p>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Payment Amount (₹)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="input-field"
                max={selectedBooking.totalEstimate - (selectedBooking.paidAmount || 0)}
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Payment Notes (Optional)</label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Add notes about cash payment received from owner, transaction ID, etc."
                className="input-field"
                rows="3"
              />
              <p className="text-xs text-gray-500 mt-1">Use this field to track cash payments received from owner</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => recordPayment(selectedBooking.id)}
                className="btn-primary flex-1"
              >
                Record Payment
              </button>
              <button
                onClick={() => {
                  setSelectedBooking(null)
                  setPaymentAmount('')
                  setPaymentNotes('')
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
