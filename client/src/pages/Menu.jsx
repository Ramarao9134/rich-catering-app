import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../contexts/CartContext'

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Desserts']

export default function Menu() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get('/api/menu').then(res => {
      setItems(res.data)
      setFilteredItems(res.data)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    let filtered = items
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    }
    setFilteredItems(filtered)
  }, [selectedCategory, search, items])

  const handleAddToCart = (item) => {
    addToCart(item)
    alert(`${item.name} added to cart!`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="card">
            <div className="h-48 bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center">
              {item.images && item.images.length > 0 ? (
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600 text-lg">{item.name}</span>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gold-600">₹{item.price}</span>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={`/menu/${item.id}`} className="btn-outline flex-1 text-center">
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                  className={`btn-primary flex-1 ${!item.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      )}
    </div>
  )
}

