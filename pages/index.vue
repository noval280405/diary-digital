<template>
  <NuxtLayout name="diary">
    <template #sidebar-content>
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

      <div class="space-y-3 mt-6">
        <label
          :class="darkMode ? 'text-slate-400' : 'text-amber-800/70'"
          class="text-xs uppercase tracking-[0.25em] font-black block"
        >
          📚 Rak Jurnal
        </label>
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
                {{ book.pages.length }}
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
                {{ currentBook.pages.length }} Lembar Tersimpan
              </p>
            </div>
          </div>

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
                !currentBook.pages.length ||
                isWritingMode
              "
              class="p-2 rounded-xl border disabled:opacity-20 active:scale-95 transition-all"
            >
              <Icon icon="solar:alt-arrow-left-bold" class="w-4 h-4" />
            </button>
            <span class="text-xs font-black px-2 text-center min-w-[55px]">
              {{ currentBook.pages.length ? currentPageIndex + 1 : 0 }} /
              {{ currentBook.pages.length }}
            </span>
            <button
              @click="nextPage"
              :disabled="
                currentPageIndex >= currentBook.pages.length - 1 ||
                !currentBook.pages.length ||
                isWritingMode
              "
              class="p-2 rounded-xl border disabled:opacity-20 active:scale-95 transition-all"
            >
              <Icon icon="solar:alt-arrow-right-bold" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="!isWritingMode">
          <transition name="page-flip" mode="out-in">
            <div
              v-if="currentPage.text"
              :key="currentPageIndex"
              class="space-y-6"
            >
              <p
                :class="
                  darkMode ? 'text-slate-100' : 'text-slate-800 font-medium'
                "
                class="whitespace-pre-wrap text-lg md:text-xl font-serif italic text-justify leading-[35px]"
              >
                "{{ currentPage.text }}"
              </p>

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
                Lembar ini masih kosong. Siap menampung cerita seru
                petualanganmu hari ini.
              </p>
            </div>
          </transition>
        </div>

        <div v-else class="space-y-4 animate-fadeIn">
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";
// Tambahan impor untuk Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const { darkMode } = useDiaryTheme();
const { $fbAuth, $fbDb } = useNuxtApp();
const router = useRouter();

// State untuk memantau user yang sedang login
const currentUser = ref(null);

// --- SEMUA STATE ASLI KAMU (UTUH) ---
// Ganti baris const notebooks = ref([]) menjadi ini:
const notebooks = useState<any[]>('global-notebooks', () => [])
const activeBookIndex = ref(0);
const currentPageIndex = ref(0);
const isWritingMode = ref(false);

const newBookTitle = ref("");
const newText = ref("");
const imagePreview = ref(null);



const generateId = () =>
  "book_" + Date.now() + Math.random().toString(36).slice(2, 8);

// --- LOGIKA UTAMA INTEGRASI FIREBASE GRATISAN ---

// 1. Cek status login saat halaman dibuka
onMounted(() => {
  onAuthStateChanged($fbAuth, async (user) => {
    if (user) {
      currentUser.value = user;
      await loadUserDiary(user.uid); // Tarik data diary KHUSUS milik UID user ini
    } else {
      router.push("/login"); // Jika belum login, arahkan ke halaman login
    }
  });
});

// 2. Fungsi menarik data dari Cloud Firestore berdasarkan UID
const loadUserDiary = async (uid) => {
  try {
    const docRef = doc($fbDb, "user_diaries", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      notebooks.value = docSnap.data().notebooks || [];
    } else {
      // Jika user baru mendaftar, buatkan satu buku default
      notebooks.value = [
        { id: generateId(), title: "Jurnal Utama Saya", pages: [] },
      ];
      await saveToFirebase();
    }
  } catch (e) {
    console.error("Gagal memuat data dari cloud: ", e);
  }
};

// 3. Fungsi sinkronisasi / backup data otomatis ke Firebase cloud
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

// --- SEMUA FUNGSI & COMPUTED ASLI KAMU (DIKEMBALIKAN 100% + DIINTEGRASIKAN) ---

const currentBook = computed(
  () => notebooks.value[activeBookIndex.value] || { title: "", pages: [] },
);
const currentPage = computed(
  () => currentBook.value.pages[currentPageIndex.value] || {},
);

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
  await saveToFirebase(); // Simpan perubahan ke cloud
};

// Ini fungsi selectBook yang sempat hilang, sekarang sudah aktif kembali!
const selectBook = (i) => {
  activeBookIndex.value = i;
  currentPageIndex.value = 0;
  isWritingMode.value = false;
};

const deleteBook = async (i) => {
  notebooks.value.splice(i, 1);
  if (activeBookIndex.value >= notebooks.value.length) {
    activeBookIndex.value = Math.max(0, notebooks.value.length - 1);
  }
  currentPageIndex.value = 0;
  await saveToFirebase(); // Simpan perubahan ke cloud
};

const startWriting = () => {
  newText.value = "";
  imagePreview.value = null;
  isWritingMode.value = true;
};

const cancelWriting = () => {
  isWritingMode.value = false;
};

const savePage = async () => {
  if (!newText.value.trim()) return
  // Tambahkan properti createdAt: Date.now() di bawah ini
  currentBook.value.pages.push({
    text: newText.value,
    image: imagePreview.value,
    createdAt: Date.now() // <-- WAJIB TAMBAHKAN INI biar bisa difilter berdasarkan hari
  })
  currentPageIndex.value = currentBook.value.pages.length - 1
  newText.value = ""
  imagePreview.value = null
  isWritingMode.value = false
  await saveToFirebase()
}

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const nextPage = () => {
  if (currentPageIndex.value < currentBook.value.pages.length - 1)
    currentPageIndex.value++;
};
const prevPage = () => {
  if (currentPageIndex.value > 0) currentPageIndex.value--;
};

// Tambahan: Fungsi jika user ingin logout
const handleLogout = async () => {
  await signOut($fbAuth);
  router.push("/login");
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
