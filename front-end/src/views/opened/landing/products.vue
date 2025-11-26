<template>
  <div class="flex min-h-screen bg-gray-50">
    <div class="flex flex-col lg:flex-row w-full"> 

      <div
        class="lg:w-64 w-full bg-white border-r border-gray-200 overflow-y-auto lg:h-screen lg:flex-shrink-0"
        style="z-index: 10;" 
        aria-label="sidebar"
      >
        <ul class="relative">
          <h3 class="px-4 py-2 font-semibold text-lg text-gray-800 border-b bg-white sticky top-0">
            Product Categories
          </h3>
          
          <li class="relative">
            <div
              @click="handleCategorySelection(null)"
              class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center mt-2 border-t bg-white"
            >
              <span class="font-bold text-gray-800">All Categories</span>
            </div>
          </li>
          
          <CategoryItem
            v-for="cat in categories"
            :key="cat.id"
            :category="cat"
            @select-category="handleCategorySelection"
          />
        </ul>
      </div>

      <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold mb-6 text-gray-800">
            Products —
            <span class="text-orange-500">
              {{ selectedSubCategory?.name || selectedCategory?.name || "All" }}
            </span>
          </h2>

          <div v-if="loading" class="text-center text-lg text-gray-500">
            Loading products...
          </div>

          <div v-else-if="productsGrid.length === 0" class="text-center text-lg text-gray-500">
            No products found for this category.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="product in productsGrid"
              :key="product.id"
              class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer"
              @click="goToProductDetail(product)"
            >
              <div class="relative w-full h-56 bg-gray-100 rounded overflow-hidden">
                <img :src="product.imageSrc" class="w-full h-full object-cover" :alt="product.name" />
              </div>
              <h3 class="font-bold text-gray-900 mt-3 text-lg">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">Category: {{ product.categoryName || 'N/A' }}</p>
              <p class="text-xs text-gray-400">MOQ: {{ product.minimum_order_quantity }}</p>

              <button
                class="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ... (The JavaScript block for the parent component is correct and remains unchanged) ...
import { defineComponent } from "vue";
import { request, gql } from "graphql-request";
import CategoryItem from "./CategoryItem.vue";

export default defineComponent({
  components: { CategoryItem },
  data() {
    return {
      categories: [],
      selectedCategory: null,
      selectedSubCategory: null,
      productsGrid: [],
      loading: false,
    };
  },
  async mounted() {
    await this.fetchCategories();
    await this.fetchProducts(null);
  },
  methods: {
    // NOTE: Your fetchCategories and fetchProducts methods are correct and robust.
    // They are omitted here for brevity but should be included in your final file.
    async fetchCategories() {
      this.loading = true;
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
                children {
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
            }
          }
        `;
        const res = await request(endpoint, query);
        this.categories =
          res?.getTreeCategories || (res?.data && res.data.getTreeCategories) || [];
        console.log("Loaded categories:", this.categories);
      } catch (e) {
        console.error("CATEGORY ERROR:", e);
      } finally {
        this.loading = false;
      }
    },

    async fetchProducts(categoryId = null) {
      this.loading = true;
      this.productsGrid = [];
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      let query;
      let variables = { first: 12, page: 1 };

      if (categoryId) {
        query = gql`
          query ProductsByCategory($first: Int!, $page: Int!, $categoryId: String!) {
            products(
              first: $first
              page: $page
              orderBy: [{ column: "created_at", order: DESC }]
              category_id: $categoryId
            ) {
              data {
                id
                name
                imageUrl
                minimum_order_quantity
                category {
                  id
                  name
                }
              }
            }
          }
        `;
        variables.categoryId = categoryId;
      } else {
        query = gql`
          query AllProducts($first: Int!, $page: Int!) {
            products(
              first: $first
              page: $page
              orderBy: [{ column: "created_at", order: DESC }]
            ) {
              data {
                id
                name
                imageUrl
                minimum_order_quantity
                category {
                  name
                }
              }
            }
          }
        `;
      }

      try {
        const res = await request(endpoint, query, variables);
        this.productsGrid = (res.products?.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          imageSrc: p.imageUrl || "https://via.placeholder.com/150?text=No+Image",
          categoryName: p.category ? p.category.name : "N/A",
          minimum_order_quantity: p.minimum_order_quantity,
        }));
      } catch (e) {
        console.error("PRODUCT ERROR:", e);
      } finally {
        this.loading = false;
      }
    },

    handleCategorySelection(category) {
      if (!category) {
        this.selectedCategory = null;
        this.selectedSubCategory = null;
        this.fetchProducts(null);
        return;
      }

      this.selectedCategory = null;
      this.selectedSubCategory = null;

      if (category.children && category.children.length > 0) {
        this.selectedCategory = category;
      } else {
        this.selectedSubCategory = category;
      }

      this.fetchProducts(category.id);
    },

    goToProductDetail(product) {
      if (product?.id && this.$router) {
        this.$router.push({ name: "ProductDetail", params: { id: product.id } });
      }
    },
  },
});
</script>

<style scoped>
/* Scoped styles */
</style>