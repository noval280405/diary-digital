<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop Gelap Lembut -->
    <div @click="closeModal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />

    <!-- Kotak Dialog Modal -->
    <div 
      :class="darkMode ? 'bg-slate-950 border-slate-800 text-white shadow-2xl shadow-indigo-950/20' : 'bg-white border-amber-200 text-slate-900 shadow-xl shadow-amber-900/10'"
      class="relative w-full max-w-sm rounded-[28px] border p-6 z-10 text-center transition-all duration-300 scale-100"
    >
      <!-- Ikon Gembok Beranimasi -->
      <div 
        :class="darkMode ? 'bg-indigo-950/50 border-indigo-900 text-indigo-400' : 'bg-rose-50 border-rose-100 text-rose-500'"
        class="w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce"
      >
        <Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" class="w-8 h-8" />
      </div>

      <h3 class="font-black text-lg tracking-wide">Jurnal Ini Terkunci</h3>
      <p class="text-xs opacity-60 mt-1 mb-5 px-4">
        Masukkan PIN Jurnal untuk membuka catatan resep atau taktik rahasia ini.
      </p>

      <!-- Indikator Bulatan PIN (Ala iPhone) -->
      <div class="flex justify-center gap-3 mb-6">
        <div 
          v-for="i in 4" 
          :key="i"
          :class="[
            pin.length >= i 
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 scale-110' 
              : (darkMode ? 'bg-slate-800' : 'bg-amber-200/60'),
            isError ? 'animate-shake bg-rose-500' : ''
          ]"
          class="w-3.5 h-3.5 rounded-full transition-all duration-150"
        />
      </div>

      <!-- Pesan Error Gagal -->
      <p v-if="isError" class="text-xs text-rose-500 font-bold mb-4 animate-pulse">
        ❌ PIN Salah! Silakan coba lagi.
      </p>

      <!-- Pad Tombol Angka (Numpad) -->
      <div class="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
        <button 
          v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]" 
          :key="num"
          @click="pressKey(num.toString())"
          :class="darkMode ? 'bg-slate-900 border-slate-800/80 hover:bg-slate-800 text-white' : 'bg-amber-50 border-amber-200/60 hover:bg-amber-100 text-slate-800'"
          class="h-14 rounded-2xl border font-black text-lg flex items-center justify-center active:scale-90 transition-all shadow-sm"
        >
          {{ num }}
        </button>
        
        <!-- Tombol Clear (C) -->
        <button 
          @click="clearPin"
          :class="darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'"
          class="h-14 font-bold text-xs uppercase tracking-widest flex items-center justify-center active:scale-90 transition-all"
        >
          Clear
        </button>

        <!-- Angka 0 -->
        <button 
          @click="pressKey('0')"
          :class="darkMode ? 'bg-slate-900 border-slate-800/80 hover:bg-slate-800 text-white' : 'bg-amber-50 border-amber-200/60 hover:bg-amber-100 text-slate-800'"
          class="h-14 rounded-2xl border font-black text-lg flex items-center justify-center active:scale-90 transition-all shadow-sm"
        >
          0
        </button>

        <!-- Tombol Backspace (Hapus 1) -->
        <button 
          @click="backspace"
          :class="darkMode ? 'text-slate-400 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'"
          class="h-14 flex items-center justify-center active:scale-90 transition-all"
        >
          <Icon icon="solar:backspace-bold" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  isOpen: boolean;
  correctPin: string; // PIN asli dari data jurnal yang di klik
  darkMode: boolean;
}>();

const emit = defineEmits(['success', 'close']);

const pin = ref('');
const isError = ref(false);

const pressKey = (num: string) => {
  if (pin.value.length < 4) {
    pin.value += num;
    isError.value = false;
  }
};

const backspace = () => {
  pin.value = pin.value.slice(0, -1);
};

const clearPin = () => {
  pin.value = '';
};

const closeModal = () => {
  clearPin();
  emit('close');
};

// Pantau jika ketikan PIN sudah genap 4 digit
watch(pin, (newPin) => {
  if (newPin.length === 4) {
    // Jalankan pengecekan setelah jeda sedikit demi kepuasan visual bulatan penuh
    setTimeout(() => {
      if (newPin === props.correctPin) {
        emit('success');
        clearPin();
      } else {
        isError.value = true;
        pin.value = ''; // Reset pin biar user bisa ngetik ulang
      }
    }, 250);
  }
});
</script>

<style scoped>
/* Animasi getar saat salah PIN */
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}
</style>