<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
    <div class="bg-slate-800 p-8 rounded-3xl w-full max-w-md shadow-xl border border-slate-700">
      <h2 class="text-2xl font-black mb-6 text-center">
        {{ isRegister ? 'Daftar Akun Diary' : 'Masuk ke Diary' }}
      </h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="text-xs font-bold uppercase tracking-wider block mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label class="text-xs font-bold uppercase tracking-wider block mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500" />
        </div>

        <button type="submit" class="w-full bg-indigo-600 p-3 rounded-xl font-bold mt-2 hover:bg-indigo-500 transition-colors">
          {{ isRegister ? 'Buat Akun' : 'Masuk' }}
        </button>
      </form>

      <p @click="isRegister = !isRegister" class="text-xs text-center mt-4 text-indigo-400 cursor-pointer hover:underline">
        {{ isRegister ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Daftar gratis' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const { $fbAuth } = useNuxtApp()
const router = useRouter()

const email = ref('')
const password = ref('')
const isRegister = ref(false)

const handleSubmit = async () => {
  try {
    if (isRegister.value) {
      // Otomatis bikin user baru di Firebase gratisan
      await createUserWithEmailAndPassword($fbAuth, email.value, password.value)
      alert('Akun berhasil dibuat!')
    } else {
      // Login user lama
      await signInWithEmailAndPassword($fbAuth, email.value, password.value)
    }
    router.push('/') // Lempar ke halaman utama diary jika sukses
  } catch (error) {
    alert(error.message)
  }
}
</script>