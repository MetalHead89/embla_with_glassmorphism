<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/** Дефолт — первое изображение товара (DummyJSON), позже подставится из категории */
const DEFAULT_IMAGE_URL =
  'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp'

const props = withDefaults(
  defineProps<{
    /** URL фона (cover); при ошибке — заглушка */
    imageUrl?: string
    /** alt для фонового изображения */
    imageAlt?: string
  }>(),
  {
    imageUrl: DEFAULT_IMAGE_URL,
    imageAlt: '',
  },
)

const loadError = ref(false)

const resolvedAlt = computed(() => props.imageAlt || 'Фон категории')

function onImgError() {
  loadError.value = true
}

watch(
  () => props.imageUrl,
  () => {
    loadError.value = false
  },
)
</script>

<template>
  <section
    class="relative isolate w-full overflow-hidden bg-zinc-950"
    aria-label="Главный баннер категории"
  >
    <!-- Фон: изображение или заглушка -->
    <img
      v-if="!loadError"
      :src="imageUrl"
      :alt="resolvedAlt"
      class="absolute inset-0 h-full w-full object-cover"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      width="1920"
      height="600"
      @error="onImgError"
    />
    <div
      v-else
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-6 text-center"
      role="img"
      :aria-label="resolvedAlt"
    >
      <svg
        class="h-14 w-14 text-zinc-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
      <span class="text-sm text-zinc-500">Изображение недоступно</span>
    </div>

    <!-- Затемнение для читаемости контента -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20"
      aria-hidden="true"
    />

    <div
      class="relative z-10 mx-auto flex min-h-[clamp(280px,42vw,600px)] max-w-7xl flex-col justify-end px-4 pb-10 pt-16 sm:px-6 sm:pb-12 lg:px-8"
    >
      <slot />
    </div>
  </section>
</template>
