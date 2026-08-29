<script setup lang="ts">
defineProps<{ open: boolean }>();
const emit = defineEmits(["close", "confirm"]);
const pin = ref("");
const error = ref("");
watch(() => pin.value, (value) => { pin.value = value.replace(/\D/g, "").slice(0, 6); error.value = ""; });
const submit = () => {
  if (!/^\d{6}$/.test(pin.value)) { error.value = "Masukkan tepat 6 angka."; return; }
  emit("confirm", pin.value);
  pin.value = "";
};
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" @click.self="$emit('close')">
      <section class="w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl dark:bg-slate-900">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Buat PIN halaman</h2>
        <p class="mt-1 text-xs leading-5 text-slate-500">PIN terdiri dari 6 angka. Simpan PIN ini karena halaman tidak dapat dibuka tanpanya.</p>
        <input v-model="pin" inputmode="numeric" type="password" maxlength="6" autofocus placeholder="••••••" class="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xl font-bold tracking-[0.5em] outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" @keyup.enter="submit" />
        <p v-if="error" class="mt-2 text-xs font-semibold text-rose-500">{{ error }}</p>
        <div class="mt-5 flex gap-2">
          <button @click="$emit('close')" class="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">Batal</button>
          <button @click="submit" class="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white">Simpan PIN</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
