<template>
  <div
    v-if="themeReady"
    :class="[
      themeClasses[currentTheme]?.wrapper || themeClasses['dark'].wrapper,
    ]"
    class="min-h-screen flex flex-col md:flex-row transition-colors duration-700 font-sans relative overflow-hidden"
  >
    <LoadingApp />
    <appNotification />
    <!-- EFEK LATAR BELAKANG: Gradasi Sinematik Luas -->
    <div
      class="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
      :class="
        themeClasses[currentTheme]?.bgGradient ||
        themeClasses['cream'].bgGradient
      "
    />

    <!-- EFEK AMBIENT GLOW: Efek Pendaran Cahaya Interaktif -->
    <div
      class="fixed -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 transition-all duration-700 animate-pulse"
      :class="
        themeClasses[currentTheme]?.glowTop || themeClasses['cream'].glowTop
      "
    />
    <div
      class="fixed -bottom-20 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-700"
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
          class="w-9 h-9 rounded-xl bg-gradient-to flex items-center justify-center shadow-lg shrink-0"
        >
          <Icon
            icon="solar:book-bookmark-bold-duotone"
            class="w-5 h-5 text-white"
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
      :style="{ height: sidebarHeight }"
      class="fixed inset-y-0 left-0 w-[85vw] max-w-[320px] md:w-76 md:sticky md:top-0 md:h-screen border-r backdrop-blur-xl flex flex-col justify-between z-50 md:z-10 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none select-none overflow-hidden"
    >
      <!-- BAGIAN ATAS (FIXED / DIAM): LOGO, TEMA, KUTIPAN, STATS, JURNAL BARU & PENCARIAN -->
      <div
        class="px-4 md:px-5 pt-4 md:pt-5 pb-3 flex flex-col gap-3 border-b border-dashed transition-all duration-300 bg-inherit rounded-t-[2rem] shrink-0"
        :class="themeClasses[currentTheme]?.borderDashed || 'border-slate-800'"
      >
        <!-- LOGO & TOMBOL CLOSE MOBILE -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <div
              :class="currentThemeClasses.btnGradient"
              class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0"
            >
              <Icon
                icon="solar:book-bookmark-bold-duotone"
                class="w-5 h-5 text-white"
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

          <button
            @click="isSidebarOpen = false"
            :class="
              themeClasses[currentTheme]?.mobileClose ||
              themeClasses['dark'].mobileClose
            "
            class="md:hidden group w-9 h-9 rounded-xl border backdrop-blur-xl flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105"
          >
            <Icon
              icon="solar:alt-arrow-left-outline"
              class="w-4 h-4 transition-all duration-300 group-hover:-translate-x-0.5"
            />
          </button>
        </div>

        <!-- PEMILIH TEMA / GANTI WARNA -->
        <div class="w-full">
          <button
            @click="showThemePicker = !showThemePicker"
            class="w-full flex items-center justify-between px-3 py-1.5 md:py-2 rounded-xl border text-xs font-bold transition-all duration-300"
            :class="
              themeClasses[currentTheme]?.navLink ||
              themeClasses['dark'].navLink
            "
          >
            <span class="flex items-center gap-2">
              <Icon
                icon="solar:palette-bold-duotone"
                :class="themeClasses[currentTheme]?.iconPrimary"
                class="w-4 h-4"
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
            <div v-if="showThemePicker" class="mt-2">
              <div
                class="grid grid-cols-5 gap-2 bg-slate-500/5 p-1.5 rounded-xl border transition-colors duration-300"
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
          class="p-3 rounded-xl border relative overflow-hidden group transition-all duration-300"
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
        <div class="space-y-1">
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
                class="w-4 h-4 transition-transform group-hover:scale-110"
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
            class="text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-1.5 opacity-80"
          >
            <Icon
              icon="solar:folder-add-bold-duotone"
              class="w-3.5 h-3.5 text-indigo-500"
            />
            Jurnal Baru
          </label>
          <div class="flex gap-2">
            <input
              v-model="newBookTitle"
              placeholder="Nama rak jurnal..."
              :class="currentThemeClasses.input || currentThemeClasses.navLink"
              class="flex-1 h-9 px-3 border rounded-xl text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/30"
              @keyup.enter="createNewBook"
            />

            <button
              @click="createNewBook"
              :class="currentThemeClasses.btnGradient"
              class="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
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
            class="text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-1.5 opacity-80"
          >
            <Icon
              icon="solar:bookmark-opened-bold-duotone"
              class="w-3.5 h-3.5 text-rose-500"
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
              class="w-full pl-9 pr-8 py-1.5 border rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/20"
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
        class="flex-1 overflow-y-auto px-4 md:px-5 py-3 space-y-2 custom-sidebar-scroll overscroll-contain touch-pan-y"
      >
        <div @click="isSidebarOpen = false">
          <slot name="sidebar-content" />
        </div>
      </div>

      <!-- BAGIAN BAWAH (FIXED / DIAM): TARGET HARI INI & PROFIL USER -->
      <div
        class="space-y-3 p-4 md:p-5 border-t shrink-0 bg-inherit"
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
      class="relative flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto z-10 flex flex-col justify-center"
    >
      <div class="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <div
          :class="
            themeClasses[currentTheme]?.mainPaper ||
            themeClasses['dark'].mainPaper
          "
          class="rounded-2xl md:rounded-[28px] border p-4 sm:p-8 md:p-12 flex-1 flex flex-col relative transition-all duration-500 min-h-[calc(100vh-120px)] md:min-h-[600px]"
        >
          <!-- Garis Margin Merah Buku Diary Tradisional -->
          <div
            class="hidden md:block absolute left-16 top-0 bottom-0 w-[1px] z-20 pointer-events-none"
            :class="
              currentTheme === 'dark' ? 'bg-rose-500/15' : 'bg-rose-500/25'
            "
          />

          <!-- Pola Garis-Garis Buku Jurnal -->
          <div
            class="absolute inset-0 pointer-events-none z-0 opacity-40"
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

const showThemePicker = ref(false);

const { $fbAuth } = useNuxtApp();
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
    bgGradient:
      "bg-[radial-gradient(circle_at_top_left,_#fffbeb,_#fef3c7,_#fdf4ff)]",
    glowTop: "bg-orange-300/30",
    glowBottom: "bg-rose-200/20",
    mobileHeader: "bg-white/70 border-amber-200/60 text-slate-900 shadow-xs",
    mobileBtn: "bg-amber-100 text-amber-900 border-transparent",
    sidebar:
      "bg-white/90 md:bg-white/40 border-amber-200/70 text-slate-800 shadow-xl shadow-amber-900/5",
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
      "bg-white border-amber-200 text-black shadow-[0_30px_70px_rgba(217,119,6,0.08)]",
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
    bgGradient:
      "bg-[radial-gradient(circle_at_top_left,_#fff5f5,_#ffe4e6,_#fae8ff)]",
    glowTop: "bg-pink-300/30",
    glowBottom: "bg-rose-300/20",
    mobileHeader: "bg-white/70 border-pink-200/60 text-pink-900 shadow-xs",
    mobileBtn: "bg-pink-100 text-pink-900 border-transparent",
    sidebar:
      "bg-white/90 md:bg-white/40 border-pink-200/70 text-pink-900 shadow-xl shadow-pink-900/5",
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
      "bg-white border-pink-200 text-pink-950 shadow-[0_30px_70px_rgba(244,63,94,0.06)]",
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
    bgGradient:
      "bg-[radial-gradient(circle_at_top_left,_#f0f9ff,_#e0f2fe,_#f0fdf4)]",
    glowTop: "bg-sky-300/30",
    glowBottom: "bg-indigo-200/20",
    mobileHeader: "bg-white/70 border-sky-200/60 text-sky-900 shadow-xs",
    mobileBtn: "bg-sky-100 text-sky-900 border-transparent",
    sidebar:
      "bg-white/90 md:bg-white/40 border-sky-200/70 text-sky-900 shadow-xl shadow-sky-900/5",
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
      "bg-white border-sky-200 text-sky-950 shadow-[0_30px_70px_rgba(14,165,233,0.06)]",
    iconPrimary: "text-sky-600",
    iconSecondary: "text-indigo-500",
    syncText: "text-sky-600",
    syncDot: "bg-sky-500",
    mobileClose: "bg-white/80 border-sky-200 text-sky-600 hover:text-sky-800",
    btnGradient: "bg-gradient-to-tr from-sky-500 to-indigo-500",
  },
  green: {
    wrapper: "bg-emerald-50/40 text-emerald-950",
    bgGradient:
      "bg-[radial-gradient(circle_at_top_left,_#f0fdf4,_#dcfce7,_#fef9c3)]",
    glowTop: "bg-emerald-300/20",
    glowBottom: "bg-teal-200/20",
    mobileHeader:
      "bg-white/70 border-emerald-200/60 text-emerald-900 shadow-xs",
    mobileBtn: "bg-emerald-100 text-emerald-900 border-transparent",
    sidebar:
      "bg-white/90 md:bg-white/40 border-emerald-200/70 text-emerald-900 shadow-xl shadow-emerald-900/5",
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
      "bg-white border-emerald-200 text-emerald-950 shadow-[0_30px_70px_rgba(16,185,129,0.06)]",
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
    bgGradient:
      "bg-[radial-gradient(circle_at_top_left,_#1e1b4b,_#0f172a,_#020617)]",
    glowTop: "bg-indigo-600/15",
    glowBottom: "bg-pink-600/10",
    mobileHeader: "bg-slate-950/70 border-slate-900/60 text-white",
    mobileBtn: "bg-slate-900 text-indigo-400 border-slate-800",
    sidebar:
      "bg-slate-950/80 md:bg-slate-950/40 border-slate-900/80 text-slate-200",
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
      "bg-slate-900/60 border-slate-900/80 text-white shadow-[0_35px_70px_rgba(0,0,0,0.6)] backdrop-blur-md",
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
const sidebarHeight = ref("100vh");

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
let resizeHandler: (() => void) | null = null;

onMounted(() => {
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

  /**
   * Tinggi sidebar berdasarkan tinggi viewport
   */
  if (import.meta.client) {
    sidebarHeight.value = `${window.innerHeight}px`;

    resizeHandler = () => {
      // Update hanya kalau perubahan tinggi signifikan
      // agar keyboard mobile tidak bikin layout lompat-lompat
      if (Math.abs(window.innerHeight - parseInt(sidebarHeight.value)) > 150) {
        sidebarHeight.value = `${window.innerHeight}px`;
      }
    };

    window.addEventListener("resize", resizeHandler);
  }
});

onBeforeUnmount(() => {
  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }

  if (import.meta.client && resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }
});

// Buat emit untuk mengirim event ke parent/page
const emit = defineEmits(["create-book", "update-search"]);

// Gunakan useState agar variabel ini otomatis sinkron dengan file Page
const newBookTitle = useState("newBookTitle", () => "");
const searchBook = useState("searchBook", () => "");

// Mengambil referensi daftar jurnal yang ada di Page
const journals = useState("journalsList", () => []);

// Fungsi Tambah Jurnal Baru
const createNewBook = () => {
  if (!newBookTitle.value.trim()) return;

  // Tambahkan jurnal baru ke dalam array
  journals.value.push({
    id: Date.now(),
    title: newBookTitle.value.trim(),
    createdAt: new Date().toISOString(),
  });

  // Reset input setelah berhasil dibuat
  newBookTitle.value = "";
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
</style>
