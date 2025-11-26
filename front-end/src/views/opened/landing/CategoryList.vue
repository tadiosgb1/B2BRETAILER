<template>
  <ul>
    <!-- Desktop: vertical list -->
    <template v-if="isDesktop">
      <CategoryItem
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        @select-category="$emit('select-category', $event)"
      />
    </template>

    <!-- Mobile: horizontal parent scroll -->
    <template v-else>
      <div class="relative mt-2">
        <!-- Prev Button -->
        <button
          v-if="scrollX > 0"
          @click="scrollPrev"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded shadow z-10"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Scrollable parent row -->
        <div
          ref="scrollContainer"
          class="flex space-x-4 px-8 overflow-x-auto scrollbar-hide"
        >
          <CategoryItem
            v-for="cat in categories"
            :key="cat.id"
            :category="cat"
            @select-category="$emit('select-category', $event)"
          />
        </div>

        <!-- Next Button -->
        <button
          v-if="canScrollNext"
          @click="scrollNext"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded shadow z-10"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </template>
  </ul>
</template>

<script>
import CategoryItem from "./CategoryItem.vue";

export default {
  name: "CategoryList",
  components: { CategoryItem },
  props: { categories: { type: Array, required: true } },
  emits: ["select-category"],
  data() {
    return {
      scrollX: 0,
      scrollWidth: 0,
      containerWidth: 0,
    };
  },
  computed: {
    isDesktop() {
      return window.innerWidth >= 768;
    },
    canScrollNext() {
      return this.scrollX + this.containerWidth < this.scrollWidth;
    },
  },
  mounted() {
    if (!this.isDesktop) this.updateScrollValues();
    window.addEventListener("resize", this.updateScrollValues);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateScrollValues);
  },
  methods: {
    updateScrollValues() {
      const container = this.$refs.scrollContainer;
      if (!container) return;
      this.scrollWidth = container.scrollWidth;
      this.containerWidth = container.clientWidth;
      this.scrollX = container.scrollLeft;
    },
    scrollPrev() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: -150, behavior: "smooth" });
      this.scrollX = container.scrollLeft - 150;
    },
    scrollNext() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: 150, behavior: "smooth" });
      this.scrollX = container.scrollLeft + 150;
    },
  },
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
