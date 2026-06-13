<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  modelValue: boolean;
  mode: "create" | "delete";
  bookTitle?: string;
}>();

const emit = defineEmits(["update:modelValue", "submit"]);

const pinInput = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const shakeInput = ref(false); // Untuk animasi jika PIN salah/kurang

// Menghitung berapa digit yang sudah diisi untuk indikator visual
const filledDots = computed(() => pinInput.value.length);

// Reset input dan animasi setiap kali modal dibuka
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      pinInput.value = "";
      shakeInput.value = false;
      await nextTick();
      inputRef.value?.focus();
    }
  },
);

const close = () => {
  pinInput.value = ""; // Bersihkan input saat menutup
  emit("update:modelValue", false);
};

const handleSubmit = () => {
  if (pinInput.value.length === 6) {
    emit("submit", pinInput.value);
    close(); // ✨ TAMBAHKAN INI biar modal otomatis langsung ketutup!
  } else {
    // Efek shake jika mencoba submit PIN yang kurang dari 6 digit
    shakeInput.value = true;
    setTimeout(() => (shakeInput.value = false), 500);
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-5 overflow-hidden"
        @click="close"
      >
        <div
          @click.stop
          class="w-full max-w-[310px] sm:max-w-[350px] bg-white border border-slate-100 p-6 sm:p-7 rounded-[2.2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] space-y-5 sm:space-y-6 text-center transform transition-all animate-in fade-in zoom-in-95 duration-300"
        >
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center border-2 animate-in zoom-in-50 delay-150 duration-500 relative"
              :class="
                mode === 'create'
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-100 text-emerald-500 shadow-inner'
                  : 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-100 text-rose-500 shadow-inner'
              "
            >
              <span
                class="absolute inset-0 rounded-2xl animate-pulse-slow opacity-40"
                :class="mode === 'create' ? 'bg-emerald-200' : 'bg-rose-200'"
              ></span>
              <Icon
                :icon="
                  mode === 'create'
                    ? 'solar:shield-keyhole-bold-duotone'
                    : 'solar:lock-bold-duotone'
                "
                class="w-7 h-7 relative z-10"
              />
            </div>

            <div class="space-y-1 px-1">
              <h3
                class="text-lg font-black text-slate-800 tracking-tight sm:text-xl"
              >
                {{
                  mode === "create" ? "Buat PIN Keamanan" : "Verifikasi Akses"
                }}
              </h3>
              <p
                class="text-[9px] sm:text-[10px] leading-relaxed text-slate-400 font-bold uppercase tracking-[0.15em]"
              >
                {{
                  mode === "create"
                    ? `Kunci Rak "${bookTitle}"`
                    : "Masukkan PIN aktif Anda"
                }}
              </p>
            </div>
          </div>

          <div class="relative py-1 group">
            <input
              ref="inputRef"
              v-model="pinInput"
              type="text"
              maxlength="6"
              inputmode="numeric"
              pattern="[0-9]*"
              class="absolute inset-0 opacity-0 cursor-pointer z-20"
              @keyup.enter="handleSubmit"
            />

            <div
              class="flex justify-center gap-2 transition-transform duration-300"
              :class="{ 'animate-shake': shakeInput }"
            >
              <div
                v-for="i in 6"
                :key="i"
                class="w-10 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-inner"
                :class="[
                  i <= filledDots
                    ? 'bg-indigo-50 border-indigo-200 shadow-indigo-100/30'
                    : 'bg-slate-50 border-slate-100 group-hover:border-slate-200',
                  i === filledDots + 1 && props.modelValue
                    ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-md scale-105'
                    : '',
                ]"
              >
                <span
                  class="w-2.5 h-2.5 rounded-full transition-all duration-300 transform"
                  :class="
                    i <= filledDots
                      ? 'bg-indigo-600 scale-100'
                      : 'bg-slate-200 scale-50'
                  "
                ></span>
              </div>
            </div>

            <div
              class="mt-3 text-[10px] font-black text-slate-300 uppercase tracking-tight"
            >
              PIN Harus 6 Digit Angka
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <button
              @click="close"
              class="group/btn py-3 rounded-xl text-[11px] font-black tracking-wider border-2 border-rose-600 text-rose-600 bg-white hover:bg-rose-50/50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 select-none"
            >
              <Icon
                icon="solar:close-circle-bold"
                class="w-3.5 h-3.5 text-rose-500"
              />
              <span>BATAL</span>
            </button>

            <button
              @click="handleSubmit"
              :disabled="pinInput.length !== 6"
              class="py-3 rounded-xl text-[11px] font-black text-white active:scale-95 transition-all duration-300 relative overflow-hidden group shadow-md disabled:shadow-none disabled:opacity-40 disabled:grayscale disabled:scale-100"
              :class="
                mode === 'create'
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/70 hover:shadow-emerald-300/80'
                  : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200/70 hover:shadow-rose-300/80'
              "
            >
              <span
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"
              ></span>
              <span
                class="relative z-10 flex items-center justify-center gap-1.5"
              >
                <Icon
                  :icon="
                    mode === 'create'
                      ? 'solar:shield-check-bold'
                      : 'solar:key-bold'
                  "
                  class="w-3.5 h-3.5"
                />
                {{ mode === "create" ? "PASANG" : "HAPUS" }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Animasi Shake untuk input yang salah */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-6px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(6px);
  }
}
.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Animasi Shimmer untuk tombol hover */
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

/* Animasi Pulse Lambat untuk efek glow ikon */
@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.15;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 3s infinite cubic-bezier(0.4, 0, 0.6, 1);
}
</style>
