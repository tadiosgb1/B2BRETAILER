<template>
  <li>
    <!-- Parent row -->
    <div
      class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center bg-white"
      @click="handleClick"
    >
      <span class="text-gray-800">{{ category.name }}</span>
      <span v-if="hasChildren">
        <i v-if="!open" class="fas fa-plus text-gray-500"></i>
        <i v-else class="fas fa-minus text-gray-500"></i>
      </span>
    </div>

    <!-- Nested children -->
    <ul v-if="hasChildren && open" class="pl-4 border-l border-gray-200 list-none">
      <li
        v-for="(child, index) in displayedChildren"
        :key="child.id"
        class="relative pl-4"
      >
        <!-- Hollow bullet -->
        <span class="absolute left-0 top-1 text-gray-400">&#9676;</span>

        <!-- Recursive category item -->
        <CategoryItem
          v-if="child"
          :category="child"
          @select-category="$emit('select-category', $event)"
        />
      </li>

      <!-- View All / Collapse -->
      <li v-if="category.children.length > 8" class="pl-4 mt-1">
        <button
          @click.stop="toggleShowAll"
          class="text-xs text-blue-500 hover:underline"
        >
          {{ showAll ? 'View Less' : 'View All' }}
        </button>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: "CategoryItem", // Important: recursive name
  props: {
    category: { type: Object, required: true },
  },
  emits: ["select-category"],
  data() {
    return {
      open: false,
      showAll: false,
    };
  },
  computed: {
    hasChildren() {
      return Array.isArray(this.category.children) && this.category.children.length > 0;
    },
    displayedChildren() {
      if (!this.hasChildren) return [];
      return this.showAll ? this.category.children : this.category.children.slice(0, 8);
    },
  },
  methods: {
    handleClick() {
      // Emit category ID to fetch products
      this.$emit("select-category", this.category.id);

      // Only toggle children if parent has children
      if (this.hasChildren) {
        this.open = !this.open;
      }
    },
    toggleShowAll() {
      this.showAll = !this.showAll;
    },
  },
};
</script>
