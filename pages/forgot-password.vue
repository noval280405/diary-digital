<template>
  <!-- Bungkus seluruh konten halaman dengan ClientOnly -->
  <ClientOnly>
    <div
      :class="
        currentTheme === 'dark'
          ? 'bg-slate-950 text-white'
          : activeThemeMap?.pageBg
      "
      class="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden transition-colors duration-500"
    >
      <!-- Background Bulat Estetik -->
      <div
        class="fixed inset-0 pointer-events-none transition-all duration-500"
        :class="
          currentTheme === 'dark'
            ? 'bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]'
            : activeThemeMap?.radialBg
        "
      />
      <div
        class="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
        :class="activeThemeMap?.glow"
      />

      <!-- Kartu Form -->
      <div
        :class="
          currentTheme === 'dark'
            ? 'bg-slate-900/60 border-slate-800 shadow-[0_30px_80px_rgba(0,0,0,0.5)]'
            : activeThemeMap?.cardBgBorder
        "
        class="w-full max-w-md p-8 md:p-10 rounded-[32px] border backdrop-blur-xl relative z-10 transition-all duration-500"
      >
        <!-- Header Ikon -->
        <div class="flex flex-col items-center text-center mb-8">
          <div
            :class="activeThemeMap?.btnGradient"
            class="w-16 h-16 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg mb-4 transition-all duration-500 text-white"
          >
            <svg
              class="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="currentColor"
              />
              <path
                d="M12 17C12.8284 17 13.5 16.3284 13.5 15.5C13.5 14.6716 12.8284 14 12 14C11.1716 14 10.5 14.6716 10.5 15.5C10.5 16.3284 11.1716 17 12 17Z"
                fill="currentColor"
              />
              <path
                d="M8 11V8.5C8 6.29086 9.79086 4.5 12 4.5C14.2091 4.5 16 6.29086 16 8.5V11H14V8.5C14 7.39543 13.1046 6.5 12 6.5C10.8954 6.5 10 7.39543 10 8.5V11H8Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-black tracking-tight">
            Pulihkan Kata Sandi
          </h2>
          <p class="text-xs opacity-60 mt-1 px-4">
            Masukkan email terdaftar. Kami akan mengirimkan tautan untuk
            mengatur ulang kata sandi kamu.
          </p>
        </div>

        <!-- Form Utama -->
        <form @submit.prevent="handleResetPassword" class="space-y-5">
          <div>
            <label
              :class="activeThemeMap?.textLabel"
              class="text-xs font-black uppercase tracking-[0.15em] block mb-2 transition-colors duration-500"
            >
              Alamat Email Kamu
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              required
              :class="
                currentTheme === 'dark'
                  ? 'bg-slate-950/90 border-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500'
                  : activeThemeMap?.inputStyle
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
              activeThemeMap?.btnGradient,
            ]"
            class="w-full bg-gradient-to-r p-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] text-white shadow-md hover:brightness-110 active:scale-[0.98] transition-all duration-500 mt-2 flex items-center justify-center gap-2"
          >
            <svg
              v-if="loading"
              class="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Kirim Tautan Atur Ulang</span>
          </button>
        </form>

        <!-- Navigasi Kembali ke Login -->
        <div
          class="mt-6 text-center border-t pt-4"
          :class="
            currentTheme === 'dark'
              ? 'border-slate-800'
              : activeThemeMap?.borderToggle
          "
        >
          <NuxtLink
            to="/login"
            :class="
              currentTheme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : activeThemeMap?.textToggle
            "
            class="text-xs font-bold inline-flex items-center gap-1.5 transition-colors group"
          >
            <svg
              class="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Kembali ke halaman masuk
          </NuxtLink>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { sendPasswordResetEmail } from "firebase/auth";

// Balikkan inisialisasi state ke cara standar, biar diisi pas mounted di client
const currentTheme = useState("diary-active-theme", () => "cream");

const authThemeMap = {
  dark: {
    btnGradient: "from-indigo-600 to-violet-600",
    textLabel: "text-indigo-400",
    textToggle: "text-indigo-400 hover:text-indigo-300",
    glow: "bg-indigo-500",
  },
  cream: {
    pageBg: "bg-amber-50 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#fff7ed,_#fef3c7)]",
    cardBgBorder: "bg-white/80 border-amber-200 shadow-xl shadow-amber-900/5",
    inputStyle:
      "bg-amber-50/50 border-amber-200 text-slate-800 focus:ring-2 focus:ring-orange-400 shadow-sm",
    borderToggle: "border-amber-100",
    btnGradient: "from-orange-500 to-amber-500",
    textLabel: "text-amber-700",
    textToggle: "text-slate-600 hover:text-slate-900",
    glow: "bg-orange-300",
  },
  pink: {
    pageBg: "bg-rose-50/40 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#fff1f2,_#ffe4e6)]",
    cardBgBorder: "bg-white/80 border-pink-200 shadow-xl shadow-pink-900/5",
    inputStyle:
      "bg-rose-50/30 border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-400 shadow-sm",
    borderToggle: "border-pink-100",
    btnGradient: "from-pink-500 to-rose-500",
    textLabel: "text-pink-600",
    textToggle: "text-pink-600 hover:text-pink-700",
    glow: "bg-pink-300",
  },
  blue: {
    pageBg: "bg-sky-50/40 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#f0f9ff,_#e0f2fe)]",
    cardBgBorder: "bg-white/80 border-sky-200 shadow-xl shadow-sky-900/5",
    inputStyle:
      "bg-sky-50/30 border-sky-200 text-slate-800 focus:ring-2 focus:ring-sky-400 shadow-sm",
    borderToggle: "border-sky-100",
    btnGradient: "from-sky-500 to-indigo-500",
    textLabel: "text-sky-600",
    textToggle: "text-sky-600 hover:text-sky-700",
    glow: "bg-sky-300",
  },
  green: {
    pageBg: "bg-emerald-50/40 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#f0fdf4,_#dcfce7)]",
    cardBgBorder:
      "bg-white/80 border-emerald-200 shadow-xl shadow-emerald-900/5",
    inputStyle:
      "bg-emerald-50/30 border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 shadow-sm",
    borderToggle: "border-emerald-100",
    btnGradient: "from-emerald-500 to-teal-500",
    textLabel: "text-emerald-600",
    textToggle: "text-emerald-600 hover:text-emerald-700",
    glow: "bg-emerald-300",
  },
};

const activeThemeMap = computed(
  () => authThemeMap[currentTheme.value] || authThemeMap.cream,
);

// Ambil data langsung pas di client-side secara aman
onMounted(() => {
  const savedTheme = localStorage.getItem("diary-active-theme");
  if (savedTheme && authThemeMap[savedTheme]) {
    currentTheme.value = savedTheme;
  }
});

const { $fbAuth } = useNuxtApp();
const router = useRouter();

const email = ref("");
const loading = ref(false);

const handleResetPassword = async () => {
  loading.value = true;
  try {
    await sendPasswordResetEmail($fbAuth, email.value);
    alert(
      "Email pemulihan sukses dikirim! Silakan periksa kotak masuk atau folder spam email kamu.",
    );
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
