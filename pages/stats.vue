<template>
  <NuxtLayout name="diary">
    <div class="h-[72px] md:hidden"></div>
    <div class="space-y-5 print-container">
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

      <nav class="sticky top-0 z-30 no-print rounded-2xl border p-1.5 backdrop-blur-xl shadow-sm" :class="panelClass">
        <div class="grid grid-cols-3 gap-1">
          <button
            v-for="tab in statsTabs"
            :key="tab.id"
            @click="activeStatsTab = tab.id"
            class="flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-[11px] sm:text-xs font-black transition-all"
            :class="activeStatsTab === tab.id ? currentThemeClasses.btnGradient + ' text-white shadow-md' : 'opacity-55 hover:opacity-100'"
          >
            <Icon :icon="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </nav>

      <div v-show="activeStatsTab === 'overview'" class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        <div
          class="p-4 md:p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          :class="panelClass"
        >
          <div class="absolute right-4 top-4 opacity-15" :class="currentThemeClasses.icon">
            <Icon icon="solar:letter-opened-bold-duotone" class="w-12 h-12" />
          </div>
          <div
            class="text-xs font-black uppercase opacity-70 tracking-wider mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Total Kata Ditulis
          </div>
          <div class="text-3xl font-black tracking-tight mb-1" :class="currentThemeClasses.textLabel">
            {{ totalAllWords }}
          </div>
          <p class="text-[11px] opacity-50 text-slate-500 dark:text-slate-400">
            Dari semua lembaran kisah hidupmu
          </p>
        </div>

        <div
          class="p-4 md:p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          :class="panelClass"
        >
          <div class="absolute right-4 top-4 opacity-15" :class="currentThemeClasses.icon">
            <Icon icon="solar:heart-bold-duotone" class="w-12 h-12" />
          </div>
          <div
            class="text-xs font-black uppercase opacity-70 tracking-wider mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Mood Paling Sering
          </div>
          <div
            class="text-3xl font-black tracking-tight mb-1 flex items-baseline gap-2"
            :class="currentThemeClasses.textLabel"
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
          class="p-4 md:p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          :class="panelClass"
        >
          <div class="absolute right-4 top-4 opacity-15" :class="currentThemeClasses.icon">
            <Icon icon="solar:notebook-bold-duotone" class="w-12 h-12" />
          </div>
          <div
            class="text-xs font-black uppercase opacity-70 tracking-wider mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Total Halaman Cerita
          </div>
          <div class="text-3xl font-black tracking-tight mb-1" :class="currentThemeClasses.textLabel">
            {{ totalPagesCount }}
          </div>
          <p class="text-[11px] opacity-50 text-slate-500 dark:text-slate-400">
            Lembaran rahasia yang aman tersimpan
          </p>
        </div>
      </div>

      <!-- Productivity dashboard -->
      <div v-show="activeStatsTab === 'calendar'" class="grid grid-cols-1 xl:grid-cols-3 gap-5 no-print">
        <section class="xl:col-span-2 p-5 md:p-6 rounded-3xl border shadow-sm" :class="panelClass">
          <div class="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 class="font-black text-lg">Kalender Perjalananmu</h3>
              <p class="text-xs opacity-50">Klik tanggal untuk melihat ringkasan tulisan.</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="changeMonth(-1)" class="p-2 rounded-xl border" :class="currentThemeClasses.border"><Icon icon="solar:alt-arrow-left-bold" class="w-4 h-4" /></button>
              <span class="text-xs font-black min-w-28 text-center">{{ calendarTitle }}</span>
              <button @click="changeMonth(1)" class="p-2 rounded-xl border" :class="currentThemeClasses.border"><Icon icon="solar:alt-arrow-right-bold" class="w-4 h-4" /></button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-1.5 text-center">
            <span v-for="day in dayNames" :key="day" class="text-[10px] font-black uppercase opacity-40 py-1">{{ day }}</span>
            <button
              v-for="cell in calendarCells"
              :key="cell.key"
              @click="selectedCalendarDay = cell.dateKey"
              :disabled="!cell.day"
              class="min-h-14 rounded-xl border p-1 transition hover:-translate-y-0.5 disabled:opacity-0"
              :class="[cell.dateKey === selectedCalendarDay ? 'ring-2 ring-indigo-500' : currentThemeClasses.border, cell.entries.length ? 'bg-indigo-500/5' : '']"
            >
              <span class="block text-[10px] font-bold opacity-60">{{ cell.day }}</span>
              <span class="block text-lg leading-6">{{ cell.entries[0]?.mood || '' }}</span>
              <span v-if="cell.entries.length > 1" class="text-[9px] font-bold text-indigo-500">+{{ cell.entries.length - 1 }}</span>
            </button>
          </div>
          <div v-if="selectedDayEntries.length" class="mt-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
            <p class="text-xs font-black mb-2">{{ selectedDayEntries.length }} tulisan pada tanggal ini</p>
            <div class="space-y-2">
              <p v-for="entry in selectedDayEntries" :key="entry.id" class="text-xs opacity-70">{{ entry.mood }} {{ entry.text?.slice(0, 100) }}{{ entry.text?.length > 100 ? '…' : '' }}</p>
            </div>
          </div>
        </section>

        <div class="space-y-5">
          <section class="p-5 rounded-3xl border shadow-sm" :class="panelClass">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 rounded-2xl bg-orange-500/10 text-orange-500"><Icon icon="solar:fire-bold-duotone" class="w-6 h-6" /></div>
              <div><p class="text-2xl font-black">{{ writingStreak }} hari</p><p class="text-[11px] opacity-50">Streak menulis saat ini</p></div>
            </div>
            <div class="flex justify-between text-[11px] mb-2"><span>Target hari ini</span><b>{{ todayWordCount }} / {{ dailyGoal }} kata</b></div>
            <div class="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><div class="h-full rounded-full transition-all" :class="currentThemeClasses.btnGradient" :style="{ width: goalProgress + '%' }" /></div>
            <input v-model.number="dailyGoal" @change="savePreferences" type="number" min="50" step="50" class="mt-4 w-full px-3 py-2 rounded-xl border text-xs" :class="currentThemeClasses.border" />
          </section>

          <section class="p-5 rounded-3xl border shadow-sm" :class="panelClass">
            <h3 class="font-black text-sm mb-1">Pengingat Menulis</h3>
            <p class="text-[11px] opacity-50 mb-4">Notifikasi muncul saat aplikasi terbuka.</p>
            <div class="flex gap-2">
              <input v-model="reminderTime" type="time" class="flex-1 px-3 py-2 rounded-xl border text-xs" :class="currentThemeClasses.border" />
              <button @click="enableReminder" class="px-4 py-2 text-white text-xs font-black rounded-xl" :class="currentThemeClasses.btnGradient">{{ reminderEnabled ? 'Aktif' : 'Aktifkan' }}</button>
            </div>
          </section>
        </div>
      </div>

      <div v-show="activeStatsTab !== 'calendar'" class="grid grid-cols-1 gap-5 no-print">
        <section v-show="activeStatsTab === 'overview'" class="p-5 md:p-6 rounded-3xl border shadow-sm" :class="panelClass">
          <h3 class="font-black text-lg">Insight Mood</h3>
          <p class="text-xs opacity-50 mb-5">Distribusi suasana hati dari seluruh tulisan aktif.</p>
          <div class="space-y-3">
            <div v-for="item in moodInsights" :key="item.mood">
              <div class="flex justify-between text-xs mb-1.5"><span>{{ item.mood }} {{ moodLabel(item.mood) }}</span><b>{{ item.count }} ({{ item.percent }}%)</b></div>
              <div class="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><div class="h-full rounded-full" :class="currentThemeClasses.btnGradient" :style="{ width: item.percent + '%' }" /></div>
            </div>
            <p v-if="!moodInsights.length" class="text-xs opacity-50">Belum cukup data mood.</p>
          </div>
        </section>

        <section v-show="activeStatsTab === 'data'" class="p-5 md:p-6 rounded-3xl border shadow-sm" :class="panelClass">
          <div class="flex items-center justify-between mb-4">
            <div><h3 class="font-black text-lg">Tempat Sampah</h3><p class="text-xs opacity-50">Pulihkan data yang tidak sengaja dihapus.</p></div>
            <span class="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-black">{{ trashItems.length }}</span>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-for="item in trashItems" :key="item.key" class="flex items-center gap-3 p-3 rounded-2xl border" :class="currentThemeClasses.border">
              <Icon :icon="item.type === 'journal' ? 'solar:notebook-bold-duotone' : 'solar:document-text-bold-duotone'" class="w-5 h-5 text-rose-400" />
              <div class="flex-1 min-w-0"><p class="text-xs font-bold truncate">{{ item.title }}</p><p class="text-[10px] opacity-40">{{ item.type === 'journal' ? 'Jurnal' : 'Lembaran' }}</p></div>
              <button @click="restoreTrash(item)" class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black">Pulihkan</button>
            </div>
            <p v-if="!trashItems.length" class="text-center text-xs opacity-40 py-8">Tempat sampah masih kosong.</p>
          </div>
        </section>
      </div>

      <div
        v-show="activeStatsTab === 'data'"
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
            <button @click="exportToJSON" class="w-full px-5 py-4 border text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.01] transition flex items-center justify-center gap-3" :class="currentThemeClasses.border">
              <Icon icon="solar:database-bold-duotone" class="w-5 h-5" /> Backup Lengkap (.JSON)
            </button>
            <label class="w-full px-5 py-4 border text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.01] transition flex items-center justify-center gap-3 cursor-pointer" :class="currentThemeClasses.border">
              <Icon icon="solar:upload-square-bold-duotone" class="w-5 h-5" /> Impor Backup
              <input type="file" accept=".json,application/json" class="hidden" @change="importFromJSON" />
            </label>
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
import { computed, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const { darkMode } = useDiaryTheme();
const notebooks = useState("global-notebooks", () => []);
const { $fbAuth, $fbDb } = useNuxtApp();
const activeStatsTab = ref("overview");
const statsTabs = [
  { id: "overview", label: "Ringkasan", icon: "solar:widget-5-bold-duotone" },
  { id: "calendar", label: "Kalender", icon: "solar:calendar-bold-duotone" },
  { id: "data", label: "Data & Backup", icon: "solar:safe-2-bold-duotone" },
];
const selectedCalendarDay = ref("");
const calendarCursor = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
const dailyGoal = ref(300);
const reminderTime = ref("20:00");
const reminderEnabled = ref(false);
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

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
const panelClass = computed(() =>
  currentTheme.value === "dark"
    ? "bg-slate-900/50 border-slate-800 text-slate-100"
    : "bg-white/80 border-slate-200/80 text-slate-800",
);

const activePages = computed(() =>
  notebooks.value.flatMap((book) =>
    book.deletedAt ? [] : (book.pages || []).filter((page) => !page.deletedAt),
  ),
);

const dateKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calendarTitle = computed(() =>
  calendarCursor.value.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
);

const calendarCells = computed(() => {
  const year = calendarCursor.value.getFullYear();
  const month = calendarCursor.value.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ key: `blank-${i}`, day: 0, dateKey: "", entries: [] });
  for (let day = 1; day <= totalDays; day++) {
    const key = dateKey(new Date(year, month, day));
    cells.push({ key, day, dateKey: key, entries: activePages.value.filter((page) => dateKey(page.createdAt) === key) });
  }
  return cells;
});

const selectedDayEntries = computed(() =>
  activePages.value.filter((page) => dateKey(page.createdAt) === selectedCalendarDay.value),
);

const changeMonth = (direction) => {
  calendarCursor.value = new Date(calendarCursor.value.getFullYear(), calendarCursor.value.getMonth() + direction, 1);
};

const writingStreak = computed(() => {
  const writtenDays = new Set(activePages.value.map((page) => dateKey(page.createdAt)));
  let cursor = new Date();
  if (!writtenDays.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (writtenDays.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
});

const countWords = (text = "") => text.trim() ? text.trim().split(/\s+/).length : 0;
const todayWordCount = computed(() =>
  activePages.value.filter((page) => dateKey(page.createdAt) === dateKey(Date.now())).reduce((sum, page) => sum + countWords(page.text), 0),
);
const goalProgress = computed(() => Math.min(100, Math.round((todayWordCount.value / Math.max(1, dailyGoal.value)) * 100)));

const moodInsights = computed(() => {
  const counts = {};
  activePages.value.forEach((page) => { if (page.mood) counts[page.mood] = (counts[page.mood] || 0) + 1; });
  const total = activePages.value.length || 1;
  return Object.entries(counts).map(([mood, count]) => ({ mood, count, percent: Math.round((count / total) * 100) })).sort((a, b) => b.count - a.count);
});
const moodLabel = (mood) => ({ "😊": "Senang", "🥰": "Cinta", "😢": "Sedih", "😡": "Kesal", "😴": "Lelah", "🤢": "Sakit" }[mood] || "Lainnya");

const trashItems = computed(() => {
  const items = [];
  notebooks.value.forEach((book) => {
    if (book.deletedAt) items.push({ key: `journal-${book.id}`, type: "journal", bookId: book.id, title: book.title, source: book });
    (book.pages || []).forEach((page) => {
      if (page.deletedAt) items.push({ key: `page-${page.id}`, type: "page", bookId: book.id, pageId: page.id, title: page.text?.slice(0, 55) || "Lembaran tanpa judul", source: page });
    });
  });
  return items.sort((a, b) => (b.source.deletedAt || 0) - (a.source.deletedAt || 0));
});

const restoreTrash = async (item) => {
  const user = $fbAuth.currentUser;
  if (!user) return alert("Silakan login kembali.");
  const target = item.type === "journal"
    ? doc($fbDb, "user_diaries", user.uid, "jurnals", item.bookId)
    : doc($fbDb, "user_diaries", user.uid, "jurnals", item.bookId, "notebooks", item.pageId);
  await updateDoc(target, { deletedAt: null });
  item.source.deletedAt = null;
};

const savePreferences = () => {
  if (!import.meta.client) return;
  localStorage.setItem("diary-productivity", JSON.stringify({ dailyGoal: dailyGoal.value, reminderTime: reminderTime.value, reminderEnabled: reminderEnabled.value }));
};

const enableReminder = async () => {
  if (!import.meta.client || !("Notification" in window)) return alert("Browser ini tidak mendukung notifikasi.");
  const permission = await Notification.requestPermission();
  reminderEnabled.value = permission === "granted";
  savePreferences();
  if (reminderEnabled.value) new Notification("Pengingat Diary aktif", { body: `Kami akan mengingatkanmu pukul ${reminderTime.value}.` });
};

onMounted(() => {
  const saved = localStorage.getItem("diary-productivity");
  if (saved) {
    try {
      const value = JSON.parse(saved);
      dailyGoal.value = Number(value.dailyGoal) || 300;
      reminderTime.value = value.reminderTime || "20:00";
      reminderEnabled.value = Boolean(value.reminderEnabled);
    } catch {}
  }
  setInterval(() => {
    const now = new Date();
    const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const notificationKey = `diary-reminded-${dateKey(now)}`;
    if (reminderEnabled.value && current === reminderTime.value && !sessionStorage.getItem(notificationKey) && Notification.permission === "granted") {
      new Notification("Waktunya menulis jurnal ✍️", { body: "Luangkan beberapa menit untuk merekam harimu." });
      sessionStorage.setItem(notificationKey, "1");
    }
  }, 30000);
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

const downloadBlob = (content, type, extension) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Diary-Digital-Backup-${new Date().toISOString().slice(0, 10)}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
};

const exportToJSON = () => {
  const backup = {
    format: "diary-digital-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    notebooks: notebooks.value,
  };
  downloadBlob(JSON.stringify(backup, null, 2), "application/json;charset=utf-8", "json");
};

const importFromJSON = async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  const user = $fbAuth.currentUser;
  if (!user) return alert("Silakan login kembali sebelum mengimpor.");
  try {
    const backup = JSON.parse(await file.text());
    if (backup?.format !== "diary-digital-backup" || !Array.isArray(backup.notebooks)) {
      throw new Error("Format backup tidak dikenali.");
    }
    if (!confirm(`Impor ${backup.notebooks.length} jurnal dari backup ini? Data dengan ID yang sama akan diperbarui.`)) return;
    for (const book of backup.notebooks) {
      if (!book?.id || !book?.title) continue;
      const { pages = [], ...journalData } = book;
      delete journalData.id;
      await setDoc(doc($fbDb, "user_diaries", user.uid, "jurnals", book.id), journalData, { merge: true });
      for (const page of pages) {
        if (!page?.id) continue;
        const { id, ...pageData } = page;
        await setDoc(doc($fbDb, "user_diaries", user.uid, "jurnals", book.id, "notebooks", id), pageData, { merge: true });
      }
    }
    notebooks.value = backup.notebooks;
    alert("Backup berhasil diimpor.");
  } catch (error) {
    alert(error?.message || "File backup gagal dibaca.");
  }
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
