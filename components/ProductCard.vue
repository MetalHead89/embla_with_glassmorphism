<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '~/types'

const props = defineProps<{
  product: Product
}>()

const imageSrc = ref(props.product.images[0] ?? '')
const imageFailed = ref(!props.product.images[0])

watch(
  () => props.product.id,
  () => {
    imageSrc.value = props.product.images[0] ?? ''
    imageFailed.value = !props.product.images[0]
  },
)

function onImgError() {
  imageFailed.value = true
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n)
}
</script>

<template>
  <article :class="$style.card">
    <div :class="$style.media">
      <img
        v-if="!imageFailed && imageSrc"
        :src="imageSrc"
        :alt="product.title"
        class="h-full w-full object-cover"
        loading="lazy"
        width="400"
        height="400"
        decoding="async"
        @error="onImgError"
      />
      <div
        v-else
        :class="$style.placeholder"
        role="img"
        :aria-label="`Нет фото: ${product.title}`"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.2"
          stroke="currentColor"
          class="h-12 w-12 text-zinc-500"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
    </div>
    <div :class="$style.body">
      <p
        v-if="product.brand"
        :class="$style.brand"
      >
        {{ product.brand }}
      </p>
      <h3 :class="$style.title">
        {{ product.title }}
      </h3>
      <p :class="$style.price">
        {{ formatPrice(product.price) }}
      </p>
    </div>
  </article>
</template>

<style lang="scss" module>
@use '~/assets/scss/glass' as glass;

.card {
  @include glass.glass-panel;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1rem;
  transition: transform 0.2s ease;

  &:focus-within {
    outline: 2px solid rgba(255, 255, 255, 0.35);
    outline-offset: 2px;
  }
}

.media {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.35);
}

.placeholder {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgb(39 39 42) 0%, rgb(24 24 27) 100%);
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem 1.15rem;
}

.brand {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.title {
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-fg);
}

.price {
  margin: 0;
  margin-top: auto;
  padding-top: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-fg);
}
</style>
