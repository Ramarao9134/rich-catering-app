import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

export default function AdminGallery() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [images, setImages] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    loadImages()
  }, [user, navigate])

  const loadImages = async () => {
    try {
      const response = await axios.get('/api/gallery')
      setImages(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Manage Gallery</h1>
          <p className="text-gray-300 mt-2">Upload and manage gallery images</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
        <button className="btn-primary">Upload Image</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(image => (
          <div key={image.id} className="card overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center">
              {image.imageUrl ? (
                <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600">{image.title}</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{image.category}</p>
              <div className="flex gap-2">
                <button className="btn-outline text-sm flex-1">Edit</button>
                <button className="btn-secondary bg-red-600 hover:bg-red-700 text-sm flex-1">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

