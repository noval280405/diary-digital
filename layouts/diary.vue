<template>
  <div class="min-h-screen flex text-slate-100 font-sans antialiased bg-[#0b1220]">

    <!-- BACKGROUND EFFECT -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
    <div class="fixed inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]"></div>

    <!-- SIDEBAR -->
    <aside
      class="relative w-80 border-r border-slate-800/60 
      bg-slate-950/70 backdrop-blur-xl 
      p-6 flex flex-col justify-between 
      shadow-2xl shadow-black/40"
    >

      <div class="space-y-6">

        <!-- HEADER -->
        <div
          class="flex items-center gap-4 pb-5 border-b border-slate-800/60"
        >
          <div
            class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 
            flex items-center justify-center shadow-lg shadow-indigo-500/20"
          >
            📚
          </div>

          <div>
            <h2 class="font-bold text-lg tracking-wide">
              Rak Diaryku
            </h2>
            <p class="text-xs text-slate-400">
              Kelola semua cerita & kenangan
            </p>
          </div>
        </div>

        <!-- SLOT -->
        <div class="space-y-4">
          <slot name="sidebar-content" />
        </div>

      </div>

      <!-- FOOTER -->
      <div
        class="pt-5 border-t border-slate-800/60 flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 
          flex items-center justify-center font-bold shadow-lg"
        >
          NV
        </div>

        <div class="leading-tight">
          <h4 class="text-sm font-semibold tracking-wide">
            Noval's Diary
          </h4>
          <p class="text-xs text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Personal Sandbox
          </p>
        </div>
      </div>

    </aside>

    <!-- MAIN -->
    <main class="relative flex-1 flex justify-center p-8 overflow-y-auto">

      <!-- GLASS CARD CONTAINER -->
      <div class="w-full flex justify-center">
        <div
          class="w-full max-w-5xl 
          bg-slate-950/30 backdrop-blur-xl 
          border border-slate-800/60 
          rounded-[28px] shadow-2xl shadow-black/40
          p-6 md:p-10"
        >
          <slot />
        </div>
      </div>

    </main>

  </div>
</template>