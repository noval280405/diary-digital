import { computed, watchEffect } from "vue";

export const useDiaryTheme = () => {
  const currentTheme = useState<string>("diary-active-theme", () => "cream");
  const darkMode = computed(() => currentTheme.value === "dark");

  watchEffect(() => {
    if (!import.meta.client) return;
    document.documentElement.classList.toggle("dark", darkMode.value);
    document.documentElement.style.colorScheme = darkMode.value ? "dark" : "light";
  });

  const toggleTheme = () => {
    currentTheme.value = darkMode.value ? "cream" : "dark";
    if (import.meta.client) {
      localStorage.setItem("diary-active-theme", currentTheme.value);
    }
  };

  return { darkMode, toggleTheme };
};
