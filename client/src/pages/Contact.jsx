import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send to the backend
    alert('Thank you for your enquiry! We will get back to you soon.')
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Have a question or want to book an event? Get in touch with us!
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-gold-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-6 h-6 text-gold-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">info@richcatering.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-6 h-6 text-gold-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">Hyderabad, Telangana, India</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            
            {submitted && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                Thank you! We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="input-field"
                />
              </div>
              
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

