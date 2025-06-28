import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ar from './locales/ar.json'

// Define supported languages type
type SupportedLanguage = 'en' | 'ar';

// Detect browser language or use stored preference
const getBrowserLanguage = (): SupportedLanguage => {
  // Check if a language preference is stored
  const storedLang = localStorage.getItem('language')
  if (storedLang && (storedLang === 'en' || storedLang === 'ar')) {
    return storedLang
  }

  // Detect browser language
  const browserLang = navigator.language.split('-')[0]
  return browserLang === 'ar' ? 'ar' : 'en' // Default to English if not Arabic
}

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getBrowserLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    ar
  }
})

// Function to change language
export const setLanguage = (lang: SupportedLanguage): void => {
  i18n.global.locale.value = lang
  localStorage.setItem('language', lang)
  
  // Set document direction based on language
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', lang)
  
  // Dispatch custom event for language change
  window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }))
}

// Initialize direction based on current language
const initializeDirection = (): void => {
  const currentLang = i18n.global.locale.value as SupportedLanguage
  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', currentLang)
}

// Call this when the app starts
initializeDirection()

export default i18n