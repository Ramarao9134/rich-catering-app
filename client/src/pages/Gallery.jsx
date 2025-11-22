import { useState, useEffect } from 'react'
import axios from 'axios'

const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'Anniversary']

export default function Gallery() {
  const [images, setImages] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    axios.get('/api/gallery').then(res => {
      setImages(res.data)
      setFilteredImages(res.data)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredImages(images)
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory))
    }
  }, [selectedCategory, images])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Gallery</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Explore our portfolio of memorable events and exquisite presentations
      </p>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
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

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map(image => (
          <div
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="card overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="h-64 bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center">
              {image.imageUrl ? (
                <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600">{image.title}</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">{image.title}</h3>
              {image.caption && (
                <p className="text-sm text-gray-600 line-clamp-2">{image.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No images found</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                >
                  ✕
                </button>
                <div className="h-96 bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center">
                  {selectedImage.imageUrl ? (
                    <img
                      src={selectedImage.imageUrl}
                      alt={selectedImage.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-600 text-2xl">{selectedImage.title}</span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{selectedImage.title}</h3>
                {selectedImage.caption && (
                  <p className="text-gray-700 mb-2">{selectedImage.caption}</p>
                )}
                <p className="text-sm text-gray-500">
                  Category: {selectedImage.category} | {new Date(selectedImage.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

