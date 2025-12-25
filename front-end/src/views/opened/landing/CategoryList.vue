<template>
  <ul class="list-none">
    <!-- Top-level categories -->
    <li v-for="category in displayedCategories" :key="category.id" class="mb-1">
      <CategoryItem
        :category="category"
        @select-category="$emit('select-category', $event)"
      />
    </li>

    <!-- View All / View Less -->
    <li v-if="categories.length > maxVisible" class="mt-2 pl-4">
      <button
        @click="toggleShowAll"
        class="text-xs text-blue-500 hover:underline"
      >
        {{ showAll ? 'View Less' : 'View All' }}
      </button>
    </li>
  </ul>
</template>

<script>
import CategoryItem from './CategoryItem.vue';

export default {
  name: "CategoryList",
  components: { CategoryItem },
  props: {
    categories: { type: Array, required: true }
  },
  emits: ["select-category"],
  data() {
    return {
      showAll: false,
      maxVisible: 7, // show 7 top-level parents initially
    };
  },
  computed: {
    displayedCategories() {
      return this.showAll ? this.categories : this.categories.slice(0, this.maxVisible);
    }
  },
  methods: {
    toggleShowAll() {
      this.showAll = !this.showAll;
    }
  }
}
</script>
