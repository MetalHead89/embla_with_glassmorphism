<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product, CategoryItem } from '~/types'

/** Кэш товаров по категориям (сессия) */
const productsCache = ref<Record<string, Product[]>>({})

/** Список всех категорий (загружаем из API) */
const { data: categoriesRaw } = await useFetch<CategoryItem[]>(
  'https://dummyjson.com/products/categories',
)

/** Массив slug-строк для слайдера */
const categories = computed(() =>
  (categoriesRaw.value ?? []).map((c) => c.slug),
)

/** Map slug → имя категории для Hero-заголовка */
const categoryNames = computed(() => {
  const map: Record<string, string> = {}
  for (const c of categoriesRaw.value ?? []) {
    map[c.slug] = c.name
  }
  return map
})

/** Активная категория — первая после загрузки */
const activeCategory = ref<string>('')

/** Загрузка товаров для категории с кэшированием */
async function loadProducts(category: string) {
  if (productsCache.value[category]) {
    return
  }
  const { data } = await useFetch<{ products: Product[] }>(
    `https://dummyjson.com/products/category/${category}`,
    {
      query: { limit: '50' },
    },
  )
  if (data.value?.products) {
    productsCache.value[category] = data.value.products.slice(0, 50)
  }
}

/** При смене категории — подгружаем товары (если ещё в кэше) */
watch(
  activeCategory,
  (cat) => {
    if (cat && !productsCache.value[cat]) {
      void loadProducts(cat)
    }
  },
  { immediate: true },
)

/** Товары для отображения (из кэша) */
const products = computed(() => {
  const cat = activeCategory.value
  if (!cat) return []
  return productsCache.value[cat] ?? []
})

/** URL фона для HeroSection — первое изображение первого товара категории */
const heroImageUrl = computed(() => {
  const prods = products.value
  if (prods.length > 0 && prods[0].images?.[0]) {
    return prods[0].images[0]
  }
  return ''
})

/** Инициализируем активную категорию после загрузки categories */
watch(
  categories,
  (cats) => {
    if (cats.length > 0 && !activeCategory.value) {
      activeCategory.value = cats[0]
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-screen bg-page text-fg">
    <HeroSection :image-url="heroImageUrl" :image-alt="categoryNames[activeCategory] || 'Категория'">
      <div class="max-w-3xl">
        <p class="mb-2 text-sm font-medium uppercase tracking-wider text-white/80">
          Категория
        </p>
        <h2 class="text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl">
          {{ categoryNames[activeCategory] || 'Загрузка...' }}
        </h2>
        <p class="mt-3 max-w-xl text-lead text-white/90 drop-shadow">
          Фоновое изображение — первый товар выбранной категории. При ошибке загрузки показывается заглушка.
        </p>
      </div>
    </HeroSection>

    <div class="border-b border-white/5 bg-page py-4 sm:py-5">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySlider
          v-model="activeCategory"
          :categories="categories"
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
          Данные с DummyJSON. {{ products.length }} товаров в категории «{{ categoryNames[activeCategory] }}».
        </p>
      </header>

      <ProductGrid :products="products" />
    </main>

    <Footer />
  </div>
</template>
