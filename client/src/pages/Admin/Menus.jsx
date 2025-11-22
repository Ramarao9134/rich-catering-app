import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

export default function AdminMenus() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    description: '',
    price: '',
    tags: '',
    isAvailable: true
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    loadItems()
  }, [user, navigate])

  const loadItems = async () => {
    try {
      const response = await axios.get('/api/menu')
      setItems(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      if (editingItem) {
        await axios.put(`/api/admin/menu/${editingItem.id}`, data)
      } else {
        await axios.post('/api/admin/menu', data)
      }
      
      setShowForm(false)
      setEditingItem(null)
      setFormData({ name: '', category: 'Breakfast', description: '', price: '', tags: '', isAvailable: true })
      loadItems()
    } catch (error) {
      alert('Failed to save menu item')
      console.error(error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      price: item.price,
      tags: item.tags ? item.tags.join(', ') : '',
      isAvailable: item.isAvailable !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await axios.delete(`/api/admin/menu/${id}`)
      loadItems()
    } catch (error) {
      alert('Failed to delete item')
      console.error(error)
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Manage Menu Items</h1>
          <p className="text-gray-300 mt-2">Add, edit, or remove menu items</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
        <button onClick={() => { setShowForm(true); setEditingItem(null); setFormData({ name: '', category: 'Breakfast', description: '', price: '', tags: '', isAvailable: true }) }} className="btn-primary">
          Add New Item
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{editingItem ? 'Edit' : 'Add'} Menu Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Beverages</option>
                  <option>Desserts</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="input-field" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Tags (comma-separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Vegetarian, Spicy, etc." className="input-field" />
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="w-5 h-5 mr-2" />
              <label>Available</label>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingItem(null) }} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="card p-6">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-2">{item.category}</p>
            <p className="text-2xl font-bold text-gold-600 mb-4">₹{item.price}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="btn-outline flex-1">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="btn-secondary bg-red-600 hover:bg-red-700 flex-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

