<template>
  <ConfirmationDialog ref="confirmationDialog" />
  <NuxtLayout name="diary">
    <template #sidebar-content>
      <div class="space-y-6 px-1 py-2 font-sans selection:bg-indigo-500/30">
        <!-- SECTION: JURNAL BARU -->
        <div
          class="space-y-3 pt-4 border-t border-dashed transition-colors duration-500"
          :class="currentThemeClasses.borderDashed"
        >
          <label
            :class="currentThemeClasses.textLabel"
            class="text-xs uppercase tracking-[0.25em] font-black block flex items-center gap-1.5 opacity-80"
          >
            <Icon
              icon="solar:folder-add-bold-duotone"
              class="w-4 h-4 text-indigo-500"
            />
            Jurnal Baru
          </label>
          <div class="flex gap-2">
            <input
              v-model="newBookTitle"
              placeholder="Nama rak jurnal..."
              :class="currentThemeClasses.input || currentThemeClasses.navLink"
              class="flex-1 h-10 px-3 border rounded-xl text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/30"
              @keyup.enter="createNewBook"
            />

            <button
              @click="createNewBook"
              :class="currentThemeClasses.btnGradient"
              class="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
              title="Tambah Jurnal Baru"
            >
              <Icon icon="iconamoon:sign-plus-fill" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Pembatas Line Premium -->
        <div
          class="my-6 border-t border-dashed opacity-30"
          :class="currentThemeClasses.borderDashed"
        ></div>

        <!-- SECTION: RAK JURNAL -->
        <div class="space-y-4">
          <label
            :class="currentThemeClasses.textLabel"
            class="text-xs uppercase tracking-[0.25em] font-black block flex items-center gap-1.5 opacity-80"
          >
            <Icon
              icon="solar:bookmark-opened-bold-duotone"
              class="w-4 h-4 text-rose-500"
            />
            Rak Jurnal
          </label>

          <!-- Fitur Pencarian -->
          <div class="relative mb-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari cerita lama..."
              :class="currentThemeClasses.input || currentThemeClasses.navLink"
              class="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/20"
            />
            <Icon
              icon="solar:magnifer-bold"
              :class="currentThemeClasses.iconPrimary"
              class="w-4 h-4 absolute left-3.5 top-3.5 opacity-60"
            />
          </div>

          <!-- LIST CONTAINER -->
          <div
            class="space-y-3 max-h-60 md:max-h-72 overflow-y-auto pr-1 custom-scrollbar"
          >
            <div
              v-for="(book, i) in displayedNotebooks"
              :key="book.id"
              @click="selectBook(book)"
              :class="
                notebooks[activeBookIndex]?.id === book.id
                  ? currentThemeClasses.btnGradient +
                    ' border-transparent shadow-md ring-1 ring-white/10'
                  : currentThemeClasses.navLink +
                    ' hover:border-slate-400/40 dark:hover:border-slate-700/50'
              "
              class="group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden bg-gradient-to-br"
            >
              <!-- Indikator Glow Samping (Hanya Muncul saat Aktif) -->
              <div
                v-if="notebooks[activeBookIndex]?.id === book.id"
                class="absolute left-0 top-0 bottom-0 w-1.5 bg-white shadow-[2px_0_8px_rgba(255,255,255,0.7)]"
              />

              <!-- Kiri: Judul / Input Inline Edit -->
              <div
                class="truncate font-bold flex items-center gap-3 flex-1 min-w-0 z-10"
              >
                <span
                  class="text-xl filter drop-shadow-xs shrink-0 select-none"
                >
                  <div
                    v-if="book.isLocked"
                    class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                    :class="
                      currentTheme === 'dark'
                        ? 'bg-rose-950 border-rose-500'
                        : 'bg-white border-rose-200'
                    "
                  >
                    <Icon
                      icon="solar:lock-keyhole-minimalistic-bold-duotone"
                      class="w-4.5 h-4.5 text-rose-600 dark:text-rose-400"
                    />
                  </div>

                  <div
                    v-else-if="notebooks[activeBookIndex]?.id === book.id"
                    class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-xs transition-transform duration-300 scale-105"
                    :class="
                      currentTheme === 'dark'
                        ? 'bg-slate-900 border-indigo-500'
                        : 'bg-white border-indigo-200'
                    "
                  >
                    <Icon
                      icon="solar:notebook-bookmark-bold-duotone"
                      class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                    />
                  </div>

                  <div
                    v-else
                    class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                    :class="
                      currentTheme === 'dark'
                        ? 'bg-slate-900 border-emerald-600'
                        : 'bg-white border-emerald-200'
                    "
                  >
                    <Icon
                      icon="solar:notebook-bold-duotone"
                      class="w-5 h-5 text-emerald-500 dark:text-emerald-400"
                    />
                  </div>
                </span>
                <!-- Mode Edit Inline -->
                <input
                  v-if="editingBookId === book.id"
                  v-model="editingBookTitle"
                  @click.stop
                  @keyup.enter="saveBookTitle(book)"
                  @keyup.esc="cancelEdit"
                  class="w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-sm outline-none text-slate-800 font-bold transition-all shadow-sm"
                  ref="editInputRef"
                />
                <!-- Mode Teks Biasa -->
                <span v-else class="truncate text-sm tracking-wide">
                  {{ book.title }}
                </span>
              </div>

              <!-- Kanan: Badge Halaman & Aksi (Dibuat Selalu Kelihatan & Berwarna Kontras) -->
              <div class="flex items-center gap-2 shrink-0 z-10 pl-2">
                <!-- Jumlah Halaman -->
                <span
                  v-if="editingBookId !== book.id"
                  class="px-2.5 py-1 rounded-xl text-[15px] font-black font-mono shadow-3xs"
                >
                  {{ book?.pages?.length || 0 }}
                </span>

                <div class="flex items-center gap-1">
                  <template v-if="editingBookId === book.id">
                    <button
                      @click.stop="saveBookTitle(book)"
                      class="group p-1.5 rounded-lg bg-white border border-slate-100 shadow-3xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                      title="Simpan Nama"
                    >
                      <Icon
                        icon="mdi:check-outline"
                        class="w-4 h-4 text-emerald-600 dark:text-emerald-500"
                      />
                    </button>

                    <button
                      @click.stop="cancelEdit"
                      class="group p-1.5 rounded-lg bg-white border border-slate-100 shadow-3xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                      title="Batal Edit"
                    >
                      <Icon
                        icon="mdi:cancel-bold"
                        class="w-4 h-4 text-rose-500 hover:text-rose-600 transition-colors"
                      />
                    </button>
                  </template>

                  <template v-else>
                    <button
                      @click.stop="startEditBook(book)"
                      class="group p-1.5 rounded-lg bg-white border border-slate-100 shadow-3xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                      title="Ubah Nama"
                    >
                      <Icon
                        icon="solar:pen-2-bold-duotone"
                        class="w-4 h-4 text-indigo-600 dark:text-indigo-500"
                      />
                    </button>

                    <button
                      @click.stop="deleteBook(book)"
                      class="group p-1.5 rounded-lg bg-white border border-slate-100 shadow-3xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                      title="Hapus Jurnal"
                    >
                      <Icon
                        icon="solar:trash-bin-trash-bold-duotone"
                        class="w-4 h-4 text-rose-600 dark:text-rose-500"
                      />
                    </button>
                  </template>
                </div>
              </div>
            </div>

            <!-- State Kosong -->
            <div
              v-if="filteredNotebooks.length === 0"
              class="text-center py-6 text-xs opacity-40 italic flex flex-col items-center gap-1"
            >
              <Icon
                icon="solar:ghost-bold-duotone"
                class="w-6 h-6 opacity-60 text-slate-400"
              />
              <span>Jurnal tidak ditemukan</span>
            </div>
          </div>

          <!-- MENU INTERAKTIF: BUKA / SEMBUNYIKAN JURNAL -->
          <div v-if="filteredNotebooks.length > 5 && !searchQuery" class="pt-1">
            <button
              @click="showAllNotebooks = !showAllNotebooks"
              :class="currentThemeClasses.textLabel"
              class="w-full py-2.5 text-xs font-bold tracking-wider uppercase border border-dashed rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-all flex items-center justify-center gap-1.5"
            >
              <span>
                {{
                  showAllNotebooks
                    ? "Sembunyikan Jurnal"
                    : `Lihat Semua Jurnal (${filteredNotebooks.length})`
                }}
              </span>
              <span
                class="text-[10px] inline-block transition-transform duration-300"
                :class="{ 'rotate-180': showAllNotebooks }"
              >
                ▼
              </span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- AREA UTAMA: KERTAS ISI DIARY -->
    <div class="h-[72px] md:hidden"></div>
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
                class="flex items-center gap-1 p-1 rounded-2xl border-2 ml-auto backdrop-blur-md transition-colors duration-300"
                :class="[
                  currentThemeClasses.border,
                  currentTheme === 'dark' ? 'bg-slate-900/50' : 'bg-white/60',
                ]"
              >
                <button
                  @click="prevPage"
                  :disabled="currentPageIndex === 0 || !filteredPages.length"
                  class="group p-1.5 rounded-xl border-2 disabled:opacity-20 active:scale-95 transition-all duration-200"
                  :class="[
                    currentThemeClasses.border,
                    currentThemeClasses.itemInactive,
                    currentThemeClasses.borderEditHover, // Menggunakan warna hover border sesuai tema yang sudah kita buat
                    currentThemeClasses.bgEditHover, // Tombol menyala penuh sesuai tema saat di-hover!
                  ]"
                >
                  <Icon
                    icon="solar:alt-arrow-left-bold"
                    class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5 text-current"
                  />
                </button>

                <span
                  class="text-xs font-black px-2 text-center min-w-[50px] tracking-wider"
                  :class="
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  "
                >
                  {{ filteredPages.length ? currentPageIndex + 1 : 0
                  }}<span class="opacity-40mx-0.5">/</span
                  >{{ filteredPages.length }}
                </span>

                <button
                  @click="nextPage"
                  :disabled="
                    currentPageIndex >= filteredPages.length - 1 ||
                    !filteredPages.length
                  "
                  class="group p-1.5 rounded-xl border-2 disabled:opacity-20 active:scale-95 transition-all duration-200"
                  :class="[
                    currentThemeClasses.border,
                    currentThemeClasses.itemInactive,
                    currentThemeClasses.borderEditHover,
                    currentThemeClasses.bgEditHover,
                  ]"
                >
                  <Icon
                    icon="solar:alt-arrow-right-bold"
                    class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-current"
                  />
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
                      :class="
                        currentTheme === 'dark'
                          ? 'text-white'
                          : 'text-slate-900'
                      "
                    >
                      Lembaran Rahasia Terkunci
                    </h3>
                    <p
                      class="text-xs opacity-60 max-w-xs mx-auto mt-1 px-4 text-slate-500 dark:text-slate-400"
                    >
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
                          : currentTheme === 'dark'
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

                <div v-else-if="isEditingPage" class="space-y-5 animate-fadeIn">
                  <div
                    class="flex items-center justify-between border-b pb-3 border-current/5"
                  >
                    <span
                      class="text-xs font-bold text-orange-500 flex items-center gap-1.5"
                    >
                      <span
                        class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"
                      />
                      Sedang Memperbaiki Tulisan...
                    </span>
                  </div>

                  <div
                    class="p-4 rounded-2xl border transition-all duration-300"
                    :class="[
                      currentThemeClasses.itemInactive,
                      currentThemeClasses.border,
                    ]"
                  >
                    <label
                      class="text-[10px] font-black uppercase tracking-[0.15em] block mb-2.5 opacity-70"
                      :class="currentThemeClasses.textLabel"
                    >
                      Ubah Suasana Hatimu untuk lembar ini:
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="m in moodList"
                        :key="m.emoji"
                        type="button"
                        @click="editMoodBuffer = m.emoji"
                        :class="
                          editMoodBuffer === m.emoji
                            ? currentThemeClasses.btnGradient +
                              ' text-white font-black shadow-xs ring-2 ring-offset-2 ring-indigo-500/20'
                            : currentTheme === 'dark'
                              ? 'bg-slate-950/40 text-slate-400 border-slate-800/80'
                              : 'bg-white text-slate-700 border-slate-200/60'
                        "
                        class="flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs transition-all duration-200 active:scale-95"
                      >
                        <span class="text-sm">{{ m.emoji }}</span>
                        <span class="text-[11px]">{{ m.label }}</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    v-model="editTextBuffer"
                    class="w-full h-56 md:h-64 p-3 border rounded-2xl outline-none text-base md:text-lg font-serif resize-none leading-[30px] md:leading-[35px]"
                    :class="
                      currentTheme === 'dark'
                        ? 'bg-slate-950/60 border-slate-800 text-slate-100 placeholder-slate-700'
                        : 'bg-white border-amber-200 text-slate-800 placeholder-slate-400 font-medium'
                    "
                    placeholder="Perbaiki kalimat typo atau tambah ceritamu di sini..."
                  />

                  <div
                    class="p-4 rounded-2xl border transition-all duration-300"
                    :class="[
                      currentThemeClasses.itemInactive,
                      currentThemeClasses.border,
                    ]"
                  >
                    <label
                      class="text-[10px] font-black uppercase tracking-[0.15em] block mb-2.5 opacity-70"
                      :class="currentThemeClasses.textLabel"
                    >
                      Foto Lembaran Jurnal:
                    </label>

                    <div
                      v-if="editImageBuffer"
                      class="relative group w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-current/10"
                    >
                      <img
                        :src="editImageBuffer"
                        class="w-full h-full object-cover"
                        alt="Foto Jurnal"
                      />
                      <button
                        type="button"
                        @click="removeEditImage"
                        class="absolute top-2 right-2 px-2 py-1 bg-red-500/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold active:scale-95 shadow-sm transition-all"
                      >
                        ✕ Hapus Foto
                      </button>
                    </div>

                    <div v-else>
                      <uploadImage
                        label="Pilih Foto Jurnal Baru"
                        typefolder="user_diaries"
                        @success-upload="
                          (url) => {
                            editImageBuffer = url;
                          }
                        "
                      />
                    </div>
                  </div>

                  <div class="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      @click="cancelEditPage"
                      class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95"
                      :class="
                        currentTheme === 'dark'
                          ? 'border-slate-800 text-slate-400 hover:text-slate-300'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      "
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      @click="saveEditPage"
                      class="px-4 py-2 text-white text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 border border-transparent"
                      :class="currentThemeClasses.btnGradient"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>

                <div v-else class="space-y-4 md:space-y-6 animate-fadeIn">
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 pb-4 border-b border-dashed border-current/10"
                  >
                    <div
                      v-if="currentPage.mood"
                      class="flex items-center flex-wrap gap-2.5 min-w-0"
                    >
                      <span
                        :class="[
                          currentThemeClasses.badge,
                          currentThemeClasses.border,
                        ]"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-black border shadow-3xs transition-transform duration-300 hover:scale-105 select-none"
                      >
                        <span
                          class="text-xs md:text-sm transform scale-110 active:animate-ping"
                          >{{ currentPage.mood }}</span
                        >
                        <span class="tracking-wide opacity-90"
                          >Suasana Hatimu</span
                        >
                      </span>

                      <span
                        v-if="currentPage.createdAt"
                        class="text-[10px] md:text-xs font-bold tracking-wide flex items-center gap-1.5"
                        :class="
                          currentTheme === 'dark'
                            ? 'text-slate-500'
                            : 'text-slate-400'
                        "
                      >
                        <span class="opacity-50">•</span>
                        <Icon
                          icon="solar:calendar-date-linear"
                          class="w-3.5 h-3.5 opacity-70"
                        />
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

                    <div
                      class="flex items-center gap-2 sm:self-center self-end w-full sm:w-auto justify-end"
                    >
                      <button
                        @click="startEditPage"
                        class="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2 backdrop-blur-md shadow-3xs transition-all duration-300 active:scale-95 hover:shadow-sm hover:-translate-y-0.5"
                        :class="[
                          currentThemeClasses.border,
                          currentThemeClasses.borderEditHover,
                          currentThemeClasses.bgEditHover,
                          currentTheme === 'dark'
                            ? 'bg-slate-900/60'
                            : 'bg-white/80',
                        ]"
                      >
                        <Icon
                          icon="solar:pen-new-square-bold-duotone"
                          class="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                        />
                        <span class="tracking-wider">Edit Lembar</span>
                      </button>

                      <button
                        @click="deleteNotebook(currentPage.id!)"
                        class="p-2 rounded-xl border border-transparent text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:border-rose-900/30 transition-all duration-200 active:scale-90 group/btnTrash relative"
                        title="Hapus Halaman"
                      >
                        <Icon
                          icon="solar:trash-bin-trash-bold-duotone"
                          class="w-5 h-5 transition-transform duration-300 group-hover/btnTrash:scale-110 group-hover/btnTrash:rotate-6"
                        />
                      </button>
                    </div>
                  </div>

                  <p
                    class="whitespace-pre-wrap text-base md:text-xl font-serif italic text-justify leading-[28px] md:leading-[35px] px-0.5"
                  >
                    "{{ currentPage.text }}"
                  </p>

                  <div
                    v-if="currentPage.image"
                    :class="[
                      currentThemeClasses.border,
                      currentTheme === 'dark'
                        ? 'bg-slate-900/60'
                        : 'bg-amber-50/40',
                    ]"
                    class="p-2 pb-4 rounded-xl border-2 shadow-md max-w-full sm:max-w-md inline-block transform -rotate-1 transition-transform hover:rotate-0"
                  >
                    <img
                      :src="currentPage.image"
                      class="max-h-52 md:max-h-72 w-full rounded-lg object-cover"
                      alt="Attachment"
                    />
                    <div
                      class="mt-2.5 text-center font-serif text-[10px] opacity-40 tracking-widest"
                      :class="
                        currentTheme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      "
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
          <div v-else class="space-y-5 animate-fadeIn px-0.5">
            <div
              class="p-4 rounded-2xl border shadow-xs transition-all duration-300"
              :class="[
                currentThemeClasses.itemInactive,
                currentThemeClasses.border,
              ]"
            >
              <label
                class="text-[10px] font-black uppercase tracking-[0.15em] block mb-3 opacity-80"
                :class="currentThemeClasses.textLabel"
              >
                Bagaimana suasana hatimu hari ini?
              </label>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="m in moodList"
                  :key="m.emoji"
                  type="button"
                  @click="selectedMood = m.emoji"
                  :class="
                    selectedMood === m.emoji
                      ? currentThemeClasses.btnGradient +
                        ' text-white font-black shadow-sm ring-2 ring-offset-2 ring-indigo-500/20'
                      : currentTheme === 'dark'
                        ? 'bg-slate-950/40 text-slate-300 border-slate-800/80'
                        : 'bg-white/80 text-slate-700 border-current/10'
                  "
                  class="flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs transition-all duration-200 active:scale-95 hover:scale-[1.02]"
                >
                  <span class="text-sm filter drop-shadow-xs">{{
                    m.emoji
                  }}</span>
                  <span class="text-[11px]">{{ m.label }}</span>
                </button>
              </div>
            </div>

            <textarea
              v-model="newText"
              placeholder="Tuangkan isi pikiran, rencana, atau petualangan serumu hari ini di sini..."
              class="w-full h-56 md:h-64 p-2 outline-none text-base md:text-lg font-serif resize-none bg-transparent leading-[32px] md:leading-[38px] placeholder:text-slate-400/70"
              :class="
                currentTheme === 'dark'
                  ? 'text-slate-100'
                  : 'text-slate-800 font-medium'
              "
            />

            <div
              class="flex flex-row items-center justify-between p-3 rounded-2xl border border-dashed gap-4 shadow-xs transition-all duration-300"
              :class="[
                currentThemeClasses.itemInactive,
                currentThemeClasses.border,
              ]"
            >
              <label
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer border active:scale-95 transition-all hover:brightness-95 shadow-3xs"
              >
                <Icon
                  icon="solar:camera-add-bold-duotone"
                  class="w-4 h-4"
                  :class="currentThemeClasses.icon"
                />
                <span>{{ imagePreview ? "Ganti Foto" : "Unggah Foto" }}</span>
                <!-- <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                /> -->
                <uploadImage typefolder="user_diaries" />
              </label>

              <div
                v-if="imagePreview"
                class="relative rounded-xl overflow-hidden border shrink-0 shadow-md group transition-all"
                :class="currentThemeClasses.border"
              >
                <img :src="imagePreview" class="h-11 w-18 object-cover" />
                <button
                  @click="imagePreview = null"
                  class="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
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
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";
import { uploadStore } from "@/stores/uploadStore";
const notificationStore = useNotificationStore();
const confirmationDialog = ref<any>(null);
// Di dalam index.vue kamu:
import { provide } from "vue";

// Pastikan dua baris ini ada setelah reactive state tema kamu didefinisikan:

import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";

// Integrasi Utilitas & Firebase
const { darkMode } = useDiaryTheme();
const { $fbAuth, $fbDb } = useNuxtApp();
const router = useRouter();

const currentUser = ref<any>(null);

// =========================================================================
// STATE UTAMA
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

// State Pengaturan Modal Reset Lupa PIN via Password
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

const generateId = () =>
  "book_" + Date.now() + Math.random().toString(36).slice(2, 8);

// =========================================================================
// FIREBASE AUTH LIFECYCLE & LOAD DATA (STRUKTUR TINGKAT BARU)
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

// ✅ BARU: Memuat data bertingkat dari sub-collection jurnals -> notebooks
const loadUserDiary = async (uid: string) => {
  try {
    console.log("📂 Sinkronisasi data bertingkat dari cloud...");

    // 1. Ambil semua daftar Jurnal (Rak Buku) terlebih dahulu
    const journalsRef = collection($fbDb, "user_diaries", uid, "jurnals");
    const journalSnapshot = await getDocs(journalsRef);

    let baseBooks: any[] = [];

    if (!journalSnapshot.empty) {
      journalSnapshot.forEach((jDoc) => {
        baseBooks.push({
          id: jDoc.id,
          ...jDoc.data(),
          pages: [], // Siapkan wadah halaman lokal
        });
      });
    } else {
      // Pembuatan awal jika database user masih kosong baru mendaftar
      const defaultId = "book_default";
      const defaultJournalRef = doc(
        $fbDb,
        "user_diaries",
        uid,
        "jurnals",
        defaultId,
      );
      const defaultData = {
        title: "Jurnal Utama Saya",
        isLocked: false,
        journalPin: "",
        createdAt: Date.now(),
      };
      await setDoc(defaultJournalRef, defaultData);
      baseBooks.push({ id: defaultId, ...defaultData, pages: [] });
    }

    // 2. Tarik lembaran 'notebooks' untuk masing-masing Jurnal yang ada
    for (let book of baseBooks) {
      const pagesRef = collection(
        $fbDb,
        "user_diaries",
        uid,
        "jurnals",
        book.id,
        "notebooks",
      );
      const qPages = query(pagesRef, orderBy("createdAt", "asc"));
      const pagesSnapshot = await getDocs(qPages);

      const pagesData: any[] = [];
      pagesSnapshot.forEach((pDoc) => {
        pagesData.push({
          id: pDoc.id,
          ...pDoc.data(),
        });
      });
      book.pages = pagesData;
    }

    notebooks.value = baseBooks;
    console.log("📊 [Sukses] Semua sub-collection terkelompok sempurna!");
  } catch (e) {
    console.error("❌ Gagal memuat lembaran bertingkat: ", e);
  }
};

// ✅ BARU: Menyimpan susunan metadata Jurnal (Rak)
const saveToFirebase = async () => {
  if (!currentUser.value) return;
  try {
    const uid = currentUser.value.uid;
    // Mengamankan data ke /user_diaries/{uid}/jurnals/{idjurnal}
    for (const book of notebooks.value) {
      const journalDocRef = doc($fbDb, "user_diaries", uid, "jurnals", book.id);
      await setDoc(
        journalDocRef,
        {
          title: book.title,
          isLocked: book.isLocked,
          journalPin: book.journalPin,
          createdAt: book.createdAt || Date.now(),
        },
        { merge: true },
      );
    }
    console.log("🔥 Metadata jurnals berhasil dicadangkan.");
  } catch (e) {
    console.error("Gagal mencadangkan jurnal: ", e);
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
    const confirmPin = prompt("Masukkan 6-Digit PIN Jurnal saat ini:");
    if (confirmPin === currentBook.value.journalPin) {
      currentBook.value.isLocked = false;
      currentBook.value.journalPin = "";
      isJournalUnlocked.value = false;
      alert("🔓 Gembok dilepas!");
      await saveToFirebase();
    } else if (confirmPin !== null) {
      alert("❌ PIN Salah!");
    }
  } else {
    const newPin = prompt("Buat 6-Digit PIN Angka Baru:");
    if (newPin === null) return;
    if (!newPin || newPin.length !== 6 || isNaN(Number(newPin))) {
      alert("⚠️ PIN wajib berupa 6 digit angka.");
      return;
    }
    currentBook.value.isLocked = true;
    currentBook.value.journalPin = newPin;
    isJournalUnlocked.value = true;
    alert(`🔐 Sukses terkunci.`);
    await saveToFirebase();
  }
};

const handleResetJournalPinWithPassword = async () => {
  resetJournalErrorMsg.value = "";
  if (!resetJournalPassword.value || !resetNewJournalPin.value) return;
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
    alert(`🎉 PIN Jurnal berhasil di-reset.`);
    closeJournalResetModal();
  } catch (error: any) {
    resetJournalErrorMsg.value = "Akses verifikasi ditolak.";
  } finally {
    isJournalResetLoading.value = false;
  }
};

const closeJournalResetModal = () => {
  showJournalResetModal.value = false;
  resetJournalPassword.value = "";
  resetNewJournalPin.value = "";
};

// =========================================================================
// LOGIKA PROTEKSI GEMBOK HALAMAN CATATAN (NOTEBOOKS)
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
  if (!currentUser.value || !currentPage.value.id || !currentBook.value.id)
    return;

  // ✅ TARGET PATH SUB-COLLECTION BARU
  const pageDocRef = doc(
    $fbDb,
    "user_diaries",
    currentUser.value.uid,
    "jurnals",
    currentBook.value.id,
    "notebooks",
    currentPage.value.id,
  );

  if (currentPage.value.isLocked) {
    if (isCurrentPageUnlocked.value) {
      const confirmPin = prompt("Masukkan PIN saat ini untuk melepas gembok:");
      if (confirmPin === currentPage.value.pin) {
        currentPage.value.isLocked = false;
        currentPage.value.pin = "";
        isCurrentPageUnlocked.value = false;
        await updateDoc(pageDocRef, { isLocked: false, pin: "" });
        alert("🔒 Gembok dilepas.");
      } else if (confirmPin !== null) {
        alert("❌ PIN Salah!");
      }
    }
  } else {
    const newPin = prompt("Buat 6-Digit PIN angka baru:");
    if (newPin === null || newPin.length !== 6 || isNaN(Number(newPin))) return;

    currentPage.value.isLocked = true;
    currentPage.value.pin = newPin;
    isCurrentPageUnlocked.value = true;

    await updateDoc(pageDocRef, { isLocked: true, pin: newPin });
    alert("🔐 Lembaran terkunci.");
  }
};

const handleResetPinWithPassword = async () => {
  if (!resetPassword.value || !resetNewPin.value) return;
  isResetLoading.value = true;
  try {
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      resetPassword.value,
    );
    await reauthenticateWithCredential($fbAuth.currentUser!, credential);

    const pageDocRef = doc(
      $fbDb,
      "user_diaries",
      currentUser.value.uid,
      "jurnals",
      currentBook.value.id,
      "notebooks",
      currentPage.value.id,
    );

    currentPage.value.pin = resetNewPin.value;
    currentPage.value.isLocked = true;
    isCurrentPageUnlocked.value = true;

    await updateDoc(pageDocRef, { isLocked: true, pin: resetNewPin.value });
    alert("🔄 PIN Halaman Berhasil Diperbarui!");
    closeResetModal();
  } catch (error: any) {
    resetErrorMsg.value = "Gagal memverifikasi akun.";
  } finally {
    isResetLoading.value = false;
  }
};

const closeResetModal = () => {
  showResetModal.value = false;
  resetPassword.value = "";
  resetNewPin.value = "";
};

// =========================================================================
// MANAJEMEN TULIS & SIMPAN (NOTEBOOKS BARU DI DALAM JURNAL)
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

// ✅ BARU: Menulis lembaran teks catatan langsung ke sub-collection notebooks milik jurnal terpilih
const savePage = async () => {
  if (!newText.value.trim() || !currentUser.value || !currentBook.value.id)
    return;

  if (!currentBook.value.pages) currentBook.value.pages = [];

  // ✅ 1. KUNCI AMAN: Ambil URL hasil upload dari Pinia Store
  const upStore = uploadStore();
  const rawPiniaUrl = upStore.getUrlRef;

  // 🛡️ STRATEGI FILTER BERLAPIS ANTI-NULL UNTUK NOTEBOOK BARU
  let finalImageValue = null;

  if (rawPiniaUrl && rawPiniaUrl.trim() !== "") {
    // Jalur 1: Jika user sukses upload lewat komponen Tailwind baru
    finalImageValue = rawPiniaUrl.trim();
    console.log(
      "🎯 [SAVE-PAGE] Menggunakan URL Gambar dari Pinia Store:",
      finalImageValue,
    );
  } else if (
    imagePreview.value &&
    imagePreview.value.trim() !== "" &&
    !imagePreview.value.startsWith("data:image")
  ) {
    // Jalur 2: Jika ada string URL valid non-base64 di preview
    finalImageValue = imagePreview.value.trim();
  } else {
    // Jalur 3: Jika tidak ada upload gambar, set null agar field di Firestore bersih
    finalImageValue = null;
    console.log("🎯 [SAVE-PAGE] Catatan dibuat tanpa gambar (null).");
  }

  // ✅ 2. Gunakan finalImageValue di dalam objek data
  const newPageData = {
    text: newText.value,
    image: finalImageValue, // 👈 Menggunakan URL Firebase resmi hasil filter
    createdAt: Date.now(),
    mood: selectedMood.value,
    isLocked: false,
    pin: "",
  };

  try {
    // Jalur path sasaran sub-collection: /user_diaries/{uid}/jurnals/{idjurnal}/notebooks
    const notebooksSubRef = collection(
      $fbDb,
      "user_diaries",
      currentUser.value.uid,
      "jurnals",
      currentBook.value.id,
      "notebooks",
    );

    const docRef = await addDoc(notebooksSubRef, newPageData);

    currentBook.value.pages.push({
      id: docRef.id,
      ...newPageData,
    });

    currentPageIndex.value = currentBook.value.pages.length - 1;
    newText.value = "";
    imagePreview.value = null;
    isWritingMode.value = false;
    searchQuery.value = "";

    console.log("📝 Sukses menulis cerita baru ke sub-collection notebooks!");

    // ✅ 3. BERSIHKAN STORE: Reset state upload setelah dokumen berhasil masuk Cloud
    upStore.setReset();
  } catch (e) {
    console.error("❌ Gagal menyimpan notebook baru:", e);
    alert("Gagal mencadangkan lembar baru.");
  }
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
    iconEdit: "text-indigo-400",
    borderEditHover: "hover:border-indigo-500",
    bgEditHover: "hover:bg-indigo-600 hover:text-white text-indigo-400", // 👈 Kita satukan warna teks default-nya di sini!
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
    iconEdit: "text-orange-500",
    borderEditHover: "hover:border-orange-500",
    bgEditHover:
      "hover:bg-gradient-to-tr hover:from-orange-500 hover:to-amber-500 hover:text-white text-orange-500", // 👈
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
    iconEdit: "text-pink-500",
    borderEditHover: "hover:border-pink-500",
    bgEditHover:
      "hover:bg-gradient-to-tr hover:from-pink-500 hover:to-rose-500 hover:text-white text-pink-500", // 👈
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
    itemInactive: "bg-sky-50/30 border-pink-100 text-sky-900 hover:bg-white",
    badge: "bg-sky-100 text-sky-900",
    iconEdit: "text-sky-500",
    borderEditHover: "hover:border-sky-500",
    bgEditHover:
      "hover:bg-gradient-to-tr hover:from-sky-500 hover:to-indigo-500 hover:text-white text-sky-500", // 👈
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
    iconEdit: "text-emerald-500",
    borderEditHover: "hover:border-emerald-500",
    bgEditHover:
      "hover:bg-gradient-to-tr hover:from-emerald-500 hover:to-teal-500 hover:text-white text-emerald-500", // 👈
  },
};

provide("currentTheme", currentTheme);

// COMPUTED DATA
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

const currentPage = computed(
  () => filteredPages.value[currentPageIndex.value] || {},
);

const filteredNotebooks = computed(() => {
  const listBuku = Array.isArray(notebooks.value) ? notebooks.value : [];
  if (!searchQuery.value.trim()) return listBuku;
  return listBuku.filter((book: any) =>
    book?.title?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const filteredPages = computed(() => {
  if (!currentBook.value || !currentBook.value.pages) return [];
  return currentBook.value.pages.filter((page: any) =>
    page?.text?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const currentThemeClasses = computed(
  () => themeStyles[currentTheme.value] || themeStyles["cream"],
);
provide("currentThemeClasses", currentThemeClasses);

// ✅ BARU: Menambah dokumen Jurnal ke sub-collection /jurnals
const createNewBook = async () => {
  if (!newBookTitle.value.trim() || !currentUser.value) return;

  const newId = generateId();
  const listBuku = Array.isArray(notebooks.value) ? notebooks.value : [];

  const newJournalData = {
    title: newBookTitle.value.trim(),
    createdAt: Date.now(),
    isLocked: false,
    journalPin: "",
  };

  try {
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

    console.log("🎨 Jurnal baru berhasil dibentuk di Cloud sub-collection!");
  } catch (e) {
    console.error(e);
  }
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

// ✅ BARU: Menghapus Jurnal sekaligus menyapu bersih seluruh sub-collection notebooks di dalamnya
const deleteBook = async (clickedBook: any) => {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan dibatalkan");
  }
  if (!currentUser.value) return;
  const originalIndex = notebooks.value.findIndex(
    (b: any) => b.id === clickedBook.id,
  );
  if (originalIndex === -1) return;

  if (
    !confirm(
      `Hapus jurnal "${clickedBook.title}" beserta seluruh lembaran di dalamnya?`,
    )
  )
    return;

  const uid = currentUser.value.uid;
  const bookId = clickedBook.id;

  try {
    // 1. Bersihkan semua lembar notebooks di bawah jurnal ini
    const pagesToDelete = notebooks.value[originalIndex].pages || [];
    for (const p of pagesToDelete) {
      if (p.id) {
        const pageDocRef = doc(
          $fbDb,
          "user_diaries",
          uid,
          "jurnals",
          bookId,
          "notebooks",
          p.id,
        );
        await deleteDoc(pageDocRef);
      }
    }

    // 2. Hapus dokumen induk Jurnal
    const journalDocRef = doc($fbDb, "user_diaries", uid, "jurnals", bookId);
    await deleteDoc(journalDocRef);

    notebooks.value.splice(originalIndex, 1);
    activeBookIndex.value =
      notebooks.value.length === 0
        ? 0
        : Math.min(activeBookIndex.value, notebooks.value.length - 1);
    currentPageIndex.value = 0;

    alert("✨ Jurnal berhasil dibersihkan dari cloud!");
  } catch (e) {
    console.error(e);
  }
};

const showAllNotebooks = ref(false);
const displayedNotebooks = computed(() => {
  if (searchQuery.value || showAllNotebooks.value)
    return filteredNotebooks.value;
  return filteredNotebooks.value.slice(0, 5);
});

const editingBookId = ref<string | null>(null);
const editingBookTitle = ref("");
const editInputRef = ref<HTMLInputElement | null>(null);

const startEditBook = async (book: any) => {
  editingBookId.value = book.id;
  editingBookTitle.value = book.title;
  await nextTick();
  if (editInputRef.value) editInputRef.value.focus();
};

const cancelEdit = () => {
  editingBookId.value = null;
  editingBookTitle.value = "";
};

// ✅ BARU: Menyimpan perubahan judul Jurnal di dalam sub-collection jurnals
const saveBookTitle = async (book: any) => {
  const cleanTitle = editingBookTitle.value.trim();
  if (!cleanTitle || cleanTitle === book.title) {
    cancelEdit();
    return;
  }

  const user = $fbAuth.currentUser;
  if (!user) return;

  try {
    const journalDocRef = doc(
      $fbDb,
      "user_diaries",
      user.uid,
      "jurnals",
      book.id,
    );
    await updateDoc(journalDocRef, { title: cleanTitle });

    notebooks.value = notebooks.value.map((item: any) => {
      if (item.id === book.id) return { ...item, title: cleanTitle };
      return item;
    });
    book.title = cleanTitle;
    console.log("Judul jurnal sukses diperbarui di sub-collection jurnals.");
  } catch (error) {
    console.error(error);
  } finally {
    cancelEdit();
  }
};

// =========================================================================
// STATE & MANAJEMEN EDIT HALAMAN (NOTEBOOKS VERSI SINKRON SANGAT AMAN)
// =========================================================================
const isEditingPage = ref(false);
const editTextBuffer = ref("");
const editMoodBuffer = ref("");
const editImageBuffer = ref<string | null>(null);

const isImageDeleted = ref(false); // 👈 Penanda apakah user sengaja menghapus gambar

const removeEditImage = () => {
  editImageBuffer.value = null;
  isImageDeleted.value = true; // 👈 Set true saat tombol hapus diklik user
};

const startEditPage = () => {
  const page = currentPage.value;
  if (!page || !page.id) return;

  editTextBuffer.value = page.text || "";
  editMoodBuffer.value = page.mood || "😊";
  editImageBuffer.value = page.image || null;
  isEditingPage.value = true;
};

const cancelEditPage = () => {
  isEditingPage.value = false;
  editTextBuffer.value = "";
  editMoodBuffer.value = "";
  editImageBuffer.value = null;
};

// ✅ BARU & BEBAS NULL: Menyimpan edit teks & gambar ke /jurnals/{idjurnal}/notebooks/{idcatatan}
const saveEditPage = async () => {
  console.log("=== 🚀 START DEBUGGING SAVE EDIT PAGE ===");

  const cleanText = editTextBuffer.value.trim();
  if (!cleanText) {
    alert("Isi cerita jurnal tidak boleh kosong.");
    return;
  }

  const user = $fbAuth.currentUser;
  const targetPage = currentPage.value;

  if (!user || !targetPage || !targetPage.id || !currentBook.value.id) {
    alert("Sesi masuk tidak valid atau lembaran tidak ditemukan di database.");
    return;
  }

  const upStore = uploadStore();
  const rawPiniaUrl = upStore.getUrlRef;

  // 🔍 SPY LOGS - Memeriksa isi setiap penampung data sebelum diolah
  console.log("📸 [DATA SPY] Nilai di Pinia:", `"${rawPiniaUrl}"`);
  console.log(
    "📸 [DATA SPY] Nilai di Local Buffer:",
    `"${editImageBuffer.value}"`,
  );
  console.log("📸 [DATA SPY] Nilai Asli Gambar Lama:", `"${targetPage.image}"`);

  // ==========================================
  // 👇 TARO DI SINI (TEPAT DI ATAS TRY CATCH) 👇
  // ==========================================
  // 🛡️ STRATEGI FILTER BERLAPIS ANTI-NULL (VERSI MENDUKUNG PENGHAPUSANNYA)
  let finalImageValue = null;

  if (isImageDeleted.value) {
    // Jalur Utama: Jika user sengaja menekan tombol hapus gambar, paksa database jadi null!
    finalImageValue = null;
    console.log(
      "🎯 [JALUR TERPILIH] User menghapus gambar. Set database menjadi null.",
    );
  } else if (rawPiniaUrl && rawPiniaUrl.trim() !== "") {
    // Jalur 1: User baru saja mengunggah foto baru lewat komponen upload
    finalImageValue = rawPiniaUrl.trim();
    console.log("🎯 [JALUR TERPILIH] Menggunakan URL Baru dari Pinia Store.");
  } else if (editImageBuffer.value && editImageBuffer.value.trim() !== "") {
    // Jalur 2: Menggunakan link gambar yang ada di buffer lokal
    finalImageValue = editImageBuffer.value.trim();
    console.log("🎯 [JALUR TERPILIH] Menggunakan URL dari editImageBuffer.");
  } else {
    // Jalur 3: Tidak ada aksi apa-apa, selamatkan gambar lama agar tidak hilang
    finalImageValue = targetPage.image ? targetPage.image : null;
    console.log(
      "🎯 [JALUR TERPILIH] Tidak ada perubahan gambar. Pertahankan yang lama.",
    );
  }
  // ==========================================
  // 👆 SELESAI PELETAKAN 👆
  // ==========================================

  console.log(
    "📝 [HASIL AKHIR] Nilai finalImageValue yang akan dikirim:",
    finalImageValue,
  );
  console.log("=== 📜 SELESAI ANALISIS DATA ===");

  try {
    // Jalur path baru: /user_diaries/{uid}/jurnals/{idjurnal}/notebooks/{idcatatan}
    const pageDocRef = doc(
      $fbDb,
      "user_diaries",
      user.uid,
      "jurnals",
      currentBook.value.id,
      "notebooks",
      targetPage.id,
    );

    await updateDoc(pageDocRef, {
      text: cleanText,
      mood: editMoodBuffer.value,
      image: finalImageValue, // 👈 Nilai hasil filter dikirim ke sini
    });

    // Sinkronisasi data ke state lokal Vue secara instan
    targetPage.text = cleanText;
    targetPage.mood = editMoodBuffer.value;
    targetPage.image = finalImageValue;

    if (currentBook.value && currentBook.value.pages) {
      const idx = currentBook.value.pages.findIndex(
        (p: any) => p.id === targetPage.id,
      );
      if (idx !== -1) {
        currentBook.value.pages[idx].text = cleanText;
        currentBook.value.pages[idx].mood = editMoodBuffer.value;
        currentBook.value.pages[idx].image = finalImageValue;
        currentBook.value.pages = [...currentBook.value.pages];
      }
    }

    alert("✨ Lembaran cerita berhasil diperbarui!");

    isImageDeleted.value = false; // 🧼 Reset penanda hapus setelah sukses
    upStore.setReset(); // Bersihkan sisa indikasi upload di Pinia
    isEditingPage.value = false;
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan perubahan.");
  }
};

watch(
  () => currentPageIndex.value,
  () => {
    isEditingPage.value = false;
    editTextBuffer.value = "";
    editMoodBuffer.value = "";
    editImageBuffer.value = null;
  },
);

import { useRouter } from "vue-router";

// Asumsi variabel ID yang didapat dari State/Route/Props aplikasi kamu
const userId = ref("iduser_kamu");
const jurnalId = ref("idjurnal_kamu");

/**
 * FUNCTION: Hapus Notebook dari Database Firestore
 * @param noteId - ID dari notebook yang ingin dihapus
 */
async function deleteNotebook(noteId: string) {
  // Pengecekan aman agar tidak crash kalau ref belum nempel
  const user = $fbAuth.currentUser;
  if (!confirmationDialog.value) {
    console.error(
      "Komponen ConfirmDialog belum dipasang di bagian bawah template HTML!",
    );
    return;
  }

  const isConfirmed = await confirmationDialog.value.show(
    "Hapus Lembaran Ini?",
    "Halaman akan dihapus permanen dari cloud database dan tidak bisa dikembalikan.",
  );

  if (!isConfirmed) return;

  console.log(`Memulai proses penghapusan notebook dengan ID: ${noteId}`);

  console.log(
    `Target path: /user_diaries/${user?.uid || userId.value}/jurnals/${currentBook.value.id}/notebooks/${noteId}`,
  );

  try {
    const docRef = doc(
      $fbDb,
      "user_diaries",
      user?.uid || userId.value,
      "jurnals",
      currentBook.value.id,
      "notebooks",
      noteId,
    );

    await deleteDoc(docRef);

    await loadUserDiary(user.uid);
    console.log("Database updated: Notebook berhasil dihapus!");
  } catch (error) {
    console.error("Waduh, gagal menghapus data dari Firestore:", error);
  }
}
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
