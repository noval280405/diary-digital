<template>
  <div
    v-if="themeReady"
    :class="[
      themeClasses[currentTheme]?.wrapper || themeClasses['dark'].wrapper,
    ]"
    class="app-shell h-[100dvh] min-h-0 flex flex-col md:flex-row transition-colors duration-500 font-sans relative overflow-hidden"
  >
    <LoadingApp />
    <appNotification />
    <div v-if="!isOnline" class="fixed inset-x-0 top-0 z-[90] bg-amber-500 px-4 py-2 text-center text-xs font-semibold text-slate-950">
      Anda sedang offline. Draft tetap disimpan di perangkat dan sinkronisasi dilanjutkan saat koneksi kembali.
    </div>
    <!-- EFEK LATAR BELAKANG: Gradasi Sinematik Luas -->
    <div
      class="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
      :class="
        themeClasses[currentTheme]?.bgGradient ||
        themeClasses['cream'].bgGradient
      "
    />

    <!-- Ambient decoration disabled for a calmer writing surface -->
    <div
      class="hidden"
      :class="
        themeClasses[currentTheme]?.glowTop || themeClasses['cream'].glowTop
      "
    />
    <div
      class="hidden"
      :class="
        themeClasses[currentTheme]?.glowBottom ||
        themeClasses['cream'].glowBottom
      "
    />

    <!-- MOBILE HEADER (Khusus Layar Smartphone) -->
    <header
      :class="
        themeClasses[currentTheme]?.mobileHeader ||
        themeClasses['cream'].mobileHeader
      "
      class="md:hidden fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between p-4 border-b backdrop-blur-md transition-colors duration-500"
    >
      <div class="flex items-center gap-2.5 select-none tracking-tight">
        <div
          :class="currentThemeClasses.btnGradient"
          class="brand-mark w-10 h-10 rounded-xl bg-gradient-to flex items-center justify-center shadow-md shrink-0"
        >
          <Icon
            icon="solar:book-bookmark-bold-duotone"
              class="w-5 h-5 text-white drop-shadow-sm"
          />
        </div>

        <span
          :class="[
            currentThemeClasses.fontTitle ||
              currentThemeClasses.fontHead ||
              'font-extrabold',
            currentThemeClasses.textTitle ||
              currentThemeClasses.text ||
              (currentTheme === 'dark' ? 'text-white' : 'text-current'),
          ]"
          class="text-base font-black transition-colors duration-300"
        >
          My<span class="opacity-50 font-medium">Diary</span>
        </span>
      </div>

      <button
        @click="isSidebarOpen = !isSidebarOpen"
        :class="
          themeClasses[currentTheme]?.mobileBtn ||
          themeClasses['cream'].mobileBtn
        "
        class="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-xs border"
      >
        <Icon
          :icon="
            isSidebarOpen
              ? 'solar:close-square-bold-duotone'
              : 'solar:hamburger-menu-bold-duotone'
          "
          class="w-5 h-5"
        />
      </button>
    </header>

    <!-- BACKDROP OVERLAY MOBILE -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
    />

    <aside
      :class="[
        themeClasses[currentTheme]?.sidebar || themeClasses['cream'].sidebar,
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
      class="fixed inset-y-0 left-0 h-[100dvh] w-[88vw] max-w-[340px] sm:w-[320px] md:relative md:inset-auto md:h-[100dvh] md:w-[300px] lg:w-[320px] md:max-w-none border-r backdrop-blur-xl flex flex-col z-50 md:z-10 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none select-none overflow-hidden"
    >
      <!-- BAGIAN ATAS (FIXED / DIAM): LOGO, TEMA, KUTIPAN, STATS, JURNAL BARU & PENCARIAN -->
      <div
        class="sidebar-controls px-4 md:px-5 pt-4 md:pt-5 pb-4 flex flex-col gap-3 border-b transition-all duration-300 bg-inherit shrink-0"
        :class="themeClasses[currentTheme]?.borderDashed || 'border-slate-800'"
      >
        <!-- LOGO & TOMBOL CLOSE MOBILE -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <div
              :class="currentThemeClasses.btnGradient"
              class="brand-mark w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0"
            >
              <Icon
                icon="solar:book-bookmark-bold-duotone"
                class="w-5 h-5 text-white drop-shadow-sm"
              />
            </div>
            <div class="truncate tracking-tight">
              <h2
                :class="[
                  currentThemeClasses.fontTitle ||
                    currentThemeClasses.fontHead ||
                    'font-extrabold',
                  currentThemeClasses.textTitle ||
                    currentThemeClasses.text ||
                    (currentTheme === 'dark' ? 'text-white' : 'text-current'),
                ]"
                class="text-sm font-black transition-colors duration-300 leading-tight"
              >
                My<span class="opacity-50 font-medium">Diary</span>
              </h2>
              <p
                :class="
                  currentTheme === 'dark' ? 'text-slate-500' : 'text-current/40'
                "
                class="text-[10px] font-bold tracking-wide mt-0.5"
              >
                Ruang Cerita
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <NuxtLink
              to="/stats"
              @click="isSidebarOpen = false"
              class="sidebar-head-action"
              :class="themeClasses[currentTheme]?.navLink"
              title="Statistik dan backup"
              aria-label="Statistik dan backup"
            >
              <Icon icon="solar:chart-2-bold-duotone" class="h-4 w-4" />
            </NuxtLink>
            <button
              @click="showThemePicker = !showThemePicker"
              class="sidebar-head-action"
              :class="themeClasses[currentTheme]?.navLink"
              title="Pilih tema"
              aria-label="Pilih tema"
            >
              <Icon icon="solar:palette-bold-duotone" class="h-4 w-4" />
            </button>
            <button
              @click="isSidebarOpen = false"
              :class="themeClasses[currentTheme]?.mobileClose || themeClasses['dark'].mobileClose"
              class="sidebar-head-action md:hidden"
              title="Tutup menu"
              aria-label="Tutup menu"
            >
              <Icon icon="solar:close-circle-linear" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- PEMILIH TEMA / GANTI WARNA -->
        <div class="w-full">
          <button
            @click="showThemePicker = !showThemePicker"
            class="hidden"
            :class="
              themeClasses[currentTheme]?.navLink ||
              themeClasses['dark'].navLink
            "
          >
            <span class="flex items-center gap-2">
              <Icon
                icon="solar:palette-bold-duotone"
                :class="themeClasses[currentTheme]?.iconPrimary"
                class="premium-icon"
              />
              Ganti Warna
            </span>
            <Icon
              :icon="
                showThemePicker
                  ? 'solar:alt-arrow-up-linear'
                  : 'solar:alt-arrow-down-linear'
              "
              class="w-4 h-4"
            />
          </button>

          <Transition name="fade">
            <div v-if="showThemePicker" class="mt-0">
              <div
                class="grid grid-cols-5 gap-2 bg-slate-500/5 p-2 rounded-xl border transition-colors duration-300 shadow-sm"
                :class="
                  themeClasses[currentTheme]?.borderSimple || 'border-slate-800'
                "
              >
                <button
                  @click="changeTheme('cream')"
                  :class="
                    currentTheme === 'cream'
                      ? 'ring-2 ring-amber-600 scale-105'
                      : ''
                  "
                  class="w-full h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center transition-all"
                >
                  <Icon
                    v-if="currentTheme === 'cream'"
                    icon="solar:check-circle-bold"
                    class="w-3.5 h-3.5 text-amber-700"
                  />
                </button>
                <button
                  @click="changeTheme('pink')"
                  :class="
                    currentTheme === 'pink'
                      ? 'ring-2 ring-pink-500 scale-105'
                      : ''
                  "
                  class="w-full h-8 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center transition-all"
                >
                  <Icon
                    v-if="currentTheme === 'pink'"
                    icon="solar:check-circle-bold"
                    class="w-3.5 h-3.5 text-pink-600"
                  />
                </button>
                <button
                  @click="changeTheme('blue')"
                  :class="
                    currentTheme === 'blue'
                      ? 'ring-2 ring-sky-500 scale-105'
                      : ''
                  "
                  class="w-full h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center transition-all"
                >
                  <Icon
                    v-if="currentTheme === 'blue'"
                    icon="solar:check-circle-bold"
                    class="w-3.5 h-3.5 text-sky-600"
                  />
                </button>
                <button
                  @click="changeTheme('green')"
                  :class="
                    currentTheme === 'green'
                      ? 'ring-2 ring-emerald-500 scale-105'
                      : ''
                  "
                  class="w-full h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center transition-all"
                >
                  <Icon
                    v-if="currentTheme === 'green'"
                    icon="solar:check-circle-bold"
                    class="w-3.5 h-3.5 text-emerald-600"
                  />
                </button>
                <button
                  @click="changeTheme('dark')"
                  :class="
                    currentTheme === 'dark'
                      ? 'ring-2 ring-indigo-500 scale-105'
                      : ''
                  "
                  class="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center transition-all"
                >
                  <Icon
                    v-if="currentTheme === 'dark'"
                    icon="solar:check-circle-bold"
                    class="w-3.5 h-3.5 text-indigo-400"
                  />
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- KUTIPAN MOTIVASI -->
        <div
          class="hidden"
          :class="
            themeClasses[currentTheme]?.quoteBox ||
            themeClasses['dark'].quoteBox
          "
        >
          <div
            class="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110 duration-500"
          >
            <Icon icon="solar:chat-round-like-bold" class="w-16 h-16" />
          </div>
          <div class="flex gap-2.5 relative z-10">
            <Icon
              icon="solar:quote-open-bold"
              :class="themeClasses[currentTheme]?.iconPrimary"
              class="w-4 h-4 shrink-0 opacity-80"
            />
            <p class="italic text-xs font-serif leading-relaxed tracking-wide">
              {{ quote }}
            </p>
          </div>
        </div>

        <!-- TOMBOL NAVIGASI STATS -->
        <div class="hidden">
          <NuxtLink
            to="/stats"
            @click="isSidebarOpen = false"
            :class="
              themeClasses[currentTheme]?.navLink ||
              themeClasses['dark'].navLink
            "
            class="w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold tracking-wide transition-all shadow-xs group"
          >
            <div class="flex items-center gap-3">
              <Icon
                icon="solar:graph-up-bold-duotone"
                :class="themeClasses[currentTheme]?.iconPrimary"
                class="premium-icon"
              />
              <span>Analisis & Ekspor Data</span>
            </div>
            <Icon
              icon="solar:alt-arrow-right-linear"
              class="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform"
            />
          </NuxtLink>
        </div>

        <!-- SECTION: JURNAL BARU -->
        <div class="space-y-2 pt-1">
          <label
            :class="currentThemeClasses.textLabel"
            class="text-[10px] uppercase tracking-[0.14em] font-semibold flex items-center gap-1.5 opacity-55"
          >
            <Icon
              icon="solar:folder-add-bold-duotone"
              class="hidden"
            />
            Jurnal Baru
          </label>
          <div class="flex gap-2">
            <input
              v-model="newBookTitle"
              placeholder="Nama rak jurnal..."
              :class="currentThemeClasses.input || currentThemeClasses.navLink"
              class="flex-1 h-10 px-3 border rounded-xl text-sm outline-none transition-shadow placeholder:text-slate-400 focus:shadow-sm"
              @keyup.enter="createNewBook"
            />

            <button
              @click="createNewBook"
              :class="currentThemeClasses.btnGradient"
              class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-sm"
              title="Tambah Jurnal Baru"
            >
              <Icon icon="iconamoon:sign-plus-fill" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- HEADER & PENCARIAN RAK JURNAL -->
        <div class="space-y-2 pt-1">
          <label
            :class="currentThemeClasses.textLabel"
            class="text-[10px] uppercase tracking-[0.14em] font-semibold flex items-center gap-1.5 opacity-55"
          >
            <Icon
              icon="solar:bookmark-opened-bold-duotone"
              class="hidden"
            />
            Rak Jurnal
          </label>

          <!-- Fitur Pencarian -->
          <div class="relative">
            <input
              v-model="searchBook"
              type="text"
              placeholder="Cari judul jurnal..."
              :class="currentThemeClasses.input || currentThemeClasses.navLink"
              class="w-full h-10 pl-9 pr-8 border rounded-xl text-sm outline-none transition-shadow placeholder:text-slate-400 focus:shadow-sm"
            />
            <Icon
              icon="solar:magnifer-bold"
              :class="currentThemeClasses.iconPrimary"
              class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none"
            />
            <button
              v-if="searchBook"
              @click="searchBook = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <Icon icon="solar:close-circle-bold" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- BAGIAN TENGAH (SCROLLABLE): HANYA UNTUK SLOT DAFTAR JURNAL -->
      <div
        class="min-h-[72px] flex-1 overflow-y-auto px-4 md:px-5 py-3 space-y-2 custom-sidebar-scroll overscroll-contain touch-pan-y"
      >
        <div @click="isSidebarOpen = false">
          <slot name="sidebar-content" />
        </div>
      </div>

      <!-- BAGIAN BAWAH (FIXED / DIAM): TARGET HARI INI & PROFIL USER -->
      <div
        class="sidebar-footer space-y-3 p-4 md:p-5 border-t shrink-0 bg-inherit"
        :class="themeClasses[currentTheme]?.borderDashed || 'border-slate-800'"
      >
        <div class="px-1">
          <div
            class="flex items-center justify-between text-[11px] font-bold opacity-60 mb-1.5"
          >
            <span class="flex items-center gap-1.5">
              <Icon
                icon="solar:pen-bold-duotone"
                :class="themeClasses[currentTheme]?.iconSecondary"
                class="w-3.5 h-3.5"
              />
              Target Hari Ini
            </span>
            <span class="font-mono tracking-tight"
              >{{ todayWordCount }} / {{ wordGoal }} kata</span
            >
          </div>

          <div
            class="h-2 rounded-full overflow-hidden p-[1px]"
            :class="
              themeClasses[currentTheme]?.progressBg ||
              'bg-slate-900 border border-slate-800'
            "
          >
            <div
              :class="
                themeClasses[currentTheme]?.progressBar ||
                'bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-500'
              "
              class="h-full rounded-full transition-all duration-700 ease-out shadow-xs"
              :style="{ width: `${Math.min(writingProgress, 100)}%` }"
            />
          </div>

          <div
            v-if="todayWordCount >= wordGoal"
            class="mt-1.5 flex items-center gap-1 justify-end text-[10px] text-emerald-500 font-black tracking-wide animate-pulse"
          >
            <Icon icon="solar:stars-bold" class="w-3 h-3" /> Target Terlampaui!
          </div>
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-xl border transition-all duration-300"
          :class="
            themeClasses[currentTheme]?.profileCard ||
            themeClasses['dark'].profileCard
          "
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              :class="
                themeClasses[currentTheme]?.avatarBg ||
                'bg-gradient-to-tr from-orange-500 to-rose-500'
              "
              class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md shrink-0"
            >
              {{
                currentUser?.email
                  ? currentUser.email.charAt(0).toUpperCase()
                  : "M"
              }}
            </div>
            <div class="truncate">
              <h4 class="font-black text-xs truncate">
                {{
                  currentUser?.email
                    ? currentUser.email.split("@")[0]
                    : "Memuat..."
                }}
              </h4>
              <div
                class="flex items-center gap-1 text-[10px] font-bold mt-0.5"
                :class="
                  themeClasses[currentTheme]?.syncText || 'text-emerald-500'
                "
              >
                <span
                  class="w-1 h-1 rounded-full animate-ping"
                  :class="
                    themeClasses[currentTheme]?.syncDot || 'bg-emerald-500'
                  "
                />
                Cloud Synced
              </div>
            </div>
          </div>

          <button
            @click="handleLogout"
            title="Keluar Aplikasi"
            :class="
              themeClasses[currentTheme]?.logoutBtn ||
              themeClasses['dark'].logoutBtn
            "
            class="w-8 h-8 rounded-xl border flex items-center justify-center active:scale-95 transition-all shadow-xs shrink-0 group"
          >
            <Icon
              icon="solar:logout-3-bold-duotone"
              class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </aside>

    <!-- AREA KANAN: LEMBARAN UTAMA KERTAS DIARY -->
    <main
      class="relative h-[100dvh] min-h-0 flex-1 p-3 pt-20 sm:p-6 sm:pt-20 md:p-6 lg:p-8 overflow-x-hidden overflow-y-auto z-10 flex flex-col scroll-smooth"
    >
      <div class="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <div
          :class="
            themeClasses[currentTheme]?.mainPaper ||
            themeClasses['dark'].mainPaper
          "
          class="overflow-hidden rounded-2xl md:rounded-[24px] border p-4 sm:p-7 md:p-9 lg:p-10 flex-1 flex flex-col relative transition-all duration-300 min-h-[calc(100dvh-96px)] md:min-h-[600px]"
        >
          <div class="absolute inset-x-0 top-0 h-1 opacity-80" :class="currentThemeClasses.btnGradient" />
          <!-- Garis Margin Merah Buku Diary Tradisional -->
          <div
          class="hidden"
            :class="
              currentTheme === 'dark' ? 'bg-rose-500/15' : 'bg-rose-500/25'
            "
          />

          <!-- Pola Garis-Garis Buku Jurnal -->
          <div
            class="hidden"
            :class="currentTheme === 'dark' ? 'opacity-15' : 'opacity-35'"
            :style="{
              backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 34px, ${currentTheme === 'dark' ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.12)'} 35px)`,
              backgroundSize: '100% 35px',
              marginTop: '36px',
            }"
          />

          <!-- Area Slot Pengisian Data Halaman -->
          <div class="relative z-10 flex-1 flex flex-col">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Numpad PIN Pengunci Jurnal Spesifik -->
    <ModalLockJournal
      :is-open="lockModalState.isOpen"
      :correct-pin="lockModalState.correctPin"
      :dark-mode="currentTheme === 'dark'"
      @success="handlePinSuccess"
      @close="closeLockModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, provide } from "vue";
import { Icon } from "@iconify/vue";
import { onAuthStateChanged, signOut, type Unsubscribe } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const showThemePicker = ref(false);

const router = useRouter();

/**
 * Flag agar layout tidak tampil sebelum tema selesai dipastikan.
 * Ini untuk menghilangkan flash theme cream saat refresh.
 */
const themeReady = ref(false);

/**
 * Daftar semua class tema.
 */
const themeClasses: Record<string, any> = {
  cream: {
    wrapper: "bg-amber-50/40 text-slate-900",
    bgGradient: "bg-amber-50/60",
    glowTop: "bg-orange-300/30",
    glowBottom: "bg-rose-200/20",
    mobileHeader: "bg-white/70 border-amber-200/60 text-slate-900 shadow-xs",
    mobileBtn: "bg-amber-100 text-amber-900 border-transparent",
    sidebar:
      "bg-white/95 border-amber-200/60 text-slate-800",
    borderDashed: "border-amber-200/60",
    borderSimple: "border-amber-200/50",
    quoteBox: "bg-amber-50/50 border-amber-200/50 text-slate-700",
    navLink:
      "bg-amber-50/30 border-amber-200/40 text-slate-700 hover:bg-amber-100/60 hover:text-slate-900",
    progressBg: "bg-amber-100 border border-amber-200/60",
    progressBar: "bg-gradient-to-r from-amber-500 to-orange-600",
    profileCard: "bg-white/80 border-amber-200/60 shadow-sm text-slate-900",
    avatarBg: "bg-amber-600",
    logoutBtn: "bg-rose-50 border-rose-200/60 text-rose-600 hover:bg-rose-100",
    mainPaper:
      "bg-white/95 border-amber-200/70 text-slate-900 shadow-[0_18px_50px_rgba(120,53,15,0.08)]",
    iconPrimary: "text-amber-600",
    iconSecondary: "text-orange-600",
    syncText: "text-emerald-600",
    syncDot: "bg-emerald-600",
    mobileClose:
      "bg-white/80 border-amber-200 text-amber-700 hover:text-amber-900",
    btnGradient: "bg-gradient-to-tr from-orange-500 to-amber-500",
  },
  pink: {
    wrapper: "bg-pink-50/40 text-pink-950",
    bgGradient: "bg-pink-50/60",
    glowTop: "bg-pink-300/30",
    glowBottom: "bg-rose-300/20",
    mobileHeader: "bg-white/70 border-pink-200/60 text-pink-900 shadow-xs",
    mobileBtn: "bg-pink-100 text-pink-900 border-transparent",
    sidebar:
      "bg-white/95 border-pink-200/60 text-pink-950",
    borderDashed: "border-pink-200/60",
    borderSimple: "border-pink-200/50",
    quoteBox: "bg-pink-50/60 border-pink-200/50 text-pink-800",
    navLink:
      "bg-pink-50/30 border-pink-200/40 text-pink-800 hover:bg-pink-100/60 hover:text-pink-950",
    progressBg: "bg-pink-100 border border-pink-200/60",
    progressBar: "bg-gradient-to-r from-pink-500 to-rose-600",
    profileCard: "bg-white/80 border-pink-200/60 shadow-sm text-pink-950",
    avatarBg: "bg-pink-600",
    logoutBtn: "bg-rose-100 border-rose-200/60 text-rose-700 hover:bg-rose-200",
    mainPaper:
      "bg-white/95 border-pink-200/70 text-pink-950 shadow-[0_18px_50px_rgba(157,23,77,0.07)]",
    iconPrimary: "text-pink-600",
    iconSecondary: "text-rose-500",
    syncText: "text-pink-600",
    syncDot: "bg-pink-500",
    mobileClose:
      "bg-white/80 border-pink-200 text-pink-600 hover:text-pink-800",
    btnGradient: "bg-gradient-to-tr from-pink-500 to-rose-500",
  },
  blue: {
    wrapper: "bg-sky-50/40 text-sky-950",
    bgGradient: "bg-sky-50/60",
    glowTop: "bg-sky-300/30",
    glowBottom: "bg-indigo-200/20",
    mobileHeader: "bg-white/70 border-sky-200/60 text-sky-900 shadow-xs",
    mobileBtn: "bg-sky-100 text-sky-900 border-transparent",
    sidebar:
      "bg-white/95 border-sky-200/60 text-sky-950",
    borderDashed: "border-sky-200/60",
    borderSimple: "border-sky-200/50",
    quoteBox: "bg-sky-50/60 border-sky-200/50 text-sky-800",
    navLink:
      "bg-sky-50/30 border-sky-200/40 text-sky-800 hover:bg-sky-100/60 hover:text-sky-950",
    progressBg: "bg-sky-100 border border-sky-200/60",
    progressBar: "bg-gradient-to-r from-sky-500 to-indigo-600",
    profileCard: "bg-white/80 border-sky-200/60 shadow-sm text-sky-950",
    avatarBg: "bg-sky-600",
    logoutBtn: "bg-rose-50 border-rose-200/60 text-rose-600 hover:bg-rose-100",
    mainPaper:
      "bg-white/95 border-sky-200/70 text-sky-950 shadow-[0_18px_50px_rgba(3,105,161,0.07)]",
    iconPrimary: "text-sky-600",
    iconSecondary: "text-indigo-500",
    syncText: "text-sky-600",
    syncDot: "bg-sky-500",
    mobileClose: "bg-white/80 border-sky-200 text-sky-600 hover:text-sky-800",
    btnGradient: "bg-gradient-to-tr from-sky-500 to-indigo-500",
  },
  green: {
    wrapper: "bg-emerald-50/40 text-emerald-950",
    bgGradient: "bg-emerald-50/60",
    glowTop: "bg-emerald-300/20",
    glowBottom: "bg-teal-200/20",
    mobileHeader:
      "bg-white/70 border-emerald-200/60 text-emerald-900 shadow-xs",
    mobileBtn: "bg-emerald-100 text-emerald-900 border-transparent",
    sidebar:
      "bg-white/95 border-emerald-200/60 text-emerald-950",
    borderDashed: "border-emerald-200/60",
    borderSimple: "border-emerald-200/50",
    quoteBox: "bg-emerald-50/60 border-emerald-200/50 text-emerald-800",
    navLink:
      "bg-emerald-50/30 border-emerald-200/40 text-emerald-800 hover:bg-emerald-100/60 hover:text-emerald-950",
    progressBg: "bg-emerald-100 border border-emerald-200/60",
    progressBar: "bg-gradient-to-r from-emerald-500 to-teal-600",
    profileCard: "bg-white/80 border-emerald-200/60 shadow-sm text-emerald-950",
    avatarBg: "bg-emerald-600",
    logoutBtn: "bg-rose-50 border-rose-200/60 text-rose-600 hover:bg-rose-100",
    mainPaper:
      "bg-white/95 border-emerald-200/70 text-emerald-950 shadow-[0_18px_50px_rgba(6,95,70,0.07)]",
    iconPrimary: "text-emerald-600",
    iconSecondary: "text-teal-600",
    syncText: "text-emerald-600",
    syncDot: "bg-emerald-500",
    mobileClose:
      "bg-white/80 border-emerald-200 text-emerald-600 hover:text-emerald-800",
    btnGradient: "bg-gradient-to-tr from-emerald-500 to-teal-500",
  },
  dark: {
    wrapper: "dark bg-slate-950 text-slate-100",
    bgGradient: "bg-slate-950",
    glowTop: "bg-indigo-600/15",
    glowBottom: "bg-pink-600/10",
    mobileHeader: "bg-slate-950/70 border-slate-900/60 text-white",
    mobileBtn: "bg-slate-900 text-indigo-400 border-slate-800",
    sidebar:
      "bg-slate-950/95 border-slate-800 text-slate-200",
    borderDashed: "border-slate-900",
    borderSimple: "border-slate-900",
    quoteBox: "bg-slate-900/30 border-slate-900 text-slate-300",
    navLink:
      "bg-slate-900/20 border-slate-900/60 text-slate-300 hover:bg-slate-900/80 hover:text-white",
    progressBg: "bg-slate-900 border border-slate-800",
    progressBar: "bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-500",
    profileCard: "bg-slate-900/40 border-slate-900/80 text-white",
    avatarBg: "bg-gradient-to-tr from-orange-500 to-rose-500",
    logoutBtn:
      "bg-slate-800/50 border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/20",
    mainPaper:
      "bg-slate-900/95 border-slate-800 text-slate-100 shadow-[0_20px_55px_rgba(0,0,0,0.3)]",
    iconPrimary: "text-orange-500",
    iconSecondary: "text-rose-500",
    syncText: "text-emerald-400",
    syncDot: "bg-emerald-400",
    mobileClose:
      "bg-slate-900/70 border-slate-800 text-indigo-400 hover:text-white",
    btnGradient: "bg-gradient-to-tr from-indigo-600 to-violet-500",
  },
};

/**
 * Ambil theme tersimpan dari localStorage.
 * Kalau tidak ada / invalid, fallback ke cream.
 */
const getSavedTheme = (): string => {
  if (!import.meta.client) return "cream";

  const savedTheme = localStorage.getItem("diary-active-theme");
  if (savedTheme && themeClasses[savedTheme]) {
    return savedTheme;
  }

  return "cream";
};

/**
 * Theme state global.
 * Penting: default value langsung ambil dari localStorage agar refresh tetap theme terakhir.
 */
const currentTheme = useState<string>("diary-active-theme", () =>
  getSavedTheme(),
);

/**
 * Class theme aktif.
 */
const currentThemeClasses = computed(
  () => themeClasses[currentTheme.value] || themeClasses.cream,
);

const currentUser = ref<any>(null);
const isSidebarOpen = ref(false);
const isOnline = ref(true);

/**
 * Ganti theme + simpan ke localStorage.
 */
const changeTheme = (themeName: string) => {
  if (!themeClasses[themeName]) return;

  currentTheme.value = themeName;

  if (import.meta.client) {
    localStorage.setItem("diary-active-theme", themeName);
  }
};

provide("changeTheme", changeTheme);

/**
 * Global lock modal state
 */
const lockModalState = useState("global-lock-modal", () => ({
  isOpen: false,
  correctPin: "",
  onSuccessCallback: null as (() => void) | null,
}));

const closeLockModal = () => {
  lockModalState.value.isOpen = false;
  lockModalState.value.correctPin = "";
  lockModalState.value.onSuccessCallback = null;
};

const handlePinSuccess = () => {
  if (lockModalState.value.onSuccessCallback) {
    lockModalState.value.onSuccessCallback();
  }
  closeLockModal();
};

/**
 * Quotes
 */
const quotes = [
  "Writing is the painting of the voice.",
  "Every page is a new beginning.",
  "A diary is a mirror of the soul.",
  "Small memories become great stories.",
  "Write what you cannot say.",
];

const quote = ref("");

/**
 * Data notebook global
 */
const notebooks = useState<any[]>("global-notebooks", () => []);
const wordGoal = ref(500);

/**
 * Hitung total kata hari ini.
 */
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
          const trimmed = String(page.text).trim();
          if (!trimmed) return;

          const words = trimmed.split(/\s+/);
          totalWords += words.filter((w: string) => w.length > 0).length;
        }
      });
    }
  });

  return totalWords;
});

/**
 * Progress menulis harian.
 */
const writingProgress = computed(() => {
  if (wordGoal.value <= 0) return 0;
  return (todayWordCount.value / wordGoal.value) * 100;
});

/**
 * Logout user
 */
const handleLogout = async () => {
  await signOut($fbAuth);
  router.push("/login");
};

/**
 * Simpan cleanup listener agar tidak bocor.
 */
let authUnsubscribe: Unsubscribe | null = null;

onMounted(() => {
  isOnline.value = navigator.onLine;
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  // loading ON di awal
  useloadingStore().setLoading(true);

  /**
   * Sinkronkan lagi theme saat mounted.
   * Kalau user terakhir pilih pink, saat refresh tetap pink.
   */
  currentTheme.value = getSavedTheme();

  /**
   * Setelah theme dipastikan benar, baru layout boleh tampil.
   * Ini menghilangkan flash cream saat refresh.
   */
  themeReady.value = true;

  /**
   * Ambil quote random
   */
  quote.value = quotes[Math.floor(Math.random() * quotes.length)];

  /**
   * Firebase auth listener
   */
  authUnsubscribe = onAuthStateChanged($fbAuth, (user) => {
    currentUser.value = user || null;

    // loading OFF setelah auth selesai dicek
    useloadingStore().setLoading(false);
  });

});

onBeforeUnmount(() => {
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }

});

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

// Buat emit untuk mengirim event ke parent/page
const emit = defineEmits(["create-book", "update-search"]);

// Gunakan useState agar variabel ini otomatis sinkron dengan file Page
const newBookTitle = useState("newBookTitle", () => "");
const searchBook = useState("searchBook", () => "");

// Mengambil referensi daftar jurnal yang ada di Page
interface Journal {
  id: number;
  title: string;
  createdAt: string;
}
const journals = ref<Journal[]>([]);

const activeBookIndex = ref(0);
const currentPageIndex = ref(0);
const isWritingMode = ref(false);
const generateId = () =>
  "book_" + Date.now() + Math.random().toString(36).slice(2, 8);
const { $fbAuth, $fbDb } = useNuxtApp();
const notificationStore = useNotificationStore();

// Fungsi Tambah Jurnal Baru
const createNewBook = async () => {
  if (!newBookTitle.value.trim()) {
    return notificationStore.showError("Judul Jurnal tidak boleh kosong.");
  }
  if (!newBookTitle.value.trim() || !currentUser.value) return;

  const newId = generateId();
  const listBuku = Array.isArray(notebooks.value) ? notebooks.value : [];

  const newJournalData = {
    title: newBookTitle.value.trim(),
    createdAt: Date.now(),
    isLocked: false,
    journalPin: "",
    journalPinHash: "",
    journalPinSalt: "",
  };

  try {
    useloadingStore().setLoading(true);
    const journalDocRef = doc(
      $fbDb,
      "user_diaries",
      currentUser.value.uid,
      "jurnals",
      newId,
    );
    await setDoc(journalDocRef, newJournalData);

    listBuku.push({ id: newId, ...newJournalData, pages: [] });
    notebooks.value = listBuku;
    newBookTitle.value = "";
    activeBookIndex.value = notebooks.value.length - 1;
    currentPageIndex.value = 0;
    isWritingMode.value = false;
    useloadingStore().setLoading(false);
  } catch (e) {
    useloadingStore().setLoading(false);
    console.error(e);
  }
};
</script>

<!-- TAMBAHKAN STYLE BERIKUT UNTUK FORCING SCROLLBAR PADA MOBILE BROWSER -->
<style scoped>
.custom-sidebar-scroll {
  /* Memaksa engine browser mengizinkan scrolling sentuh (touch) */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Menyembunyikan track scrollbar bawaan di Firefox */
}

/* Menyembunyikan track scrollbar di Chrome, Safari, dan Edge */
.custom-sidebar-scroll::-webkit-scrollbar {
  display: none;
}

/* Sistem interaksi global: tenang, konsisten, dan keyboard-friendly. */
.app-shell :deep(button),
.app-shell :deep(a) {
  -webkit-tap-highlight-color: transparent;
}

.app-shell :deep(button) {
  font-weight: 600;
  letter-spacing: 0;
  transition:
    color 160ms ease,
    background-color 160ms ease,
    border-color 160ms ease,
    opacity 160ms ease,
    box-shadow 160ms ease;
}

.app-shell :deep(button:hover:not(:disabled)) {
  transform: none !important;
}

.app-shell :deep(button:active:not(:disabled)) {
  transform: none !important;
  opacity: 0.78;
}

.app-shell :deep(button:focus-visible),
.app-shell :deep(a:focus-visible),
.app-shell :deep(label[role="button"]:focus-visible) {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.app-shell :deep(button:disabled) {
  cursor: not-allowed;
}

.brand-mark {
  position: relative;
  isolation: isolate;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 8px 20px rgba(15, 23, 42, 0.14);
}

.brand-mark::after {
  position: absolute;
  inset: 1px 1px auto;
  height: 45%;
  content: "";
  z-index: -1;
  border-radius: 0.65rem 0.65rem 50% 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.25), transparent);
}

.sidebar-head-action {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-radius: 0.7rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.sidebar-head-action:hover {
  filter: brightness(0.98);
}

.sidebar-controls :deep(label > svg),
.app-shell :deep(.premium-icon) {
  box-sizing: border-box;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0.38rem;
  border-radius: 0.6rem;
  background: color-mix(in srgb, currentColor 11%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

.app-shell :deep(button[aria-label] > svg) {
  transition: opacity 160ms ease;
}

.app-shell :deep(button[aria-label]:hover > svg) {
  opacity: 0.78;
}

.app-shell :deep(button[class*="bg-gradient"]) {
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.08),
    0 7px 18px rgba(15, 23, 42, 0.1);
}

.app-shell :deep(button[class*="bg-gradient"]:hover:not(:disabled)) {
  filter: brightness(1.04);
  box-shadow:
    0 2px 4px rgba(15, 23, 42, 0.08),
    0 9px 22px rgba(15, 23, 42, 0.13);
}

/* Pada layar laptop pendek, prioritaskan kontrol dan daftar jurnal. */
@media (max-height: 780px) {
  .sidebar-quote {
    display: none;
  }

  .sidebar-controls {
    gap: 0.5rem;
    padding-top: 0.75rem;
    padding-bottom: 0.6rem;
  }

  .sidebar-footer {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    gap: 0.6rem;
  }
}

@media (max-width: 767px) {
  .sidebar-controls {
    padding-top: max(1rem, env(safe-area-inset-top));
  }

  .sidebar-footer {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}
</style>
