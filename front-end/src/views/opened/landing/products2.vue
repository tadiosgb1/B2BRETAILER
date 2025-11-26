<template>
  <div class="w-full bg-gray-50 min-h-screen">
    <!-- CATEGORY BAR -->
    <div class="bg-white w-full shadow">
      <div class="relative px-4 py-3 flex items-center">
        <!-- LEFT arrow -->
        <button
          @click="scrollLeft"
          class="bg-white/90 hover:bg-white shadow rounded-full p-2 mr-2"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <!-- SCROLLABLE BAR -->
        <div
          ref="catBar"
          class="flex items-center space-x-2 overflow-x-auto scrollbar-hide py-1 flex-1"
        >
          <div
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat)"
            class="flex items-center space-x-1 px-3 py-2 rounded-lg cursor-pointer border transition text-sm whitespace-nowrap"
            :class="
              selectedCategory?.id === cat.id && !selectedSubCategory
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            "
          >
            <i :class="cat.icon || 'fa-solid fa-box'" class="text-base"></i>
            <span>{{ cat.name }}</span>
            <i
              v-if="cat.children?.length"
              class="fa-solid fa-chevron-down text-xs ml-1"
            ></i>
          </div>
        </div>

        <!-- RIGHT arrow -->
        <button
          @click="scrollRight"
          class="bg-white/90 hover:bg-white shadow rounded-full p-2 ml-2"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <!-- SUBCATEGORY BAR -->
      <div
        v-if="selectedCategory?.children?.length"
        class="bg-gray-50 border-t px-4 py-2 overflow-x-auto scrollbar-hide flex space-x-2"
      >
        <div
          v-for="sub in selectedCategory.children"
          :key="sub.id"
          @click="selectSubCategory(sub)"
          class="px-3 py-2 rounded-lg cursor-pointer border text-sm whitespace-nowrap"
          :class="
            selectedSubCategory?.id === sub.id
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
          "
        >
          {{ sub.name }}
        </div>
      </div>
    </div>

    <!-- SEARCH -->
    <div class="bg-white shadow p-4 mt-2">
      <div class="flex items-center space-x-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="flex-1 border border-gray-300 rounded-lg px-4 py-3"
        />
        <button
          class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Search
        </button>
      </div>
    </div>

    <!-- PRODUCT GRID -->
    <div class="mt-8">
      <div class="max-w-6xl mx-auto bg-white rounded-lg shadow p-4">
        <h3 class="font-bold text-lg mb-4">
          Products —
          <span class="text-orange-500">{{
            selectedSubCategory?.name || selectedCategory?.name || "All"
          }}</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div
              class="relative w-full h-56 bg-gray-100 rounded overflow-hidden"
            >
              <img :src="product.image" class="w-full h-full object-cover" />
            </div>

            <h2 class="font-bold text-gray-900 text-lg mt-3">
              {{ product.title }}
            </h2>
            <p class="text-sm text-gray-500">
              Supplier: {{ product.supplier }}
            </p>
            <p class="text-2xl text-orange-500 font-bold mt-3">
              {{ product.price }}
            </p>
            <button
              class="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";

export default {
  data() {
    return {
      categories: [],
      selectedCategory: null,
      selectedSubCategory: null,
      searchQuery: "",
      products: [], // load products later
    };
  },

  computed: {
    filteredProducts() {
      if (this.selectedSubCategory) {
        return this.products.filter(
          (p) => p.categoryId === this.selectedSubCategory.id
        );
      } else if (this.selectedCategory) {
        return this.products.filter(
          (p) => p.categoryId === this.selectedCategory.id
        );
      }
      return this.products;
    },
  },

  async mounted() {
    await this.fetchCategories();
  },

  methods: {
    async fetchCategories() {
      try {
        const endpoint = import.meta.env.VITE_GRAPHQL_URL;
        const query = gql`
          query {
            getTreeCategories {
              id
              name
              imageUrl
              children {
                id
                name
                imageUrl
              }
            }
          }
        `;
        const response = await request(endpoint, query);
        this.categories = response.getTreeCategories;
        this.selectedCategory = this.categories[0] || null;
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    },

    selectCategory(cat) {
      this.selectedCategory = cat;
      this.selectedSubCategory = null;
    },

    selectSubCategory(sub) {
      this.selectedSubCategory = sub;
    },

    scrollLeft() {
      this.$refs.catBar?.scrollBy({ left: -180, behavior: "smooth" });
    },

    scrollRight() {
      this.$refs.catBar?.scrollBy({ left: 180, behavior: "smooth" });
    },
  },
};
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
