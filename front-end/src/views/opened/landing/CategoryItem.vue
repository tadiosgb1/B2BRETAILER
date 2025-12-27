<template>
  <li>
    <!-- Clickable category row -->
    <div
      class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center bg-white"
      @click="onCategoryClick"
    >
      <span class="text-gray-800">{{ category.name }}</span>

      <span v-if="hasChildren">
        <i v-if="!open" class="fas fa-plus text-gray-500"></i>
        <i v-else class="fas fa-minus text-gray-500"></i>
      </span>
    </div>

    <!-- Children -->
    <ul
      v-if="hasChildren && open"
      class="pl-4 border-l border-gray-200 list-none"
    >
      <li
        v-for="child in displayedChildren"
        :key="child.id"
        class="relative pl-4"
      >
        <span class="absolute left-0 top-1 text-gray-400">&#9676;</span>

        <!-- Recursive call -->
        <CategoryItem
          :category="child"
          :is-top-level="false"
          @select-category="forwardEvent"
        />
      </li>

      <!-- View All for top-level parents only -->
      <li
        v-if="isTopLevel && category.children.length > 5"
        class="pl-4 mt-1"
      >
        <button
          @click.stop="toggleShowAll"
          class="text-xs text-blue-500 hover:underline"
        >
          {{ showAll ? "View Less" : "View All" }}
        </button>
      </li>

      <!-- View All for nested children (existing logic) -->
      <li
        v-else-if="!isTopLevel && category.children.length > 8"
        class="pl-4 mt-1"
      >
        <button
          @click.stop="toggleShowAll"
          class="text-xs text-blue-500 hover:underline"
        >
          {{ showAll ? "View Less" : "View All" }}
        </button>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: "CategoryItem",
  props: {
    category: {
      type: Object,
      required: true,
    },
    isTopLevel: { // Detect top-level categories
      type: Boolean,
      default: false,
    },
  },
  emits: ["select-category"],
  data() {
    return {
      open: false,
      showAll: false,
      firstFiveChildren: [], // Holds first 5 for top-level
      remainingChildren: [], // Holds remaining top-level categories
    };
  },
  computed: {
    hasChildren() {
      return Array.isArray(this.category.children) &&
             this.category.children.length > 0;
    },
    displayedChildren() {
      if (!this.hasChildren) return [];

      // Top-level: show first 5 or all based on showAll
      if (this.isTopLevel) {
        return this.showAll
          ? this.category.children
          : this.firstFiveChildren;
      }

      // Nested children: existing logic (first 8)
      return this.showAll
        ? this.category.children
        : this.category.children.slice(0, 8);
    },
  },
  created() {
    // Prepare first 5 and remaining for top-level
    if (this.isTopLevel && this.hasChildren) {
      this.firstFiveChildren = this.category.children.slice(0, 5);
      this.remainingChildren = this.category.children.slice(5);
    }
  },
  methods: {
    onCategoryClick() {
      this.$emit("select-category", this.category);

      if (this.hasChildren) {
        this.open = !this.open;
      }
    },
    forwardEvent(category) {
      this.$emit("select-category", category);
    },
    toggleShowAll() {
      this.showAll = !this.showAll;

      // Reset firstFiveChildren when collapsing top-level
      if (!this.showAll && this.isTopLevel) {
        this.firstFiveChildren = this.category.children.slice(0, 5);
      }
    },
  },
};
</script>
