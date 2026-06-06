<template>
  <NuxtLayout name="diary">
    <div class="h-[72px] md:hidden"></div>
    <div class="space-y-8 print-container">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 no-print transition-colors duration-500"
        :class="
          currentThemeClasses.border || 'border-slate-200 dark:border-slate-800'
        "
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span
              class="flex h-2 w-2 rounded-full animate-pulse bg-current transition-colors duration-500"
              :class="currentThemeClasses.icon"
            />
            <span
              class="text-[10px] font-black uppercase tracking-widest opacity-60"
              :class="currentThemeClasses.textLabel"
            >
              Personal Workspace
            </span>
          </div>
          <h2
            class="block text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight bg-clip-text text-transparent transition-all duration-500"
            :class="currentThemeClasses.btnGradient"
          >
            Analisis Jurnal & Ekspor
          </h2>
          <p class="text-xs opacity-60 mt-1 text-slate-500 dark:text-slate-400">
            Rangkuman perjalanan menulis dan manajemen data akunmu
          </p>
        </div>

        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide border transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-xs group shrink-0"
          :class="
            currentTheme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          "
        >
          <Icon
            icon="solar:arrow-left-bold-duotone"
            class="w-4 h-4 text-orange-500 group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Kembali Menulis</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          class="p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          :class="
            currentTheme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/80 to-slate-950/40 border-slate-800/80 shadow-black/20'
              : 'bg-gradient-to-br from-white to-orange-50/10 border-slate-200/60 shadow-xs'
          "
        >
          <div class="absolute right-4 top-4 opacity-15 text-orange-500">
            <Icon icon="solar:letter-opened-bold-duotone" class="w-12 h-12" />
          </div>
          <div
            class="text-xs font-black uppercase opacity-70 tracking-wider mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Total Kata Ditulis
          </div>
          <div class="text-4xl font-black tracking-tight text-orange-500 mb-1">
            {{ totalAllWords }}
          </div>
          <p class="text-[11px] opacity-50 text-slate-500 dark:text-slate-400">
            Dari semua lembaran kisah hidupmu
          </p>
        </div>

        <div
          class="p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          :class="
            currentTheme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/80 to-slate-950/40 border-slate-800/80 shadow-black/20'
              : 'bg-gradient-to-br from-white to-indigo-50/10 border-slate-200/60 shadow-xs'
          "
        >
          <div class="absolute right-4 top-4 opacity-15 text-indigo-500">
            <Icon icon="solar:heart-bold-duotone" class="w-12 h-12" />
          </div>
          <div
            class="text-xs font-black uppercase opacity-70 tracking-wider mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Mood Paling Sering
          </div>
          <div
            class="text-4xl font-black tracking-tight text-indigo-500 mb-1 flex items-baseline gap-2"
          >
            <span>{{ dominantMood.emoji }}</span>
            <span
              class="text-sm font-black opacity-60 text-slate-500 dark:text-slate-400"
            >
              ({{ dominantMood.count }} Halaman)
            </span>
          </div>
          <p class="text-[11px] opacity-50 text-slate-500 dark:text-slate-400">
            Suasana hati yang mendominasi ceritamu
          </p>
        </div>

        <div
          class="p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          :class="
            currentTheme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/80 to-slate-950/40 border-slate-800/80 shadow-black/20'
              : 'bg-gradient-to-br from-white to-emerald-50/10 border-slate-200/60 shadow-xs'
          "
        >
          <div class="absolute right-4 top-4 opacity-15 text-emerald-500">
            <Icon icon="solar:notebook-bold-duotone" class="w-12 h-12" />
          </div>
          <div
            class="text-xs font-black uppercase opacity-70 tracking-wider mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Total Halaman Cerita
          </div>
          <div class="text-4xl font-black tracking-tight text-emerald-500 mb-1">
            {{ totalPagesCount }}
          </div>
          <p class="text-[11px] opacity-50 text-slate-500 dark:text-slate-400">
            Lembaran rahasia yang aman tersimpan
          </p>
        </div>
      </div>

      <div
        class="p-6 md:p-8 rounded-3xl border relative overflow-hidden no-print transition-all duration-500 shadow-md"
        :class="
          currentTheme === 'dark'
            ? 'bg-slate-900/40 border-slate-800/80 shadow-black/10'
            : 'bg-white border-slate-200/80 shadow-slate-200/50'
        "
      >
        <div
          class="absolute -right-16 -bottom-16 w-48 h-48 rounded-full blur-3xl opacity-10"
          :class="currentTheme === 'dark' ? 'bg-indigo-500' : 'bg-orange-400'"
        />

        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-2">
            <div
              class="p-2.5 rounded-xl text-white shadow-md transition-all duration-500"
              :class="[
                currentThemeClasses.btnGradient,
                currentTheme === 'dark'
                  ? 'shadow-indigo-950/40'
                  : 'shadow-current/10',
              ]"
            >
              <Icon icon="solar:safe-2-bold-duotone" class="w-5 h-5" />
            </div>
            <div>
              <h3
                class="text-lg font-black tracking-tight"
                :class="
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-800'
                "
              >
                Amankan & Cadangkan Data
              </h3>
              <p class="text-xs opacity-60 text-slate-500 dark:text-slate-400">
                Pindahkan tulisan berhargamu ke komputer lokal agar tidak pernah
                hilang.
              </p>
            </div>
          </div>

          <hr
            class="my-5 border-dashed"
            :class="
              currentThemeClasses.border ||
              'border-slate-200 dark:border-slate-800'
            "
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              @click="exportToTXT"
              class="w-full px-5 py-4 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 group border border-transparent"
              :class="[
                currentThemeClasses.btnGradient,
                currentTheme === 'dark'
                  ? 'shadow-indigo-950/30'
                  : 'shadow-current/10',
              ]"
            >
              <Icon
                icon="solar:download-square-bold-duotone"
                class="w-5 h-5 opacity-90 group-hover:animate-bounce"
              />
              <span>Unduh Dokumen Mentah (.TXT)</span>
            </button>

            <button
              @click="triggerPrint"
              class="w-full px-5 py-4 border text-xs font-black uppercase tracking-widest rounded-2xl shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 group"
              :class="
                currentTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              "
            >
              <Icon
                icon="solar:printer-bold-duotone"
                class="w-5 h-5 transition-colors duration-500"
                :class="currentThemeClasses.icon"
              />
              <span>Cetak Cetakan Fisik (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      <div class="hidden print-block space-y-6 mt-8 font-serif">
        <div class="border-b-2 border-slate-900 pb-4 text-center">
          <h1 class="text-2xl font-bold uppercase tracking-widest">
            Arsip Jurnal Pribadi Digital
          </h1>
          <p class="text-xs mt-1 italic">
            Dicetak pada:
            {{ new Date().toLocaleDateString("id-ID", { dateStyle: "full" }) }}
          </p>
        </div>
        <div v-for="book in notebooks" :key="book.id" class="space-y-4 pt-4">
          <h3 class="text-lg font-bold border-b pb-1 text-slate-800">
            📔 RAK: {{ book.title }}
          </h3>
          <div v-if="book.pages && book.pages.length > 0" class="space-y-4">
            <div
              v-for="(p, idx) in book.pages"
              :key="idx"
              class="p-4 border rounded-xl space-y-2 bg-slate-50/50 break-inside-avoid"
            >
              <div
                class="flex justify-between items-center text-xs text-slate-500 font-sans border-b pb-1"
              >
                <span
                  >Lembar #{{ idx + 1 }} — {{ p.mood || "😊" }} Suasana
                  Hati</span
                >
                <span>{{
                  p.createdAt
                    ? new Date(p.createdAt).toLocaleString("id-ID")
                    : ""
                }}</span>
              </div>
              <p class="text-sm leading-relaxed italic text-slate-800">
                "{{ p.text }}"
              </p>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 italic pl-4">
            (Belum ada lembaran cerita di dalam rak ini)
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";

const { darkMode } = useDiaryTheme();
const notebooks = useState("global-notebooks", () => []);

// --- TAMBAHKAN LOGIKA TEMA DI BAWAH INI AGAR TIDAK ERROR ---
const currentTheme = useState("diary-active-theme", () => "cream");

const themeStyles = {
  dark: {
    textLabel: "text-indigo-400",
    border: "border-slate-900",
    icon: "text-indigo-400",
    btnGradient: "bg-gradient-to-tr from-indigo-600 to-violet-500",
  },
  cream: {
    textLabel: "text-amber-700",
    border: "border-amber-200/60",
    icon: "text-amber-700",
    btnGradient: "bg-gradient-to-tr from-orange-500 to-amber-500",
  },
  pink: {
    textLabel: "text-pink-600",
    border: "border-pink-200/60",
    icon: "text-pink-600",
    btnGradient: "bg-gradient-to-tr from-pink-500 to-rose-500",
  },
  blue: {
    textLabel: "text-sky-600",
    border: "border-sky-200/60",
    icon: "text-sky-600",
    btnGradient: "bg-gradient-to-tr from-sky-500 to-indigo-500",
  },
  green: {
    textLabel: "text-emerald-600",
    border: "border-emerald-200/60",
    icon: "text-emerald-600",
    btnGradient: "bg-gradient-to-tr from-emerald-500 to-teal-500",
  },
};
// Computed untuk mengambil class sesuai tema aktif dengan aman
const currentThemeClasses = computed(() => {
  return themeStyles[currentTheme.value] || themeStyles["cream"];
});
// -----------------------------------------------------------

// 1. Hitung total seluruh kata di semua buku
const totalAllWords = computed(() => {
  let count = 0;
  notebooks.value.forEach((book) => {
    if (book.pages) {
      book.pages.forEach((p) => {
        if (p.text)
          count += p.text
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0).length;
      });
    }
  });
  return count;
});

// 2. Hitung total seluruh halaman
const totalPagesCount = computed(() => {
  let count = 0;
  notebooks.value.forEach((book) => {
    if (book.pages) count += book.pages.length;
  });
  return count;
});

// 3. Analisis Mood Dominan
const dominantMood = computed(() => {
  const moodCounts = {};
  let maxCount = 0;
  let maxMood = "😐";

  notebooks.value.forEach((book) => {
    if (book.pages) {
      book.pages.forEach((p) => {
        if (p.mood) {
          moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1;
          if (moodCounts[p.mood] > maxCount) {
            maxCount = moodCounts[p.mood];
            maxMood = p.mood;
          }
        }
      });
    }
  });
  return { emoji: maxMood, count: maxCount };
});

// 4. Fungsi Cetak PDF yang aman untuk arsitektur Nuxt 3 SSR
const triggerPrint = () => {
  if (process.client) {
    window.print();
  }
};

// 5. Aksi Ekspor Teks (.txt)
const exportToTXT = () => {
  let textOutput = "=== BACKUP DIARY DIGITAL RESMI ===\n\n";

  notebooks.value.forEach((book) => {
    textOutput += `BUKU JURNAL: ${book.title || "Tanpa Judul"}\n`;
    textOutput += "=========================================\n\n";

    if (book.pages && book.pages.length > 0) {
      book.pages.forEach((p, index) => {
        const date = p.createdAt
          ? new Date(p.createdAt).toLocaleString("id-ID")
          : "Tanggal tidak diketahui";
        textOutput += `Halaman #${index + 1} | Waktu: ${date} | Mood: ${p.mood || "😐"}\n`;
        textOutput += `Isi Cerita:\n${p.text}\n`;
        textOutput += "\n-----------------------------------------\n\n";
      });
    } else {
      textOutput += "(Buku ini masih kosong, belum ada lembaran cerita)\n\n";
    }
  });

  const blob = new Blob([textOutput], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Diary-Digital-Cadangan-${new Date().toISOString().slice(0, 10)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* Aturan CSS khusus saat proses pencetakan PDF berlangsung */
@media print {
  :deep(aside),
  .no-print {
    display: none !important;
  }

  :deep(main),
  .print-container {
    background: white !important;
    color: black !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  :deep(.rounded-\[32px\]) {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .print-block {
    display: block !important;
  }

  .break-inside-avoid {
    break-inside: avoid;
  }
}
</style>
