<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center select-none overflow-hidden"
    >
      <!-- Background Overlay Kaca Transparan (Ikut Dark/Light Mode otomatis) -->
      <div
        class="absolute inset-0 transition-colors duration-700"
        :class="
          currentTheme === 'dark'
            ? 'bg-slate-950/70 backdrop-blur-2xl'
            : 'bg-white/70 backdrop-blur-2xl'
        "
      />

      <!-- EFEK ORNAMEN MELAYANG (AMBIENT PARTICLES) -->
      <div
        class="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
      >
        <div
          class="absolute top-1/4 left-10 w-4 h-4 rounded-full border-2 border-current animate-float-slow"
          :class="activeThemeClass?.textLabel"
        ></div>
        <div
          class="absolute bottom-1/3 right-12 w-6 h-6 rounded-xl border-2 border-dashed border-current animate-float-reverse"
          :class="activeThemeClass?.textLabel"
        ></div>
        <div
          class="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-current animate-float-mid"
          :class="activeThemeClass?.textLabel"
        ></div>
      </div>

      <!-- Konten Utama -->
      <div
        class="relative z-10 flex flex-col items-center text-center px-6 max-w-sm"
      >
        <!-- BRAND LOGO MYDIARY WITH ENHANCED ENTRANCE -->
        <div class="flex flex-col items-center gap-3 mb-12 animate-slide-up">
          <!-- Kotak Logo Gradasi Premium (Otomatis sinkron pake master data lokal!) -->
          <div
            :class="activeThemeClass?.btnGradient"
            class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl mb-2 transition-all duration-500 animate-float-logo text-white"
          >
            <!-- SVG Native Pengganti solar:book-bookmark-bold-duotone (100% Terang Kontras) -->
            <svg
              class="w-9 h-9"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M19 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 22 19 2Z"
                fill="#FFFFFF"
              />
              <path d="M16 2V13L13.5 11.25L11 13V2H16Z" fill="#FFFFFF" />
              <path
                d="M6 6H9M6 10H8M6 14H12M6 18H18"
                stroke="#FFFFFF"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div class="tracking-tight">
            <h1
              class="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight"
            >
              My<span class="opacity-30 font-medium">Diary</span>
            </h1>
            <!-- Label "Ruang Cerita" - Sekarang dijamin warnanya ganti-ganti sesuai tema aktif lu! -->
            <p
              :class="activeThemeClass?.textLabel"
              class="text-xs font-black tracking-[0.25em] uppercase mt-2.5 flex items-center justify-center gap-2 opacity-90 transition-colors duration-500"
            >
              <!-- SVG Native Pengganti solar:chat-round-line-linear (Memakai warna textLabel induknya) -->
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2 22L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                  stroke="currentColor"
                  stroke-width="2.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  opacity="0.5"
                  d="M8 10H16M8 14H13"
                  stroke="currentColor"
                  stroke-width="2.25"
                  stroke-linecap="round"
                />
              </svg>
              Ruang Cerita
            </p>
          </div>
        </div>

        <!-- AMBIENT SPINNING LOADER -->
        <div
          class="relative w-16 h-16 flex items-center justify-center animate-pulse-slow"
        >
          <!-- Lingkaran Luar -->
          <div
            class="absolute inset-0 rounded-full border-[3px]"
            :class="
              currentTheme === 'dark'
                ? 'border-slate-800/40'
                : 'border-slate-100/80'
            "
          />

          <!-- Ring Indikator Berputar (Otomatis ngikut warna tema aktif) -->
          <div
            class="absolute inset-0 rounded-full border-[3px] border-t-transparent border-r-transparent animate-spin transition-all duration-500"
            :class="activeThemeClass?.spinner"
          />

          <!-- Efek Kilatan Pulsing Tengah -->
          <div
            class="w-5 h-5 rounded-full animate-ping absolute transition-all duration-500 opacity-75"
            :class="activeThemeClass?.pulse"
          />
        </div>

        <!-- LOADING TEXT AREA (CSS Dikunci mati biar text-slate muncul benderang) -->
        <div class="mt-10 space-y-2 animate-fade-in-delayed">
          <h3
            class="text-xs font-bold text-slate-400 dark:text-slate-500 max-w-[240px] leading-relaxed italic"
          >
            Membuka Lembaran Jurnal...
          </h3>
          <p
            :class="activeThemeClass?.textLabel"
            class="text-xs font-semibold max-w-[240px] leading-relaxed italic opacity-80 transition-colors duration-500"
          >
            "Setiap cerita berharga, kenangan Anda sedang kami tata rapi."
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

// 1. Ambil state tema aktif global dari Nuxt
const currentTheme = useState<string>("diary-active-theme", () => "cream");

// 2. MASTER DATA THEME CLASSES LOKAL (Biar mandiri, anti-gagal, dan langsung ganti warna instant!)
const localThemeClasses: Record<
  string,
  { btnGradient: string; textLabel: string; spinner: string; pulse: string }
> = {
  dark: {
    btnGradient: "bg-gradient-to-tr from-indigo-600 to-violet-500",
    textLabel: "text-indigo-400",
    spinner: "border-l-indigo-500 border-b-violet-500",
    pulse: "bg-indigo-500/30",
  },
  cream: {
    btnGradient: "bg-gradient-to-tr from-orange-500 to-amber-500",
    textLabel: "text-amber-700 dark:text-amber-500",
    spinner: "border-l-orange-500 border-b-amber-500",
    pulse: "bg-orange-500/30",
  },
  pink: {
    btnGradient: "bg-gradient-to-tr from-pink-500 to-rose-500",
    textLabel: "text-pink-600 dark:text-pink-400",
    spinner: "border-l-pink-500 border-b-rose-500",
    pulse: "bg-pink-500/30",
  },
  blue: {
    btnGradient: "bg-gradient-to-tr from-sky-500 to-indigo-500",
    textLabel: "text-sky-600 dark:text-sky-400",
    spinner: "border-l-sky-500 border-b-indigo-500",
    pulse: "bg-sky-500/30",
  },
  green: {
    btnGradient: "bg-gradient-to-tr from-emerald-500 to-teal-500",
    textLabel: "text-emerald-600 dark:text-emerald-400",
    spinner: "border-l-emerald-500 border-b-teal-500",
    pulse: "bg-emerald-500/30",
  },
};

// Getter pintar untuk mengambil bundle styles sesuai tema aktif sekarang
const activeThemeClass = computed(() => {
  return localThemeClasses[currentTheme.value] || localThemeClasses.cream;
});

// 3. Status Loading dari Pinia Store
const isLoading = computed(() => {
  return useloadingStore().getLoading;
});
</script>

<style scoped>
/* Transisi Utama Modal Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animasi Masuk Elemen Logo */
.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Animasi Masuk Elemen Teks (Kunci Opacity 1) */
.animate-fade-in-delayed {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
}

/* Efek Melayang Halus Logo Buku */
.animate-float-logo {
  animation: floatLogo 3.5s ease-in-out infinite;
}

/* Animasi Partikel Backdrop */
.animate-float-slow {
  animation: floatParticle 6s ease-in-out infinite;
}
.animate-float-mid {
  animation: floatParticle 4.5s ease-in-out infinite 1s;
}
.animate-float-reverse {
  animation: floatParticleReverse 7s ease-in-out infinite 0.5s;
}

.animate-pulse-slow {
  animation: pulseSlow 3s ease-in-out infinite;
}

/* KEYFRAMES */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatLogo {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
  }
}

@keyframes floatParticle {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-15px) translateX(8px);
    opacity: 0.7;
  }
}

@keyframes floatParticleReverse {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  50% {
    transform: translateY(12px) translateX(-10px) rotate(45deg);
    opacity: 0.6;
  }
}

@keyframes pulseSlow {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}
</style>
