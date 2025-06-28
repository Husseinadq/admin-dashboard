// import './assets/main.css'
import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize language direction based on current locale
const currentLang = i18n.global.locale.value
document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr')
document.documentElement.setAttribute('lang', currentLang)

// Initialize theme based on stored preference or system preference
const initializeTheme = () => {
  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem('theme')
  
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme)
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = prefersDark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }
}

initializeTheme()

app.mount('#app')
