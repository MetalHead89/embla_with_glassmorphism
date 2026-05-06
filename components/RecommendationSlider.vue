<script setup lang="ts">
import useEmblaCarousel from 'embla-carousel-vue'
import type { Product } from '~/types'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  'product-click': [product: Product]
}>()

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: true,
  align: 'start',
  dragFree: true,
})
</script>

<template>
  <div
    class="embla mt-2 max-w-full w-full"
    aria-label="Рекомендуемые товары"
  >
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <li
          v-for="product in products"
          :key="product.id"
          class="embla__slide"
        >
          <ProductCard
            :product="product"
            class="h-full w-full min-w-0"
            @click="emit('product-click', product)"
          />
        </li>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.embla__viewport {
  overflow: hidden;
  width: 100%;
}

.embla__container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: max-content;
  touch-action: pan-y pinch-zoom;
  margin-left: 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.embla__slide {
  flex: 0 0 auto;
  min-width: 0;
  width: 140px;
  max-width: 45%;
  display: flex;
  align-items: stretch;
}

:deep(.card) {
  width: 100%;
  height: 100%;
  transform: none !important;
  transition: none !important;
  margin: 0;
}

:deep(.card:hover) {
  transform: none !important;
}

:deep(.media) {
  aspect-ratio: 1 / 1;
}
</style>