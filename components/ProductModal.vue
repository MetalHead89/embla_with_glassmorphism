<script setup lang="ts">
import { ref, watch } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import type { Product } from '~/types'

const props = defineProps<{
  modelValue: boolean
  product: Product
  recommendations: Product[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'product-click': [product: Product]
}>()

const activeImageIndex = ref(0)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      activeImageIndex.value = 0
    }
  },
)

const modifiers = [
  { id: 'm1', name: 'Standard', price: 0 },
  { id: 'm2', name: 'Premium', price: 49 },
  { id: 'm3', name: 'Deluxe', price: 99 },
]

function formatPrice(n: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n)
}

function selectImage(idx: number) {
  activeImageIndex.value = idx
}

function closeModal() {
  emit('update:modelValue', false)
}

function handleRecClick(product: Product) {
  emit('product-click', product)
}
</script>

<template>
  <VueFinalModal
    :model-value="modelValue"
    :show-close-button="false"
    :click-to-close="true"
    :esc-to-close="true"
    :z-index-base="1000"
    class=""
    content-class="max-w-[800px] h-[90vh] rounded-[20px_20px_0_0] absolute left-0 bottom-0 w-full md:left-1/2 md:-translate-x-1/2 md:bottom-[initial] md:top-1/2 md:-translate-y-1/2 md:h-fit md:max-h-[700px]"
    @update:model-value="closeModal"
  >
    <div :class="$style.modal">
      <button
        type="button"
        :class="$style.closeBtn"
        @click="closeModal"
        aria-label="Закрыть"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="h-full overflow-y-auto md:flex md: flex-row md:gap-4">
        <div :class="$style.gallery">
          <div :class="$style.mainImage">
            <img
              v-if="product.images?.[activeImageIndex]"
              :src="product.images[activeImageIndex]"
              :alt="product.title"
              class="h-full w-full object-cover"
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
          <div v-if="product.images && product.images.length > 1" :class="$style.thumbs">
            <button
              v-for="(img, idx) in product.images.slice(0, 5)"
              :key="idx"
              type="button"
              :class="[
                $style.thumb,
                idx === activeImageIndex ? $style.thumbActive : '',
              ]"
              @click="selectImage(idx)"
            >
              <img :src="img" :alt="`${product.title} ${idx + 1}`" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <div :class="$style.info">
          <p v-if="product.brand" :class="$style.brand">
            {{ product.brand }}
          </p>
          <h2 :class="$style.title">
            {{ product.title }}
          </h2>
          <p :class="$style.price">
            {{ formatPrice(product.price) }}
          </p>
          <p :class="$style.description">
            {{ product.description }}
          </p>

          <div :class="$style.section">
            <h3 :class="$style.sectionTitle">Модификаторы</h3>
            <div :class="$style.modifiers">
              <div
                v-for="mod in modifiers"
                :key="mod.id"
                :class="$style.modifierCard"
              >
                <span :class="$style.modifierName">{{ mod.name }}</span>
                <span :class="$style.modifierPrice">{{ formatPrice(mod.price) }}</span>
              </div>
            </div>
          </div>

          <div v-if="recommendations.length > 0" :class="$style.section">
            <h3 :class="$style.sectionTitle">Рекомендации</h3>
            <RecommendationSlider
              :products="recommendations"
              @product-click="handleRecClick"
            />
          </div>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<style lang="scss" module>
@use '~/assets/scss/glass' as glass;

.modal {
  @include glass.glass-panel;
  position: relative;
  border-radius: 1rem;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.closeBtn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-fg);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
}

.gallery {
  background: inherit;
  padding: 1rem 1rem 0;

  @media screen and (min-width: 768px) {
    position: sticky;
    top: 0;
    z-index: 10;
    min-width: 300px;
  }
}

.mainImage {
  aspect-ratio: 1 / 1;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.35);
}

.placeholder {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.thumbs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumb {
  flex: 0 0 auto;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &Active {
    border-color: rgba(255, 255, 255, 0.5);
  }
}

.info {
  padding: 0 1rem 1rem;

  @media screen and (min-width: 768px) {
    width: 60%;
    flex-shrink: 0;
  }
}

.brand {
  margin: 0;
  margin-top: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.title {
  margin: 0;
  margin-top: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-fg);
  line-height: 1.2;
}

.price {
  margin: 0;
  margin-top: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-fg);
}

.description {
  margin: 0;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-muted);
}

.section {
  margin-top: 0.75rem;
}

.sectionTitle {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-fg);
}

.modifiers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.modifierCard {
  @include glass.glass-panel;
  flex: 1 1 calc(33.333% - 0.5rem);
  min-width: 70px;
  border-radius: 0.375rem;
  padding: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.modifierName {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--color-fg);
}

.modifierPrice {
  font-size: 0.6rem;
  color: var(--color-muted);
}

@media (max-width: 767px) {
  .modal {
    border-radius: 1rem 1rem 0 0;
    max-width: 100%;
  }
}
</style>