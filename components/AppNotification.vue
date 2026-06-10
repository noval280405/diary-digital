<template>
  <Transition name="notif-fade">
    <div
      v-if="notificationStore.snackbar"
      class="notif-wrapper"
      :class="notificationStore.type"
    >
      <div class="notif-card">
        <!-- ICON -->
        <div class="icon" :class="notificationStore.type">
          <span v-if="notificationStore.type === 'success'">✔</span>
          <span v-else-if="notificationStore.type === 'error'">✕</span>
          <span v-else-if="notificationStore.type === 'info'">⚠</span>
          <span v-else>•</span>
        </div>

        <!-- MESSAGE -->
        <div class="message">
          {{ notificationStore.message }}
        </div>

        <!-- CLOSE -->
        <button class="close" @click="closeNotif">
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from "vue";
const notificationStore = useNotificationStore();

let timer: ReturnType<typeof setTimeout> | null = null;

function closeNotif() {
  notificationStore.snackbar = false;
}

watch(
  () => notificationStore.snackbar,
  (val) => {
    if (val) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        notificationStore.snackbar = false;
      }, 3000); // 3 detik
    }
  }
);

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
/* ================= WRAPPER ================= */
.notif-wrapper {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
}

/* ================= CARD ================= */
.notif-card {
  display: flex;
  align-items: center;
  gap: 12px;

  min-width: 300px;
  max-width: 380px;

  padding: 14px 16px;
  border-radius: 18px;

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);

  color: white;
}

/* SUCCESS */
.notif-wrapper.success .notif-card {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.95),
    rgba(22, 163, 74, 0.95)
  );
}

/* ERROR */
.notif-wrapper.error .notif-card {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.95),
    rgba(220, 38, 38, 0.95)
  );
}

/* INFO */
.notif-wrapper.info .notif-card {
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.95),
    rgba(234, 88, 12, 0.95)
  );
}

/* ================= ICON ================= */
.icon {
  width: 36px;
  height: 36px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.18);

  font-size: 15px;
  font-weight: 900;

  flex-shrink: 0;
}

/* ================= MESSAGE ================= */
.message {
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

/* ================= CLOSE ================= */
.close {
  width: 28px;
  height: 28px;

  border: none;
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.15);

  color: white;

  cursor: pointer;

  transition: all 0.2s ease;
}

.close:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

/* ================= ANIMATION ================= */
.notif-fade-enter-active,
.notif-fade-leave-active {
  transition: all 0.25s ease;
}

.notif-fade-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

.notif-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}
</style>