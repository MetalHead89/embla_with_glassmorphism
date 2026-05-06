<script setup lang="ts">
/**
 * Embla v8 + Vue: структура и стили как в документации
 * https://www.embla-carousel.com/docs/v8/get-started/vue
 * https://www.embla-carousel.com/docs/v8/guides/required-setup
 * Переменная ширина слайдов: https://www.embla-carousel.com/docs/guides/slide-sizes (v9, те же принципы)
 */
import useEmblaCarousel from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import { nextTick, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  categories: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: true,
    align: 'start',
  },
  [
    Autoplay({
      delay: 4000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ],
)

function syncFromModel() {
  const api = emblaApi.value
  if (!api || props.categories.length === 0) return
  const i = props.categories.indexOf(props.modelValue)
  if (i < 0) return
  if (api.selectedScrollSnap() !== i) {
    api.scrollTo(i)
  }
}

function onSelect() {
  const api = emblaApi.value
  if (!api) return
  const cat = props.categories[api.selectedScrollSnap()]
  if (cat && cat !== props.modelValue) {
    emit('update:modelValue', cat)
  }
}

let removeSelectListener: (() => void) | undefined

watch(
  emblaApi,
  (api) => {
    removeSelectListener?.()
    removeSelectListener = undefined
    if (!api) return
    api.on('select', onSelect)
    removeSelectListener = () => {
      api.off('select', onSelect)
    }
    void nextTick(() => {
      api.plugins()?.autoplay?.play()
      syncFromModel()
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  removeSelectListener?.()
})

watch(
  () => props.modelValue,
  () => {
    void nextTick(() => syncFromModel())
  },
)

watch(
  () => props.categories.join('|'),
  () => {
    void nextTick(() => {
      emblaApi.value?.reInit()
      syncFromModel()
    })
  },
)

function selectCategory(index: number) {
  const cat = props.categories[index]
  if (!cat) return
  emit('update:modelValue', cat)
  emblaApi.value?.scrollTo(index)
}

function formatLabel(slug: string) {
  if (typeof slug !== 'string') return String(slug)
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
</script>

<template>
  <section
    class="category-strip"
    aria-label="Категории товаров"
  >
    <div class="embla">
      <div
        ref="emblaRef"
        class="embla__viewport"
      >
        <div class="embla__container">
          <div
            v-for="(cat, index) in categories"
            :key="cat"
            class="embla__slide"
          >
            <button
              type="button"
              class="embla__chip"
              :class="{ 'embla__chip--active': cat === modelValue }"
              :aria-pressed="cat === modelValue"
              @click="selectCategory(index)"
            >
              {{ formatLabel(cat) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/glass' as glass;

/* Обязательная обвязка Embla (v8 required-setup) */
.embla__viewport {
  overflow: hidden;
}

.embla__container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  /* Иначе flex-контейнер может сжаться до ширины вьюпорта и не дать переполнения — drag отключается */
  width: max-content;
  touch-action: pan-y pinch-zoom;
}

/* Слайды переменной ширины под контент чипа */
.embla__slide {
  flex: 0 0 auto;
  min-width: max-content;
}

.embla__chip {
  @include glass.glass-panel;
  display: block;
  margin: 0;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  color: var(--color-fg);
  cursor: grab;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }
}

.embla__chip--active {
  @include glass.glass-chip-active;
  transform: scale(1.05);
}
</style>
