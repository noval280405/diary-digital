<script setup lang="ts">
const open = ref(false);
onMounted(() => { open.value = localStorage.getItem("diary-onboarding-complete") !== "1"; });
const finish = () => {
  localStorage.setItem("diary-onboarding-complete", "1");
  open.value = false;
};
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <section class="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white"><Icon icon="solar:notebook-bold-duotone" class="h-6 w-6" /></div>
        <h2 class="mt-5 text-2xl font-bold text-slate-900">Selamat datang di MyDiary</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500">Ruang pribadi untuk menulis, memahami mood, dan menyimpan kenangan Anda.</p>
        <div class="mt-6 space-y-3 text-sm text-slate-600">
          <p class="flex gap-3"><span class="font-bold text-indigo-600">01</span> Pilih jurnal atau buat jurnal baru dari sidebar.</p>
          <p class="flex gap-3"><span class="font-bold text-indigo-600">02</span> Tekan Tulis Jurnal, pilih mood, lalu ceritakan hari Anda.</p>
          <p class="flex gap-3"><span class="font-bold text-indigo-600">03</span> Gunakan Data & Backup secara berkala untuk menjaga salinan pribadi.</p>
        </div>
        <button @click="finish" class="mt-7 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Mulai menulis</button>
        <p class="mt-4 text-center text-[11px] text-slate-400">Dengan melanjutkan, Anda menyetujui <NuxtLink to="/terms" class="underline">Syarat</NuxtLink> dan <NuxtLink to="/privacy" class="underline">Privasi</NuxtLink>.</p>
      </section>
    </div>
  </Teleport>
</template>
