<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
// import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
// import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'

const { t } = useI18n()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.classList.add('mobile-menu-open')
  } else {
    document.body.classList.remove('mobile-menu-open')
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.classList.remove('mobile-menu-open')
}
</script>

<template>
  <header>
 
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
   
  </footer>
</template>

