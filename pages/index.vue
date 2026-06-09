<template>
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
              class="flex-1 px-4 py-3 border rounded-2xl text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/30"
              @keyup.enter="createNewBook"
            />
            <button
              @click="createNewBook"
              :class="currentThemeClasses.btnGradient"
              class="hover:brightness-110 hover:scale-[1.03] active:scale-95 transition-all px-5 rounded-2xl font-black text-current shadow-md text-xl bg-gradient-to-br flex items-center justify-center shrink-0"
            >
              +
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
                  {{
                    book.isLocked
                      ? "🔒"
                      : notebooks[activeBookIndex]?.id === book.id
                        ? "📖"
                        : "📔"
                  }}
                </span>
                <!-- Mode Edit Inline -->
                <input
                  v-if="editingBookId === book.id"
                  v-model="editingBookTitle"
                  @click.stop
                  @keyup.enter="saveBookTitle(book)"
                  @keyup.esc="cancelEdit"
                  class="w-full bg-white/20 dark:bg-slate-950/40 border-2 border-indigo-500/50 rounded-xl px-3 py-1.5 text-sm outline-none text-current font-bold transition-all shadow-inner backdrop-blur-xs"
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

                <!-- GRUP TOMBOL UTAMA (Selalu Tampil Tanpa Perlu Hover) -->
                <div class="flex items-center gap-1">
                  <!-- Tombol Edit / Simpan -->
                  <button
                    v-if="editingBookId === book.id"
                    @click.stop="saveBookTitle(book)"
                    class="p-2 rounded-xl border border-transparent transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    title="Simpan Nama"
                  >
                    <Icon
                      icon="solar:check-circle-bold-duotone"
                      class="w-6 h-6"
                    />
                  </button>
                  <button
                    v-else
                    @click.stop="startEditBook(book)"
                    class="p-2 rounded-xl border border-transparent transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    title="Ubah Nama"
                  >
                    <Icon icon="solar:pen-2-bold-duotone" class="w-6 h-6" />
                  </button>

                  <!-- Tombol Hapus (Dibuat Berwarna Merah Tegas) -->
                  <button
                    @click.stop="deleteBook(book)"
                    class="p-2 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    title="Hapus Jurnal"
                  >
                    <Icon icon="solar:close-square-linear" class="w-6 h-6" />
                  </button>
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
                    class="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-current/5"
                  >
                    <div
                      v-if="currentPage.mood"
                      class="flex flex-wrap items-center gap-2"
                    >
                      <span
                        :class="[
                          currentThemeClasses.badge,
                          currentThemeClasses.border,
                        ]"
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border shadow-sm"
                      >
                        <span>{{ currentPage.mood }}</span>
                        <span>Suasana Hati</span>
                      </span>
                      <span
                        v-if="currentPage.createdAt"
                        class="text-[10px] md:text-[11px] opacity-40 font-medium"
                        :class="
                          currentTheme === 'dark'
                            ? 'text-slate-400'
                            : 'text-slate-600'
                        "
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

                    <button
                      @click="startEditPage"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 hover:bg-current/5 shadow-3xs"
                      :class="
                        currentTheme === 'dark'
                          ? 'border-slate-800 text-slate-300'
                          : 'border-amber-200/80 text-slate-700 bg-white/60'
                      "
                    >
                      <Icon
                        icon="solar:pen-to-square-bold-duotone"
                        class="w-3.5 h-3.5 text-orange-500"
                      />
                      <span>Edit Lembar</span>
                    </button>
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
import { uploadStore } from "@/stores/uploadStore"; // ✅ 1. KUNCI UTAMA: Import store Pinia yang terlewat
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
// FIREBASE AUTH LIFECYCLE & DATABASES (SINKRON STRUKTUR HALAMAN LANGSUNG)
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

// Memuat dokumen halaman langsung dari sub-collection 'notebooks'
const loadUserDiary = async (uid: string) => {
  try {
    console.log(
      "📂 Memulai sinkronisasi halaman langsung dari sub-collection notebooks...",
    );

    // 1. Ambil SEMUA dokumen halaman langsung dari path: user_diaries/{uid}/notebooks
    const notebooksSubRef = collection($fbDb, "user_diaries", uid, "notebooks");
    const qPages = query(notebooksSubRef, orderBy("createdAt", "asc"));
    const querySnapshotPages = await getDocs(qPages);

    const allDbPages: any[] = [];
    querySnapshotPages.forEach((subDoc) => {
      allDbPages.push({
        id: subDoc.id,
        ...subDoc.data(),
      });
    });

    // 2. Ambil metadata rak/struktur buku dari dokumen induk
    const docRef = doc($fbDb, "user_diaries", uid);
    const docSnap = await getDoc(docRef);

    let baseBooks: any[] = [];
    if (docSnap.exists() && docSnap.data().notebooks) {
      baseBooks = docSnap.data().notebooks;
    } else {
      // Fallback buku jika kosong
      baseBooks = [
        {
          id: "book_default",
          title: "Jurnal Utama Saya",
          isLocked: false,
          journalPin: "",
          pages: [],
        },
      ];
    }

    // 3. Kelompokkan halaman langsung berdasarkan bookId masing-masing
    notebooks.value = baseBooks.map((book: any, index: number) => {
      return {
        ...book,
        pages: allDbPages.filter((page: any) => {
          return (
            page.bookId === book.id ||
            (index === 0 && (!page.bookId || page.bookId === "book_default"))
          );
        }),
      };
    });

    console.log(
      "📊 [Sukses] Semua halaman berhasil ditarik dan dikelompokkan ke dalam jurnal!",
    );
  } catch (e) {
    console.error("❌ Gagal memuat lembaran dari cloud: ", e);
  }
};

const saveToFirebase = async () => {
  if (!currentUser.value) return;
  try {
    const uid = currentUser.value.uid;

    // Simpan susunan metadata struktur buku saja ke dalam field dokumen induk user_diaries/{uid}
    const userDocRef = doc($fbDb, "user_diaries", uid);

    const booksMetadataOnly = notebooks.value.map((book: any) => {
      const { pages, ...metadata } = book;
      return metadata;
    });

    await setDoc(userDocRef, { notebooks: booksMetadataOnly }, { merge: true });
    console.log("🔥 Struktur rak buku berhasil dicadangkan ke dokumen utama!");
  } catch (e) {
    console.error("Gagal mencadangkan metadata rak buku: ", e);
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
  if (!currentUser.value || !currentPage.value.id) return;
  const pageDocRef = doc(
    $fbDb,
    "user_diaries",
    currentUser.value.uid,
    "notebooks",
    currentPage.value.id,
  );

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

          await updateDoc(pageDocRef, { isLocked: false, pin: "" });
          alert("🔒 Proteksi PIN telah dilepas.");
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

    await updateDoc(pageDocRef, { isLocked: true, pin: newPin });
    alert("🔐 Sukses terkunci aman!");
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

    const pageDocRef = doc(
      $fbDb,
      "user_diaries",
      currentUser.value.uid,
      "notebooks",
      currentPage.value.id,
    );
    currentPage.value.pin = resetNewPin.value;
    currentPage.value.isLocked = true;
    isCurrentPageUnlocked.value = true;

    await updateDoc(pageDocRef, { isLocked: true, pin: resetNewPin.value });
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
// MANAJEMEN TULIS & HALAMAN CATATAN (DIPERBARUI KE SUB-COLLECTION)
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

// MENAMBAH HALAMAN BARU LANGSUNG KE SUB-COLLECTION
const savePage = async () => {
  if (!newText.value.trim() || !currentUser.value) return;

  if (!currentBook.value.pages) currentBook.value.pages = [];

  const newPageData = {
    bookId: currentBook.value.id,
    text: newText.value,
    image: imagePreview.value,
    createdAt: Date.now(),
    mood: selectedMood.value,
    isLocked: false,
    pin: "",
  };

  try {
    const notebooksSubRef = collection(
      $fbDb,
      "user_diaries",
      currentUser.value.uid,
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
  } catch (e) {
    console.error("Gagal menambahkan halaman baru ke sub-collection:", e);
    alert("Gagal mencadangkan lembar baru ke cloud.");
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

// =========================================================================
// INTEGRASI TEMA & MANAJEMEN AKSI SIDEBAR
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
    itemInactive: "bg-sky-50/30 border-pink-100 text-sky-900 hover:bg-white",
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
  if (!currentUser.value) return;

  const originalIndex = notebooks.value.findIndex(
    (b: any) => b.id === clickedBook.id,
  );

  if (originalIndex === -1) return;

  if (
    !confirm(
      `Hapus jurnal "${clickedBook.title}" beserta seluruh isinya secara permanen?`,
    )
  ) {
    return;
  }

  const uid = currentUser.value.uid;
  const bookId = clickedBook.id;

  try {
    console.log(`Memulai proses penghapusan jurnal: ${bookId}`);

    // Hapus semua halaman yang terikat dengan bookId dari sub-collection notebooks
    const pagesToDelete = notebooks.value[originalIndex].pages || [];
    for (const p of pagesToDelete) {
      if (p.id) {
        const pageDocRef = doc($fbDb, "user_diaries", uid, "notebooks", p.id);
        await deleteDoc(pageDocRef);
      }
    }
    console.log("Semua lembar halaman di cloud berhasil dibersihkan.");

    // Sinkronisasi mutasi lokal array
    notebooks.value.splice(originalIndex, 1);

    if (notebooks.value.length === 0) {
      activeBookIndex.value = 0;
    } else if (activeBookIndex.value >= notebooks.value.length) {
      activeBookIndex.value = notebooks.value.length - 1;
    }

    currentPageIndex.value = 0;
    await saveToFirebase();

    alert("✨ Jurnal dan seluruh isinya berhasil dihapus!");
  } catch (e) {
    console.error("Gagal menghapus jurnal dari cloud:", e);
    alert("Terjadi kesalahan saat mencoba menghapus jurnal dari cloud.");
  }
};

const showAllNotebooks = ref(false);

const displayedNotebooks = computed(() => {
  if (searchQuery.value) {
    return filteredNotebooks.value;
  }
  if (showAllNotebooks.value) {
    return filteredNotebooks.value;
  }
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

const saveBookTitle = async (book: any) => {
  const cleanTitle = editingBookTitle.value.trim();

  if (!cleanTitle || cleanTitle === book.title) {
    cancelEdit();
    return;
  }

  const user = $fbAuth.currentUser;
  if (!user) {
    alert("Sesi Anda telah habis. Silakan login kembali.");
    return;
  }

  try {
    const updatedNotebooks = notebooks.value.map((item: any) => {
      if (item.id === book.id) {
        return { ...item, title: cleanTitle };
      }
      return item;
    });

    notebooks.value = updatedNotebooks;
    await saveToFirebase();
    book.title = cleanTitle;

    console.log("Judul jurnal di database user_diaries berhasil diperbarui.");
  } catch (error) {
    console.error("Gagal memperbarui judul di Firestore:", error);
    alert("Gagal menyimpan perubahan ke cloud.");
  } finally {
    cancelEdit();
  }
};

// =========================================================================
// STATE & MANAJEMEN BUFFER EDIT HALAMAN CATATAN
// =========================================================================
const isEditingPage = ref(false);
const editTextBuffer = ref("");
const editMoodBuffer = ref("");
const editImageBuffer = ref<string | null>(null);

const removeEditImage = () => {
  editImageBuffer.value = null;
};

const startEditPage = () => {
  const page = currentPage.value;

  if (!page || !page.id) {
    alert("Maaf, lembaran halaman tidak valid atau tidak memiliki ID resmi.");
    return;
  }

  editTextBuffer.value = page.text || "";
  editMoodBuffer.value = page.mood || "😊";
  editImageBuffer.value = page.image || null;

  isEditingPage.value = true;
  console.log("✏️ Membuka mode edit untuk dokumen halaman ID:", page.id);
};

const cancelEditPage = () => {
  isEditingPage.value = false;
  editTextBuffer.value = "";
  editMoodBuffer.value = "";
  editImageBuffer.value = null;
};

const saveEditPage = async () => {
  console.log("=== 🚀 START DEBUGGING SAVE EDIT PAGE ===");

  const cleanText = editTextBuffer.value.trim();
  if (!cleanText) {
    alert("Isi cerita jurnal tidak boleh kosong.");
    return;
  }

  const user = $fbAuth.currentUser;
  const targetPage = currentPage.value;

  if (!user || !targetPage || !targetPage.id) {
    alert("Sesi masuk tidak valid atau lembaran tidak ditemukan di database.");
    return;
  }

  // ✅ 2. KUNCI UTAMA: Panggil instans secara aman untuk runtime environment Nuxt
  const upStore = uploadStore();
  const rawPiniaUrl = upStore.getUrlRef;

  // 🔍 SPY LOGS - Memeriksa isi setiap penampung data sebelum diolah
  console.log(
    "📸 [DATA SPY] Nilai di Pinia (upStore.getUrlRef):",
    `"${rawPiniaUrl}"`,
  );
  console.log(
    "📸 [DATA SPY] Nilai di Local Buffer (editImageBuffer):",
    `"${editImageBuffer.value}"`,
  );
  console.log(
    "📸 [DATA SPY] Nilai Asli Gambar Lama (targetPage.image):",
    `"${targetPage.image}"`,
  );

  // 🛡️ STRATEGI FILTER BERLAPIS (Membasmi String Kosong "")
  let finalImageValue = null;

  if (rawPiniaUrl && rawPiniaUrl.trim() !== "") {
    // Jalur 1: User baru saja upload foto baru lewat komponen upload
    finalImageValue = rawPiniaUrl.trim();
    console.log("🎯 [JALUR TERPILIH] Menggunakan URL Baru dari Pinia Store.");
  } else if (editImageBuffer.value && editImageBuffer.value.trim() !== "") {
    // Jalur 2: Menggunakan link gambar yang ada di buffer lokal halaman utama
    finalImageValue = editImageBuffer.value.trim();
    console.log("🎯 [JALUR TERPILIH] Menggunakan URL dari editImageBuffer.");
  } else {
    // Jalur 3: Jika dua-duanya "" atau null, selamatkan dengan gambar lama agar tidak terhapus
    finalImageValue = targetPage.image ? targetPage.image : null;
    console.log(
      "🎯 [JALUR TERPILIH] Store & Buffer kosong. Menyelamatkan gambar asli lama.",
    );
  }

  console.log(
    "📝 [HASIL AKHIR INTERAL] Nilai finalImageValue yang akan dikirim:",
    finalImageValue,
  );
  console.log("=== 📜 SELESAI ANALISIS DATA ===");

  try {
    const pageDocRef = doc(
      $fbDb,
      "user_diaries",
      user.uid,
      "notebooks",
      targetPage.id,
    );

    console.log(
      "💾 Menulis ke Firestore path: user_diaries/" +
        user.uid +
        "/notebooks/" +
        targetPage.id,
    );

    // Eksekusi Tembak ke Firestore Cloud
    await updateDoc(pageDocRef, {
      text: cleanText,
      mood: editMoodBuffer.value,
      image: finalImageValue, // Mengirim data tersaring ketat
    });

    // Sinkronisasi komponen visual secara instan
    targetPage.text = cleanText;
    targetPage.mood = editMoodBuffer.value;
    targetPage.image = finalImageValue;

    // Sinkronisasi deep reactive array pembungkus halaman
    if (currentBook.value && currentBook.value.pages) {
      const idx = currentBook.value.pages.findIndex(
        (p: any) => p.id === targetPage.id,
      );
      if (idx !== -1) {
        currentBook.value.pages[idx].text = cleanText;
        currentBook.value.pages[idx].mood = editMoodBuffer.value;
        currentBook.value.pages[idx].image = finalImageValue;

        // Force refresh state array Vue
        currentBook.value.pages = [...currentBook.value.pages];
      }
    }

    console.log("✅ [SUKSES] Data cloud & lokal sinkron sempurna!");
    alert("✨ Lembaran cerita berhasil diperbarui!");

    // 🧼 Bersihkan Pinia Store di sini secara aman setelah transaksi sukses
    upStore.setReset();

    isEditingPage.value = false;
  } catch (error) {
    console.error(
      "❌ [ERROR FIRESTORE] Gagal memperbarui lembaran halaman:",
      error,
    );
    alert("Gagal menyimpan perubahan lembaran ke cloud.");
  }
};

// Reset otomatis jika ganti halaman lewat paginasi saat sedang mengedit
watch(
  () => currentPageIndex.value,
  () => {
    isEditingPage.value = false;
    editTextBuffer.value = "";
    editMoodBuffer.value = "";
    editImageBuffer.value = null;
  },
);
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
