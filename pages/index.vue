<template>
  <ConfirmationDialog ref="confirmationDialog" />
  <PinModal
    v-model="isPinModalOpen"
    :mode="pinModalMode"
    :book-title="selectedBook?.title"
    @submit="handlePinSubmit"
  />
  <NuxtLayout
    name="diary"
    @create-book="handleCreateBook"
    @update-search="(val) => (searchKeyword = val)"
  >
    <template #sidebar-content>
      <div @click.stop class="space-y-3 font-sans selection:bg-indigo-500/30">
        <!-- DAFTAR KARTU JURNAL -->
        <div
          v-for="book in displayedNotebooks"
          :key="book.id"
          @click="selectBook(book)"
          :class="[
            notebooks[activeBookIndex]?.id === book.id
              ? currentThemeClasses.btnGradient +
                ' border-transparent shadow-md ring-2 ring-white/20'
              : currentThemeClasses.navLink +
                ' hover:shadow-xs hover:-translate-y-0.5',
          ]"
          class="group rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden select-none"
        >
          <div class="p-2.5">
            <!-- BARIS UTAMA: ICON, JUDUL, HALAMAN & ACTION -->
            <div class="flex items-start gap-2.5">
              <!-- ICON KUNCI / BUKU -->
              <div class="shrink-0 pointer-events-none">
                <div
                  v-if="book.isLocked"
                  class="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-100 dark:bg-rose-900/30"
                >
                  <Icon
                    icon="solar:lock-keyhole-bold-duotone"
                    class="w-4 h-4 text-rose-500"
                  />
                </div>

                <div
                  v-else
                  class="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30"
                >
                  <Icon
                    icon="solar:notebook-bold-duotone"
                    class="w-4 h-4 text-emerald-500"
                  />
                </div>
              </div>

              <!-- JUDUL & HALAMAN -->
              <div class="flex-1 min-w-0">
                <!-- INPUT EDIT JUDUL -->
                <input
                  v-if="editingBookId === book.id"
                  v-model="editingBookTitle"
                  @click.stop
                  @keyup.enter="saveBookTitle(book)"
                  @keyup.esc="cancelEdit"
                  class="w-full border rounded-lg px-2 py-1 text-xs font-bold bg-white text-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  ref="editInputRef"
                />

                <!-- DISPLAY JUDUL -->
                <div v-else class="space-y-0.5">
                  <!-- JUDUL JURNAL -->
                  <div class="text-xs font-bold leading-tight break-words">
                    <span
                      v-if="
                        book.isExpanded ||
                        (book.title && book.title.length <= 35)
                      "
                    >
                      {{ book.title }}
                    </span>
                    <span v-else> {{ book.title?.slice(0, 35) }}... </span>
                  </div>

                  <!-- TOMBOL SELENGKAPNYA (HANYA MUNCUL JIKA TEKS PANJANG & DIKLIK KHUSUS) -->
                  <button
                    v-if="book.title && book.title.length > 35"
                    @click.stop="book.isExpanded = !book.isExpanded"
                    class="text-[10px] opacity-75 hover:opacity-100 underline font-medium block"
                  >
                    {{ book.isExpanded ? "Sembunyikan" : "Lihat Selengkapnya" }}
                  </button>

                  <!-- SUB-INFO: HALAMAN -->
                  <div
                    class="text-[10px] opacity-60 mt-1 flex items-center gap-1 font-medium pointer-events-none"
                  >
                    <Icon
                      icon="solar:document-text-bold-duotone"
                      class="w-3 h-3"
                    />
                    <span>{{ book.pages?.length || 0 }} Halaman</span>
                  </div>
                </div>
              </div>

              <!-- ACTION BUTTONS (Gaya Ringkas & Minimalis) -->
              <div class="flex items-center gap-1 shrink-0 pt-0.5">
                <template v-if="editingBookId === book.id">
                  <button
                    @click.stop="saveBookTitle(book)"
                    class="p-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    title="Simpan"
                  >
                    <Icon icon="mdi:check" class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click.stop="cancelEdit"
                    class="p-1 rounded-md bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                    title="Batal"
                  >
                    <Icon icon="mdi:close" class="w-3.5 h-3.5" />
                  </button>
                </template>

                <template v-else>
                  <button
                    type="button"
                    @click.stop.prevent="toggleJournalLock(book)"
                    class="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                    :title="book.isLocked ? 'Buka Kunci' : 'Kunci Jurnal'"
                  >
                    <Icon
                      :icon="
                        book.isLocked
                          ? 'solar:lock-keyhole-bold'
                          : 'solar:key-bold'
                      "
                      :class="
                        book.isLocked ? 'text-rose-500' : 'text-emerald-500'
                      "
                      class="w-3.5 h-3.5"
                    />
                  </button>

                  <button
                    @click.stop="startEditBook(book)"
                    class="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                    title="Edit Judul"
                  >
                    <Icon
                      icon="solar:pen-2-bold-duotone"
                      class="w-3.5 h-3.5 text-indigo-500"
                    />
                  </button>

                  <button
                    @click.stop="deleteBook(book)"
                    class="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                    title="Hapus Jurnal"
                  >
                    <Icon
                      icon="solar:trash-bin-trash-bold-duotone"
                      class="w-3.5 h-3.5 text-rose-500"
                    />
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- TAMPILAN JIKA TIDAK ADA JURNAL / TIDAK DITEMUKAN -->
        <div
          v-if="displayedNotebooks.length === 0"
          class="text-center py-6 px-3 border border-dashed rounded-2xl opacity-60 space-y-1"
        >
          <Icon
            icon="solar:notes-minimalistic-bold-duotone"
            class="w-8 h-8 mx-auto opacity-40"
          />
          <p class="text-xs font-bold">
            {{
              searchBook || searchQuery
                ? "Jurnal tidak ditemukan"
                : "Belum Ada Jurnal"
            }}
          </p>
          <p class="text-[10px]">
            {{
              searchBook || searchQuery
                ? "Coba kata kunci lain"
                : "Buat rak jurnal baru di atas"
            }}
          </p>
        </div>

        <!-- TOMBOL BUKA / SEMBUNYIKAN JURNAL -->
        <div
          v-if="filteredNotebooks.length > 5 && !(searchBook || searchQuery)"
          class="pt-1"
        >
          <button
            @click="showAllNotebooks = !showAllNotebooks"
            :class="[
              currentThemeClasses.textLabel,
              hoverThemeClasses[currentTheme] || hoverThemeClasses['cream'],
            ]"
            class="w-full py-2 text-[11px] font-bold tracking-wider uppercase border rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <span>
              {{
                showAllNotebooks
                  ? "Sembunyikan"
                  : `Lihat Semua (${filteredNotebooks.length})`
              }}
            </span>
            <span
              class="text-[9px] inline-block transition-transform duration-300"
              :class="{ 'rotate-180': showAllNotebooks }"
            >
              ▼
            </span>
          </button>
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
        v-if="!isWritingMode"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-4 border-b pb-4 mb-4 md:mb-6"
        :class="currentThemeClasses.border"
      >
        <div
          class="flex items-center gap-3.5 md:gap-4 select-none tracking-tight min-w-0"
        >
          <div
            :class="
              currentTheme === 'dark'
                ? 'text-slate-400'
                : currentThemeClasses.textLabel
            "
            class="shrink-0 transition-transform duration-500 ease-out hover:scale-110"
          >
            <Icon
              icon="solar:book-bookmark-bold-duotone"
              class="w-8 h-8 md:w-10 md:h-10 opacity-95"
            />
          </div>

          <div class="min-w-0 flex flex-col justify-center">
            <h1
              :class="[
                currentThemeClasses.fontTitle ||
                  currentThemeClasses.fontHead ||
                  'font-black',
                currentThemeClasses.textTitle ||
                  currentThemeClasses.text ||
                  (currentTheme === 'dark' ? 'text-white' : 'text-slate-900'),
              ]"
              class="text-xl md:text-2xl font-black truncate leading-tight transition-colors duration-300 mb-1"
            >
              {{ currentBook.title || "Mulai Menulis" }}
            </h1>

            <p
              :class="
                currentTheme === 'dark' ? 'text-slate-500' : 'text-current/50'
              "
              class="text-[11px] md:text-xs font-bold tracking-wide flex items-center gap-1.5"
            >
              <span>{{ filteredPages.length }} Lembar</span>
              <span class="opacity-30">•</span>
              <span class="opacity-80">{{
                searchQuery ? "Ditemukan" : "Tersimpan"
              }}</span>
            </p>
          </div>
        </div>

        <!-- <div
          v-if="currentBook.id"
          class="w-full sm:w-auto shrink-0 pt-1 sm:pt-0"
        >
          <button
            @click="toggleJournalLock"
            :class="
              currentBook.isLocked
                ? 'bg-rose-50 text-rose-600 border-rose-200/60 shadow-rose-100/50 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200/60 shadow-emerald-100/50 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
            "
            class="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl text-xs font-black border tracking-wide transition-all duration-300 active:scale-95 hover:brightness-98 shadow-xs"
          >
            <Icon
              :icon="
                currentBook.isLocked
                  ? 'solar:lock-bold'
                  : 'solar:shield-keyhole-bold'
              "
              class="w-4 h-4 transform scale-105"
              :class="{ 'animate-pulse': currentBook.isLocked }"
            />
            <span>
              {{ currentBook.isLocked ? "JURNAL TERKUNCI" : "KUNCI HALAMAN" }}
            </span>
          </button>
        </div> -->
      </div>

      <!-- Panel pencarian lanjutan dan mode fokus -->
      <div
        v-if="!isWritingMode"
        class="sticky top-0 z-30 mb-4 rounded-2xl border p-2.5 sm:p-3 shadow-sm backdrop-blur-xl"
        :class="[currentThemeClasses.border, currentTheme === 'dark' ? 'bg-slate-900/50' : 'bg-white/70']"
      >
        <div class="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div class="relative flex-1">
            <Icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <input v-model="searchQuery" type="search" placeholder="Cari isi cerita atau tag..." class="w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs outline-none" :class="currentThemeClasses.inputSearch" />
          </div>
          <div class="grid grid-cols-2 sm:flex gap-2">
            <select v-model="moodFilter" class="px-3 py-2.5 rounded-xl border text-xs outline-none" :class="currentThemeClasses.inputSearch">
              <option value="">Semua mood</option>
              <option v-for="m in moodList" :key="m.emoji" :value="m.emoji">{{ m.emoji }} {{ m.label }}</option>
            </select>
            <input v-model="dateFilter" type="date" class="px-3 py-2.5 rounded-xl border text-xs outline-none" :class="currentThemeClasses.inputSearch" />
            <button v-if="searchQuery || moodFilter || dateFilter" @click="clearAdvancedFilters" class="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Reset Filter</button>
          </div>
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
                class="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 active:scale-95 select-none"
                :class="
                  currentPage.isLocked
                    ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500 dark:text-white dark:border-transparent'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500 dark:text-white dark:border-transparent'
                "
              >
                <Icon
                  :icon="
                    currentPage.isLocked
                      ? 'solar:shield-keyhole-bold'
                      : 'solar:key-bold'
                  "
                  class="w-3.5 h-3.5 shrink-0"
                />

                <span>
                  {{ currentPage.isLocked ? "Hapus PIN" : "Kunci" }}
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
                      class="text-xs font-black flex items-center gap-2 tracking-wide select-none transition-colors duration-300"
                      :class="
                        currentTheme === 'dark'
                          ? 'text-slate-400'
                          : currentThemeClasses.textLabel
                      "
                    >
                      <span class="relative flex h-2 w-2">
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          :class="
                            currentTheme === 'dark'
                              ? 'bg-slate-500'
                              : currentThemeClasses.bgEditHover || 'bg-current'
                          "
                        ></span>
                        <span
                          class="relative inline-flex rounded-full h-2 w-2"
                          :class="
                            currentTheme === 'dark'
                              ? 'bg-slate-400'
                              : currentThemeClasses.bgEditHover || 'bg-current'
                          "
                        ></span>
                      </span>

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
                      :class="[
                        currentThemeClasses.itemInactive,
                        currentThemeClasses.border, // 👈 Mengikuti warna border tema aktif (Green/Pink/Cream)
                        currentThemeClasses.textLabel, // 👈 Mengikuti warna teks tema aktif agar lebih hidup
                        currentTheme === 'dark'
                          ? 'border-slate-700/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                          : 'hover:bg-current/5 border-opacity-60',
                      ]"
                      class="px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all active:scale-95 shadow-3xs tracking-wider"
                    >
                      BATAL
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
                          icon="solar:trash-bin-trash-bold-duotone"
                          class="w-5 h-5 transition-transform duration-300 group-hover/btnTrash:scale-110 group-hover/btnTrash:rotate-6"
                        />
                        <span class="tracking-wider">Hapus Lembar</span>
                      </button>
                    </div>
                  </div>

                  <p
                    class="whitespace-pre-wrap text-base md:text-xl font-serif italic text-justify leading-[28px] md:leading-[35px] px-0.5"
                  >
                    "{{ currentPage.text }}"
                  </p>
                  <div v-if="currentPage.tags?.length" class="flex flex-wrap gap-2">
                    <span v-for="tag in currentPage.tags" :key="tag" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">#{{ tag }}</span>
                  </div>

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
          <div ref="writingEditorRef" v-else class="space-y-3 animate-fadeIn px-0.5">
            <div class="flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5" :class="[currentThemeClasses.border, currentThemeClasses.itemInactive]">
              <div class="flex items-center gap-2 min-w-0">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" :class="currentThemeClasses.btnGradient">
                  <Icon icon="solar:pen-new-square-bold-duotone" class="w-4 h-4" />
                </span>
                <div class="min-w-0">
                  <p class="text-xs font-black truncate">Tulis di {{ currentBook.title }}</p>
                  <p class="text-[10px] opacity-50">Draft tersimpan otomatis</p>
                </div>
              </div>
              <span class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black" :class="currentThemeClasses.badge">{{ newTextWordCount }} kata</span>
            </div>
            <div
              class="p-2.5 rounded-2xl border shadow-xs transition-all duration-300"
              :class="[
                currentThemeClasses.itemInactive,
                currentThemeClasses.border,
              ]"
            >
              <label
                class="text-[10px] font-black uppercase tracking-[0.15em] block mb-2 opacity-80"
                :class="currentThemeClasses.textLabel"
              >
                Bagaimana suasana hatimu hari ini?
              </label>

              <div class="grid grid-cols-6 gap-1.5">
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
                  class="flex items-center justify-center gap-1 px-1.5 py-1.5 border rounded-xl text-xs transition-all duration-200 active:scale-95 hover:scale-[1.02]"
                >
                  <span class="text-sm filter drop-shadow-xs">{{
                    m.emoji
                  }}</span>
                  <span class="hidden lg:inline text-[10px]">{{ m.label }}</span>
                </button>
              </div>
            </div>

            <textarea
              v-model="newText"
              placeholder="Tuangkan isi pikiran, rencana, atau petualangan serumu hari ini di sini..."
              class="w-full h-36 md:h-40 p-3 outline-none text-base md:text-lg font-serif resize-y bg-transparent rounded-2xl border leading-[28px] md:leading-[32px] placeholder:text-slate-400/70"
              :class="[
                currentThemeClasses.border,
                currentTheme === 'dark'
                  ? 'text-slate-100 bg-slate-950/20'
                  : 'text-slate-800 bg-white/40 font-medium'
              ]"
            />

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3" :class="currentThemeClasses.border">
              <div class="flex-1">
                <label class="text-[10px] font-black uppercase tracking-widest opacity-60">Tag <span class="normal-case font-medium">(opsional)</span></label>
                <input v-model="newTagsInput" placeholder="Contoh: kerja, keluarga, ide" class="mt-1.5 w-full rounded-xl border px-3 py-2 text-xs outline-none" :class="currentThemeClasses.inputSearch" />
              </div>
              <div class="text-right text-[11px] opacity-60">
                <p class="font-bold">{{ newTextWordCount }} kata</p>
                <p>{{ draftStatus }}</p>
              </div>
            </div>

            <div
              class="p-3 rounded-2xl border transition-all duration-300 w-full"
              :class="[
                currentThemeClasses.itemInactive,
                currentThemeClasses.border,
              ]"
            >
              <uploadImage
                typefolder="user_diaries"
                :label="imagePreview ? 'Ganti Foto Jurnal' : 'Unggah Foto Jurnal'"
                @preview="imagePreview = $event"
                @success-upload="imagePreview = $event"
                @remove="removeNewImage"
                @upload-error="notificationStore.showError($event)"
              />
            </div>
          </div>
        </div>

        <!-- TOMBOL NAVIGASI BAWAH (Aksi Simpan / Batal / Tulis) -->
        <div
          class="sticky bottom-2 z-30 flex justify-end gap-2.5 p-3 mt-5 border rounded-2xl w-full shadow-lg backdrop-blur-xl"
          :class="[currentThemeClasses.border, currentTheme === 'dark' ? 'bg-slate-950/90' : 'bg-white/90']"
        >
          <button
            v-if="!isWritingMode && !isEditingPage"
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
            :class="[
              currentThemeClasses.itemInactive,
              currentThemeClasses.border, // 👈 Pakai border bawaan tema agar warnanya ikut berubah
              currentThemeClasses.textLabel, // 👈 Pakai warna teks tema agar green/pink-nya hidup
              currentTheme === 'dark'
                ? 'border-slate-700/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                : 'hover:bg-current/5 border-opacity-60',
            ]"
            class="w-1/2 sm:w-auto text-center justify-center px-5 py-3 sm:py-2.5 rounded-xl font-black text-xs border-4 transition-all active:scale-95 shadow-3xs tracking-wider"
          >
            BATAL
          </button>

          <button
            v-if="isWritingMode"
            @click="savePage"
            :disabled="isSavingPage || uploadStore().uploading"
            :class="currentThemeClasses.btnGradient"
            class="w-1/2 sm:w-auto justify-center px-5 py-3 sm:py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="solar:check-square-bold-duotone"
              class="w-4 h-4 transform scale-110"
            />
            {{ uploadStore().uploading ? "MENGUNGGAH..." : isSavingPage ? "MENYIMPAN..." : "SIMPAN" }}
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
const isPinModalOpen = ref(false);
const pinModalMode = ref<"create" | "delete">("create");
const selectedBook = ref<any>(null); // Penampung buku yang sedang dipilih untuk di-PIN
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
const writingEditorRef = ref<HTMLElement | null>(null);

const newBookTitle = ref("");
const newText = ref("");
const imagePreview = ref<string | null>(null);

// State Pencarian dan Pilihan Mood
const searchQuery = ref("");
const selectedMood = ref("😊");
const moodFilter = ref("");
const dateFilter = ref("");
const newTagsInput = ref("");
const draftStatus = ref("Draft siap");
const isSavingPage = ref(false);
let draftTimer: ReturnType<typeof setTimeout> | null = null;

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
      useloadingStore().setLoading(true);
      currentUser.value = user;
      await loadUserDiary(user.uid);
      useloadingStore().setLoading(false);
    } else {
      useloadingStore().setLoading(false);
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

const toggleJournalLock = (book: any) => {
  // 1. Simpan data buku yang diklik ke penampung reaktif
  selectedBook.value = book;

  // 2. Tentukan mode modal berdasarkan status lock buku saat ini
  if (book.isLocked) {
    pinModalMode.value = "delete"; // Modenya menghapus/melepas PIN
  } else {
    pinModalMode.value = "create"; // Modenya membuat PIN baru
  }

  // 3. Picu modal custom agar muncul di layar
  isPinModalOpen.value = true;
};

const handlePinSubmit = async (pinYangDiketik: string) => {
  // Ambil data buku yang tadi disimpan saat tombol sidebar diklik
  const book = selectedBook.value;
  if (!book) return;

  if (pinModalMode.value === "create") {
    // 🟢 LOGIKA: BUAT PIN BARU
    book.isLocked = true;
    book.journalPin = pinYangDiketik; // Sesuaikan dengan nama field kamu (journalPin)

    // Jika buku yang dikunci kebetulan adalah buku yang sedang aktif dibuka di layar tengah
    if (currentBook.value?.id === book.id) {
      isJournalUnlocked.value = true;
    }

    notificationStore.showSuccess(`Sukses terkunci.`);
    await saveToFirebase(); // Panggil fungsi save Firebase bawaan kamu
  } else {
    // 🔴 LOGIKA: HAPUS / LEPAS PIN
    if (pinYangDiketik === book.journalPin) {
      book.isLocked = false;
      book.journalPin = "";

      if (currentBook.value?.id === book.id) {
        isJournalUnlocked.value = false;
      }

      notificationStore.showSuccess("Gembok dilepas!");
      await saveToFirebase(); // Panggil fungsi save Firebase bawaan kamu
    } else {
      notificationStore.showError("PIN Salah!");
    }
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
    notificationStore.showSuccess(`PIN Jurnal berhasil di-reset.`);
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
        notificationStore.showSuccess("Gembok dilepas.");
      } else if (confirmPin !== null) {
        notificationStore.showError("PIN Salah!");
      }
    }
  } else {
    const newPin = prompt("Buat 6-Digit PIN angka baru:");
    if (newPin === null || newPin.length !== 6 || isNaN(Number(newPin))) return;

    currentPage.value.isLocked = true;
    currentPage.value.pin = newPin;
    isCurrentPageUnlocked.value = true;

    await updateDoc(pageDocRef, { isLocked: true, pin: newPin });
    notificationStore.showSuccess("Lembaran terkunci.");
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
    notificationStore.showSuccess("PIN Halaman Berhasil Diperbarui!");
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
const startWriting = async () => {
  const draft = import.meta.client
    ? localStorage.getItem(`diary-draft-${currentBook.value.id}`)
    : null;
  newText.value = draft || "";
  newTagsInput.value = import.meta.client
    ? localStorage.getItem(`diary-draft-tags-${currentBook.value.id}`) || ""
    : "";
  imagePreview.value = null;
  selectedMood.value = "😊";
  isWritingMode.value = true;
  await nextTick();
  writingEditorRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const cancelWriting = () => {
  isWritingMode.value = false;
};

const removeNewImage = () => {
  imagePreview.value = null;
  uploadStore().setReset();
  notificationStore.showSuccess("Gambar dihapus dari lembaran.");
};

const newTextWordCount = computed(() =>
  newText.value.trim() ? newText.value.trim().split(/\s+/).length : 0,
);

watch([newText, newTagsInput, selectedMood], () => {
  if (!import.meta.client || !isWritingMode.value || !currentBook.value.id) return;
  draftStatus.value = "Menyimpan draft...";
  if (draftTimer) clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    localStorage.setItem(`diary-draft-${currentBook.value.id}`, newText.value);
    localStorage.setItem(`diary-draft-tags-${currentBook.value.id}`, newTagsInput.value);
    draftStatus.value = "Draft tersimpan otomatis";
  }, 500);
});

const normalizeTags = (value: string) =>
  [...new Set(value.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 8);

const clearAdvancedFilters = () => {
  searchQuery.value = "";
  moodFilter.value = "";
  dateFilter.value = "";
};

// ✅ BARU: Menulis lembaran teks catatan langsung ke sub-collection notebooks milik jurnal terpilih
const savePage = async () => {
  const upStore = uploadStore();
  if (upStore.uploading) {
    return notificationStore.showError("Tunggu sampai gambar selesai diunggah.");
  }
  if (isSavingPage.value) return;
  const rawPiniaUrl = upStore.getUrlRef;

  if (!newText.value || !newText.value.trim()) {
    return notificationStore.showError("Lembaran kosong tidak dapat disimpan.");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah Lembaran",
    "Anda yakin ingin menambahkan Lembaran baru?",
  );

  if (!confirmed) {
    return notificationStore.showError("Penambahan Lembaran dibatalkan");
  }

  if (!newText.value.trim() || !currentUser.value || !currentBook.value.id)
    return;

  if (!currentBook.value.pages) currentBook.value.pages = [];

  let finalImageValue = null;

  if (rawPiniaUrl && rawPiniaUrl.trim() !== "") {
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
    finalImageValue = imagePreview.value.trim();
  } else {
    finalImageValue = null;
    console.log("🎯 [SAVE-PAGE] Catatan dibuat tanpa gambar (null).");
  }

  const newPageData = {
    text: newText.value,
    image: finalImageValue,
    createdAt: Date.now(),
    mood: selectedMood.value,
    tags: normalizeTags(newTagsInput.value),
    isLocked: false,
    pin: "",
  };

  try {
    isSavingPage.value = true;
    useloadingStore().setLoading(true);
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
    newTagsInput.value = "";
    if (import.meta.client) {
      localStorage.removeItem(`diary-draft-${currentBook.value.id}`);
      localStorage.removeItem(`diary-draft-tags-${currentBook.value.id}`);
    }
    imagePreview.value = null;
    isWritingMode.value = false;
    searchQuery.value = "";

    console.log("📝 Sukses menulis cerita baru ke sub-collection notebooks!");

    upStore.setReset();
    useloadingStore().setLoading(false);
    notificationStore.showSuccess("Lembaran jurnal berhasil disimpan.");
  } catch (e) {
    useloadingStore().setLoading(false);
    console.error("❌ Gagal menyimpan notebook baru:", e);
    notificationStore.showError("Gagal mencadangkan lembar baru.");
  } finally {
    isSavingPage.value = false;
    useloadingStore().setLoading(false);
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

const hoverThemeClasses: Record<string, string> = {
  dark: "hover:bg-indigo-500/10 text-indigo-400",
  cream: "hover:bg-orange-500/10 dark:hover:bg-orange-500/5",
  pink: "hover:bg-pink-500/10 dark:hover:bg-pink-500/5",
  blue: "hover:bg-sky-500/10 dark:hover:bg-sky-500/5",
  green: "hover:bg-emerald-500/10 dark:hover:bg-emerald-500/5",
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

// const searchBook = ref("");
const searchPage = ref("");
const filteredNotebooks = computed(() => {
  const listBuku = Array.isArray(notebooks.value)
    ? notebooks.value.filter((book: any) => !book.deletedAt)
    : [];

  if (!searchBook.value.trim()) {
    return listBuku;
  }

  return listBuku.filter((book: any) =>
    book.title.toLowerCase().includes(searchBook.value.toLowerCase()),
  );
});

const filteredPages = computed(() => {
  if (!currentBook.value || !currentBook.value.pages) {
    return [];
  }

  return currentBook.value.pages.filter((page: any) => {
    if (page.deletedAt) return false;
    const keyword = searchQuery.value.trim().toLowerCase();
    const searchable = `${page.text || ""} ${(page.tags || []).join(" ")}`.toLowerCase();
    const matchesKeyword = !keyword || searchable.includes(keyword);
    const matchesMood = !moodFilter.value || page.mood === moodFilter.value;
    const matchesDate = !dateFilter.value || new Date(page.createdAt).toISOString().slice(0, 10) === dateFilter.value;
    return matchesKeyword && matchesMood && matchesDate;
  });
});

watch(searchQuery, () => {
  currentPageIndex.value = 0;
});

const currentThemeClasses = computed(
  () => themeStyles[currentTheme.value] || themeStyles["cream"],
);
provide("currentThemeClasses", currentThemeClasses);

// ✅ BARU: Menambah dokumen Jurnal ke sub-collection /jurnals
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
    console.log("🎨 Jurnal baru berhasil dibentuk di Cloud sub-collection!");
  } catch (e) {
    useloadingStore().setLoading(false);
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
    "Jurnal akan dipindahkan ke tempat sampah dan dapat dipulihkan.",
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan dibatalkan");
  }
  if (!currentUser.value) return;
  const originalIndex = notebooks.value.findIndex(
    (b: any) => b.id === clickedBook.id,
  );
  if (originalIndex === -1) return;

  const uid = currentUser.value.uid;
  const bookId = clickedBook.id;

  try {
    useloadingStore().setLoading(true);
    // Soft-delete agar jurnal dapat dipulihkan dari tempat sampah.
    const journalDocRef = doc($fbDb, "user_diaries", uid, "jurnals", bookId);
    const deletedAt = Date.now();
    await updateDoc(journalDocRef, { deletedAt });
    notebooks.value[originalIndex].deletedAt = deletedAt;
    activeBookIndex.value =
      notebooks.value.length === 0
        ? 0
        : Math.min(activeBookIndex.value, notebooks.value.length - 1);
    currentPageIndex.value = 0;

    notificationStore.showSuccess("Jurnal dipindahkan ke tempat sampah.");
    useloadingStore().setLoading(false);
  } catch (e) {
    useloadingStore().setLoading(false);
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
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Ubah Judul",
    "Anda yakin ingin mengubah judul jurnal ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Pengubahan judul dibatalkan");
  }
  const cleanTitle = editingBookTitle.value.trim();
  if (!cleanTitle || cleanTitle === book.title) {
    cancelEdit();
    return;
  }

  const user = $fbAuth.currentUser;
  if (!user) return;

  try {
    useloadingStore().setLoading(true);
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
    useloadingStore().setLoading(false);
    console.log("Judul jurnal sukses diperbarui di sub-collection jurnals.");
  } catch (error) {
    useloadingStore().setLoading(false);
    console.error(error);
  } finally {
    useloadingStore().setLoading(false);
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
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Ubah Cerita",
    "Anda yakin ingin mengubah cerita ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Pengubahan cerita dibatalkan");
  }
  console.log("=== 🚀 START DEBUGGING SAVE EDIT PAGE ===");

  const cleanText = editTextBuffer.value.trim();
  if (!cleanText) {
    notificationStore.showError("Isi cerita jurnal tidak boleh kosong.");
    return;
  }

  const user = $fbAuth.currentUser;
  const targetPage = currentPage.value;

  if (!user || !targetPage || !targetPage.id || !currentBook.value.id) {
    notificationStore.showError(
      "Sesi masuk tidak valid atau lembaran tidak ditemukan di database.",
    );
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
    useloadingStore().setLoading(true);
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
    useloadingStore().setLoading(false);
    notificationStore.showSuccess("Lembaran cerita berhasil diperbarui!");

    isImageDeleted.value = false; // 🧼 Reset penanda hapus setelah sukses
    upStore.setReset(); // Bersihkan sisa indikasi upload di Pinia
    isEditingPage.value = false;
  } catch (error) {
    useloadingStore().setLoading(false);
    console.error(error);
    notificationStore.showError("Gagal menyimpan perubahan.");
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
    "Halaman akan dipindahkan ke tempat sampah dan dapat dipulihkan.",
  );

  if (!isConfirmed) return;

  console.log(`Memulai proses penghapusan notebook dengan ID: ${noteId}`);

  console.log(
    `Target path: /user_diaries/${user?.uid || userId.value}/jurnals/${currentBook.value.id}/notebooks/${noteId}`,
  );

  try {
    useloadingStore().setLoading(true);
    const docRef = doc(
      $fbDb,
      "user_diaries",
      user?.uid || userId.value,
      "jurnals",
      currentBook.value.id,
      "notebooks",
      noteId,
    );

    const deletedAt = Date.now();
    await updateDoc(docRef, { deletedAt });
    const target = currentBook.value.pages.find((page: any) => page.id === noteId);
    if (target) target.deletedAt = deletedAt;
    currentPageIndex.value = Math.max(0, currentPageIndex.value - 1);
    useloadingStore().setLoading(false);
    notificationStore.showSuccess("Lembaran dipindahkan ke tempat sampah.");
  } catch (error) {
    useloadingStore().setLoading(false);
    console.error("Waduh, gagal menghapus data dari Firestore:", error);
  }
}

const searchKeyword = ref("");

// 2. Fungsi Tambah Jurnal Baru
const handleCreateBook = (title) => {
  if (!title.trim()) return;
  journals.value.push({
    id: Date.now(),
    title: title,
  });
};

// 1. Hubungkan ke data jurnal yang sama dengan Layout
const journals = useState("journalsList", () => [
  // Data awal / dummy (jika ada)
  { id: 1, title: "Catatan Harian" },
  { id: 2, title: "Rencana Masa Depan" },
]);

// 2. Hubungkan ke kata kunci pencarian dari Layout
const searchBook = useState("searchBook", () => "");

// 3. Logika Filter Pencarian
const filteredJournals = computed(() => {
  if (!searchBook.value.trim()) {
    return journals.value;
  }
  return journals.value.filter((journal) =>
    journal.title.toLowerCase().includes(searchBook.value.toLowerCase().trim()),
  );
});
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

/* 1. Efek Hover dinamis mengikuti tema untuk Light Mode */
.custom-hover-theme:hover {
  background-color: var(
    --hover-bg,
    rgba(241, 245, 249, 0.6)
  ); /* Fallback slate-100 */
}

/* 2. Efek Hover dinamis mengikuti tema untuk Dark Mode */
.dark .custom-hover-theme:hover {
  background-color: var(
    --hover-bg-dark,
    rgba(15, 23, 42, 0.6)
  ); /* Fallback slate-900/60 */
}

/* Styling Scrollbar kustom */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
