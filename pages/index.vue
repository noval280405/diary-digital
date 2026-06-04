<template>
  <NuxtLayout name="diary">
    <template #sidebar-content>
      <div class="space-y-6 px-1 py-2 font-sans">
        <div
          class="space-y-3 pt-4 border-t border-dashed transition-colors duration-500"
          :class="currentThemeClasses.border"
        >
          <label
            :class="currentThemeClasses.textLabel"
            class="text-[10px] uppercase tracking-[0.25em] font-black block flex items-center gap-1.5"
          >
            <Icon icon="solar:folder-add-bold-duotone" class="w-3.5 h-3.5" />
            Jurnal Baru
          </label>
          <div class="flex gap-2">
            <input
              v-model="newBookTitle"
              placeholder="Nama rak jurnal..."
              :class="currentThemeClasses.input"
              class="flex-1 px-4 py-2.5 border rounded-2xl text-xs outline-none transition-all duration-300 placeholder:text-slate-400"
              @keyup.enter="createNewBook"
            />
            <button
              @click="createNewBook"
              :class="currentThemeClasses.btnGradient"
              class="hover:brightness-110 active:scale-95 transition-all px-4 rounded-2xl font-black text-white shadow-md text-base"
            >
              +
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <label
            :class="currentThemeClasses.textLabel"
            class="text-[10px] uppercase tracking-[0.25em] font-black block flex items-center gap-1.5"
          >
            <Icon
              icon="solar:bookmark-opened-bold-duotone"
              class="w-3.5 h-3.5"
            />
            Rak Jurnal
          </label>

          <div class="relative mb-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari cerita lama..."
              :class="currentThemeClasses.inputSearch"
              class="w-full pl-8 pr-3 py-2 border rounded-xl text-xs outline-none transition-all placeholder:text-slate-400"
            />
            <Icon
              icon="solar:magnifer-bold"
              :class="currentThemeClasses.icon"
              class="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-60"
            />
          </div>

          <div
            class="space-y-2.5 max-h-48 md:max-h-56 overflow-y-auto pr-1 custom-scrollbar"
          >
            <div
              v-for="(book, i) in filteredNotebooks"
              :key="book.id"
              @click="selectBook(book)"
              :class="
                notebooks[activeBookIndex]?.id === book.id
                  ? currentThemeClasses.itemActive
                  : currentThemeClasses.itemInactive
              "
              class="group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden"
            >
              <div
                v-if="notebooks[activeBookIndex]?.id === book.id"
                class="absolute left-0 top-0 bottom-0 w-1 bg-white/70"
              />
              <div
                class="truncate font-bold flex items-center gap-2.5 flex-1 min-w-0"
              >
                <span
                  :class="
                    notebooks[activeBookIndex]?.id === book.id
                      ? 'text-white'
                      : currentThemeClasses.icon
                  "
                >
                  {{
                    book.isLocked
                      ? "🔒"
                      : notebooks[activeBookIndex]?.id === book.id
                        ? "📖"
                        : "📔"
                  }}
                </span>
                <span class="truncate text-xs font-bold tracking-wide">{{
                  book.title
                }}</span>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span
                  :class="
                    notebooks[activeBookIndex]?.id === book.id
                      ? 'bg-white/20 text-white'
                      : currentThemeClasses.badge
                  "
                  class="px-2 py-0.5 rounded-full text-[10px] font-black font-mono"
                >
                  {{ book?.pages?.length || 0 }}
                </span>
                <button
                  @click.stop="deleteBook(book)"
                  class="md:opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>

            <div
              v-if="filteredNotebooks.length === 0"
              class="text-center py-4 text-[11px] opacity-40 italic"
            >
              Jurnal tidak ditemukan
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- AREA UTAMA: KERTAS ISI DIARY -->
    <div
      class="w-full min-h-[calc(100vh-180px)] md:min-h-[500px] flex flex-col justify-between relative px-2 sm:px-4 md:pl-8"
    >
      <!-- HEADER JURNAL (Judul Rak & Aksi Gembok Global) -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-6 md:mb-8"
        :class="currentThemeClasses.border"
      >
        <div class="flex items-center gap-3 md:gap-4">
          <div
            :class="currentThemeClasses.btnGradient"
            class="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0"
          >
            <Icon
              icon="solar:book-bookmark-bold-duotone"
              class="w-6 h-6 md:w-8 md:h-8 text-white"
            />
          </div>
          <div class="min-w-0">
            <h1 class="text-xl md:text-3xl font-black tracking-tight truncate">
              {{ currentBook.title || "Mulai Menulis" }}
            </h1>
            <p class="text-xs md:text-sm opacity-60 font-semibold mt-0.5">
              {{ filteredPages.length }} Lembar
              {{ searchQuery ? "Ditemukan" : "Tersimpan" }}
            </p>
          </div>
        </div>

        <!-- Tombol Pengunci Utama Berdasarkan Rak Jurnal -->
        <div v-if="currentBook.id" class="flex items-center gap-3">
          <button
            @click="toggleJournalLock"
            class="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-300"
            :class="
              currentBook.isLocked
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
            "
          >
            <Icon
              :icon="
                currentBook.isLocked
                  ? 'solar:lock-bold'
                  : 'solar:shield-keyhole-bold'
              "
              class="w-4 h-4"
            />
            <span>
              {{
                currentBook.isLocked ? "Jurnal Terkunci" : "Kunci Halaman Ini"
              }}
            </span>
          </button>
        </div>
      </div>

      <!-- KONDISI PERTAMA: JURNAL DIKUNCI TOTAL -->
      <div
        v-if="currentBook.isLocked && !isJournalUnlocked && !isWritingMode"
        class="flex flex-col items-center justify-center py-16 text-center space-y-4 px-4 flex-1 animate-fadeIn"
      >
        <div
          class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 animate-bounce"
        >
          <Icon
            icon="solar:lock-keyhole-minimalistic-bold-duotone"
            class="w-8 h-8"
          />
        </div>
        <div>
          <h3
            class="text-lg font-black"
            :class="darkMode ? 'text-white' : 'text-slate-900'"
          >
            Rak Jurnal Terproteksi
          </h3>
          <p class="text-xs opacity-60 max-w-xs mx-auto mt-1">
            Isi dokumen, resep rahasia, atau taktik penting di dalam jurnal
            <strong>"{{ currentBook.title }}"</strong> ini dikunci rapat.
          </p>
        </div>

        <!-- Kotak Akses Verifikasi PIN Rahasia -->
        <div class="flex flex-col gap-2 items-center w-full max-w-xs">
          <input
            v-model="inputJournalPin"
            type="text"
            maxlength="6"
            placeholder="••••••"
            style="-webkit-text-security: disc; text-security: disc"
            class="w-32 text-center text-xl font-black px-3 py-2.5 rounded-xl border tracking-widest focus:outline-none transition-all"
            :class="currentThemeClasses.input"
            @input="checkJournalPinInput"
          />
          <p v-if="journalPinError" class="text-xs text-red-500 font-bold mt-1">
            ❌ PIN Salah! Akses rahasia ditolak.
          </p>

          <button
            @click="showJournalResetModal = true"
            class="text-[11px] md:text-xs font-bold underline mt-4 opacity-50 hover:opacity-100 transition-opacity text-slate-500 dark:text-slate-400"
          >
            Lupa PIN Jurnal? Reset dengan Password
          </button>
        </div>
      </div>

      <!-- KONDISI KEDUA: TAMPILAN NORMAL (TERBUKA / AMAN) -->
      <div v-else class="flex-1 flex flex-col justify-between">
        <!-- BAGIAN TENGAH: AREA SLOTS / WRITING EDITOR -->
        <div>
          <!-- Mode Tampilan Normal Membaca Lembaran Cerita -->
          <div v-if="!isWritingMode">
            <!-- Header Paginasi & Proteksi PIN Lembar Halaman -->
            <div
              class="flex flex-row items-center justify-between gap-2.5 w-full mb-6"
            >
              <!-- Tombol Status & Kunci PIN Lembaran Halaman -->
              <button
                v-if="!isWritingMode && currentPage.text"
                @click="togglePageLock"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300 active:scale-95 shadow-sm backdrop-blur-md"
                :class="
                  currentPage.isLocked
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                "
              >
                <Icon
                  :icon="
                    currentPage.isLocked
                      ? 'solar:shield-keyhole-bold'
                      : 'solar:key-bold'
                  "
                  class="w-4 h-4 shrink-0 transition-transform duration-300"
                />
                <span>
                  {{ currentPage.isLocked ? "Hapus PIN" : "Kunci Lembar" }}
                </span>
              </button>

              <!-- Widget Kontrol Paginasi Halaman Kanan Atas -->
              <div
                class="flex items-center gap-1 p-1 rounded-xl border ml-auto"
                :class="
                  darkMode
                    ? 'bg-slate-900/50 border-slate-800 text-white'
                    : 'bg-amber-50/80 border-amber-200 text-slate-800'
                "
              >
                <button
                  @click="prevPage"
                  :disabled="currentPageIndex === 0 || !filteredPages.length"
                  class="p-1.5 rounded-lg border disabled:opacity-20 active:scale-95 transition-all"
                  :class="darkMode ? 'border-slate-800' : 'border-amber-200'"
                >
                  <Icon icon="solar:alt-arrow-left-bold" class="w-3.5 h-3.5" />
                </button>
                <span
                  class="text-xs font-black px-1.5 text-center min-w-[45px]"
                >
                  {{ filteredPages.length ? currentPageIndex + 1 : 0 }}/{{
                    filteredPages.length
                  }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="
                    currentPageIndex >= filteredPages.length - 1 ||
                    !filteredPages.length
                  "
                  class="p-1.5 rounded-lg border disabled:opacity-20 active:scale-95 transition-all"
                  :class="darkMode ? 'border-slate-800' : 'border-amber-200'"
                >
                  <Icon icon="solar:alt-arrow-right-bold" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Animasi Transisi Lembaran Diary -->
            <transition name="page-flip" mode="out-in">
              <div
                v-if="currentPage.text"
                :key="currentPageIndex"
                class="space-y-5"
              >
                <!-- PROTEKSI HALAMAN TUNGGAL -->
                <div
                  v-if="currentPage.isLocked && !isCurrentPageUnlocked"
                  class="flex flex-col items-center justify-center py-10 md:py-16 text-center space-y-4 animate-fadeIn px-2"
                >
                  <div
                    class="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 animate-bounce"
                  >
                    <Icon
                      icon="solar:lock-keyhole-bold-duotone"
                      class="w-8 h-8"
                    />
                  </div>
                  <div>
                    <h3
                      class="text-base md:text-lg font-black"
                      :class="darkMode ? 'text-white' : 'text-slate-900'"
                    >
                      Lembaran Rahasia Terkunci
                    </h3>
                    <p class="text-xs opacity-60 max-w-xs mx-auto mt-1 px-4">
                      Masukkan 6 digit PIN pribadi kamu atau gunakan opsi reset
                      di bawah jika lupa.
                    </p>
                  </div>
                  <div class="flex flex-col gap-2 items-center w-full">
                    <input
                      v-model="inputPin"
                      type="text"
                      maxlength="6"
                      placeholder="••••••"
                      style="-webkit-text-security: disc; text-security: disc"
                      class="w-36 md:w-40 text-center text-lg md:text-xl font-black px-3 py-2 rounded-xl border tracking-widest focus:outline-none transition-all"
                      :class="[
                        inputPin.length > 0
                          ? 'bg-rose-50/50 border-rose-400 text-rose-600 dark:bg-rose-950/20 dark:border-rose-500 dark:text-rose-400 animate-pulse'
                          : darkMode
                            ? 'bg-slate-900 border-slate-700 text-slate-400'
                            : 'bg-slate-50 border-slate-300 text-slate-400',
                      ]"
                      @input="checkPinInput"
                    />
                    <p
                      v-if="pinError"
                      class="text-xs text-rose-500 font-bold flex items-center gap-1 mt-1"
                    >
                      <Icon icon="solar:danger-bold" class="w-3.5 h-3.5" /> PIN
                      salah!
                    </p>

                    <button
                      @click="showResetModal = true"
                      class="text-[11px] md:text-xs font-bold underline mt-4 opacity-50 hover:opacity-100 transition-opacity text-slate-500 dark:text-slate-400"
                    >
                      Lupa PIN? Reset dengan Password
                    </button>
                  </div>
                </div>

                <!-- TAMPILAN KONTEN ISI DIARY UTAMA (TERBUKA) -->
                <div v-else class="space-y-4 md:space-y-6 animate-fadeIn">
                  <!-- Tag Mood & Tanggal Penulisan -->
                  <div
                    v-if="currentPage.mood"
                    class="flex flex-wrap items-center gap-2"
                  >
                    <span
                      :class="
                        currentThemeClasses.badge +
                        ' ' +
                        currentThemeClasses.border
                      "
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border shadow-sm"
                    >
                      <span>{{ currentPage.mood }}</span>
                      <span>Suasana Hati</span>
                    </span>
                    <span
                      v-if="currentPage.createdAt"
                      class="text-[10px] md:text-[11px] opacity-40 font-medium"
                      :class="darkMode ? 'text-slate-400' : 'text-slate-600'"
                    >
                      •
                      {{
                        new Date(currentPage.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      }}
                    </span>
                  </div>

                  <!-- Baris Kalimat Teks Diary Utama -->
                  <p
                    :class="
                      darkMode ? 'text-slate-200' : 'text-slate-800 font-medium'
                    "
                    class="whitespace-pre-wrap text-base md:text-xl font-serif italic text-justify leading-[28px] md:leading-[35px] px-0.5"
                  >
                    "{{ currentPage.text }}"
                  </p>

                  <!-- Lampiran Berkas Foto Polaroid Estetik -->
                  <div
                    v-if="currentPage.image"
                    :class="
                      currentThemeClasses.border +
                      ' ' +
                      (darkMode ? 'bg-slate-900/60' : 'bg-amber-50/40')
                    "
                    class="p-2 pb-4 rounded-xl border-2 shadow-md max-w-full sm:max-w-md inline-block transform -rotate-1 transition-transform hover:rotate-0"
                  >
                    <img
                      :src="currentPage.image"
                      class="max-h-52 md:max-h-72 w-full rounded-lg object-cover"
                      alt="Attachment"
                    />
                    <div
                      class="mt-2.5 text-center font-serif text-[10px] opacity-40 tracking-widest"
                      :class="darkMode ? 'text-slate-400' : 'text-slate-600'"
                    >
                      ✦ MEMORI TERLAMPIR ✦
                    </div>
                  </div>
                </div>
              </div>

              <!-- State Layar Kosong / Hasil Cari Nihil -->
              <div
                v-else
                class="text-center py-12 flex flex-col items-center space-y-3 px-4 px-0.5"
              >
                <Icon
                  icon="solar:pen-new-square-bold-duotone"
                  :class="currentThemeClasses.icon"
                  class="w-12 h-12 animate-bounce"
                />
                <p class="font-serif text-sm italic text-slate-500 max-w-xs">
                  {{
                    searchQuery
                      ? "Tidak ada lembaran yang cocok dengan kata kunci."
                      : "Lembar ini masih kosong. Siap menampung cerita seru hari ini."
                  }}
                </p>
              </div>
            </transition>
          </div>

          <!-- MODE EDITOR MENULIS JURNAL BARU -->
          <div v-else class="space-y-4 animate-fadeIn px-0.5">
            <!-- Pilihan Emosi Mood Tracker -->
            <div
              class="p-3 md:p-4 rounded-2xl border transition-all shadow-sm"
              :class="
                darkMode
                  ? 'bg-slate-900/40 border-slate-800'
                  : 'bg-amber-50/50 border-amber-200'
              "
            >
              <label
                class="text-[10px] font-black uppercase tracking-[0.15em] block mb-2 opacity-60"
                :class="currentThemeClasses.textLabel"
              >
                Bagaimana suasana hatimu hari ini?
              </label>
              <div class="flex flex-wrap gap-1.5 md:gap-2">
                <button
                  v-for="m in moodList"
                  :key="m.emoji"
                  type="button"
                  @click="selectedMood = m.emoji"
                  :class="[
                    selectedMood === m.emoji
                      ? darkMode
                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                        : 'bg-orange-100 border-orange-400 text-orange-900 font-bold'
                      : darkMode
                        ? 'bg-slate-950/80 border-slate-900/60 opacity-60 text-slate-400'
                        : 'bg-white border-amber-100 opacity-70 text-slate-700',
                  ]"
                  class="flex items-center gap-1 px-2.5 py-1 border rounded-xl text-xs transition-all duration-200 active:scale-95"
                >
                  <span>{{ m.emoji }}</span>
                  <span class="text-[11px]">{{ m.label }}</span>
                </button>
              </div>
            </div>

            <!-- Tempat Mengetik Cerita -->
            <textarea
              v-model="newText"
              placeholder="Tuangkan isi pikiran, rencana, atau petualangan serumu hari ini di sini..."
              :class="
                darkMode
                  ? 'text-slate-100 placeholder-slate-700'
                  : 'text-slate-800 placeholder-slate-400 font-medium'
              "
              class="w-full h-56 md:h-64 p-1 outline-none text-base md:text-lg font-serif resize-none bg-transparent leading-[30px] md:leading-[35px]"
            />

            <!-- Pilihan Input Lampiran File Gambar -->
            <div
              :class="
                darkMode
                  ? 'bg-slate-900/40 border-slate-800'
                  : 'bg-amber-50/40 border-amber-200'
              "
              class="flex flex-row items-center justify-between p-3 rounded-2xl border border-dashed gap-4 shadow-sm"
            >
              <label
                :class="
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-white border-amber-200 text-slate-700 shadow-sm'
                "
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black cursor-pointer border active:scale-95 transition-transform shrink-0"
              >
                <Icon
                  icon="solar:camera-add-bold-duotone"
                  class="w-4 h-4 text-orange-500"
                />
                <span>{{ imagePreview ? "Ganti Foto" : "Unggah Foto" }}</span>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                />
              </label>

              <div
                v-if="imagePreview"
                class="relative rounded-lg overflow-hidden border shrink-0 shadow-sm"
                :class="darkMode ? 'border-slate-800' : 'border-amber-200'"
              >
                <img :src="imagePreview" class="h-10 w-16 object-cover" />
                <button
                  @click="imagePreview = null"
                  class="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[10px] font-bold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TOMBOL NAVIGASI BAWAH (Aksi Simpan / Batal / Tulis) -->
        <div
          class="flex justify-end gap-2.5 pt-4 mt-8 border-t w-full"
          :class="currentThemeClasses.border"
        >
          <button
            v-if="!isWritingMode"
            @click="startWriting"
            :disabled="!notebooks.length"
            :class="currentThemeClasses.btnGradient"
            class="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-2 shadow-md disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Icon icon="solar:pen-bold-duotone" class="w-4 h-4" /> TULIS JURNAL
          </button>

          <button
            v-if="isWritingMode"
            @click="cancelWriting"
            :class="
              darkMode
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            "
            class="w-1/2 sm:w-auto text-center justify-center px-4 py-3 sm:py-2.5 rounded-xl font-black text-xs transition-colors"
          >
            BATAL
          </button>

          <button
            v-if="isWritingMode"
            @click="savePage"
            :class="
              darkMode
                ? 'from-emerald-600 to-teal-600'
                : 'from-emerald-500 to-teal-500'
            "
            class="bg-gradient-to-r w-1/2 sm:w-auto justify-center px-4 py-3 sm:py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <Icon icon="solar:check-square-bold-duotone" class="w-4 h-4" />
            SIMPAN
          </button>
        </div>
      </div>
    </div>

    <!-- CLIENT ONLY WRAPPER UNTUK MODAL AGAR AMAN DARI HYDRATION MISMATCH -->
    <ClientOnly>
      <!-- MODAL DIALOG 1: RESET PIN HALAMAN (Bawaan) -->
      <div
        v-if="showResetModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      >
        <div
          :class="
            darkMode
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-amber-200 text-slate-800'
          "
          class="w-full sm:max-w-md p-5 sm:p-6 rounded-t-3xl sm:rounded-3xl border-t sm:border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
          <div
            class="flex items-center gap-3 border-b pb-3"
            :class="darkMode ? 'border-slate-800' : 'border-amber-100'"
          >
            <div class="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Icon icon="solar:shield-warning-bold-duotone" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-black text-sm md:text-base">Verifikasi Akun</h3>
              <p class="text-[10px] md:text-[11px] opacity-60">
                Gunakan password akun untuk setel ulang PIN Halaman.
              </p>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div class="space-y-1">
              <label class="font-bold opacity-70">Email Terdaftar</label>
              <input
                :value="currentUser?.email"
                type="text"
                disabled
                class="w-full px-3 py-2 rounded-xl border bg-slate-100 dark:bg-slate-950 opacity-60 cursor-not-allowed font-medium text-xs"
              />
            </div>
            <div class="space-y-1">
              <label class="font-bold opacity-70">Password Akun Login</label>
              <input
                v-model="resetPassword"
                type="password"
                placeholder="Masukkan password akun..."
                class="w-full px-3 py-2.5 sm:py-2 rounded-xl border bg-transparent text-sm sm:text-xs outline-none focus:ring-1 focus:ring-orange-400 dark:focus:ring-indigo-500"
              />
            </div>
            <div class="space-y-1">
              <label class="font-bold opacity-70">Buat 6-Digit PIN Baru</label>
              <input
                v-model="resetNewPin"
                type="text"
                maxlength="6"
                placeholder="Contoh: 123456"
                class="w-full px-3 py-2.5 sm:py-2 rounded-xl border bg-transparent text-sm sm:text-xs outline-none focus:ring-1 focus:ring-orange-400 dark:focus:ring-indigo-500 tracking-wider"
              />
            </div>

            <p
              v-if="resetErrorMsg"
              class="text-xs text-red-500 font-bold flex items-center gap-1"
            >
              <Icon icon="solar:danger-bold" class="w-3.5 h-3.5" />
              {{ resetErrorMsg }}
            </p>
          </div>

          <div class="flex flex-row justify-end gap-2 pt-2 text-xs">
            <button
              @click="closeResetModal"
              :disabled="isResetLoading"
              class="w-1/2 sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              BATAL
            </button>
            <button
              @click="handleResetPinWithPassword"
              :disabled="isResetLoading"
              class="w-1/2 sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Icon
                v-if="isResetLoading"
                icon="solar:spinner-bold"
                class="w-3.5 h-3.5 animate-spin"
              />
              <span>UPDATE</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL DIALOG 2: RESET PIN RAK JURNAL GLOBAL -->
      <div
        v-if="showJournalResetModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      >
        <div
          :class="
            darkMode
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-amber-200 text-slate-800'
          "
          class="w-full sm:max-w-md p-5 sm:p-6 rounded-t-3xl sm:rounded-3xl border-t sm:border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
          <div
            class="flex items-center gap-3 border-b pb-3"
            :class="darkMode ? 'border-slate-800' : 'border-amber-100'"
          >
            <div class="p-2 rounded-xl bg-red-500/10 text-red-500">
              <Icon icon="solar:shield-keyhole-bold-duotone" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-black text-sm md:text-base">
                Reset Gembok Jurnal
              </h3>
              <p class="text-[10px] md:text-[11px] opacity-60">
                Otorisasi password untuk mengatur ulang PIN rak gembok jurnal.
              </p>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div class="space-y-1">
              <label class="font-bold opacity-70">Email Terdaftar</label>
              <input
                :value="currentUser?.email"
                type="text"
                disabled
                class="w-full px-3 py-2 rounded-xl border bg-slate-100 dark:bg-slate-950 opacity-60 cursor-not-allowed font-medium text-xs"
              />
            </div>
            <div class="space-y-1">
              <label class="font-bold opacity-70">Password Akun Login</label>
              <input
                v-model="resetJournalPassword"
                type="password"
                placeholder="Masukkan password akun..."
                class="w-full px-3 py-2.5 sm:py-2 rounded-xl border bg-transparent text-sm sm:text-xs outline-none focus:ring-1 focus:ring-red-400 dark:focus:ring-indigo-500"
              />
            </div>
            <div class="space-y-1">
              <label class="font-bold opacity-70"
                >Buat 6-Digit PIN Jurnal Baru</label
              >
              <input
                v-model="resetNewJournalPin"
                type="text"
                maxlength="6"
                placeholder="Contoh: 654321"
                class="w-full px-3 py-2.5 sm:py-2 rounded-xl border bg-transparent text-sm sm:text-xs outline-none focus:ring-1 focus:ring-red-400 dark:focus:ring-indigo-500 tracking-wider"
              />
            </div>

            <p
              v-if="resetJournalErrorMsg"
              class="text-xs text-red-500 font-bold flex items-center gap-1"
            >
              <Icon icon="solar:danger-bold" class="w-3.5 h-3.5" />
              {{ resetJournalErrorMsg }}
            </p>
          </div>

          <div class="flex flex-row justify-end gap-2 pt-2 text-xs">
            <button
              @click="closeJournalResetModal"
              :disabled="isJournalResetLoading"
              class="w-1/2 sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              BATAL
            </button>
            <button
              @click="handleResetJournalPinWithPassword"
              :disabled="isJournalResetLoading"
              class="w-1/2 sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl font-black text-white bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Icon
                v-if="isJournalResetLoading"
                icon="solar:spinner-bold"
                class="w-3.5 h-3.5 animate-spin"
              />
              <span>RE-SET PIN</span>
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";
import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Integrasi Utilitas & Firebase
const { darkMode } = useDiaryTheme();
const { $fbAuth, $fbDb } = useNuxtApp();
const router = useRouter();

const currentUser = ref<any>(null);

// =========================================================================
// STATE UTAMA (Sudah Digabung & Menggunakan State Global Nuxt)
// =========================================================================
const notebooks = useState<any[]>("global-notebooks", () => []);
const activeBookIndex = ref(0);
const currentPageIndex = ref(0);
const isWritingMode = ref(false);

const newBookTitle = ref("");
const newText = ref("");
const imagePreview = ref<string | null>(null);

// State Pencarian dan Pilihan Mood
const searchQuery = ref("");
const selectedMood = ref("😊");

// State Proteksi Kunci PIN Halaman Catatan
const isCurrentPageUnlocked = ref(false);
const inputPin = ref("");
const pinError = ref(false);

// State Pengaturan Modal Reset Lupa PIN via Password (Halaman Catatan)
const showResetModal = ref(false);
const resetPassword = ref("");
const resetNewPin = ref("");
const isResetLoading = ref(false);
const resetErrorMsg = ref("");

// State Proteksi Kunci PIN Rak Jurnal (Sidebar)
const isJournalUnlocked = ref(false);
const inputJournalPin = ref("");
const journalPinError = ref(false);

// State Pengaturan Modal Reset Lupa PIN via Password (Rak Jurnal)
const showJournalResetModal = ref(false);
const resetJournalPassword = ref("");
const resetNewJournalPin = ref("");
const isJournalResetLoading = ref(false);
const resetJournalErrorMsg = ref("");

const moodList = [
  { emoji: "😊", label: "Senang" },
  { emoji: "🥰", label: "Cinta" },
  { emoji: "😢", label: "Sedih" },
  { emoji: "😡", label: "Kesal" },
  { emoji: "😴", label: "Lelah" },
  { emoji: "🤢", label: "Sakit" },
];

// Generator ID Unik untuk Buku Baru
const generateId = () =>
  "book_" + Date.now() + Math.random().toString(36).slice(2, 8);

// =========================================================================
// FIREBASE AUTH LIFECYCLE & DATABASES
// =========================================================================
onMounted(() => {
  onAuthStateChanged($fbAuth, async (user) => {
    if (user) {
      currentUser.value = user;
      await loadUserDiary(user.uid);
    } else {
      router.push("/login");
    }
  });
});

const loadUserDiary = async (uid: string) => {
  try {
    const docRef = doc($fbDb, "user_diaries", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      notebooks.value = docSnap.data().notebooks || [];
    } else {
      notebooks.value = [
        {
          id: generateId(),
          title: "Jurnal Utama Saya",
          isLocked: false,
          journalPin: "",
          pages: [],
        },
      ];
      await saveToFirebase();
    }
  } catch (e) {
    console.error("Gagal memuat data dari cloud: ", e);
  }
};

const saveToFirebase = async () => {
  if (!currentUser.value) return;
  try {
    await setDoc(doc($fbDb, "user_diaries", currentUser.value.uid), {
      notebooks: notebooks.value,
    });
  } catch (e) {
    console.error("Gagal mencadangkan ke cloud: ", e);
  }
};

// =========================================================================
// LOGIKA PROTEKSI GEMBOK RAK JURNAL (SIDEBAR)
// =========================================================================
watch(activeBookIndex, () => {
  isJournalUnlocked.value = false;
  inputJournalPin.value = "";
  journalPinError.value = false;
});

const checkJournalPinInput = () => {
  if (inputJournalPin.value.length === 6) {
    if (inputJournalPin.value === currentBook.value.journalPin) {
      isJournalUnlocked.value = true;
      journalPinError.value = false;
    } else {
      journalPinError.value = true;
      inputJournalPin.value = "";
    }
  }
};

const toggleJournalLock = async () => {
  if (currentBook.value.isLocked) {
    const confirmPin = prompt(
      "Masukkan 6-Digit PIN Jurnal saat ini untuk melepas gembok permanen:",
    );
    if (confirmPin === currentBook.value.journalPin) {
      currentBook.value.isLocked = false;
      currentBook.value.journalPin = "";
      isJournalUnlocked.value = false;
      alert("🔓 Gembok dilepas! Jurnal ini sekarang berstatus umum.");
      await saveToFirebase();
    } else if (confirmPin !== null) {
      alert("❌ PIN Salah! Gagal membuka gembok.");
    }
  } else {
    const newPin = prompt(
      "Buat 6-Digit PIN Angka Baru untuk mengamankan jurnal ini:",
    );
    if (newPin === null) return;

    if (!newPin || newPin.length !== 6 || isNaN(Number(newPin))) {
      alert("⚠️ PIN wajib berupa 6 digit angka baku (Contoh: 123456).");
      return;
    }

    currentBook.value.isLocked = true;
    currentBook.value.journalPin = newPin;
    isJournalUnlocked.value = true;
    alert(
      `🔐 Sukses! Jurnal "${currentBook.value.title}" sekarang aman terkunci.`,
    );
    await saveToFirebase();
  }
};

const handleResetJournalPinWithPassword = async () => {
  resetJournalErrorMsg.value = "";

  if (!resetJournalPassword.value) {
    resetJournalErrorMsg.value = "Password akun login wajib diisi!";
    return;
  }
  if (
    !resetNewJournalPin.value ||
    resetNewJournalPin.value.length !== 6 ||
    isNaN(Number(resetNewJournalPin.value))
  ) {
    resetJournalErrorMsg.value = "PIN baru wajib berupa 6 digit angka baku!";
    return;
  }

  isJournalResetLoading.value = true;

  try {
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      resetJournalPassword.value,
    );
    await reauthenticateWithCredential($fbAuth.currentUser!, credential);

    currentBook.value.journalPin = resetNewJournalPin.value;
    currentBook.value.isLocked = true;
    isJournalUnlocked.value = true;

    await saveToFirebase();
    alert(
      `🎉 Sukses! PIN Gembok untuk jurnal "${currentBook.value.title}" berhasil di-reset.`,
    );
    closeJournalResetModal();
  } catch (error: any) {
    console.error("Gagal melakukan reset PIN Jurnal:", error);
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      resetJournalErrorMsg.value = "Password salah! Akses verifikasi ditolak.";
    } else {
      resetJournalErrorMsg.value =
        "Terjadi kesalahan sistem saat memverifikasi akun.";
    }
  } finally {
    isJournalResetLoading.value = false;
  }
};

const closeJournalResetModal = () => {
  showJournalResetModal.value = false;
  resetJournalPassword.value = "";
  resetNewJournalPin.value = "";
  resetJournalErrorMsg.value = "";
};

// =========================================================================
// LOGIKA PROTEKSI GEMBOK HALAMAN CATATAN (KONTEN UTAMA)
// =========================================================================
watch(
  [currentPageIndex, activeBookIndex],
  () => {
    isCurrentPageUnlocked.value = false;
    inputPin.value = "";
    pinError.value = false;
  },
  { immediate: true },
);

watch(searchQuery, () => {
  currentPageIndex.value = 0;
});

const checkPinInput = () => {
  if (inputPin.value.length === 6) {
    if (inputPin.value === currentPage.value.pin) {
      isCurrentPageUnlocked.value = true;
      pinError.value = false;
    } else {
      pinError.value = true;
      inputPin.value = "";
    }
  }
};

const togglePageLock = async () => {
  if (currentPage.value.isLocked) {
    if (isCurrentPageUnlocked.value) {
      const confirmDisable = confirm(
        "Apakah kamu ingin MEMBUANG proteksi PIN pada halaman ini secara permanen?",
      );
      if (confirmDisable) {
        const confirmPin = prompt("Masukkan PIN saat ini untuk konfirmasi:");
        if (confirmPin === currentPage.value.pin) {
          currentPage.value.isLocked = false;
          currentPage.value.pin = "";
          isCurrentPageUnlocked.value = false;
          alert("🔒 Proteksi PIN telah dilepas.");
          await saveToFirebase();
        } else if (confirmPin !== null) {
          alert("❌ PIN Salah!");
        }
      }
    } else {
      const inputBuka = prompt(
        "Masukkan 6-Digit PIN untuk membuka lembaran ini:",
      );
      if (inputBuka === currentPage.value.pin) {
        isCurrentPageUnlocked.value = true;
        pinError.value = false;
      } else if (inputBuka !== null) {
        alert("❌ PIN Salah!");
      }
    }
  } else {
    const newPin = prompt("Buat 6-Digit PIN angka baru:");
    if (newPin === null) return;

    if (!newPin || newPin.length !== 6 || isNaN(Number(newPin))) {
      alert("⚠️ PIN wajib berupa 6 digit nomor angka baku.");
      return;
    }

    currentPage.value.isLocked = true;
    currentPage.value.pin = newPin;
    isCurrentPageUnlocked.value = true;
    alert("🔐 Sukses terkunci aman!");
    await saveToFirebase();
  }
};

const handleResetPinWithPassword = async () => {
  resetErrorMsg.value = "";

  if (!resetPassword.value) {
    resetErrorMsg.value = "Password akun wajib diisi!";
    return;
  }
  if (
    !resetNewPin.value ||
    resetNewPin.value.length !== 6 ||
    isNaN(Number(resetNewPin.value))
  ) {
    resetErrorMsg.value = "PIN baru harus berupa 6 digit angka baku!";
    return;
  }

  isResetLoading.value = true;
  try {
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      resetPassword.value,
    );
    await reauthenticateWithCredential($fbAuth.currentUser!, credential);

    currentPage.value.pin = resetNewPin.value;
    currentPage.value.isLocked = true;
    isCurrentPageUnlocked.value = true;

    await saveToFirebase();
    alert("🔄 PIN Berhasil Diperbarui!");
    closeResetModal();
  } catch (error: any) {
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      resetErrorMsg.value = "Password salah! Akses ditolak.";
    } else {
      resetErrorMsg.value = "Gagal memverifikasi akun.";
    }
  } finally {
    isResetLoading.value = false;
  }
};

const closeResetModal = () => {
  showResetModal.value = false;
  resetPassword.value = "";
  resetNewPin.value = "";
  resetErrorMsg.value = "";
};

// =========================================================================
// MANAJEMEN TULIS & HALAMAN CATATAN
// =========================================================================
const startWriting = () => {
  newText.value = "";
  imagePreview.value = null;
  selectedMood.value = "😊";
  isWritingMode.value = true;
};

const cancelWriting = () => {
  isWritingMode.value = false;
};

const savePage = async () => {
  if (!newText.value.trim()) return;

  if (!currentBook.value.pages) currentBook.value.pages = [];

  currentBook.value.pages.push({
    text: newText.value,
    image: imagePreview.value,
    createdAt: Date.now(),
    mood: selectedMood.value,
    isLocked: false,
    pin: "",
  });

  currentPageIndex.value = currentBook.value.pages.length - 1;
  newText.value = "";
  imagePreview.value = null;
  isWritingMode.value = false;
  searchQuery.value = "";
  await saveToFirebase();
};

const handleImageUpload = (e: any) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev: any) => {
    imagePreview.value = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const nextPage = () => {
  if (currentPageIndex.value < filteredPages.value.length - 1)
    currentPageIndex.value++;
};
const prevPage = () => {
  if (currentPageIndex.value > 0) currentPageIndex.value--;
};

// =========================================================================
// INTEGRASI TEMA & MANAJEMEN AKSI SIDEBAR (TERINTEGRASI CLOUD)
// =========================================================================
const currentTheme = useState<string>("diary-active-theme", () => "cream");

const themeStyles: Record<string, any> = {
  dark: {
    textLabel: "text-indigo-400",
    border: "border-slate-900",
    icon: "text-indigo-400",
    input:
      "bg-slate-900/90 border-slate-800/80 text-slate-100 focus:ring-2 focus:ring-indigo-500",
    inputSearch:
      "bg-slate-900/60 border-slate-800 text-white focus:ring-1 focus:ring-indigo-500",
    btnGradient: "bg-gradient-to-tr from-indigo-600 to-violet-500",
    itemActive:
      "bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-400 text-white shadow-md shadow-indigo-950/50",
    itemInactive:
      "bg-slate-900/40 border-slate-900/80 text-slate-300 hover:bg-slate-900/80",
    badge: "bg-slate-800 text-indigo-400",
  },
  cream: {
    textLabel: "text-amber-700",
    border: "border-amber-200/60",
    icon: "text-amber-700",
    input:
      "bg-amber-50/50 border-amber-200 text-slate-800 focus:ring-2 focus:ring-orange-400 shadow-sm",
    inputSearch:
      "bg-amber-50/40 border-amber-200 text-slate-800 focus:ring-1 focus:ring-orange-400",
    btnGradient: "bg-gradient-to-tr from-orange-500 to-amber-500",
    itemActive:
      "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-md shadow-amber-900/20",
    itemInactive:
      "bg-amber-50/40 border-amber-100 text-slate-700 hover:bg-white",
    badge: "bg-amber-100 text-amber-900",
  },
  pink: {
    textLabel: "text-pink-600",
    border: "border-pink-200/60",
    icon: "text-pink-600",
    input:
      "bg-pink-50/50 border-pink-200 text-pink-950 focus:ring-2 focus:ring-pink-400 shadow-sm",
    inputSearch:
      "bg-pink-50/40 border-pink-200 text-pink-950 focus:ring-1 focus:ring-pink-400",
    btnGradient: "bg-gradient-to-tr from-pink-500 to-rose-500",
    itemActive:
      "bg-gradient-to-r from-pink-500 to-rose-500 border-pink-400 text-white shadow-md shadow-pink-900/10",
    itemInactive: "bg-pink-50/30 border-pink-100 text-pink-900 hover:bg-white",
    badge: "bg-pink-100 text-pink-900",
  },
  blue: {
    textLabel: "text-sky-600",
    border: "border-sky-200/60",
    icon: "text-sky-600",
    input:
      "bg-sky-50/50 border-sky-200 text-sky-950 focus:ring-2 focus:ring-sky-400 shadow-sm",
    inputSearch:
      "bg-sky-50/40 border-sky-200 text-sky-950 focus:ring-1 focus:ring-sky-400",
    btnGradient: "bg-gradient-to-tr from-sky-500 to-indigo-500",
    itemActive:
      "bg-gradient-to-r from-sky-500 to-indigo-500 border-sky-400 text-white shadow-md shadow-indigo-900/10",
    itemInactive: "bg-sky-50/30 border-sky-100 text-sky-900 hover:bg-white",
    badge: "bg-sky-100 text-sky-900",
  },
  green: {
    textLabel: "text-emerald-600",
    border: "border-emerald-200/60",
    icon: "text-emerald-600",
    input:
      "bg-emerald-50/50 border-emerald-200 text-emerald-950 focus:ring-2 focus:ring-emerald-400 shadow-sm",
    inputSearch:
      "bg-emerald-50/40 border-emerald-200 text-emerald-950 focus:ring-1 focus:ring-emerald-400",
    btnGradient: "bg-gradient-to-tr from-emerald-500 to-teal-500",
    itemActive:
      "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-md shadow-teal-900/10",
    itemInactive:
      "bg-emerald-50/30 border-emerald-100 text-emerald-900 hover:bg-white",
    badge: "bg-emerald-100 text-emerald-900",
  },
};

// COMPUTED DATA BUKU & PAGES
const currentBook = computed(() => {
  const listBuku = Array.isArray(notebooks.value) ? notebooks.value : [];
  return (
    listBuku[activeBookIndex.value] || {
      id: "",
      title: "",
      isLocked: false,
      journalPin: "",
      pages: [],
    }
  );
});

const currentPage = computed(() => {
  return filteredPages.value[currentPageIndex.value] || {};
});

const filteredNotebooks = computed(() => {
  const listBuku = Array.isArray(notebooks.value) ? notebooks.value : [];
  if (!searchQuery.value.trim()) return listBuku;
  return listBuku.filter((book: any) =>
    book?.title?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const filteredPages = computed(() => {
  if (!currentBook.value || !currentBook.value.pages) return [];
  return currentBook.value.pages.filter((page: any) => {
    return page?.text?.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const currentThemeClasses = computed(() => {
  return themeStyles[currentTheme.value] || themeStyles["cream"];
});

// AKSI MUTASI DATA AMAN & SINKRON CLOUD (SINKRON SISI USER INTERFACE)
const createNewBook = async () => {
  if (!newBookTitle.value.trim()) return;

  const listBuku = Array.isArray(notebooks.value) ? notebooks.value : [];
  listBuku.push({
    id: generateId(),
    title: newBookTitle.value.trim(),
    createdAt: Date.now(),
    isLocked: false,
    journalPin: "",
    pages: [],
  });

  notebooks.value = listBuku;
  newBookTitle.value = "";
  activeBookIndex.value = notebooks.value.length - 1;
  currentPageIndex.value = 0;
  isWritingMode.value = false;
  await saveToFirebase();
};

const selectBook = (clickedBook: any) => {
  const originalIndex = notebooks.value.findIndex(
    (b: any) => b.id === clickedBook.id,
  );
  if (originalIndex !== -1) {
    activeBookIndex.value = originalIndex;
    currentPageIndex.value = 0;
    isWritingMode.value = false;
  }
};

const deleteBook = async (clickedBook: any) => {
  const originalIndex = notebooks.value.findIndex(
    (b: any) => b.id === clickedBook.id,
  );
  if (
    originalIndex !== -1 &&
    confirm(`Hapus jurnal "${clickedBook.title}" beserta seluruh isinya?`)
  ) {
    notebooks.value.splice(originalIndex, 1);

    if (notebooks.value.length === 0) {
      activeBookIndex.value = 0;
    } else if (activeBookIndex.value >= notebooks.value.length) {
      activeBookIndex.value = notebooks.value.length - 1;
    }
    currentPageIndex.value = 0;
    await saveToFirebase();
  }
};
</script>

<style scoped>
.page-flip-enter-active,
.page-flip-leave-active {
  transition: all 0.25s ease-out;
}
.page-flip-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.page-flip-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
</style>
