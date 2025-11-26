<template>
  <li class="relative" ref="itemEl" @mouseenter="onEnter" @mouseleave="onLeave">
    <!-- Parent row for all screens -->
    <div
      class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center bg-white"
      @click="$emit('select-category', category)"
    >
      <div class="flex items-center gap-2">
        <img
          v-if="category.imageUrl"
          :src="category.imageUrl"
          alt=""
          class="w-6 h-6 object-cover rounded"
        />
        <i v-else class="fas fa-box text-gray-500 w-6 h-6"></i>
        <span class="text-gray-800">{{ category.name }}</span>
      </div>

      <span v-if="hasChildren && isDesktop" class="text-gray-500">›</span>
    </div>

    <!-- Flyout for desktop / laptop -->
    <div
      v-if="showFlyout && hasChildren && isDesktop"
      :style="flyoutStyle"
      class="bg-white border shadow-xl z-[99999] min-w-[220px] max-h-[70vh] overflow-auto"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
    >
      <ul class="py-1">
        <CategoryItem
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          @select-category="$emit('select-category', $event)"
        />
      </ul>
    </div>

    <!-- Mobile / Tablet Horizontal Row with prev/next buttons -->
    <div v-if="isMobile && hasChildren" class="relative mt-2">
      <!-- Prev button -->
      <button
        v-if="scrollX > 0"
        @click="scrollPrev"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded shadow z-10"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <!-- Scrollable row -->
      <div
        ref="scrollContainer"
        class="flex space-x-4 px-8 overflow-x-auto scrollbar-hide"
      >
        <div
          v-for="child in category.children"
          :key="child.id"
          @click="$emit('select-category', child)"
          class="flex flex-col items-center min-w-[100px] bg-white border rounded-lg shadow hover:shadow-md p-2 cursor-pointer"
        >
          <img
            v-if="child.imageUrl"
            :src="child.imageUrl"
            alt=""
            class="w-10 h-10 object-cover rounded mb-1"
          />
          <i
            v-else
            class="fas fa-box text-gray-400 mb-1 w-10 h-10 flex items-center justify-center text-xl bg-gray-100 rounded"
          ></i>
          <span class="text-xs text-center">{{ child.name }}</span>
        </div>
      </div>

      <!-- Next button -->
      <button
        v-if="canScrollNext"
        @click="scrollNext"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded shadow z-10"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </li>
</template>

<script>
export default {
  name: "CategoryItem",
  props: {
    category: { type: Object, required: true },
  },
  emits: ["select-category"],
  data() {
    return {
      showFlyout: false,
      flyoutStyle: {},
      scrollX: 0,
      scrollWidth: 0,
      containerWidth: 0,
    };
  },
  computed: {
    hasChildren() {
      return this.category.children && this.category.children.length > 0;
    },
    isDesktop() {
      return window.innerWidth >= 768; // Desktop/laptop
    },
    isMobile() {
      return window.innerWidth < 768; // Tablet/mobile
    },
    canScrollNext() {
      return this.scrollX + this.containerWidth < this.scrollWidth;
    },
  },
  mounted() {
    if (this.isMobile && this.hasChildren) {
      this.updateScrollValues();
      window.addEventListener("resize", this.updateScrollValues);
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateScrollValues);
  },
  methods: {
    onEnter() {
      if (!this.isDesktop) return;
      this.showFlyout = true;
      this.$nextTick(() => {
        const el = this.$refs.itemEl;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const left = rect.right;
        const top = rect.top;
        const maxHeight = Math.max(window.innerHeight - top - 12, 120);
        this.flyoutStyle = {
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 99999,
          minWidth: "220px",
          maxHeight: `${maxHeight}px`,
          overflowY: "auto",
        };
      });
    },
    onLeave() {
      if (!this.isDesktop) return;
      this.showFlyout = false;
    },
    updateScrollValues() {
      const container = this.$refs.scrollContainer;
      if (!container) return;
      this.scrollWidth = container.scrollWidth;
      this.containerWidth = container.clientWidth;
      this.scrollX = container.scrollLeft;
    },
    scrollPrev() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: -100, behavior: "smooth" });
      this.scrollX = container.scrollLeft - 100;
    },
    scrollNext() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: 100, behavior: "smooth" });
      this.scrollX = container.scrollLeft + 100;
    },
  },
};
</script>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
