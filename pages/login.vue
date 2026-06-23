<template>
  <ClientOnly>
    <div
      :class="
        currentTheme === 'dark'
          ? 'bg-slate-950 text-white'
          : activeThemeMap?.pageBg
      "
      class="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden transition-colors duration-500"
    >
      <div
        class="absolute top-6 right-6 z-50 flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-1.5 rounded-full border border-amber-200/40 dark:border-slate-800"
      >
        <button
          v-for="(theme, key) in availableThemes"
          :key="key"
          @click="changeTheme(key)"
          :class="[
            theme.bg,
            currentTheme === key
              ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-950 scale-110 shadow-md'
              : 'opacity-60 hover:opacity-100 hover:scale-105',
          ]"
          class="w-7 h-7 rounded-full transition-all duration-300 relative group"
          :title="theme.name"
        >
          <span
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
          >
            {{ theme.name }}
          </span>
        </button>
      </div>

      <div
        class="fixed inset-0 pointer-events-none transition-all duration-500"
        :class="
          currentTheme === 'dark'
            ? 'bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]'
            : activeThemeMap?.radialBg
        "
      />
      <div
        class="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
        :class="activeThemeMap?.glow"
      />

      <div
        :class="
          currentTheme === 'dark'
            ? 'bg-slate-900/60 border-slate-800 shadow-[0_30px_80px_rgba(0,0,0,0.5)]'
            : activeThemeMap?.cardBgBorder
        "
        class="w-full max-w-md p-8 md:p-10 rounded-[32px] border backdrop-blur-xl relative z-10 transition-all duration-500"
      >
        <div class="flex flex-col items-center text-center mb-8">
          <div
            :class="activeThemeMap?.btnGradient"
            class="w-16 h-16 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg mb-4 transition-all duration-500 text-white"
          >
            <svg
              v-if="isRegister"
              class="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                fill="currentColor"
              />
              <path
                d="M12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6Z"
                fill="currentColor"
              />
              <path
                d="M6 17C6 14.5 9 13.5 12 13.5C15 13.5 18 14.5 18 17C18 18.5 16 19.5 12 19.5C8 19.5 6 18.5 6 17Z"
                fill="currentColor"
              />
            </svg>
            <svg
              v-else
              class="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M19 10H5C3.89543 10 3 10.8954 3 12V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V12C21 10.8954 20.1046 10 19 10Z"
                fill="currentColor"
              />
              <path
                d="M12 17C12.8284 17 13.5 16.3284 13.5 15.5C13.5 14.6716 12.8284 14 12 14C11.1716 14 10.5 14.6716 10.5 15.5C10.5 16.3284 11.1716 17 12 17Z"
                fill="currentColor"
              />
              <path
                d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10H14V7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7V10H8Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-black tracking-tight">
            {{ isRegister ? "Buat Akun Diary" : "Masuk ke Diary" }}
          </h2>
          <p class="text-xs opacity-60 mt-1">
            {{
              isRegister
                ? "Daftar gratis untuk mencadangkan jurnalmu"
                : "Tulis kembali lembaran ceritamu hari ini"
            }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label
              :class="activeThemeMap?.textLabel"
              class="text-xs font-black uppercase tracking-[0.15em] block mb-2 transition-colors duration-500"
            >
              Alamat Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              required
              :class="
                currentTheme === 'dark'
                  ? 'bg-slate-950/90 border-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500'
                  : activeThemeMap?.inputStyle
              "
              class="w-full px-4 py-3 border rounded-2xl text-sm outline-none transition-all duration-300 placeholder:text-slate-500"
            />
          </div>

          <div class="space-y-2">
            <label
              :class="activeThemeMap?.textLabel"
              class="text-xs font-black uppercase tracking-[0.15em] block transition-colors duration-500"
            >
              Kata Sandi
            </label>

            <div class="relative w-full">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                :class="
                  currentTheme === 'dark'
                    ? 'bg-slate-950/90 border-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500'
                    : activeThemeMap?.inputStyle
                "
                class="w-full pr-12 px-4 py-3 border rounded-2xl text-sm outline-none transition-all duration-300 placeholder:text-slate-400"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity p-1 text-slate-400"
                :title="
                  showPassword
                    ? 'Sembunyikan Kata Sandi'
                    : 'Tampilkan Kata Sandi'
                "
              >
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </button>
            </div>

            <div v-if="!isRegister" class="text-right pt-1">
              <NuxtLink
                to="/forgot-password"
                :class="
                  currentTheme === 'dark'
                    ? 'text-slate-400 hover:text-indigo-400'
                    : 'text-slate-500 hover:opacity-80'
                "
                class="text-xs font-bold transition-all hover:underline"
              >
                Lupa kata sandi?
              </NuxtLink>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            :class="[
              loading ? 'opacity-50 cursor-not-allowed' : '',
              activeThemeMap?.btnGradient,
            ]"
            class="w-full bg-gradient-to-r p-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] text-white shadow-md hover:brightness-110 active:scale-[0.98] transition-all duration-500 mt-2 flex items-center justify-center gap-2"
          >
            <svg
              v-if="loading"
              class="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{
              isRegister ? "Daftar Akun Baru" : "Masuk Sekarang"
            }}</span>
          </button>
        </form>

        <div
          class="mt-8 pt-4 border-t text-center"
          :class="
            currentTheme === 'dark'
              ? 'border-slate-800/60'
              : activeThemeMap?.borderToggle
          "
        >
          <p
            @click="toggleAuthMode"
            :class="activeThemeMap?.textToggle"
            class="text-xs font-bold cursor-pointer hover:underline inline-flex items-center gap-1 transition-colors duration-500"
          >
            {{
              isRegister
                ? "Sudah punya akun? Masuk di sini"
                : "Belum punya akun? Daftar gratis sekarang"
            }}
          </p>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getFirestore } from "firebase/firestore";

// Shared state tema global
const currentTheme = useState("diary-active-theme", () => "cream");

const availableThemes = {
  cream: { name: "Creamy Amber", bg: "bg-amber-500" },
  dark: { name: "Deep Indigo", bg: "bg-indigo-600" },
  pink: { name: "Rose Pink", bg: "bg-pink-500" },
  blue: { name: "Sky Blue", bg: "bg-sky-500" },
  green: { name: "Emerald Green", bg: "bg-emerald-500" },
};

const authThemeMap = {
  dark: {
    pageBg: "bg-slate-950 text-white",
    radialBg:
      "bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.18),_transparent_40%)]",
    cardBgBorder:
      "bg-slate-900/80 border-slate-800 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl",
    inputStyle:
      "bg-slate-950/90 border-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 shadow-sm",
    borderToggle: "border-slate-800",
    btnGradient: "from-indigo-600 to-violet-600",
    textLabel: "text-indigo-400",
    textToggle: "text-indigo-400 hover:text-indigo-300",
    glow: "bg-indigo-500",
  },
  cream: {
    pageBg: "bg-amber-50 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#fff7ed,_#fef3c7)]",
    cardBgBorder: "bg-white/80 border-amber-200 shadow-xl shadow-amber-900/5",
    inputStyle:
      "bg-amber-50/50 border-amber-200 text-slate-800 focus:ring-2 focus:ring-orange-400 shadow-sm",
    borderToggle: "border-amber-100",
    btnGradient: "from-orange-500 to-amber-500",
    textLabel: "text-amber-700",
    textToggle: "text-orange-600 hover:text-orange-500",
    glow: "bg-orange-300",
  },
  pink: {
    pageBg: "bg-rose-50/40 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#fff1f2,_#ffe4e6)]",
    cardBgBorder: "bg-white/80 border-pink-200 shadow-xl shadow-pink-900/5",
    inputStyle:
      "bg-rose-50/30 border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-400 shadow-sm",
    borderToggle: "border-pink-100",
    btnGradient: "from-pink-500 to-rose-500",
    textLabel: "text-pink-600",
    textToggle: "text-pink-600 hover:text-pink-500",
    glow: "bg-pink-300",
  },
  blue: {
    pageBg: "bg-sky-50/40 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#f0f9ff,_#e0f2fe)]",
    cardBgBorder: "bg-white/80 border-sky-200 shadow-xl shadow-sky-900/5",
    inputStyle:
      "bg-sky-50/30 border-sky-200 text-slate-800 focus:ring-2 focus:ring-sky-400 shadow-sm",
    borderToggle: "border-sky-100",
    btnGradient: "from-sky-500 to-indigo-500",
    textLabel: "text-sky-600",
    textToggle: "text-sky-600 hover:text-sky-500",
    glow: "bg-sky-300",
  },
  green: {
    pageBg: "bg-emerald-50/40 text-slate-900",
    radialBg: "bg-[radial-gradient(circle_at_top,_#f0fdf4,_#dcfce7)]",
    cardBgBorder:
      "bg-white/80 border-emerald-200 shadow-xl shadow-emerald-900/5",
    inputStyle:
      "bg-emerald-50/30 border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 shadow-sm",
    borderToggle: "border-emerald-100",
    btnGradient: "from-emerald-500 to-teal-500",
    textLabel: "text-emerald-600",
    textToggle: "text-emerald-600 hover:text-emerald-500",
    glow: "bg-emerald-300",
  },
};

const activeThemeMap = computed(
  () => authThemeMap[currentTheme.value] || authThemeMap.cream,
);

const changeTheme = (themeKey) => {
  currentTheme.value = themeKey;
  if (import.meta.client) {
    localStorage.setItem("diary-active-theme", themeKey);
  }
};

const email = ref("");
const password = ref("");
const isRegister = ref(false);
const loading = ref(false);

// State baru untuk show/hide password
const showPassword = ref(false);

onMounted(() => {
  if (import.meta.client) {
    const savedTheme = localStorage.getItem("diary-active-theme");
    if (savedTheme && authThemeMap[savedTheme]) {
      currentTheme.value = savedTheme;
    }

    const savedMode = localStorage.getItem("diary-auth-mode");
    if (savedMode) {
      isRegister.value = savedMode === "register";
    }
  }
});

const toggleAuthMode = () => {
  isRegister.value = !isRegister.value;
  // Reset mata pas ganti mode auth biar tetep tertutup semula
  showPassword.value = false;

  if (import.meta.client) {
    localStorage.setItem(
      "diary-auth-mode",
      isRegister.value ? "register" : "login",
    );
  }
};

const { $fbAuth } = useNuxtApp();
const router = useRouter();
const db = getFirestore();

const getDisplayNameFromEmail = (emailValue) => {
  const rawName = String(emailValue || "")
    .split("@")[0]
    .trim();
  if (!rawName) return "User";
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    if (isRegister.value) {
      const userCredential = await createUserWithEmailAndPassword(
        $fbAuth,
        email.value,
        password.value,
      );

      const user = userCredential.user;
      const derivedDisplayName = getDisplayNameFromEmail(email.value);

      await updateProfile(user, {
        displayName: derivedDisplayName,
      });

      await setDoc(doc(db, "user_diaries", user.uid), {
        uid: user.uid,
        email: user.email || email.value,
        displayName: derivedDisplayName,
        createdAt: serverTimestamp(),
      });

      alert("Selamat! Akun diary kamu berhasil dibuat.");

      if (import.meta.client) {
        localStorage.removeItem("diary-auth-mode");
      }
    } else {
      await signInWithEmailAndPassword($fbAuth, email.value, password.value);

      if (import.meta.client) {
        localStorage.removeItem("diary-auth-mode");
      }
    }

    router.push("/");
  } catch (error) {
    console.error("FIREBASE ERROR DETECTED:", error);

    if (error.code === "auth/email-already-in-use") {
      alert("Email sudah terdaftar. Silakan login langsung.");
    } else if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential"
    ) {
      alert("Email atau password salah. Periksa kembali data kamu.");
    } else {
      alert(`Terjadi kesalahan: [${error.code}] - ${error.message}`);
    }
  } finally {
    loading.value = false;
  }
};
</script>
