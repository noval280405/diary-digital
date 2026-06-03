<template>
  <div
    :class="[
      darkMode ? 'dark bg-slate-950 text-white' : 'bg-amber-50 text-slate-900',
    ]"
    class="min-h-screen flex transition-all duration-500 font-sans relative overflow-hidden"
  >
    <div
      class="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
      :class="
        darkMode
          ? 'bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]'
          : 'bg-[radial-gradient(circle_at_top,_#fff7ed,_#fef3c7)]'
      "
    />

    <div
      class="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none z-0 transition-all duration-500"
      :class="darkMode ? 'bg-indigo-500' : 'bg-orange-300'"
    />

    <aside
      :class="
        darkMode
          ? 'bg-slate-950/70 border-slate-800 text-slate-200'
          : 'bg-white/80 border-amber-200 text-slate-800 shadow-xl shadow-amber-900/5'
      "
      class="relative w-80 border-r backdrop-blur-xl p-6 flex flex-col justify-between shadow-2xl z-10 transition-colors duration-500"
    >
      <div class="space-y-6">
        <div class="flex items-center justify-between">
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
              <h2
                class="font-bold text-lg"
                :class="darkMode ? 'text-white' : 'text-slate-900'"
              >
                My Diary
              </h2>
              <p class="text-xs opacity-60">Personal Journal</p>
            </div>
          </div>

          <button
            @click="toggleTheme"
            :class="
              darkMode
                ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800'
                : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
            "
            class="w-11 h-11 rounded-xl border flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <Icon
              :icon="darkMode ? 'solar:moon-stars-bold' : 'solar:sun-bold'"
              class="w-5 h-5"
            />
          </button>
        </div>

        <div
          class="p-4 rounded-2xl border transition-colors duration-500"
          :class="
            darkMode
              ? 'bg-white/5 border-slate-800/80 text-slate-300'
              : 'bg-amber-50/60 border-amber-200 text-slate-700'
          "
        >
          <div class="flex gap-3">
            <Icon
              icon="solar:chat-round-like-bold"
              class="w-5 h-5 mt-1 shrink-0 opacity-70"
            />
            <p class="italic text-sm leading-relaxed">{{ quote }}</p>
          </div>
        </div>

        <slot name="sidebar-content" />
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex items-center gap-2 mb-2 opacity-60">
            <Icon icon="solar:pen-bold" class="w-4 h-4" />
            <span class="text-xs font-medium">Writing Goal</span>
          </div>
          <div
            class="h-2 rounded-full overflow-hidden"
            :class="darkMode ? 'bg-slate-800' : 'bg-amber-200/60'"
          >
            <div
              class="h-full w-[65%] bg-gradient-to-r from-orange-500 to-pink-500"
            />
          </div>
          <div class="mt-2 text-xs opacity-60 font-medium">
            327 / 500 words today
          </div>
        </div>

        <div
          class="flex items-center gap-3 pt-4 border-t transition-colors duration-500"
          :class="darkMode ? 'border-slate-800' : 'border-amber-200'"
        >
          <!-- <div
            class="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center shadow-md"
          >
            <Icon icon="solar:user-bold" class="w-5 h-5 text-white" />
          </div> -->

           <div :class="darkMode ? 'from-indigo-500 to-pink-500' : 'from-orange-500 to-rose-500'" class="w-14 h-14 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0">
               <Icon icon="solar:user-bold" class="w-5 h-5 text-white" />
            </div>
          <div>
            <h4
              class="font-bold text-sm"
              :class="darkMode ? 'text-white' : 'text-slate-900'"
            >
              Noval's Diary
            </h4>
            <div
              class="flex items-center gap-1 text-xs text-emerald-500 font-semibold"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
              />
              Auto Saved
            </div>
          </div>
        </div>
      </div>
    </aside>

    <main class="relative flex-1 p-6 md:p-10 overflow-y-auto z-10">
      <div class="max-w-4xl mx-auto">
        <div
          :class="
            darkMode
              ? 'bg-slate-900 border-slate-800 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]'
              : 'bg-white border-amber-200 text-black shadow-[0_30px_60px_rgba(217,119,6,0.06)]'
          "
          class="rounded-[32px] border p-8 md:p-12 relative overflow-hidden transition-all duration-500 min-h-[580px]"
        >
          <div
            class="absolute left-16 top-0 bottom-0 w-[1.5px] bg-red-400/30 z-20 pointer-events-none"
          />

          <div
            class="absolute inset-0 pointer-events-none z-0"
            style="
              background-image: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 34px,
                rgba(148, 163, 184, 0.07) 35px
              );
              background-size: 100% 35px;
              margin-top: 50px;
            "
          />

          <div class="relative z-10 h-full">
            <slot />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useDiaryTheme } from "~/composables/useDiaryTheme";

const { darkMode, toggleTheme } = useDiaryTheme();

const quotes = [
  "Writing is the painting of the voice.",
  "Every page is a new beginning.",
  "A diary is a mirror of the soul.",
  "Small memories become great stories.",
  "Write what you cannot say.",
];
const quote = ref("");

onMounted(() => {
  quote.value = quotes[Math.floor(Math.random() * quotes.length)];
});
</script>
