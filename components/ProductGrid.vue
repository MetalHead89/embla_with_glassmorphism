<script setup lang="ts">
import type { Product } from '~/types'

defineProps<{
  products: Product[]
}>()
</script>

<template>
  <ul
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    aria-label="Товары"
  >
    <li
      v-for="p in products"
      :key="p.id"
      class="min-w-0"
    >
      <ProductCard :product="p" />
    </li>
  </ul>
</template>
