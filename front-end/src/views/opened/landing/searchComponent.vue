<template>
  <!-- Search Component -->
  <div class="relative w-full md:w-80 lg:w-[450px] xl:w-[550px] ml-auto">
    <input
      type="text"
      v-model="searchQuery"
      @input="onSearchInput"
      placeholder="Search products..."
      class="w-full border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
    />
    <button
      @click="performSearch"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
    >
      <i class="fas fa-search"></i>
    </button>

    <!-- Search Results Dropdown -->
    <div
      v-if="showResults && filteredProducts.length > 0"
      class="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto border border-gray-200"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        @click="goToProductDetail(product)"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-3"
      >
        <img
          :src="proxiedImage(product.imageSrc)"
          class="w-10 h-10 rounded object-cover"
        />
        <div>
          <p class="text-sm font-medium">{{ product.name }}</p>
          <p class="text-xs text-gray-500">{{ product.categoryName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gql, request } from "graphql-request";

export default {
  name: "SearchComponent",
  data() {
    return {
      searchQuery: "",
      filteredProducts: [],
      showResults: false,
      loading: false,
    };
  },
  methods: {
    proxiedImage(url) {
    if (!url) return '/placeholder.png';

    // Check Vite mode: 'development' or 'production'
    if (import.meta.env.MODE === 'production') {
      // In production, remove backend domain so HTTPS frontend works
      return url.replace(/^http:\/\/78\.47\.138\.239:8080/, '');
    } else {
      // In development, use full URL (local dev backend)
      return url;
    }
  },
    async onSearchInput() {
      if (this.searchQuery.trim().length < 2) {
        this.filteredProducts = [];
        this.showResults = false;
        return;
      }
      await this.performSearch();
    },

    async performSearch() {
      await this.fetchProducts(null, this.searchQuery);
      this.showResults = true;
    },

    async fetchProducts(categoryId = null, search = null) {
      this.loading = true;
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      let query;
      let variables = { first: 12, page: 1 };

      if (categoryId) {
        query = gql`
          query ProductsByCategory($first: Int!, $page: Int!, $categoryId: String!, $search: String) {
            products(
              first: $first
              page: $page
              category_id: $categoryId
              search: $search
              orderBy: [{ column: "created_at", order: DESC }]
            ) {
              data {
                id
                name
                imageUrl
                minimum_order_quantity
                category { id name }
                rate
              }
            }
          }
        `;
        variables.categoryId = categoryId;
        variables.search = search;
      } else {
        query = gql`
          query AllProducts($first: Int!, $page: Int!, $search: String) {
            products(
              first: $first
              page: $page
              search: $search
              orderBy: [{ column: "created_at", order: DESC }]
            ) {
              data {
                id
                name
                rate
                imageUrl
                minimum_order_quantity
                category { name }
              }
            }
          }
        `;
        variables.search = search;
      }

      try {
        const res = await request(endpoint, query, variables);
        this.filteredProducts = (res.products?.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          imageSrc: p.imageUrl || "https://via.placeholder.com/150?text=No+Image",
          categoryName: p.category ? p.category.name : "N/A",
          minimum_order_quantity: p.minimum_order_quantity,
          rate: p.rate || 0,
        }));
      } catch (e) {
        console.error("PRODUCT ERROR:", e);
      } finally {
        this.loading = false;
      }
    },

    goToProductDetail(product) {
      if (product?.id && this.$router) {
        this.$router.push({ name: "ProductDetail", params: { id: product.id } });
      }
    },
  },
};
</script>
