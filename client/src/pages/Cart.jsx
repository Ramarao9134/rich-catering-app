import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to place an order')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }

    if (!address.trim()) {
      alert('Please enter delivery address')
      return
    }

    setLoading(true)
    try {
      const items = cart.map(item => ({
        menuItemId: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price
      }))

      const response = await axios.post('/api/cart/checkout', {
        items,
        total: getTotal(),
        address,
        paymentMethod
      })

      if (response.data.success) {
        if (paymentMethod === 'online' || paymentMethod === 'upi' || paymentMethod === 'card') {
          // Simulate payment processing
          const paymentResponse = await axios.post(`/api/payments/order/${response.data.orderId}`, {
            amount: getTotal(),
            paymentMethod
          })
          if (paymentResponse.data.success) {
            alert(`Order Confirmed & Payment Received! Order ID: #${response.data.orderId}`)
          } else {
            alert(`Order Confirmed! Order ID: #${response.data.orderId}\nPlease complete payment from your profile.`)
          }
        } else {
          alert(`Order Confirmed! Order ID: #${response.data.orderId}\nPayment will be collected on delivery.`)
        }
        clearCart()
        navigate('/profile')
      }
    } catch (error) {
      alert('Failed to place order. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty</p>
        <Link to="/menu" className="btn-primary">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold-200 to-gold-400 rounded-lg flex items-center justify-center">
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-gray-600">{item.name[0]}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                    <p className="text-gray-600 mb-2">₹{item.price} each</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-lg font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-gray-700">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-gold-600">₹{getTotal()}</span>
              </div>
            </div>

            {!user ? (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">Please login to checkout</p>
                <Link to="/login" className="btn-primary w-full text-center block">
                  Login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="input-field"
                    rows="3"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block font-semibold mb-2">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="input-field"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !user || !address.trim()}
              className={`btn-primary w-full text-lg py-3 ${(!user || !address.trim() || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

