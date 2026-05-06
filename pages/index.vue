<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '~/types'

/** 50 товаров для сетки; итерация 6 — привязка к категории и кэш */
const { data: productsPayload } = await useFetch<{ products: Product[] }>(
  'https://dummyjson.com/products',
  {
    query: { limit: '50' },
  },
)

const products = computed(
  () => productsPayload.value?.products?.slice(0, 50) ?? [],
)

/** Slugs категорий DummyJSON — 20 шт., до подстановки из API (итерация 6) */
const demoCategories = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
]

const activeCategory = ref<string>('beauty')
</script>

<template>
  <div class="min-h-screen bg-page text-fg">
    <HeroSection image-alt="Beauty — фон категории">
      <div class="max-w-3xl">
        <p class="mb-2 text-sm font-medium uppercase tracking-wider text-white/80">
          Категория
        </p>
        <h2 class="text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl">
          Hero-секция
        </h2>
        <p class="mt-3 max-w-xl text-lead text-white/90 drop-shadow">
          Фоновое изображение в режиме cover; при ошибке загрузки показывается заглушка.
        </p>
      </div>
    </HeroSection>

    <div class="border-b border-white/5 bg-page py-4 sm:py-5">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySlider
          v-model="activeCategory"
          :categories="demoCategories"
        />
      </div>
    </div>

    <main
      class="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8"
    >
      <header class="space-y-2">
        <h1 class="text-display tracking-tight">
          Embla + Glassmorphism
        </h1>
        <p class="text-lead text-muted max-w-2xl">
          Сетка из 50 карточек (лимит DummyJSON). Итерация 6 — фильтр по выбранной
          категории.
        </p>
      </header>

      <ProductGrid :products="products" />
    </main>
  </div>
</template>
