import { defineComponent, ref, withAsyncContext, computed, watch, mergeProps, withCtx, createVNode, toDisplayString, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, nextTick, unref, useSSRContext, isRef, toValue, onServerPrefetch, reactive, toRef } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import useEmblaCarousel from 'embla-carousel-vue';
import { _ as _export_sfc, a as useNuxtApp, d as asyncDataDefaults, g as fetchDefaults, f as createError } from './server.mjs';
import { y as hash } from '../_/nitro.mjs';
import { isPlainObject } from '@vue/shared';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

//#region src/index.ts
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

const DEFAULT_IMAGE_URL = "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp";
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "HeroSection",
  __ssrInlineRender: true,
  props: {
    imageUrl: { default: DEFAULT_IMAGE_URL },
    imageAlt: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const loadError = ref(false);
    const resolvedAlt = computed(() => props.imageAlt || "Фон категории");
    const imgKey = ref(0);
    watch(
      () => props.imageUrl,
      () => {
        loadError.value = false;
        imgKey.value++;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "relative isolate w-full overflow-hidden bg-zinc-950",
        "aria-label": "Главный баннер категории"
      }, _attrs))}>`);
      if (!loadError.value) {
        _push(`<img${ssrRenderAttr("src", __props.imageUrl)}${ssrRenderAttr("alt", resolvedAlt.value)} class="hero-image absolute inset-0 h-full w-full object-cover" loading="eager" fetchpriority="high" decoding="async" width="1920" height="600">`);
      } else {
        _push(`<div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-6 text-center" role="img"${ssrRenderAttr("aria-label", resolvedAlt.value)}><svg class="h-14 w-14 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path></svg><span class="text-sm text-zinc-500">Изображение недоступно</span></div>`);
      }
      _push(`<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" aria-hidden="true"></div><div class="relative z-10 mx-auto flex min-h-[clamp(280px,42vw,600px)] max-w-7xl flex-col justify-end px-4 pb-10 pt-16 sm:px-6 sm:pb-12 lg:px-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$5, { __name: "HeroSection" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "CategorySlider",
  __ssrInlineRender: true,
  props: {
    categories: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        loop: true,
        align: "start",
        dragFree: true
      },
      [
        // Autoplay({
        //   delay: 4000,
        //   stopOnMouseEnter: true,
        //   stopOnInteraction: false,
        // }),
      ]
    );
    let isProgrammaticScroll = false;
    function getNearestCategoryIndex() {
      const api = emblaApi.value;
      if (!api || props.categories.length === 0) return -1;
      const currentProgress = (api.scrollProgress() % 1 + 1) % 1;
      const snaps = api.scrollSnapList();
      let nearestIndex = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;
      snaps.forEach((snap, index) => {
        const delta = Math.abs(currentProgress - snap);
        const wrappedDelta = Math.abs(1 - delta);
        const distance = Math.min(delta, wrappedDelta);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      return nearestIndex;
    }
    function syncFromModel() {
      const api = emblaApi.value;
      if (!api || props.categories.length === 0) return;
      const i = props.categories.indexOf(props.modelValue);
      if (i < 0) return;
      if (api.selectedScrollSnap() !== i) {
        isProgrammaticScroll = true;
        api.scrollTo(i);
      }
    }
    function onSelect() {
      if (isProgrammaticScroll) {
        isProgrammaticScroll = false;
        return;
      }
      const api = emblaApi.value;
      if (!api) return;
      const cat = props.categories[api.selectedScrollSnap()];
      if (cat && cat !== props.modelValue) {
        emit("update:modelValue", cat);
      }
    }
    function onSettle() {
      if (isProgrammaticScroll) {
        isProgrammaticScroll = false;
        return;
      }
      const api = emblaApi.value;
      if (!api || props.categories.length === 0) return;
      const nearestIndex = getNearestCategoryIndex();
      if (nearestIndex < 0) return;
      const cat = props.categories[nearestIndex];
      if (!cat) return;
      if (cat !== props.modelValue || api.selectedScrollSnap() !== nearestIndex) {
        isProgrammaticScroll = true;
        emit("update:modelValue", cat);
        api.scrollTo(nearestIndex);
      }
    }
    let removeEmblaListener;
    watch(
      emblaApi,
      (api) => {
        removeEmblaListener?.();
        removeEmblaListener = void 0;
        if (!api) return;
        api.on("select", onSelect);
        api.on("settle", onSettle);
        removeEmblaListener = () => {
          api.off("select", onSelect);
          api.off("settle", onSettle);
        };
      },
      { immediate: true }
    );
    watch(
      () => props.modelValue,
      () => {
        void nextTick(() => syncFromModel());
      }
    );
    watch(
      () => props.categories.join("|"),
      () => {
        void nextTick(() => {
          emblaApi.value?.reInit();
          syncFromModel();
        });
      }
    );
    function formatLabel(slug) {
      if (typeof slug !== "string") return String(slug);
      return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "category-strip",
        "aria-label": "Категории товаров"
      }, _attrs))} data-v-03d19084><div class="embla" data-v-03d19084><div class="embla__viewport" data-v-03d19084><div class="embla__container" data-v-03d19084><!--[-->`);
      ssrRenderList(__props.categories, (cat, index) => {
        _push(`<div class="embla__slide" data-v-03d19084><button type="button" class="${ssrRenderClass([{ "embla__chip--active": cat === __props.modelValue }, "embla__chip"])}"${ssrRenderAttr("aria-pressed", cat === __props.modelValue)} data-v-03d19084>${ssrInterpolate(formatLabel(cat))}</button></div>`);
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CategorySlider.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-03d19084"]]), { __name: "CategorySlider" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const imageSrc = ref(props.product.images[0] ?? "");
    const imageFailed = ref(!props.product.images[0]);
    watch(
      () => props.product.id,
      () => {
        imageSrc.value = props.product.images[0] ?? "";
        imageFailed.value = !props.product.images[0];
      }
    );
    function formatPrice(n) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
      }).format(n);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.card,
        tabindex: "0",
        role: "button",
        "aria-label": `Товар ${__props.product.title}`
      }, _attrs))}><div class="${ssrRenderClass(_ctx.$style.media)}">`);
      if (!imageFailed.value && imageSrc.value) {
        _push(`<img${ssrRenderAttr("src", imageSrc.value)}${ssrRenderAttr("alt", __props.product.title)} class="h-full w-full object-cover" loading="lazy" width="400" height="400" decoding="async">`);
      } else {
        _push(`<div class="${ssrRenderClass(_ctx.$style.placeholder)}" role="img"${ssrRenderAttr("aria-label", `Нет фото: ${__props.product.title}`)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="h-12 w-12 text-zinc-500" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path></svg></div>`);
      }
      _push(`</div><div class="${ssrRenderClass(_ctx.$style.body)}">`);
      if (__props.product.brand) {
        _push(`<p class="${ssrRenderClass(_ctx.$style.brand)}">${ssrInterpolate(__props.product.brand)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h3 class="${ssrRenderClass(_ctx.$style.title)}">${ssrInterpolate(__props.product.title)}</h3><p class="${ssrRenderClass(_ctx.$style.price)}">${ssrInterpolate(formatPrice(__props.product.price))}</p></div></article>`);
    };
  }
});
const card = "_card_1hb4b_1";
const media = "_media_1hb4b_22";
const placeholder = "_placeholder_1hb4b_30";
const body = "_body_1hb4b_39";
const brand = "_brand_1hb4b_47";
const title = "_title_1hb4b_56";
const price = "_price_1hb4b_68";
const style0 = {
  card,
  media,
  placeholder,
  body,
  brand,
  title,
  price
};
const cssModules = {
  "$style": style0
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__cssModules", cssModules]]), { __name: "ProductCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ProductGrid",
  __ssrInlineRender: true,
  props: {
    products: {}
  },
  emits: ["product-click"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProductCard = __nuxt_component_0;
      _push(`<ul${ssrRenderAttrs(mergeProps({
        key: __props.products.length,
        class: "grid min-h-screen grid-cols-1 grid-rows-1 gap-6 auto-rows-fr sm:grid-cols-2 lg:grid-cols-4",
        "aria-label": "Товары"
      }, _attrs))}><!--[-->`);
      ssrRenderList(__props.products, (p, idx) => {
        _push(`<li class="product-card-wrapper min-w-0" style="${ssrRenderStyle({ animationDelay: `${idx * 50}ms` })}">`);
        _push(ssrRenderComponent(_component_ProductCard, {
          product: p,
          onClick: ($event) => emit("product-click", p)
        }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductGrid.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "ProductGrid" });
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_3 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "border-t border-white/5 bg-page/80 backdrop-blur-sm" }, _attrs))} data-v-d1858374><div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" data-v-d1858374><div class="flex flex-col items-center justify-between gap-3 sm:flex-row" data-v-d1858374><p class="text-sm text-muted" data-v-d1858374> © ${ssrInterpolate(unref(year))} Embla Glass. Built with Nuxt + Tailwind. </p><nav class="flex gap-4 text-sm text-muted" data-v-d1858374><a href="https://github.com" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-white" data-v-d1858374> GitHub </a><a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-white" data-v-d1858374> DummyJSON </a></nav></div></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-d1858374"]]), { __name: "Footer" });
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
function defineKeyedFunctionFactory(factory) {
  const placeholder2 = function() {
    throw new Error(`[nuxt] \`${factory.name}\` is a compiler macro and cannot be called at runtime.`);
  };
  return Object.defineProperty(placeholder2, "__nuxt_factory", {
    enumerable: false,
    get: () => factory.factory
  });
}
const createUseAsyncData = defineKeyedFunctionFactory({
  name: "createUseAsyncData",
  factory(options = {}) {
    function useAsyncData2(...args) {
      const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
      if (_isAutoKeyNeeded(args[0], args[1])) {
        args.unshift(autoKey);
      }
      let [_key, _handler, opts = {}] = args;
      const isKeyReactive = isRef(_key) || typeof _key === "function";
      const key = isKeyReactive ? computed(() => toValue(_key)) : { value: _key };
      if (!key.value || typeof key.value !== "string") {
        throw new TypeError("[nuxt] [useAsyncData] key must be a non-empty string.");
      }
      if (typeof _handler !== "function") {
        throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
      }
      const shouldFactoryOptionsOverride = typeof options === "function";
      const nuxtApp = useNuxtApp();
      const factoryOptions = shouldFactoryOptionsOverride ? options(opts) : options;
      if (!shouldFactoryOptionsOverride) {
        for (const key2 in factoryOptions) {
          if (factoryOptions[key2] === void 0) {
            continue;
          }
          if (opts[key2] !== void 0) {
            continue;
          }
          opts[key2] = factoryOptions[key2];
        }
      }
      opts.server ??= true;
      opts.default ??= getDefault;
      opts.getCachedData ??= getDefaultCachedData;
      opts.lazy ??= false;
      opts.immediate ??= true;
      opts.deep ??= asyncDataDefaults.deep;
      opts.dedupe ??= "cancel";
      if (shouldFactoryOptionsOverride) {
        for (const key2 in factoryOptions) {
          if (factoryOptions[key2] === void 0) {
            continue;
          }
          opts[key2] = factoryOptions[key2];
        }
      }
      nuxtApp._asyncData[key.value];
      function createInitialFetch() {
        const initialFetchOptions = { cause: "initial", dedupe: opts.dedupe };
        if (!nuxtApp._asyncData[key.value]?._init) {
          initialFetchOptions.cachedData = opts.getCachedData(key.value, nuxtApp, { cause: "initial" });
          nuxtApp._asyncData[key.value] = buildAsyncData(nuxtApp, key.value, _handler, opts, initialFetchOptions.cachedData);
        }
        return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
      }
      const initialFetch = createInitialFetch();
      const asyncData = nuxtApp._asyncData[key.value];
      asyncData._deps++;
      const fetchOnServer = opts.server !== false && nuxtApp.payload.serverRendered;
      if (fetchOnServer && opts.immediate) {
        const promise = initialFetch();
        if (getCurrentInstance()) {
          onServerPrefetch(() => promise);
        } else {
          nuxtApp.hook("app:created", async () => {
            await promise;
          });
        }
      }
      const asyncReturn = {
        data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
        pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
        status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
        error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
        refresh: (...args2) => {
          if (!nuxtApp._asyncData[key.value]?._init) {
            const initialFetch2 = createInitialFetch();
            return initialFetch2();
          }
          return nuxtApp._asyncData[key.value].execute(...args2);
        },
        execute: (...args2) => asyncReturn.refresh(...args2),
        clear: () => {
          const entry = nuxtApp._asyncData[key.value];
          if (entry?._abortController) {
            try {
              entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
            } finally {
              entry._abortController = void 0;
            }
          }
          clearNuxtDataByKey(nuxtApp, key.value);
        }
      };
      const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
      Object.assign(asyncDataPromise, asyncReturn);
      Object.defineProperties(asyncDataPromise, {
        then: { enumerable: true, value: asyncDataPromise.then.bind(asyncDataPromise) },
        catch: { enumerable: true, value: asyncDataPromise.catch.bind(asyncDataPromise) },
        finally: { enumerable: true, value: asyncDataPromise.finally.bind(asyncDataPromise) }
      });
      return asyncDataPromise;
    }
    return useAsyncData2;
  }
});
const useAsyncData = createUseAsyncData.__nuxt_factory();
createUseAsyncData.__nuxt_factory({
  lazy: true,
  // @ts-expect-error private property
  _functionName: "useLazyAsyncData"
});
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function buildAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return;
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (asyncData._abortController?.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        if (nuxtApp._asyncDataPromises[key] === promise) {
          delete nuxtApp._asyncDataPromises[key];
        }
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
function generateOptionSegments(opts) {
  const segments = [
    toValue(opts.method)?.toUpperCase() || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.query || opts.params]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const entries = [];
      for (const entry of value.entries()) {
        const [key, val] = entry;
        entries.push([key, val instanceof File ? `${val.name}:${val.size}:${val.lastModified}` : val]);
      }
      segments.push(hash(entries));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const createUseFetch = defineKeyedFunctionFactory({
  name: "createUseFetch",
  factory(options = {}) {
    function useFetch2(request, arg1, arg2) {
      const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
      const factoryOptions = typeof options === "function" ? options(opts) : options;
      const {
        server,
        lazy,
        default: defaultFn,
        transform,
        pick: pick2,
        watch: watchSources,
        immediate,
        getCachedData,
        deep,
        dedupe,
        timeout,
        ...fetchOptions
      } = {
        ...typeof options === "function" ? {} : factoryOptions,
        ...opts,
        ...typeof options === "function" ? factoryOptions : {}
      };
      const _request = computed(() => toValue(request));
      const key = computed(() => toValue(fetchOptions.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(fetchOptions)]));
      if (!fetchOptions.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
        throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
      }
      const _fetchOptions = reactive({
        ...fetchDefaults,
        ...fetchOptions,
        cache: typeof fetchOptions.cache === "boolean" ? void 0 : fetchOptions.cache
      });
      const _asyncDataOptions = {
        server,
        lazy,
        default: defaultFn,
        transform,
        pick: pick2,
        immediate,
        getCachedData,
        deep,
        dedupe,
        timeout,
        watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
      };
      const asyncData = useAsyncData(watchSources === false ? key.value : key, (_, { signal }) => {
        let _$fetch = fetchOptions.$fetch || globalThis.$fetch;
        if (!opts.$fetch) {
          const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
          if (isLocalFetch) {
            _$fetch = useRequestFetch();
          }
        }
        return _$fetch(_request.value, { signal, ..._fetchOptions });
      }, _asyncDataOptions);
      return asyncData;
    }
    return useFetch2;
  }
});
const useFetch = createUseFetch.__nuxt_factory();
createUseFetch.__nuxt_factory({
  lazy: true,
  // @ts-expect-error private property
  _functionName: "useLazyFetch"
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const productsCache = ref({});
    const { data: categoriesRaw } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "https://dummyjson.com/products/categories",
      "$Yto1W9gonv"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const categories = computed(
      () => (categoriesRaw.value ?? []).map((c) => c.slug)
    );
    const categoryNames = computed(() => {
      const map = {};
      for (const c of categoriesRaw.value ?? []) {
        map[c.slug] = c.name;
      }
      return map;
    });
    const activeCategory = ref("");
    async function loadProducts(category) {
      if (productsCache.value[category]) {
        return;
      }
      const { data } = await useFetch(
        `https://dummyjson.com/products/category/${category}`,
        {
          query: { limit: "50" }
        },
        "$gbykIFOk_8"
        /* nuxt-injected */
      );
      if (data.value?.products) {
        productsCache.value[category] = data.value.products.slice(0, 50);
      }
    }
    watch(
      activeCategory,
      (cat) => {
        if (cat && !productsCache.value[cat]) {
          void loadProducts(cat);
        }
      },
      { immediate: true }
    );
    const products = computed(() => {
      const cat = activeCategory.value;
      if (!cat) return [];
      return productsCache.value[cat] ?? [];
    });
    const heroImageUrl = computed(() => {
      const prods = products.value;
      if (prods.length > 0 && prods[0].images?.[0]) {
        return prods[0].images[0];
      }
      return "";
    });
    watch(
      categories,
      (cats) => {
        if (cats.length > 0 && !activeCategory.value) {
          activeCategory.value = cats[0];
        }
      },
      { immediate: true }
    );
    const selectedProduct = ref(null);
    const isModalOpen = ref(false);
    function openProduct(product) {
      selectedProduct.value = product;
      isModalOpen.value = true;
    }
    computed(() => {
      const product = selectedProduct.value;
      if (!product || !products.value) return [];
      return products.value.filter((p) => p.id !== product.id).slice(0, 8);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HeroSection = __nuxt_component_0$1;
      const _component_CategorySlider = __nuxt_component_1;
      const _component_ProductGrid = __nuxt_component_2;
      const _component_ClientOnly = __nuxt_component_3;
      const _component_Footer = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-page text-fg" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_HeroSection, {
        "image-url": heroImageUrl.value,
        "image-alt": categoryNames.value[activeCategory.value] || "Категория"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-3xl"${_scopeId}><p class="mb-2 text-sm font-medium uppercase tracking-wider text-white/80"${_scopeId}> Категория </p><h2 class="text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl"${_scopeId}>${ssrInterpolate(categoryNames.value[activeCategory.value] || "Загрузка...")}</h2><p class="mt-3 max-w-xl text-lead text-white/90 drop-shadow"${_scopeId}> Фоновое изображение — первый товар выбранной категории. При ошибке загрузки показывается заглушка. </p></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-3xl" }, [
                createVNode("p", { class: "mb-2 text-sm font-medium uppercase tracking-wider text-white/80" }, " Категория "),
                createVNode("h2", { class: "text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl" }, toDisplayString(categoryNames.value[activeCategory.value] || "Загрузка..."), 1),
                createVNode("p", { class: "mt-3 max-w-xl text-lead text-white/90 drop-shadow" }, " Фоновое изображение — первый товар выбранной категории. При ошибке загрузки показывается заглушка. ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="border-b border-white/5 bg-page py-4 sm:py-5"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_CategorySlider, {
        modelValue: activeCategory.value,
        "onUpdate:modelValue": ($event) => activeCategory.value = $event,
        categories: categories.value
      }, null, _parent));
      _push(`</div></div><main class="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8"><header class="space-y-2"><h1 class="text-display tracking-tight"> Embla + Glassmorphism </h1><p class="text-lead text-muted max-w-2xl"> Данные с DummyJSON. ${ssrInterpolate(products.value.length)} товаров в категории «${ssrInterpolate(categoryNames.value[activeCategory.value])}». </p></header>`);
      _push(ssrRenderComponent(_component_ProductGrid, {
        products: products.value,
        onProductClick: openProduct
      }, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BQtErjfp.mjs.map
