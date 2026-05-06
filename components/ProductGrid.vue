<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  'product-click': [product: Product]
}>()
</script>

<template>
  <ul
    :key="products.length"
    class="grid min-h-screen grid-cols-1 grid-rows-1 gap-6 auto-rows-fr sm:grid-cols-2 lg:grid-cols-4"
    aria-label="Товары"
  >
    <li
      v-for="(p, idx) in products"
      :key="p.id"
      class="product-card-wrapper min-w-0"
      :style="{ animationDelay: `${idx * 50}ms` }"
    >
      <ProductCard
        :product="p"
        @click="emit('product-click', p)"
      />
    </li>
  </ul>
</template>

<style>
.product-card-wrapper {
  animation: product-fade-in 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes product-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
