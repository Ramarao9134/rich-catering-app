import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  const translations = {
    en: {
      home: 'Home',
      menu: 'Menu',
      packages: 'Packages',
      gallery: 'Gallery',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      cart: 'Cart',
      admin: 'Admin',
      orderNow: 'Order Now',
      bookEvent: 'Book Event',
      viewMenu: 'View Menu',
      welcome: 'Welcome to Rich & Catering',
      tagline: 'Exquisite Cuisine & Memorable Events',
    },
    te: {
      home: 'హోమ్',
      menu: 'మెనూ',
      packages: 'ప్యాకేజీలు',
      gallery: 'గ్యాలరీ',
      contact: 'సంప్రదించండి',
      login: 'లాగిన్',
      register: 'నమోదు',
      logout: 'లాగ్అవుట్',
      profile: 'ప్రొఫైల్',
      cart: 'కార్ట్',
      admin: 'అడ్మిన్',
      orderNow: 'ఇప్పుడే ఆర్డర్ చేయండి',
      bookEvent: 'ఈవెంట్ బుక్ చేయండి',
      viewMenu: 'మెనూ చూడండి',
      welcome: 'రిచ్ & కేటరింగ్‌కు స్వాగతం',
      tagline: 'అద్భుతమైన వంటకాలు & గుర్తుంచుకోదగిన సంఘటనలు',
    }
  }

  const t = (key) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

