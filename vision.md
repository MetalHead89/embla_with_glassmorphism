# Техническое видение проекта

## 1. Технологии

| Категория | Выбор | Обоснование |
|-----------|-------|-------------|
| **Фреймворк** | Nuxt 4 | SSR/SSG из коробки, модульность, отличная DX |
| **Бандлер** | Vite | Встроен в Nuxt 4, быстрая сборка |
| **Язык** | TypeScript | Типизация, автокомплит, безопасность |
| **UI-стек** | Tailwind CSS + SCSS | Утилитарные классы + кастомные стили (glassmorphism) |
| **Слайдер** | Embla Carousel | Легкий (4KB), touch-friendly, плавные анимации |
| **Анимации** | CSS Transforms | 60fps через transform, упрощённые переходы |
| **Данные** | DummyJSON (REST) | Бесплатно, CORS, категории + товары с изображениями |
| **Хостинг** | Netlify | Прямая сборка из Git, бесплатный tier |
| **Среда** | Node.js 24.14.0 (строго) | Стабильность, совместимость |

---

## 2. Принцип разработки (KISS)

- **Минимализм**: только необходимые зависимости (Embla, Tailwind, Nuxt)
- **Компонентная архитектура**:
  - `HeroSection.vue` — фон-изображение категории
  - `CategorySlider.vue` — слайдер чипсов категорий (Embla)
  - `ProductGrid.vue` — сетка карточек товаров
  - `ProductCard.vue` — единый компонент карточки
  - `Footer.vue` — простой футер
- **State**: локальный в странице (`useState`/`ref`), без Pinia
- **Запросы**: `useFetch` в `index.vue`, кэширование в памяти на время сессии
- **Типизация**: интерфейсы в `types/index.ts`
- **Стили**:
  - Tailwind для сетки, отступов, typography
  - SCSS модули для glassmorphism эффектов (backdrop-filter)
- **Нет**:
  - сложного state management
  - Redux/Pinia
  - лишних библиотек

---

## 3. Используемые данные

**API**: DummyJSON (`https://dummyjson.com`)

**Endpoints**:
- `GET /products/categories` → `string[]` (список категорий)
- `GET /products/category/{category}` → `{ products: Product[] }`

**Интерфейс `Product`**:
```typescript
interface Product {
  id: number
  title: string
  description: string
  price: number
  images: string[]  // используем images[0]
  brand: string
  category: string
}
```

**Логика**:
- При mount страницы: загружаем категории + товары первой категории
- При клике на категорию: запрос товаров этой категории
- Лимит: 50 товаров (обрезаем если больше)
- Нет пагинации, нет «Load more»

---

## 4. Требования к изображениям

**Источники**:
- Изображения категорий для херо-блока: `images[0]` первого товара категории
- Изображения товаров: `images[0]` каждого товара

**Обработка**:
- Lazy loading через `loading="lazy"` у `<img>`
- Форматы: WebP/JPEG (DummyJSON отдает JPEG)
- Fallback: при ошибке загрузки — заглушка (серый фон + иконка)

**Размеры** (рекомендуемые):
- Херо-блок: 1920×600px (cover)
- Карточка товара: 400×400px (object-fit: cover)

---

## 5. Обеспечение быстродействия

**Критичные оптимизации**:
- **Изображения**: lazy loading + приоритетная загрузка херо-изображения
- **Слайдер**: Embla Carousel использует CSS `transform: translate3d` (аппаратное ускорение)
- **CSS**: минифицированный Tailwind, `will-change` для анимируемых элементов
- **JavaScript**: tree-shaking (Vite), code-splitting (Nuxt auto-imports)
- **Кэширование**: браузерный cache для статики (Nitro), HTTP/2 push

**Web Vitals цели**:
- LCP < 2.5s (оптимизированный херо-изображение)
- CLS < 0.1 (фиксированные размеры карточек)
- INP < 200ms (лёгкие анимации transform)

**Метрики проверки**: Lighthouse (Performance ≥90), Chrome DevTools (Performance tab)

---

## 6. Внешний вид и анимации

**Тема**: Dark mode (тёмный фон страницы)

**Glassmorphism**:
- Карточки/чипсы: `background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2)`
- Активный чипс: `background: rgba(255,255,255,0.9);`

**Анимации переходов** (при смене категории):
- **Херо-блок**: cross-fade (0.4s ease)
- **Сетка товаров**: stagger fade-in (each card delay 50ms, duration 0.3s)
- **Активный чипс**: scale(1.05) + full opacity transition

**Сетка товаров**:
- Мобильно: 1 колонка
- Планшет: 2 колонки
- Десктоп: 4 колонки

**Слайдер категорий**:
- Горизонтальный scroll-snap
- Touch-свайпы
- Автопроигрывание (пауза при наведении)

**Футер**:
- Простой текстовый футер на усмотрение разработчика
