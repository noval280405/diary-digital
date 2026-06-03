import { ref, onMounted, watch } from 'vue'

export const useDiaryTheme = () => {
  const darkMode = useState<boolean>('diary-dark-mode', () => true)

  const toggleTheme = () => {
    darkMode.value = !darkMode.value
    updateGlobalClass(darkMode.value)
  }

  const updateGlobalClass = (isDark: boolean) => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  onMounted(() => {
    const saved = localStorage.getItem('diary-theme')
    if (saved) {
      darkMode.value = saved === 'dark'
    }
    updateGlobalClass(darkMode.value)
  })

  watch(darkMode, (newVal) => {
    localStorage.setItem('diary-theme', newVal ? 'dark' : 'light')
  })

  return {
    darkMode,
    toggleTheme
  }
}