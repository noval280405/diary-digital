<template>
  <div
    :class="[
      darkMode ? 'dark bg-slate-950 text-white' : 'bg-amber-50 text-slate-900',
    ]"
    class="min-h-screen flex transition-all duration-500 font-sans relative overflow-hidden"
  >
    <!-- Efek Latar Belakang Gradasi -->
    <div
      class="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
      :class="
        darkMode
          ? 'bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]'
          : 'bg-[radial-gradient(circle_at_top,_#fff7ed,_#fef3c7)]'
      "
    />

    <!-- Efek Ambient Glow -->
    <div
      class="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none z-0 transition-all duration-500"
      :class="darkMode ? 'bg-indigo-500' : 'bg-orange-300'"
    />

    <!-- Komponen Kiri: Sidebar -->
    <aside
      :class="
        darkMode
          ? 'bg-slate-950/70 border-slate-800 text-slate-200'
          : 'bg-white/80 border-amber-200 text-slate-800 shadow-xl shadow-amber-900/5'
      "
      class="relative w-80 border-r backdrop-blur-xl p-6 flex flex-col justify-between shadow-2xl z-10 transition-colors duration-500"
    >
      <div class="space-y-5">
        <!-- Identitas Aplikasi & Tombol Ganti Tema -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              :class="
                darkMode
                  ? 'from-indigo-500 to-pink-500'
                  : 'from-orange-500 to-rose-500'
              "
              class="w-14 h-14 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0"
            >
              <Icon
                icon="solar:book-bookmark-bold-duotone"
                class="w-8 h-8 text-white"
              />
            </div>
            <div>
              <h2
                class="font-bold text-lg"
                :class="darkMode ? 'text-white' : 'text-slate-900'"
              >
                My Diary
              </h2>
              <p class="text-xs opacity-60">Personal Journal</p>
            </div>
          </div>

          <button
            @click="toggleTheme"
            :class="
              darkMode
                ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800'
                : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
            "
            class="w-11 h-11 rounded-xl border flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <Icon
              :icon="darkMode ? 'solar:moon-stars-bold' : 'solar:sun-bold'"
              class="w-5 h-5"
            />
          </button>
        </div>

        <!-- Kutipan Bijak (Quotes) -->
        <div
          class="p-4 rounded-2xl border transition-colors duration-500"
          :class="
            darkMode
              ? 'bg-white/5 border-slate-800/80 text-slate-300'
              : 'bg-amber-50/60 border-amber-200 text-slate-700'
          "
        >
          <div class="flex gap-3">
            <Icon
              icon="solar:chat-round-like-bold"
              class="w-5 h-5 mt-1 shrink-0 opacity-70"
            />
            <p class="italic text-sm leading-relaxed">{{ quote }}</p>
          </div>
        </div>

        <!-- DI SINI: Tombol Navigasi Menu Analisis & Ekspor Statistik -->
        <NuxtLink 
          to="/stats"
          :class="darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-amber-100/40 border-amber-200 text-slate-700 hover:bg-amber-100'"
          class="w-full p-3 rounded-xl border flex items-center gap-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-sm"
        >
          <Icon icon="solar:graph-up-bold-duotone" class="w-4 h-4 text-orange-500" />
          <span>Lihat Analisis & Ekspor</span>
        </NuxtLink>

        <!-- Tempat Menyisipkan Konten Tambahan Sidebar dari Index Halaman -->
        <slot name="sidebar-content" />
      </div>

      <div class="space-y-4">
        <!-- Target Menulis Harian (Writing Goal) -->
        <div>
          <div class="flex items-center gap-2 mb-2 opacity-60">
            <Icon icon="solar:pen-bold" class="w-4 h-4" />
            <span class="text-xs font-medium">Writing Goal</span>
          </div>

          <!-- Progress Bar Dinamis -->
          <div
            class="h-2 rounded-full overflow-hidden"
            :class="darkMode ? 'bg-slate-800' : 'bg-amber-200/60'"
          >
            <div
              class="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500 ease-out"
              :style="{ width: `${Math.min(writingProgress, 100)}%` }"
            />
          </div>

          <!-- Indikator Hitung Kata Dinamis -->
          <div class="mt-2 text-xs opacity-60 font-medium flex justify-between">
            <span>{{ todayWordCount }} / {{ wordGoal }} kata hari ini</span>
            <span
              v-if="todayWordCount >= wordGoal"
              class="text-emerald-500 font-bold animate-pulse"
              >🎉 Target Tercapai!</span
            >
          </div>
        </div>

        <!-- Profil Akun Pengguna & Aksi Log Out -->
        <div
          class="flex items-center justify-between pt-4 border-t transition-colors duration-500"
          :class="darkMode ? 'border-slate-800' : 'border-amber-200'"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              :class="
                darkMode
                  ? 'from-indigo-500 to-pink-500'
                  : 'from-orange-500 to-rose-500'
              "
              class="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0"
            >
              <Icon icon="solar:user-bold" class="w-5 h-5 text-white" />
            </div>
            <div class="truncate">
              <h4
                class="font-bold text-sm truncate"
                :class="darkMode ? 'text-white' : 'text-slate-900'"
              >
                {{
                  currentUser?.email
                    ? currentUser.email.split("@")[0]
                    : "Memuat..."
                }}
              </h4>
              <div
                class="flex items-center gap-1 text-xs text-emerald-500 font-semibold"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                />
                Auto Saved
              </div>
            </div>
          </div>

          <button
            @click="handleLogout"
            title="Keluar / Ganti Akun"
            :class="
              darkMode
                ? 'bg-slate-900 border-slate-800 text-red-400 hover:bg-red-950/30'
                : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
            "
            class="h-9 px-3 rounded-xl border flex items-center gap-2 text-xs font-black tracking-wide hover:scale-105 active:scale-95 transition-all shadow-sm group shrink-0"
          >
            <Icon
              icon="solar:logout-3-bold"
              class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Komponen Kanan: Area Isi Kertas Jurnal -->
    <main class="relative flex-1 p-6 md:p-10 overflow-y-auto z-10">
      <div class="max-w-4xl mx-auto">
        <div
          :class="
            darkMode
              ? 'bg-slate-900 border-slate-800 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]'
              : 'bg-white border-amber-200 text-black shadow-[0_30px_60px_rgba(217,119,6,0.06)]'
          "
          class="rounded-[32px] border p-8 md:p-12 relative overflow-hidden transition-all duration-500 min-h-[580px]"
        >
          <!-- Garis Margin Merah Khas Buku Diary Fisik -->
          <div
            class="absolute left-16 top-0 bottom-0 w-[1.5px] bg-red-400/30 z-20 pointer-events-none"
          />

          <!-- Pola Garis-Garis Buku Bergaris Tradisional -->
          <div
            class="absolute inset-0 pointer-events-none z-0"
            style="
              background-image: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 34px,
                rgba(148, 163, 184, 0.07) 35px
              );
              background-size: 100% 35px;
              margin-top: 50px;
            "
          />

          <div class="relative z-10 h-full">
            <slot />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";
import { onAuthStateChanged, signOut } from "firebase/auth";

const { darkMode, toggleTheme } = useDiaryTheme();
const { $fbAuth } = useNuxtApp();
const router = useRouter();

const currentUser = ref<any>(null);

const quotes = [
  "Writing is the painting of the voice.",
  "Every page is a new beginning.",
  "A diary is a mirror of the soul.",
  "Small memories become great stories.",
  "Write what you cannot say.",
];
const quote = ref("");

onMounted(() => {
  quote.value = quotes[Math.floor(Math.random() * quotes.length)];

  // Pantau sesi user di tingkat layout agar profil sinkron sepanjang waktu
  onAuthStateChanged($fbAuth, (user) => {
    if (user) {
      currentUser.value = user;
    }
  });
});

// Mengakses data notebooks global tersinkronisasi dari halaman utama
const notebooks = useState<any[]>("global-notebooks", () => []);

// Target kata harian standar
const wordGoal = ref(500);

// Hitung total kata yang ditulis khusus hari ini secara real-time
const todayWordCount = computed(() => {
  let totalWords = 0;
  const todayStr = new Date().toDateString(); 

  notebooks.value.forEach((book: any) => {
    if (book.pages && Array.isArray(book.pages)) {
      book.pages.forEach((page: any) => {
        const pageDate = page.createdAt
          ? new Date(page.createdAt).toDateString()
          : todayStr;

        if (pageDate === todayStr && page.text) {
          // Membersihkan tumpukan spasi kosong dan menghitung jumlah kata yang valid
          const words = page.text.trim().split(/\s+/);
          totalWords += words.filter((w: string) => w.length > 0).length;
        }
      });
    } 
  });

  return totalWords;
});

// Mengubah jumlah kalkulasi kata harian ke persentase bar visual
const writingProgress = computed(() => {
  if (wordGoal.value === 0) return 0;
  return (todayWordCount.value / wordGoal.value) * 100;
});

// Aksi keluar akun pengguna
const handleLogout = async () => {
  await signOut($fbAuth);
  router.push("/login");
};
</script>