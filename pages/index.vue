<template>
  <NuxtLayout name="diary">
    <template #sidebar-content>
      <!-- Jurnal Baru -->
      <div
        class="space-y-3 pt-4 border-t transition-colors duration-500"
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

      <!-- Rak Jurnal -->
      <div class="space-y-3 mt-6">
        <label
          :class="darkMode ? 'text-slate-400' : 'text-amber-800/70'"
          class="text-xs uppercase tracking-[0.25em] font-black block"
        >
          📚 Rak Jurnal
        </label>

        <!-- Kotak Pencarian Teks di Sidebar -->
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

        <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
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
            <div class="truncate font-bold flex items-center gap-2.5">
              <span>{{ activeBookIndex === i ? "📖" : "📔" }}</span>
              <span class="truncate text-sm tracking-wide">{{
                book.title
              }}</span>
            </div>
            <div class="flex items-center gap-2">
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
                class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Konten Utama Jurnal -->
    <div
      class="pl-0 md:pl-12 min-h-[500px] flex flex-col justify-between relative"
    >
      <div>
        <div
          class="flex flex-wrap items-center justify-between gap-4 border-b pb-6 mb-8"
          :class="darkMode ? 'border-slate-800/80' : 'border-amber-200/60'"
        >
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
              <h1
                class="text-2xl md:text-3xl font-black tracking-tight"
                :class="darkMode ? 'text-white' : 'text-slate-900'"
              >
                {{ currentBook.title || "Mulai Menulis" }}
              </h1>
              <p class="text-sm opacity-60 font-semibold mt-0.5">
                {{ filteredPages.length }} Lembar
                {{ searchQuery ? "Ditemukan" : "Tersimpan" }}
              </p>
            </div>
          </div>

          <!-- Navigasi Halaman & Tombol Kunci PIN -->
          <div class="flex items-center gap-3">
            <!-- Tombol Status & Manajemen Kunci PIN Per Halaman (Hanya muncul saat membaca) -->
            <button
              v-if="!isWritingMode && currentPage.text"
              @click="togglePageLock"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border transition-all active:scale-95"
              :class="
                currentPage.isLocked
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              "
            >
              <Icon
                :icon="
                  currentPage.isLocked
                    ? 'solar:shield-keyhole-bold-duotone'
                    : 'solar:key-bold-duotone'
                "
                class="w-4 h-4"
              />
              <span>{{
                currentPage.isLocked ? "Hapus PIN" : "Kunci PIN"
              }}</span>
            </button>

            <div
              class="flex items-center gap-1.5 p-1 rounded-2xl border"
              :class="
                darkMode
                  ? 'bg-slate-900/50 border-slate-800'
                  : 'bg-amber-50/80 border-amber-200'
              "
            >
              <button
                @click="prevPage"
                :disabled="
                  currentPageIndex === 0 ||
                  !filteredPages.length ||
                  isWritingMode
                "
                class="p-2 rounded-xl border disabled:opacity-20 active:scale-95 transition-all"
              >
                <Icon icon="solar:alt-arrow-left-bold" class="w-4 h-4" />
              </button>
              <span class="text-xs font-black px-2 text-center min-w-[55px]">
                {{ filteredPages.length ? currentPageIndex + 1 : 0 }} /
                {{ filteredPages.length }}
              </span>
              <button
                @click="nextPage"
                :disabled="
                  currentPageIndex >= filteredPages.length - 1 ||
                  !filteredPages.length ||
                  isWritingMode
                "
                class="p-2 rounded-xl border disabled:opacity-20 active:scale-95 transition-all"
              >
                <Icon icon="solar:alt-arrow-right-bold" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Mode Tampilan Lembaran Cerita -->
        <div v-if="!isWritingMode">
          <transition name="page-flip" mode="out-in">
            <div
              v-if="currentPage.text"
              :key="currentPageIndex"
              class="space-y-6"
            >
              <!-- KONDISI 1 - Jika Halaman Dikunci & Belum Dimasukkan PIN yang Benar -->
              <div
                v-if="currentPage.isLocked && !isCurrentPageUnlocked"
                class="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-fadeIn"
              >
                <div
                  class="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 animate-bounce"
                >
                  <Icon
                    icon="solar:lock-keyhole-bold-duotone"
                    class="w-10 h-10"
                  />
                </div>
                <div>
                  <h3
                    class="text-lg font-black"
                    :class="darkMode ? 'text-white' : 'text-slate-900'"
                  >
                    Lembaran Rahasia Terkunci
                  </h3>
                  <p class="text-xs opacity-60 max-w-xs mx-auto mt-1">
                    Masukkan 6 digit PIN kamu atau gunakan opsi reset jika lupa.
                  </p>
                </div>
                <div class="flex flex-col gap-2 items-center">
                  <input
                    v-model="inputPin"
                    type="text"
                    maxlength="6"
                    placeholder="••••••"
                    style="-webkit-text-security: disc; text-security: disc"
                    class="w-40 text-center text-xl font-black px-3 py-2.5 rounded-xl border tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
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
                    salah, silakan coba lagi!
                  </p>

                  <!-- BARU: Tombol Lupa PIN -->
                  <button
                    @click="showResetModal = true"
                    class="text-xs font-bold underline mt-3 opacity-50 hover:opacity-100 transition-opacity text-slate-500 dark:text-slate-400"
                  >
                    Lupa PIN Lembaran Ini? Reset dengan Password
                  </button>
                </div>
              </div>

              <!-- KONDISI 2 - Tampilan Halaman Normal (Terbuka atau Tidak Dikunci) -->
              <div v-else class="space-y-6">
                <!-- Tampilan Lencana Mood di Lembaran Cerita -->
                <div
                  v-if="currentPage.mood"
                  class="flex items-center gap-2 animate-fadeIn"
                >
                  <span
                    :class="
                      darkMode
                        ? 'bg-slate-900 border-slate-800 text-slate-300'
                        : 'bg-amber-100/60 border-amber-200 text-amber-900'
                    "
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border"
                  >
                    <span>{{ currentPage.mood }}</span>
                    <span>Suasana Hati</span>
                  </span>
                  <span
                    v-if="currentPage.createdAt"
                    class="text-[11px] opacity-40 font-medium"
                  >
                    •
                    {{
                      new Date(currentPage.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    }}
                  </span>
                </div>

                <p
                  :class="
                    darkMode ? 'text-slate-100' : 'text-slate-800 font-medium'
                  "
                  class="whitespace-pre-wrap text-lg md:text-xl font-serif italic text-justify leading-[35px]"
                >
                  "{{ currentPage.text }}"
                </p>

                <!-- Lampiran Foto -->
                <div
                  v-if="currentPage.image"
                  :class="
                    darkMode
                      ? 'border-slate-800 bg-slate-900/60 shadow-black/40'
                      : 'border-amber-200 bg-amber-50/40 shadow-amber-900/5'
                  "
                  class="p-3 pb-6 rounded-2xl border-2 shadow-xl inline-block transform -rotate-1 transition-transform hover:rotate-0"
                >
                  <img
                    :src="currentPage.image"
                    class="max-h-72 rounded-xl object-cover"
                    alt="Attachment"
                  />
                  <div
                    class="mt-3 text-center font-serif text-xs opacity-40 tracking-widest"
                  >
                    ✦ MEMORI TERLAMPIR ✦
                  </div>
                </div>
              </div>
            </div>

            <!-- Halaman Kosong -->
            <div
              v-else
              class="text-center py-16 flex flex-col items-center space-y-3"
            >
              <Icon
                icon="solar:pen-new-square-bold-duotone"
                :class="darkMode ? 'text-indigo-400/60' : 'text-orange-500/60'"
                class="w-16 h-16 animate-bounce"
              />
              <p class="font-serif italic text-slate-500 max-w-xs">
                {{
                  searchQuery
                    ? "Tidak ada lembaran yang cocok dengan pencarian kata kuncimu."
                    : "Lembar ini masih kosong. Siap menampung cerita seru petualanganmu hari ini."
                }}
              </p>
            </div>
          </transition>
        </div>

        <!-- Mode Input Menulis Jurnal -->
        <div v-else class="space-y-4 animate-fadeIn">
          <!-- Komponen Pemilih Mood Saat Menulis -->
          <div
            class="p-4 rounded-2xl border transition-all"
            :class="
              darkMode
                ? 'bg-slate-900/40 border-slate-800'
                : 'bg-amber-50/50 border-amber-200'
            "
          >
            <label
              class="text-[10px] font-black uppercase tracking-[0.15em] block mb-2.5 opacity-60"
            >
              Bagaimana suasana hatimu hari ini?
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="m in moodList"
                :key="m.emoji"
                type="button"
                @click="selectedMood = m.emoji"
                :class="[
                  selectedMood === m.emoji
                    ? darkMode
                      ? 'bg-indigo-600/30 border-indigo-500 scale-105 text-white'
                      : 'bg-orange-100 border-orange-400 scale-105 text-orange-900 font-bold'
                    : darkMode
                      ? 'bg-slate-950/80 border-slate-900/60 opacity-50 hover:opacity-100 text-slate-400'
                      : 'bg-white border-amber-100 opacity-60 hover:opacity-100 text-slate-700',
                ]"
                class="flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-medium transition-all duration-200"
              >
                <span>{{ m.emoji }}</span>
                <span>{{ m.label }}</span>
              </button>
            </div>
          </div>

          <textarea
            v-model="newText"
            placeholder="Tuangkan isi pikiran, rencana, atau petualangan serumu hari ini di sini..."
            :class="
              darkMode
                ? 'text-slate-100 placeholder-slate-700'
                : 'text-slate-800 placeholder-slate-400 font-medium'
            "
            class="w-full h-64 p-2 outline-none text-lg font-serif resize-none bg-transparent leading-[35px]"
          />

          <!-- Lampiran Gambar -->
          <div
            :class="
              darkMode
                ? 'bg-slate-900/40 border-slate-800'
                : 'bg-amber-50/40 border-amber-200'
            "
            class="flex items-center justify-between p-4 rounded-2xl border border-dashed"
          >
            <label
              :class="
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white border-amber-200 text-slate-700 shadow-sm'
              "
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black cursor-pointer border active:scale-95 transition-transform"
            >
              <Icon
                icon="solar:camera-add-bold-duotone"
                class="w-4 h-4 text-orange-500"
              />
              <span>{{ imagePreview ? "Ganti Foto" : "Sematkan Gambar" }}</span>
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
            </label>

            <div
              v-if="imagePreview"
              class="relative rounded-lg overflow-hidden border"
            >
              <img :src="imagePreview" class="h-12 w-20 object-cover" />
              <button
                @click="imagePreview = null"
                class="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigasi Aksi Simpan / Batal -->
      <div
        class="flex justify-end gap-3 pt-6 mt-8 border-t"
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
          class="bg-gradient-to-r px-5 py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-2 shadow-md disabled:opacity-40"
        >
          <Icon icon="solar:pen-bold-duotone" class="w-4 h-4" /> TULIS JURNAL
        </button>

        <button
          v-if="isWritingMode"
          @click="cancelWriting"
          :class="
            darkMode
              ? 'bg-slate-800 text-slate-400'
              : 'bg-amber-100 text-amber-800'
          "
          class="px-4 py-2.5 rounded-xl font-black text-xs"
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
          class="bg-gradient-to-r px-5 py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-2 shadow-md"
        >
          <Icon icon="solar:check-square-bold-duotone" class="w-4 h-4" /> SIMPAN
          LEMBARAN
        </button>
      </div>
    </div>

    <!-- BARU: MODAL DIALOG RESET PIN VIA PASSWORD ACCOUNT -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        :class="
          darkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-amber-200 text-slate-800'
        "
        class="w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4"
      >
        <div
          class="flex items-center gap-3 border-b pb-3"
          :class="darkMode ? 'border-slate-800' : 'border-amber-100'"
        >
          <div class="p-2 rounded-xl bg-orange-500/10 text-orange-500">
            <Icon icon="solar:shield-warning-bold-duotone" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-black text-base">Verifikasi Pemilik Akun</h3>
            <p class="text-[11px] opacity-60">
              Masukkan password login untuk menyetel ulang PIN lembaran ini.
            </p>
          </div>
        </div>

        <div class="space-y-3.5 text-xs">
          <!-- Email Field (Read Only) -->
          <div class="space-y-1">
            <label class="font-bold opacity-70">Email Terdaftar</label>
            <input
              :value="currentUser?.email"
              type="text"
              disabled
              class="w-full px-3 py-2 rounded-xl border bg-slate-100 dark:bg-slate-950 opacity-60 cursor-not-allowed font-medium"
            />
          </div>
          <!-- Password Field -->
          <div class="space-y-1">
            <label class="font-bold opacity-70">Password Akun Login</label>
            <input
              v-model="resetPassword"
              type="password"
              placeholder="Masukkan password akun kamu..."
              class="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:ring-1 focus:ring-orange-400 dark:focus:ring-indigo-500"
            />
          </div>
          <!-- New PIN Field -->
          <div class="space-y-1">
            <label class="font-bold opacity-70">Buat 6-Digit PIN Baru</label>
            <input
              v-model="resetNewPin"
              type="text"
              maxlength="6"
              placeholder="Contoh: 123456"
              class="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:ring-1 focus:ring-orange-400 dark:focus:ring-indigo-500 tracking-wider"
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

        <!-- Tombol Aksi Modal -->
        <div class="flex justify-end gap-2.5 pt-2 text-xs">
          <button
            @click="closeResetModal"
            :disabled="isResetLoading"
            class="px-4 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
          >
            BATAL
          </button>
          <button
            @click="handleResetPinWithPassword"
            :disabled="isResetLoading"
            class="px-4 py-2 rounded-xl font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 flex items-center gap-1.5 disabled:opacity-40 shadow-sm"
          >
            <Icon
              v-if="isResetLoading"
              icon="solar:spinner-bold"
              class="w-3.5 h-3.5 animate-spin"
            />
            <span>{{ isResetLoading ? "Memproses..." : "UPDATE PIN" }}</span>
          </button>
        </div>
      </div>
    </div>
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

// BARU: State Pengaturan Modal Reset Lupa PIN via Password
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

// Logika memfilter halaman berdasarkan kotak pencarian secara real-time
const filteredPages = computed(() => {
  if (!currentBook.value || !currentBook.value.pages) return [];
  return currentBook.value.pages.filter((page: any) => {
    return page.text.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Membaca halaman aktif dari daftar halaman yang sudah difilter
const currentPage = computed(
  () => filteredPages.value[currentPageIndex.value] || {},
);

// FIX ANTI-GABAL: Auto-lock instan menyala kembali saat berpindah koordinat halaman/buku
watch(
  [currentPageIndex, activeBookIndex],
  () => {
    isCurrentPageUnlocked.value = false;
    inputPin.value = "";
    pinError.value = false;
  },
  { immediate: true },
);

// Watcher otomatis mereset index jika user mengetik sesuatu di pencarian
watch(searchQuery, () => {
  currentPageIndex.value = 0;
});

// Logika memverifikasi input PIN otomatis saat user mengetik 6 angka
const checkPinInput = () => {
  if (inputPin.value.length === 6) {
    if (inputPin.value === currentPage.value.pin) {
      isCurrentPageUnlocked.value = true;
      pinError.value = false;
    } else {
      pinError.value = true;
      inputPin.value = ""; // Bersihkan otomatis jika salah ketik
    }
  }
};

// Logika mengaktifkan atau mematikan proteksi gembok PIN secara umum
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

// BARU: Eksekusi Reset / Update PIN dengan verifikasi Firebase Auth Password
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
    // 1. Buat kredensial login ulang dari Email & Password user yang aktif
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      resetPassword.value,
    );

    // 2. Lakukan Re-authentication ke Firebase Auth Server
    await reauthenticateWithCredential($fbAuth.currentUser!, credential);

    // 3. Jika lolos pasword benar, ganti PIN di state halaman aktif
    currentPage.value.pin = resetNewPin.value;
    currentPage.value.isLocked = true; // Pastikan statusnya tetap terkunci aman
    isCurrentPageUnlocked.value = true; // Langsung tampilkan teks halaman setelah sukses reset

    // 4. Cadangkan perubahan PIN baru ke Firestore Cloud
    await saveToFirebase();

    alert(
      "🔄 PIN Berhasil Diperbarui! Lembaran rahasia kamu kini aman dengan kombinasi PIN baru.",
    );
    closeResetModal();
  } catch (error: any) {
    console.error(error);
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      resetErrorMsg.value =
        "Password akun yang kamu masukkan salah! Akses ditolak.";
    } else {
      resetErrorMsg.value =
        "Gagal memverifikasi akun. Periksa koneksi internetmu.";
    }
  } finally {
    isResetLoading.value = false;
  }
};

// BARU: Fungsi menutup modal reset PIN dan mengosongkan form
const closeResetModal = () => {
  showResetModal.value = false;
  resetPassword.value = "";
  resetNewPin.value = "";
  resetErrorMsg.value = "";
};

// Aksi Rak Jurnal
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

// Aksi Menulis
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

// Navigasi Lembaran Buku
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
