<script setup lang="ts">
/**
 * Embla v8 + Vue: структура и стили как в документации
 * https://www.embla-carousel.com/docs/v8/get-started/vue
 * https://www.embla-carousel.com/docs/v8/guides/required-setup
 * Переменная ширина слайдов: https://www.embla-carousel.com/docs/guides/slide-sizes (v9, те же принципы)
 */
import useEmblaCarousel from 'embla-carousel-vue'
// import Autoplay from 'embla-carousel-autoplay'
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
    // loop: true,
    align: 'start',
    dragFree: true,
  },
  [
    // Autoplay({
    //   delay: 4000,
    //   stopOnMouseEnter: true,
    //   stopOnInteraction: false,
    // }),
  ],
)

let isProgrammaticScroll = false

function getNearestCategoryIndex() {
  const api = emblaApi.value
  if (!api || props.categories.length === 0) return -1

  const currentProgress = ((api.scrollProgress() % 1) + 1) % 1
  const snaps = api.scrollSnapList()

  let nearestIndex = -1
  let nearestDistance = Number.POSITIVE_INFINITY

  snaps.forEach((snap, index) => {
    const delta = Math.abs(currentProgress - snap)
    const wrappedDelta = Math.abs(1 - delta)
    const distance = Math.min(delta, wrappedDelta)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return nearestIndex
}

function syncFromModel() {
  const api = emblaApi.value
  if (!api || props.categories.length === 0) return
  const i = props.categories.indexOf(props.modelValue)
  if (i < 0) return
  if (api.selectedScrollSnap() !== i) {
    isProgrammaticScroll = true
    api.scrollTo(i)
  }
}

function onSelect() {
  if (isProgrammaticScroll) {
    isProgrammaticScroll = false
    return
  }
  const api = emblaApi.value
  if (!api) return
  const cat = props.categories[api.selectedScrollSnap()]
  if (cat && cat !== props.modelValue) {
    emit('update:modelValue', cat)
  }
}

function onSettle() {
  if (isProgrammaticScroll) {
    isProgrammaticScroll = false
    return
  }

  const api = emblaApi.value
  if (!api || props.categories.length === 0) return

  // After a free drag, Embla may not change the selected snap on its own.
  // We pick the nearest category here so the slider keeps the user's position.
  const nearestIndex = getNearestCategoryIndex()
  if (nearestIndex < 0) return

  const cat = props.categories[nearestIndex]
  if (!cat) return

  if (cat !== props.modelValue || api.selectedScrollSnap() !== nearestIndex) {
    isProgrammaticScroll = true
    emit('update:modelValue', cat)
    api.scrollTo(nearestIndex)
  }
}

let removeEmblaListener: (() => void) | undefined

watch(
  emblaApi,
  (api) => {
    removeEmblaListener?.()
    removeEmblaListener = undefined
    if (!api) return
    api.on('select', onSelect)
    api.on('settle', onSettle)
    removeEmblaListener = () => {
      api.off('select', onSelect)
      api.off('settle', onSettle)
    }
    // void nextTick(() => {
    //   api.plugins()?.autoplay?.play()
    //   syncFromModel()
    // })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  removeEmblaListener?.()
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
  isProgrammaticScroll = true
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
  <div
    class="embla mt-2 max-w-full w-full"
    aria-label="Рекомендуемые товары"
  >
    <div class="embla__viewport" ref="emblaRef">
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
</template>

<style scoped lang="scss">
@use '~/assets/scss/glass' as glass;

.embla {
  --slide-spacing: 1rem;
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
  padding-left: var(--slide-spacing);
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
