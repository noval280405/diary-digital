<template>
  <NuxtLayout name="diary">

    <!-- SIDEBAR -->
    <template #sidebar-content>

      <!-- CREATE BOOK -->
      <div class="space-y-3">
        <label class="text-xs text-slate-400 uppercase tracking-[0.2em]">
          ✦ Buku Baru
        </label>

        <div class="flex gap-2">
          <input
            v-model="newBookTitle"
            placeholder="Judul buku..."
            class="flex-1 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm 
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            @keyup.enter="createNewBook"
          />

          <button
            @click="createNewBook"
            class="bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition px-4 rounded-xl font-bold shadow-lg"
          >
            +
          </button>
        </div>
      </div>

      <!-- BOOK LIST -->
      <div class="space-y-2 mt-6">
        <label class="text-xs text-slate-500 uppercase tracking-[0.2em]">
          📚 Koleksi Buku
        </label>

        <div class="space-y-2 max-h-72 overflow-y-auto pr-1">

          <div
            v-for="(book, i) in notebooks"
            :key="book.id"
            @click="selectBook(i)"
            class="group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 border backdrop-blur"
            :class="activeBookIndex === i
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400 shadow-xl shadow-indigo-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'"
          >

            <div class="truncate font-medium">
              📔 {{ book.title }}
            </div>

            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-400">{{ book.pages.length }}</span>

              <button
                @click.stop="deleteBook(i)"
                class="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-300"
              >
                🗑
              </button>
            </div>

          </div>

        </div>
      </div>

    </template>

    <!-- MAIN -->
    <div class="w-full max-w-4xl">

      <!-- HEADER -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-black tracking-tight">
          📖 {{ currentBook.title }}
        </h1>

        <p class="text-xs text-slate-500 mt-1">
          Halaman
          <span class="text-indigo-400 font-bold">
            {{ currentPageIndex + 1 }}
          </span>
          /
          {{ currentBook.pages.length || 1 }}
        </p>
      </div>

      <!-- BOOK CARD -->
      <div
        class="relative rounded-[28px] overflow-hidden border border-slate-800 
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
        shadow-2xl shadow-black/50"
      >

        <!-- TOP BAR -->
        <div class="flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-slate-800">

          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-red-400"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span class="w-3 h-3 rounded-full bg-green-400"></span>
          </div>

          <div class="text-xs text-slate-500 tracking-widest">
            DIARY MODE
          </div>

        </div>

        <!-- CONTENT -->
        <div class="p-8 min-h-[460px] relative">

          <!-- VIEW MODE -->
          <div v-if="!isWritingMode" class="space-y-6">

            <transition name="fade">
              <div
                v-if="currentPage.text"
                class="relative p-6 rounded-2xl border border-slate-800
                bg-slate-900/40 backdrop-blur-xl shadow-xl"
              >

                <div class="absolute left-0 top-0 w-1 h-full bg-indigo-500 rounded-l-2xl"></div>

                <p class="whitespace-pre-wrap leading-loose text-slate-200 font-medium pl-2">
                  {{ currentPage.text }}
                </p>

                <img
                  v-if="currentPage.image"
                  :src="currentPage.image"
                  class="mt-5 rounded-2xl border border-slate-700 shadow-lg"
                />

              </div>

              <div v-else class="text-center text-slate-500 py-24">
                📭 Belum ada cerita di halaman ini
              </div>
            </transition>

          </div>

          <!-- WRITE MODE -->
          <div v-else class="space-y-4 animate-fadeIn">

            <textarea
              v-model="newText"
              placeholder="Tulis cerita kamu di sini..."
              class="w-full h-44 p-4 rounded-2xl bg-slate-900 border border-slate-700 
              focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200"
            />

            <input
              type="file"
              @change="handleImageUpload"
              class="text-sm text-slate-400"
            />

          </div>

        </div>

        <!-- FOOTER CONTROLS -->
        <div class="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-t border-slate-800">

          <!-- NAV -->
          <div class="flex gap-2">

            <button
              @click="prevPage"
              class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 
              active:scale-95 transition text-sm"
            >
              ⬅ Prev
            </button>

            <button
              @click="nextPage"
              class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 
              active:scale-95 transition text-sm"
            >
              Next ➡
            </button>

          </div>

          <!-- ACTION -->
          <div class="flex gap-2">

            <button
              v-if="!isWritingMode"
              @click="isWritingMode = true"
              class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 
              shadow-lg shadow-indigo-500/20 transition text-sm font-semibold"
            >
              + Tulis
            </button>

            <button
              v-else
              @click="isWritingMode = false"
              class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-sm"
            >
              Batal
            </button>

            <button
              v-if="isWritingMode"
              @click="savePage"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 
              shadow-lg shadow-emerald-500/20 transition text-sm font-semibold"
            >
              Simpan
            </button>

          </div>

        </div>

      </div>

    </div>

  </NuxtLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// definePageMeta({ layout: 'diary' })

const notebooks = ref([])
const activeBookIndex = ref(0)
const currentPageIndex = ref(0)
const isWritingMode = ref(false)

const newBookTitle = ref('')
const newText = ref('')
const imagePreview = ref(null)

const generateId = () =>
  'book_' + Date.now() + Math.random().toString(36).slice(2, 8)

/* LOAD */
onMounted(() => {
  const data = localStorage.getItem('diary_books')
  if (data) notebooks.value = JSON.parse(data)
  else {
    notebooks.value = [{
      id: generateId(),
      title: 'My First Diary',
      pages: []
    }]
  }
})

/* SAVE */
watch(notebooks, (val) => {
  localStorage.setItem('diary_books', JSON.stringify(val))
}, { deep: true })

const currentBook = computed(() =>
  notebooks.value[activeBookIndex.value] || { title: '', pages: [] }
)

const currentPage = computed(() =>
  currentBook.value.pages[currentPageIndex.value] || {}
)

/* BOOK */
const createNewBook = () => {
  if (!newBookTitle.value.trim()) return

  notebooks.value.push({
    id: generateId(),
    title: newBookTitle.value,
    pages: []
  })

  activeBookIndex.value = notebooks.value.length - 1
  currentPageIndex.value = 0
  newBookTitle.value = ''
}

const selectBook = (i) => {
  activeBookIndex.value = i
  currentPageIndex.value = 0
  isWritingMode.value = false
}

const deleteBook = (i) => {
  notebooks.value.splice(i, 1)
  if (activeBookIndex.value >= notebooks.value.length) {
    activeBookIndex.value = 0
  }
}

/* PAGE */
const savePage = () => {
  if (!newText.value.trim()) return

  currentBook.value.pages.push({
    text: newText.value,
    image: imagePreview.value
  })

  currentPageIndex.value = currentBook.value.pages.length - 1
  newText.value = ''
  imagePreview.value = null
  isWritingMode.value = false
}

/* IMAGE */
const handleImageUpload = (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()

  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
  }

  if (file) reader.readAsDataURL(file)
}

/* NAV */
const nextPage = () => {
  if (currentPageIndex.value < currentBook.value.pages.length - 1) {
    currentPageIndex.value++
  }
}

const prevPage = () => {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all .25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>