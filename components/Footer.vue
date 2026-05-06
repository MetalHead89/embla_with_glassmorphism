<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/5 bg-page/80 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p class="text-sm text-muted">
          © {{ year }} Embla Glass. Built with Nuxt + Tailwind.
        </p>
        <nav class="flex gap-4 text-sm text-muted">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors hover:text-white"
          >
            DummyJSON
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '~/assets/scss/glass' as glass;

footer {
  @include glass.glass-panel;
  border-top: 1px solid var(--glass-border);
}
</style>
