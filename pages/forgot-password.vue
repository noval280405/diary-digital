<template>
  <div
    :class="darkMode ? 'bg-slate-950 text-white' : 'bg-amber-50 text-slate-900'"
    class="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden transition-colors duration-500"
  >
    <!-- Background Bulat Estetik -->
    <div
      class="fixed inset-0 pointer-events-none transition-all duration-500"
      :class="
        darkMode
          ? 'bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]'
          : 'bg-[radial-gradient(circle_at_top,_#fff7ed,_#fef3c7)]'
      "
    />
    <div
      class="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
      :class="darkMode ? 'bg-indigo-500' : 'bg-orange-300'"
    />

    <!-- Kartu Form (Glassmorphism Effect) -->
    <div
      :class="
        darkMode
          ? 'bg-slate-900/60 border-slate-800 shadow-[0_30px_80px_rgba(0,0,0,0.5)]'
          : 'bg-white/80 border-amber-200 shadow-xl shadow-amber-900/5'
      "
      class="w-full max-w-md p-8 md:p-10 rounded-[32px] border backdrop-blur-xl relative z-10 transition-all duration-500"
    >
      <!-- Header Ikon -->
      <div class="flex flex-col items-center text-center mb-8">
        <div
          :class="
            darkMode
              ? 'from-indigo-500 to-pink-500'
              : 'from-orange-500 to-rose-500'
          "
          class="w-16 h-16 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg mb-4"
        >
          <Icon
            icon="solar:keyhole-unlock-bold-duotone"
            class="w-8 h-8 text-white"
          />
        </div>
        <h2 class="text-2xl font-black tracking-tight">Pulihkan Kata Sandi</h2>
        <p class="text-xs opacity-60 mt-1 px-4">
          Masukkan email terdaftar. Kami akan mengirimkan tautan untuk mengatur
          ulang kata sandi kamu.
        </p>
      </div>

      <!-- Form Utama -->
      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <div>
          <label
            class="text-xs font-black uppercase tracking-[0.15em] block mb-2 opacity-70"
          >
            Alamat Email Kamu
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            required
            :class="
              darkMode
                ? 'bg-slate-950/90 border-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500'
                : 'bg-amber-50/50 border-amber-200 text-slate-800 focus:ring-2 focus:ring-orange-400 shadow-sm'
            "
            class="w-full px-4 py-3 border rounded-2xl text-sm outline-none transition-all duration-300 placeholder:text-slate-500"
          />
        </div>

        <!-- Tombol Kirim -->
        <button
          type="submit"
          :disabled="loading"
          :class="[
            loading ? 'opacity-50 cursor-not-allowed' : '',
            darkMode
              ? 'from-indigo-600 to-violet-600'
              : 'from-orange-500 to-amber-500',
          ]"
          class="w-full bg-gradient-to-r p-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] text-white shadow-md hover:brightness-110 active:scale-[0.98] transition-all duration-300 mt-2 flex items-center justify-center gap-2"
        >
          <Icon
            v-if="loading"
            icon="solar:spinner-bold animate-spin"
            class="w-4 h-4"
          />
          <span>Kirim Tautan Atur Ulang</span>
        </button>
      </form>

      <!-- Navigasi Kembali ke Login -->
      <div
        class="mt-6 text-center border-t pt-4"
        :class="darkMode ? 'border-slate-800' : 'border-amber-100'"
      >
        <NuxtLink
          to="/login"
          :class="
            darkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          "
          class="text-xs font-bold inline-flex items-center gap-1.5 transition-colors group"
        >
          <Icon
            icon="solar:alt-arrow-left-bold"
            class="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
          />
          Kembali ke halaman masuk
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";
import { sendPasswordResetEmail } from "firebase/auth";

const { darkMode } = useDiaryTheme();
const { $fbAuth } = useNuxtApp();
const router = useRouter();

const email = ref("");
const loading = ref(false);

const handleResetPassword = async () => {
  loading.value = true;
  try {
    // Fungsi bawaan Firebase untuk kirim email reset password otomatis
    await sendPasswordResetEmail($fbAuth, email.value);
    alert(
      "Email pemulihan sukses dikirim! Silakan periksa kotak masuk atau folder spam email kamu.",
    );

    // Setelah sukses, langsung arahkan balik ke halaman login
    router.push("/login");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      alert("Email tersebut belum terdaftar di aplikasi diary.");
    } else if (error.code === "auth/invalid-email") {
      alert("Format email tidak valid. Periksa kembali penulisan email kamu.");
    } else {
      alert(error.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>
