<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { uploadStore } from "@/stores/uploadStore";

const props = defineProps({
  label: {
    type: String,
    default: "Upload Foto Jurnal",
  },
  typefolder: {
    type: String,
    default: "user_diaries",
  },
});

const emit = defineEmits(["success-upload"]);

const useuploadStore = uploadStore();
const fileInput = ref<HTMLInputElement | null>(null);
const fileValueName = ref(""); // Menyimpan nama file untuk UI Tailwind

onMounted(() => {
  useuploadStore.setReset();
});

async function uploadPicture() {
  try {
    // Jalankan upload dan tunggu sampai promise selesai membawa URL resmi
    const downloadURL: any = await useuploadStore.simpanFileAction(props.typefolder);
    
    if (downloadURL) {
      console.log("📢 [UPLOAD SUCCESS] Memancarkan URL ke Parent:", downloadURL);
      // Lempar URL ke komponen utama agar disimpan ke Firestore
      emit("success-upload", downloadURL); 
    }
  } catch (error) {
    console.error("Gagal mengunggah gambar:", error);
  }
}

function onfilepicked(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  
  fileValueName.value = file.name;
  const originalname = file.name;
  const filename = originalname.replace(/\s+/g, "_").toLowerCase();
  
  useuploadStore.setnameFile(filename);
  useuploadStore.setfile(file);
  useuploadStore.setTypeFile(file.type);
  
  // Langsung picu upload tanpa nunggu tombol lain
  uploadPicture();
}

const progress = computed(() => useuploadStore.getprogressUpload);

// Kosongkan input dan nama file ketika progress di-reset ke 0 oleh parent
watch(progress, (val) => {
  if (val === 0) {
    fileValueName.value = ""; 
    if (fileInput.value) {
      fileInput.value.value = ""; // Reset input file HTML asli
    }
  }
});
</script>

<template>
  <div class="w-full space-y-2">
    <div 
      class="relative flex items-center justify-between border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        @change="onfilepicked"
      />
      
      <span class="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-[70%]">
        {{ fileValueName || props.label }}
      </span>

      <span class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded-md font-sans">
        Pilih File
      </span>
    </div>

    <div v-if="progress > 0" class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden transition-all">
      <div 
        class="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>