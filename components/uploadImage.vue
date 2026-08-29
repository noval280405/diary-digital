<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { uploadStore } from "@/stores/uploadStore";

const props = withDefaults(defineProps<{ label?: string; typefolder?: string }>(), {
  label: "Pilih Foto Jurnal",
  typefolder: "user_diaries",
});
const emit = defineEmits(["success-upload", "preview", "remove", "upload-error"]);
const store = uploadStore();
const currentTheme = useState<string>("diary-active-theme", () => "cream");
const fileInput = ref<HTMLInputElement | null>(null);
const fileName = ref("");
const previewUrl = ref("");
const errorMessage = ref("");
const progress = computed(() => Math.round(store.getprogressUpload || 0));
const isUploading = computed(() => store.uploading);
const isUploaded = computed(() => Boolean(store.getUrlRef) && progress.value >= 100);
const accentClasses = computed(() => ({
  cream: { border: "border-amber-300/80", soft: "bg-amber-50 text-amber-800", icon: "bg-orange-500", bar: "from-orange-500 to-amber-400" },
  pink: { border: "border-pink-300/80", soft: "bg-pink-50 text-pink-800", icon: "bg-pink-500", bar: "from-pink-500 to-rose-400" },
  blue: { border: "border-sky-300/80", soft: "bg-sky-50 text-sky-800", icon: "bg-sky-500", bar: "from-sky-500 to-indigo-400" },
  green: { border: "border-emerald-300/80", soft: "bg-emerald-50 text-emerald-800", icon: "bg-emerald-500", bar: "from-emerald-500 to-teal-400" },
  dark: { border: "border-indigo-500/50", soft: "bg-slate-900 text-slate-200", icon: "bg-indigo-500", bar: "from-indigo-500 to-violet-400" },
}[currentTheme.value] || { border: "border-indigo-300", soft: "bg-indigo-50 text-indigo-800", icon: "bg-indigo-500", bar: "from-indigo-500 to-violet-400" }));

onMounted(() => store.setReset());
onBeforeUnmount(() => {
  if (previewUrl.value.startsWith("blob:")) URL.revokeObjectURL(previewUrl.value);
});

const resetLocalPreview = () => {
  if (previewUrl.value.startsWith("blob:")) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = "";
  fileName.value = "";
  errorMessage.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const removeImage = async () => {
  const uploadedUrl = store.getUrlRef;
  resetLocalPreview();
  if (uploadedUrl) {
    try {
      await store.deleteUploadedFile(uploadedUrl);
    } catch {
      store.setReset();
      emit("upload-error", "Gambar dihapus dari jurnal, tetapi file cloud gagal dibersihkan.");
    }
  } else {
    store.setReset();
  }
  emit("remove");
};

const uploadPicture = async () => {
  try {
    const downloadURL = await store.simpanFileAction(props.typefolder);
    if (typeof downloadURL === "string" && downloadURL) {
      previewUrl.value = downloadURL;
      emit("preview", downloadURL);
      emit("success-upload", downloadURL);
    }
  } catch (error: any) {
    errorMessage.value = error?.message || "Gambar gagal diunggah. Silakan coba lagi.";
    emit("upload-error", errorMessage.value);
  }
};

const onFilePicked = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  errorMessage.value = "";
  if (!file.type.startsWith("image/")) {
    errorMessage.value = "File harus berupa gambar.";
    input.value = "";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = "Ukuran gambar maksimal 5 MB.";
    input.value = "";
    return;
  }
  if (previewUrl.value.startsWith("blob:")) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = URL.createObjectURL(file);
  fileName.value = file.name;
  emit("preview", previewUrl.value);
  store.setnameFile(`${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase()}`);
  store.setfile(file);
  store.setTypeFile(file.type);
  await uploadPicture();
};
</script>

<template>
  <div class="w-full">
    <div v-if="previewUrl" class="grid grid-cols-[104px_1fr] sm:grid-cols-[136px_1fr] gap-3 rounded-xl border p-2.5 transition-colors" :class="[accentClasses.border, accentClasses.soft]">
      <div class="relative h-24 sm:h-28 overflow-hidden rounded-lg bg-black/5">
        <img :src="previewUrl" alt="Preview foto jurnal" class="h-full w-full object-cover" />
        <span v-if="isUploaded" class="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-[9px] font-black text-white shadow">SIAP</span>
      </div>
      <div class="flex min-w-0 flex-col justify-between py-1">
        <div>
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" :class="accentClasses.icon">
              <Icon icon="solar:gallery-check-bold-duotone" class="h-4 w-4" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-xs font-black">{{ fileName || "Foto jurnal" }}</p>
              <p class="text-[10px] opacity-60">{{ isUploading ? `Mengunggah ${progress}%` : isUploaded ? "Foto siap disertakan" : "Menyiapkan preview" }}</p>
            </div>
          </div>
          <div v-if="isUploading" class="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10">
            <div class="h-full rounded-full bg-gradient-to-r transition-all" :class="accentClasses.bar" :style="{ width: `${progress}%` }" />
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <label
            class="group/change inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75"
            :class="accentClasses.icon"
          >
            <Icon icon="solar:gallery-edit-bold-duotone" class="h-3.5 w-3.5 transition-transform group-hover/change:rotate-6 group-hover/change:scale-110" />
            <span>Ganti foto</span>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" :disabled="isUploading" @change="onFilePicked" />
          </label>
          <button
            type="button"
            :disabled="isUploading"
            @click="removeImage"
            title="Hapus gambar"
            aria-label="Hapus gambar"
            class="group/remove inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500 bg-rose-500 text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon icon="solar:trash-bin-minimalistic-linear" class="h-4 w-4 transition-transform group-hover/remove:scale-110" />
          </button>
        </div>
      </div>
    </div>

    <label v-else class="group flex min-h-18 cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-left transition-colors" :class="[accentClasses.border, accentClasses.soft, { 'pointer-events-none opacity-60': isUploading }]">
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFilePicked" />
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm" :class="accentClasses.icon">
        <Icon icon="solar:gallery-add-bold-duotone" class="h-6 w-6" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-xs font-black">{{ props.label }}</span>
        <span class="mt-0.5 block text-[10px] opacity-55">Klik untuk memilih · JPG, PNG, WEBP · Maks. 5 MB</span>
      </span>
      <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4 shrink-0 opacity-40" />
    </label>

    <p v-if="errorMessage" class="mt-2 rounded-xl bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-500">{{ errorMessage }}</p>
  </div>
</template>
