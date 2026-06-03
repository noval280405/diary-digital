import { ref, onMounted } from 'vue'

// State global agar sinkron di semua halaman (Layout, Index, Login)
const darkMode = ref(false)

export const useDiaryTheme = () => {
    // Fungsi untuk membalikkan status tema
    const toggleTheme = () => {
        darkMode.value = !darkMode.value
        // Simpan pilihan user ke localStorage biar awet
        localStorage.setItem('diary-theme', darkMode.value ? 'dark' : 'light')

        // Opsional: Pasang class 'dark' di root HTML untuk Tailwind CSS versi global
        if (darkMode.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    // Cek tema pilihan user saat pertama kali aplikasi dimuat di browser
    onMounted(() => {
        const savedTheme = localStorage.getItem('diary-theme')
        if (savedTheme) {
            darkMode.value = savedTheme === 'dark'
        } else {
            // Jika user belum pernah milih, ikuti setelan bawaan laptop/HP mereka
            darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }

        // Terapkan class sesuai kondisi awal
        if (darkMode.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    })

    return {
        darkMode,
        toggleTheme
    }
}