<template>
  <li class="relative" ref="itemEl" @mouseenter="onEnter" @mouseleave="onLeave">
    <!-- Parent row -->
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

      <span v-if="hasChildren" class="text-gray-500">›</span>
    </div>

    <!-- Flyout for desktop -->
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

    <!-- Mobile / Tablet Horizontal Row -->
    <div
      v-if="isMobile && hasChildren && mobileActive"
      class="flex space-x-4 px-2 mt-2 overflow-x-auto"
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
        <i v-else class="fas fa-box text-gray-400 mb-1"></i>
        <span class="text-xs text-center">{{ child.name }}</span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "CategoryItem",
  props: {
    category: { type: Object, required: true },
    mobileActive: { type: Boolean, default: false }, // For mobile horizontal row toggle
  },
  emits: ["select-category"],
  data() {
    return {
      showFlyout: false,
      flyoutStyle: {},
    };
  },
  computed: {
    hasChildren() {
      return this.category.children && this.category.children.length > 0;
    },
    isDesktop() {
      return window.innerWidth >= 768; // md breakpoint
    },
    isMobile() {
      return window.innerWidth < 768;
    },
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
  },
};
</script>

<style scoped>
/* Hide mobile scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>
