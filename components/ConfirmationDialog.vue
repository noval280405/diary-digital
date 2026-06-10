<template>
  <Transition
    enter-active-class="transition duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    enter-from-class="opacity-0 scale-90 backdrop-blur-0"
    enter-to-class="opacity-100 scale-100 backdrop-blur-sm"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 backdrop-blur-sm"
    leave-to-class="opacity-0 scale-95 backdrop-blur-0"
  >
    <div
      v-if="dialog"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/20 backdrop-blur-xs p-4"
    >
      <div
        class="w-full max-w-[380px] rounded-[2.5rem] border-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 relative group/card"
        :class="[
          currentThemeClasses.border,
          // MENGUNCI WARNA BACKGROUND SOLID (ANTI TRANSPARAN) SESUAI TEMA INDEX
          currentTheme === 'dark'
            ? 'bg-slate-950 text-white border-slate-800'
            : currentTheme === 'pink'
              ? 'bg-pink-100 text-pink-950'
              : currentTheme === 'orange'
                ? 'bg-orange-100 text-orange-950'
                : currentTheme === 'green'
                  ? 'bg-emerald-100 text-emerald-950'
                  : currentTheme === 'blue'
                    ? 'bg-sky-100 text-sky-950'
                    : 'bg-stone-100 text-stone-900', // Default / Cream solid
        ]"
      >
        <div
          class="absolute top-3 left-0 right-0 flex justify-center gap-1.5 opacity-40"
        >
          <!-- <div
            v-for="i in 5"
            :key="i"
            class="w-2 h-2 rounded-full bg-current"
          /> -->
        </div>

        <div
          class="h-2 w-full bg-gradient-to-r"
          :class="currentThemeClasses.btnGradient"
        />

        <div class="px-8 pt-9 pb-6 flex flex-col items-center text-center">
          <div
            class="w-16 h-16 rounded-[24px] flex items-center justify-center mb-5 border-2 shadow-sm relative overflow-hidden transition-transform duration-500 group-hover/card:scale-105"
            :class="[
              currentThemeClasses.border,
              currentTheme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-100',
            ]"
          >
            <div
              class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-out"
            />

            <Icon
              icon="solar:notebook-bookmark-bold-duotone"
              class="w-8 h-8 transition-transform duration-500 group-hover/card:rotate-6"
              :class="
                currentTheme === 'dark' ? 'text-indigo-400' : 'text-current'
              "
            />
          </div>

          <div class="space-y-2">
            <h3
              class="text-lg font-black tracking-tight text-current leading-tight"
            >
              {{ title }}
            </h3>
            <p
              class="text-xs leading-relaxed max-w-[250px] mx-auto font-bold opacity-60 text-current"
            >
              {{ message }}
            </p>
          </div>
        </div>

        <div class="px-8 pb-8 pt-2 flex items-center gap-3">
          <button
            @click="onCancel"
            class="flex-1 h-12 rounded-2xl border-2 font-black text-xs tracking-wider transition-all duration-300 active:scale-95 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 shadow-3xs"
            :class="[
              currentThemeClasses.border,
              currentTheme === 'dark'
                ? 'bg-slate-900 text-slate-300 border-slate-800'
                : 'bg-white text-current border-slate-100',
            ]"
          >
            Tidak
          </button>

          <button
            @click="onConfirm"
            :class="currentThemeClasses.btnGradient"
            class="flex-1 h-12 rounded-2xl font-black text-xs tracking-wider text-white shadow-md hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";

// Mengambil state tema dari komponen induk (index.vue)
const currentTheme = inject<string>("currentTheme", "cream");
const currentThemeClasses = inject<Record<string, any>>(
  "currentThemeClasses",
  {},
);

const dialog = ref(false);
const title = ref("");
const message = ref("");

let resolvePromise: (value: boolean) => void;

function show(dialogTitle: string, dialogMessage: string): Promise<boolean> {
  title.value = dialogTitle;
  message.value = dialogMessage;
  dialog.value = true;

  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function onConfirm() {
  dialog.value = false;
  resolvePromise(true);
}

function onCancel() {
  dialog.value = false;
  resolvePromise(false);
}

defineExpose({
  show,
});
</script>
