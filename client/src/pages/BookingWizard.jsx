import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

export default function BookingWizard() {
  const { packageId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pkg, setPkg] = useState(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    guestCount: '',
    addOns: [],
    paymentMethod: 'cash',
    contactDetails: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  useEffect(() => {
    if (!user) {
      alert('Please login to book an event')
      navigate('/login')
      return
    }
    axios.get(`/api/packages/${packageId}`).then(res => {
      setPkg(res.data)
      setFormData(prev => ({ ...prev, guestCount: prev.guestCount || res.data.minGuests }))
    }).catch(console.error)
  }, [packageId, user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contactDetails: { ...prev.contactDetails, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Check availability when date or timeSlot changes
      if ((name === 'date' || name === 'timeSlot') && value) {
        checkAvailability(name === 'date' ? value : formData.date, name === 'timeSlot' ? value : formData.timeSlot)
      }
    }
  }

  const checkAvailability = async (date, timeSlot) => {
    if (!date || !timeSlot) return
    setCheckingAvailability(true)
    try {
      const response = await axios.get('/api/bookings/availability', {
        params: { date, timeSlot }
      })
      setAvailability(response.data)
    } catch (error) {
      console.error('Error checking availability:', error)
      setAvailability(null)
    } finally {
      setCheckingAvailability(false)
    }
  }

  const toggleAddOn = (addon) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addon.id)
        ? prev.addOns.filter(id => id !== addon.id)
        : [...prev.addOns, addon.id]
    }))
  }

  const calculateTotal = () => {
    if (!pkg) return 0
    const basePrice = pkg.pricePerGuest * parseInt(formData.guestCount || pkg.minGuests)
    const addOnPrice = pkg.addOns
      ?.filter(a => formData.addOns.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0) || 0
    return basePrice + addOnPrice
  }

  const handleSubmit = async () => {
    if (!formData.date || !formData.timeSlot || !formData.guestCount) {
      alert('Please fill all required fields')
      return
    }

    if (parseInt(formData.guestCount) < pkg.minGuests || parseInt(formData.guestCount) > pkg.maxGuests) {
      alert(`Guest count must be between ${pkg.minGuests} and ${pkg.maxGuests}`)
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/bookings', {
        packageId: pkg.id,
        date: formData.date,
        timeSlot: formData.timeSlot,
        guestCount: parseInt(formData.guestCount),
        addOns: formData.addOns,
        totalEstimate: calculateTotal(),
        contactDetails: formData.contactDetails,
        paymentMethod: formData.paymentMethod
      })

      if (response.data.success) {
        alert(`Booking request submitted! Booking ID: #${response.data.bookingId}`)
        navigate('/profile')
      }
    } catch (error) {
      alert('Failed to submit booking. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!pkg) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  const timeSlots = ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)', 'Night (8 PM - 12 AM)']

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Book Event: {pkg.title}</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-gold-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-gold-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Details</span>
          <span>Add-ons</span>
          <span>Review</span>
          <span>Confirm</span>
        </div>
      </div>

      <div className="card p-8">
        {/* Step 1: Event Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Event Details</h2>
            
            <div>
              <label className="block font-semibold mb-2">Event Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Time Slot *</label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select time slot</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {checkingAvailability && (
                <p className="text-sm text-gray-600 mt-1">Checking availability...</p>
              )}
              {availability && !checkingAvailability && (
                <div className={`mt-2 p-3 rounded-lg ${
                  availability.available 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {availability.available ? (
                    <p className="font-semibold">✓ Slot available</p>
                  ) : (
                    <div>
                      <p className="font-semibold">⚠ Slot not available</p>
                      {availability.conflictingBookings.length > 0 && (
                        <p className="text-sm mt-1">
                          {availability.conflictingBookings.length} booking(s) already scheduled for this slot
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label className="block font-semibold mb-2">
                Number of Guests * ({pkg.minGuests} - {pkg.maxGuests})
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                min={pkg.minGuests}
                max={pkg.maxGuests}
                required
                className="input-field"
              />
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => navigate(-1)} className="btn-outline flex-1">
                Cancel
              </button>
              <button onClick={() => setStep(2)} className="btn-primary flex-1">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add-ons */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Add-ons (Optional)</h2>
            
            {pkg.addOns && pkg.addOns.length > 0 ? (
              <div className="space-y-4">
                {pkg.addOns.map(addon => (
                  <label
                    key={addon.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.addOns.includes(addon.id)
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.addOns.includes(addon.id)}
                      onChange={() => toggleAddOn(addon)}
                      className="w-5 h-5 text-gold-500 mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{addon.name}</div>
                      <div className="text-sm text-gray-600">{addon.description}</div>
                    </div>
                    <div className="text-lg font-semibold text-gold-600">₹{addon.price}</div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No add-ons available for this package</p>
            )}
            
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Contact Details</h2>
            
            <div>
              <label className="block font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="contact.name"
                value={formData.contactDetails.name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contactDetails.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Phone *</label>
              <input
                type="tel"
                name="contact.phone"
                value={formData.contactDetails.phone}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Venue Address *</label>
              <textarea
                name="contact.address"
                value={formData.contactDetails.address}
                onChange={handleChange}
                required
                rows="3"
                className="input-field"
              />
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">
                Back
              </button>
              <button onClick={() => setStep(4)} className="btn-primary flex-1">
                Review & Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Review Your Booking</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Package</h3>
                <p>{pkg.title} - ₹{pkg.pricePerGuest} per guest</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Event Details</h3>
                <p>Date: {new Date(formData.date).toLocaleDateString()}</p>
                <p>Time: {formData.timeSlot}</p>
                <p>Guests: {formData.guestCount}</p>
              </div>
              
              {formData.addOns.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Add-ons</h3>
                  <ul className="list-disc list-inside">
                    {pkg.addOns
                      ?.filter(a => formData.addOns.includes(a.id))
                      .map(a => (
                        <li key={a.id}>{a.name} - ₹{a.price}</li>
                      ))}
                  </ul>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total Estimate</span>
                  <span className="text-gold-600">₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Payment Method *</label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-gold-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="w-5 h-5 text-gold-500 mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Cash Payment</div>
                    <div className="text-sm text-gray-600">Pay at venue or to owner</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-gold-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleChange}
                    className="w-5 h-5 text-gold-500 mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Online Payment</div>
                    <div className="text-sm text-gray-600">Pay now via online payment gateway</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="btn-outline flex-1">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (availability && !availability.available)}
                className={`btn-primary flex-1 ${loading || (availability && !availability.available) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

