<template>
  <NuxtLayout name="diary">
    <template #sidebar-content>
      <div class="space-y-6 px-1 py-2">
        <!-- Bagian 1: Input Pembuat Jurnal Baru -->
        <div
          class="space-y-3 pt-2 border-t transition-colors duration-500"
          :class="darkMode ? 'border-slate-800/60' : 'border-amber-200/60'"
        >
          <label
            :class="darkMode ? 'text-indigo-400' : 'text-amber-700'"
            class="text-xs uppercase tracking-[0.25em] font-black block"
          >
            ✦ Jurnal Baru
          </label>
          <div class="flex gap-2">
            <input
              v-model="newBookTitle"
              placeholder="Nama rak jurnal..."
              :class="
                darkMode
                  ? 'bg-slate-900/90 border-slate-800/80 text-slate-100 focus:ring-2 focus:ring-indigo-500'
                  : 'bg-amber-50/50 border-amber-200 text-slate-800 focus:ring-2 focus:ring-orange-400 shadow-sm'
              "
              class="flex-1 px-4 py-2.5 border rounded-2xl text-sm outline-none transition-all duration-300 placeholder:text-slate-400"
              @keyup.enter="createNewBook"
            />
            <button
              @click="createNewBook"
              :class="
                darkMode
                  ? 'from-indigo-600 to-violet-500'
                  : 'from-orange-500 to-amber-500'
              "
              class="bg-gradient-to-tr hover:brightness-110 active:scale-95 transition-all px-4 rounded-2xl font-black text-white shadow-md text-lg"
            >
              +
            </button>
          </div>
        </div>

        <!-- Bagian 2: List Rak Jurnal di Sidebar -->
        <div class="space-y-3">
          <label
            :class="darkMode ? 'text-slate-400' : 'text-amber-800/70'"
            class="text-xs uppercase tracking-[0.25em] font-black block"
          >
            📚 Rak Jurnal
          </label>

          <!-- Kotak Pencarian Cerita Lama -->
          <div class="relative mb-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari cerita lama..."
              :class="
                darkMode
                  ? 'bg-slate-900/60 border-slate-800 text-white focus:ring-1 focus:ring-indigo-500'
                  : 'bg-amber-50/40 border-amber-200 text-slate-800 focus:ring-1 focus:ring-orange-400'
              "
              class="w-full pl-8 pr-3 py-1.5 border rounded-xl text-xs outline-none transition-all placeholder:text-slate-400"
            />
            <Icon
              icon="solar:magnifer-bold"
              class="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-40"
            />
          </div>

          <!-- Loop List Buku Rak Jurnal -->
          <div
            class="space-y-2.5 max-h-48 md:max-h-56 overflow-y-auto pr-1 custom-scrollbar"
          >
            <div
              v-for="(book, i) in notebooks"
              :key="book.id"
              @click="selectBook(i)"
              :class="
                activeBookIndex === i
                  ? darkMode
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-400 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-md'
                  : darkMode
                    ? 'bg-slate-900/40 border-slate-900/80 text-slate-300 hover:bg-slate-900/80'
                    : 'bg-amber-50/40 border-amber-100 text-slate-700 hover:bg-white'
              "
              class="group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden"
            >
              <div
                v-if="activeBookIndex === i"
                class="absolute left-0 top-0 bottom-0 w-1 bg-white/70"
              />
              <div
                class="truncate font-bold flex items-center gap-2.5 flex-1 min-w-0"
              >
                <span>{{
                  book.isLocked ? "🔒" : activeBookIndex === i ? "📖" : "📔"
                }}</span>
                <span class="truncate text-sm tracking-wide">{{
                  book.title
                }}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span
                  :class="
                    activeBookIndex === i
                      ? 'bg-white/20 text-white'
                      : darkMode
                        ? 'bg-slate-800 text-indigo-400'
                        : 'bg-amber-100 text-amber-900'
                  "
                  class="px-2 py-0.5 rounded-full text-xs font-black"
                >
                  {{ book.pages ? book.pages.length : 0 }}
                </span>
                <button
                  @click.stop="deleteBook(i)"
                  class="md:opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
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
        :class="darkMode ? 'border-slate-800/80' : 'border-amber-200/60'"
      >
        <div class="flex items-center gap-3 md:gap-4">
          <div
            :class="
              darkMode
                ? 'from-indigo-500 to-pink-500'
                : 'from-orange-500 to-rose-500'
            "
            class="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0"
          >
            <Icon
              icon="solar:book-bookmark-bold-duotone"
              class="w-6 h-6 md:w-8 md:h-8 text-white"
            />
          </div>
          <div class="min-w-0">
            <h1
              class="text-xl md:text-3xl font-black tracking-tight truncate"
              :class="darkMode ? 'text-white' : 'text-slate-900'"
            >
              {{ currentBook.title || "Mulai Menulis" }}
            </h1>
            <p class="text-xs md:text-sm opacity-60 font-semibold mt-0.5">
              {{ filteredPages.length }} Lembar
              {{ searchQuery ? "Ditemukan" : "Tersimpan" }}
            </p>
          </div>
        </div>

        <!-- Tombol Pengunci Utama Berdasarkan Rak Jurnal -->
        <div class="flex items-center gap-3">
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
          <h3 class="text-lg font-black">Rak Jurnal Terproteksi</h3>
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
            class="w-32 text-center text-xl font-black px-3 py-2.5 rounded-xl border tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500 transition-all bg-transparent"
            :class="
              darkMode
                ? 'border-slate-800 text-white'
                : 'border-amber-200 text-slate-800'
            "
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
                  :style="{
                    color: currentPage.isLocked
                      ? darkMode
                        ? '#f87171'
                        : '#e11d48'
                      : darkMode
                        ? '#34d399'
                        : '#059669',
                  }"
                />
                <span
                  :class="
                    currentPage.isLocked
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  "
                >
                  {{ currentPage.isLocked ? "Hapus PIN" : "Kunci Lembar" }}
                </span>
              </button>

              <!-- Widget Kontrol Paginasi Halaman Kanan Atas -->
              <div
                class="flex items-center gap-1 p-1 rounded-xl border ml-auto"
                :class="
                  darkMode
                    ? 'bg-slate-900/50 border-slate-800'
                    : 'bg-amber-50/80 border-amber-200'
                "
              >
                <button
                  @click="prevPage"
                  :disabled="currentPageIndex === 0 || !filteredPages.length"
                  class="p-1.5 rounded-lg border disabled:opacity-20 active:scale-95 transition-all"
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
                      class="w-36 md:w-40 text-center text-lg md:text-xl font-black px-3 py-2 rounded-xl border tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
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
                        darkMode
                          ? 'bg-slate-900 border-slate-800 text-slate-300'
                          : 'bg-amber-100/60 border-amber-200 text-amber-900'
                      "
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border shadow-sm"
                    >
                      <span>{{ currentPage.mood }}</span>
                      <span>Suasana Hati</span>
                    </span>
                    <span
                      v-if="currentPage.createdAt"
                      class="text-[10px] md:text-[11px] opacity-40 font-medium"
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
                      darkMode
                        ? 'border-slate-800 bg-slate-900/60'
                        : 'border-amber-200 bg-amber-50/40'
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
                    >
                      ✦ MEMORI TERLAMPIR ✦
                    </div>
                  </div>
                </div>
              </div>

              <!-- State Layar Kosong / Hasil Cari Nihil -->
              <div
                v-else
                class="text-center py-12 flex flex-col items-center space-y-3 px-4"
              >
                <Icon
                  icon="solar:pen-new-square-bold-duotone"
                  :class="
                    darkMode ? 'text-indigo-400/60' : 'text-orange-500/60'
                  "
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
          :class="darkMode ? 'border-slate-800/80' : 'border-amber-200/60'"
        >
          <button
            v-if="!isWritingMode"
            @click="startWriting"
            :disabled="!notebooks.length"
            :class="
              darkMode
                ? 'from-indigo-600 to-violet-600'
                : 'from-orange-500 to-amber-500'
            "
            class="bg-gradient-to-r w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-2 shadow-md disabled:opacity-40 active:scale-95 transition-transform"
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

const { darkMode } = useDiaryTheme();
const { $fbAuth, $fbDb } = useNuxtApp();
const router = useRouter();

const currentUser = ref<any>(null);

// State Utama
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

// State Proteksi Kunci PIN Utama
const isCurrentPageUnlocked = ref(false);
const inputPin = ref("");
const pinError = ref(false);

// State Pengaturan Modal Reset Lupa PIN via Password
const showResetModal = ref(false);
const resetPassword = ref("");
const resetNewPin = ref("");
const isResetLoading = ref(false);
const resetErrorMsg = ref("");

const moodList = [
  { emoji: "😊", label: "Senang" },
  { emoji: "🥰", label: "Cinta" },
  { emoji: "😢", label: "Sedih" },
  { emoji: "😡", label: "Kesal" },
  { emoji: "😴", label: "Lelah" },
  { emoji: "🤢", label: "Sakit" },
];

const generateId = () =>
  "book_" + Date.now() + Math.random().toString(36).slice(2, 8);

// Firebase Auth Lifecycle
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
        { id: generateId(), title: "Jurnal Utama Saya", pages: [] },
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

// Computed Properties
const currentBook = computed(
  () => notebooks.value[activeBookIndex.value] || { title: "", pages: [] },
);

const filteredPages = computed(() => {
  if (!currentBook.value || !currentBook.value.pages) return [];
  return currentBook.value.pages.filter((page: any) => {
    return page.text.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Tambahkan di dalam <script setup> halaman pages/index.vue kamu

const isJournalUnlocked = ref(false);
const inputJournalPin = ref("");
const journalPinError = ref(false);

// Reset kunci tiap kali user pindah memilih rak buku jurnal lain di sidebar
watch(activeBookIndex, () => {
  isJournalUnlocked.value = false;
  inputJournalPin.value = "";
  journalPinError.value = false;
});

// Fungsi cek ketikan PIN gembok jurnal (Menggunakan 6 digit angka biar ringkas)
const checkJournalPinInput = () => {
  if (inputJournalPin.value.length === 6) {
    if (inputJournalPin.value === currentBook.value.journalPin) {
      isJournalUnlocked.value = true;
      journalPinError.value = false;
    } else {
      journalPinError.value = true;
      inputJournalPin.value = ""; // hapus isi biar bisa ketik ulang
    }
  }
};

// Fungsi mengaktifkan / menonaktifkan gembok pada rak jurnal saat ini
const toggleJournalLock = async () => {
  if (currentBook.value.isLocked) {
    const confirmPin = prompt(
      "Masukkan 6-Digit PIN Jurnal saat ini untuk melepas gembok permanen:",
    );
    if (confirmPin === currentBook.value.journalPin) {
      currentBook.value.isLocked = false;
      currentBook.value.journalPin = "";
      isJournalUnlocked.value = false;
      alert(
        "🔓 Gembok dilepas! Jurnal ini sekarang berstatus umum dan bisa diakses langsung.",
      );
      await saveToFirebase(); // cadangkan perubahan status ke Cloud Firestore
    } else if (confirmPin !== null) {
      alert("❌ PIN Salah! Gagal membuka gembok.");
    }
  } else {
    const newPin = prompt(
      "Buat 6-Digit PIN Angka Baru untuk mengamankan resep/taktik rahasia di jurnal ini:",
    );
    if (newPin === null) return;

    if (!newPin || newPin.length !== 6 || isNaN(Number(newPin))) {
      alert(
        "⚠️ Gagal mengunci! PIN wajib berupa 6 digit angka baku (Contoh: 123456).",
      );
      return;
    }

    currentBook.value.isLocked = true;
    currentBook.value.journalPin = newPin;
    isJournalUnlocked.value = true;
    alert(
      `🔐 Sukses! Jurnal "${currentBook.value.title}" sekarang aman terbungkus enkripsi sandi.`,
    );
    await saveToFirebase();
  }
};

// =========================================================================
// 1. STATE REAKTIF UNTUK RESET PIN GEMBOK JURNAL (Letakkan di bagian atas bersama ref lainnya)
// =========================================================================
const showJournalResetModal = ref(false);
const resetJournalPassword = ref("");
const resetNewJournalPin = ref("");
const isJournalResetLoading = ref(false);
const resetJournalErrorMsg = ref("");

// =========================================================================
// 2. LOGIKA UTAMA RESET PIN GEMBOK JURNAL (Letakkan di atas atau di bawah fungsi toggleJournalLock)
// =========================================================================
const handleResetJournalPinWithPassword = async () => {
  // Reset pesan error setiap kali tombol ditekan
  resetJournalErrorMsg.value = "";

  // Validasi input awal lokal
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

  // Aktifkan status loading pada tombol modal
  isJournalResetLoading.value = true;

  try {
    // 1. Buat kredensial autentikasi menggunakan email user aktif dan password yang diinput
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      resetJournalPassword.value,
    );

    // 2. Lakukan re-autentikasi ke Firebase Auth untuk memastikan ini benar-benar pemilik akun
    await reauthenticateWithCredential($fbAuth.currentUser!, credential);

    // 3. Jika lolos verifikasi password, perbarui PIN pada rak jurnal yang sedang aktif saat ini
    currentBook.value.journalPin = resetNewJournalPin.value;
    currentBook.value.isLocked = true;

    // 4. Langsung berikan izin akses masuk agar gembok merah terbuka otomatis
    isJournalUnlocked.value = true;

    // 5. Cadangkan perubahan struktur data baru ke Cloud Firestore via fungsi otomatis kamu
    await saveToFirebase();

    // Beri umpan balik sukses ke pengguna
    alert(
      `🎉 Sukses! PIN Gembok untuk jurnal "${currentBook.value.title}" berhasil di-reset.`,
    );

    // Tutup jendela modal dan bersihkan form ketikan
    closeJournalResetModal();
  } catch (error: any) {
    console.error("Gagal melakukan reset PIN Jurnal:", error);

    // Tangani pesan error spesifik dari Firebase
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      resetJournalErrorMsg.value = "Password salah! Akses verifikasi ditolak.";
    } else if (error.code === "auth/too-many-requests") {
      resetJournalErrorMsg.value =
        "Terlalu banyak percobaan salah. Silakan coba beberapa saat lagi.";
    } else {
      resetJournalErrorMsg.value =
        "Terjadi kesalahan sistem saat memverifikasi akun.";
    }
  } finally {
    // Matikan efek loading tombol
    isJournalResetLoading.value = false;
  }
};

// Fungsi pembantu untuk menutup modal dan membersihkan sisa teks inputan
const closeJournalResetModal = () => {
  showJournalResetModal.value = false;
  resetJournalPassword.value = "";
  resetNewJournalPin.value = "";
  resetJournalErrorMsg.value = "";
};

const currentPage = computed(
  () => filteredPages.value[currentPageIndex.value] || {},
);

// Auto-lock instan menyala kembali saat berpindah koordinat halaman/buku
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
        const confirmPin = prompt(
          "Masukkan PIN saat ini untuk konfirmasi pelepasan kunci:",
        );
        if (confirmPin === currentPage.value.pin) {
          currentPage.value.isLocked = false;
          currentPage.value.pin = "";
          isCurrentPageUnlocked.value = false;
          alert(
            "🔒 Proteksi PIN telah dilepas. Halaman kembali berstatus umum!",
          );
          await saveToFirebase();
        } else if (confirmPin !== null) {
          alert("❌ PIN Salah! Gagal melepas proteksi.");
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
    const newPin = prompt(
      "Buat 6-Digit PIN angka baru untuk mengunci halaman rahasia ini:",
    );
    if (newPin === null) return;

    if (!newPin || newPin.length !== 6 || isNaN(Number(newPin))) {
      alert(
        "⚠️ Gagal mengunci! PIN wajib berupa 6 digit nomor angka baku (Contoh: 123456).",
      );
      return;
    }

    currentPage.value.isLocked = true;
    currentPage.value.pin = newPin;
    isCurrentPageUnlocked.value = true;
    alert("🔐 Sukses! Lembaran ini terkunci aman dengan 6 digit PIN di Cloud.");
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

const createNewBook = async () => {
  if (!newBookTitle.value.trim()) return;
  notebooks.value.push({
    id: generateId(),
    title: newBookTitle.value,
    pages: [],
  });
  activeBookIndex.value = notebooks.value.length - 1;
  currentPageIndex.value = 0;
  newBookTitle.value = "";
  searchQuery.value = "";
  await saveToFirebase();
};

const selectBook = (i: number) => {
  activeBookIndex.value = i;
  currentPageIndex.value = 0;
  isWritingMode.value = false;
  searchQuery.value = "";
};

const deleteBook = async (i: number) => {
  notebooks.value.splice(i, 1);
  if (activeBookIndex.value >= notebooks.value.length) {
    activeBookIndex.value = Math.max(0, notebooks.value.length - 1);
  }
  currentPageIndex.value = 0;
  searchQuery.value = "";
  await saveToFirebase();
};

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
