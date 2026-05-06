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
    class="embla"
    aria-label="Рекомендуемые товары"
  >
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <div
          v-for="product in products"
          :key="product.id"
          class="embla__slide"
        >
          <ProductCard
            :product="product"
            class="h-full w-full min-w-0"
            @click="emit('product-click', product)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.embla {
  --slide-spacing: 1rem;
  --slide-size: 140px;
  user-select: none;
}

.embla__viewport {
  padding: 10px 0;
  overflow: hidden;
}

.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}

.embla__slide {
  transform: translate3d(0, 0, 0);
  width: fit-content;
  flex: 0 0 var(--slide-size);
  min-width: 0;
  padding-left: var(--slide-spacing);
}
</style>