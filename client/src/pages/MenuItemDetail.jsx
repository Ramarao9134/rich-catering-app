import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../contexts/CartContext'

export default function MenuItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get(`/api/menu/${id}`).then(res => {
      setItem(res.data)
    }).catch(console.error)
  }, [id])

  const handleAddToCart = () => {
    if (!item.isAvailable) {
      alert('This item is currently unavailable')
      return
    }
    addToCart({ ...item, quantity })
    alert(`${item.name} (${quantity}x) added to cart!`)
    navigate('/cart')
  }

  if (!item) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-gold-600 hover:text-gold-700">
        ← Back to Menu
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="h-96 bg-gradient-to-br from-gold-200 to-gold-400 rounded-xl flex items-center justify-center">
            {item.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-gray-600 text-2xl">{item.name}</span>
            )}
          </div>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-gold-600">₹{item.price}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">{item.category}</span>
            {!item.isAvailable && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Unavailable</span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6 text-lg">{item.description}</p>
          
          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {item.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`btn-primary w-full text-lg py-3 ${!item.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {item.isAvailable ? `Add to Cart - ₹${item.price * quantity}` : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  )
}

