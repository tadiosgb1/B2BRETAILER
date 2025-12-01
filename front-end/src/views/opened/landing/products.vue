<template>
  <div class="flex min-h-screen bg-gray-50">
    <div class="flex flex-col lg:flex-row w-full">
      
      <!-- SIDEBAR CATEGORY LIST -->
      <div
        class="lg:w-64 w-full bg-white border-r border-gray-200 overflow-y-auto lg:h-screen lg:flex-shrink-0"
        style="z-index: 10;"
        aria-label="sidebar"
      >
        <ul class="relative">
          <h3 class="px-4 py-2 font-semibold text-lg text-gray-800 border-b bg-white sticky top-0">
            Product Categories
          </h3>

          <!-- ALL CATEGORIES -->
          <li class="relative">
         
            <div
              @click="handleCategorySelection(null);allCliked=true"
              class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center mt-2 border-t bg-white"
            >
              <span class="font-bold text-gray-800">All Categories</span>
            </div>
          </li>

          <!-- CATEGORY TREE ITEMS -->
          <CategoryItem
            v-for="cat in categories"
            :key="cat.id"
            :category="cat"
            @select-category="handleCategorySelection"
          />
        </ul>
      </div>

      
      <!-- MAIN PRODUCTS CONTENT -->
      <div class="flex-1 p-3 overflow-auto">
      <div class="mb-6 mx-0 lg:mx-0 flex items-center gap-4 bg-white  rounded-lg border border-gray-200 p-2 hover:shadow-lg transition-shadow duration-300">
      <input
        v-model="searchTerm"
        @input="handleSearch"
        type="text"
        placeholder="Search products..."
        class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-700 placeholder-gray-400"
        />
      </div>

        <div class="px-4">

  <!-- HEADER -->
  <h2 class="text-3xl font-bold mb-6 text-gray-800">
    Products —
    <span class="text-orange-500">
      {{ selectedSubCategory?.name || selectedCategory?.name  }}
    </span>
  </h2>

  <!-- SKELETON LOADER -->
  <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="n in 8"
      :key="'skeleton-' + n"
      class="border rounded-lg p-4 shadow-sm bg-white animate-pulse"
    >
      <div class="w-full h-32 bg-gray-200 rounded mb-3"></div>
      <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
      <div class="h-3 bg-gray-200 rounded w-1/3"></div>
      <div class="h-10 bg-gray-300 rounded mt-4"></div>
    </div>
  </div>

  <!-- NO PRODUCTS MESSAGE -->
  <div
    v-else-if="productsGrid.length === 0"
    class="text-center text-lg text-gray-500"
  >
    No products found for this category.
  </div>

  <!-- REAL PRODUCTS GRID -->
  <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="product in productsGrid"
      :key="product.id"
      class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer flex flex-col"
      @click="goToProductDetail(product)"
    >
      <div class="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
        <img :src="proxiedImage(product.imageSrc)" class="w-full h-full object-cover" :alt="product.name" />
      </div>

      <h3 class="font-bold text-gray-900 mt-3 text-lg">{{ product.name }}</h3>
      <p class="text-sm text-gray-500">Category: {{ product.categoryName || 'N/A' }}</p>
      <p class="text-xs text-gray-400">MOQ: {{ product.minimum_order_quantity }}</p>


      <div class="flex space-x-1">
    <!-- Loop 5 times for 5 stars -->
    <template v-for="i in 5" :key="i">
      <svg
        v-if="i <= Math.floor(product.rate)"
        class="w-6 h-6 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z" />
      </svg>
      <svg
        v-else-if="i - product.rate < 1"
        class="w-6 h-6 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stop-color="currentColor" />
            <stop offset="50%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z"/>
      </svg>
      <svg
        v-else
        class="w-6 h-6 text-gray-300"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z" />
      </svg>
    </template>
  </div>
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
import { defineComponent } from "vue";
import { request, gql } from "graphql-request";
import CategoryItem from "./CategoryItem.vue";

export default defineComponent({
  components: { CategoryItem },
   props: {
    category_id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      searchTerm: "",
      searchTimeout: null,
      categories: [],
      selectedCategory: null,
      selectedSubCategory: null,
      productsGrid: [],
      loading: false,
      allCliked:false,
    };
  },

async mounted() {
  await this.fetchCategories();

  if (this.allCliked) {
    await this.fetchProducts(null);
  } else if (this.category_id) {
    console.log("Loading category from prop:", this.category_id);
    this.handleCategorySelection({ id: this.category_id });
  } else {
    console.log("Loading all products");
    await this.fetchProducts(null);
  }
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
   handleSearch() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.searchTerm.trim().length > 0) {
        this.fetchSearchedProducts(this.searchTerm.trim());
      } else {
       
        // Reset to category/all products
        this.fetchProducts(this.selectedSubCategory?.id || this.selectedCategory?.id || null);
      }
    }, 300)
  },
 async fetchSearchedProducts(search) {
  this.loading = true;
  this.productsGrid = [];
  const endpoint = import.meta.env.VITE_GRAPHQL_URL;
  const token = localStorage.getItem("token"); // adjust key if needed
  const query = gql`
    query SearchProducts($search: String!) {
      searchProduct(search: $search) {
        id
        name
        imageUrl
        minimum_order_quantity
        category {
          name
        }
      }
    }
  `;

  try {
    const res = await request(
      endpoint,
      query,
      { search }, // variables
      {
        Authorization: token ? `Bearer ${token}` : "",
      }
    );

    console.log("res result", res);

    this.productsGrid = (res.searchProduct || []).map((p) => ({
      id: p.id,
      name: p.name,
      rate:p.rate,
      imageSrc: p.imageUrl || "https://via.placeholder.com/150?text=No+Image",
      categoryName: p.category ? p.category.name : "N/A",
      minimum_order_quantity: p.minimum_order_quantity,
    }));
    this.selectedCategory="Searched Products"
  } catch (e) {
    console.error("SEARCH ERROR:", e);
  } finally {
    this.loading = false;
  }
}
,

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
        this.categories = res?.getTreeCategories || [];
      } catch (e) {
        console.error("CATEGORY ERROR:", e);
      } finally {
        this.loading = false;
      }
    },

    /* ============================================================
       FETCH PRODUCTS (BY CATEGORY OR ALL)
    ============================================================ */
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
                rate
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
          rate: p.rate || 0,
        }));
      } catch (e) {
        console.error("PRODUCT ERROR:", e);
      } finally {
        this.loading = false;
      }
    },

    /* ============================================================
       CATEGORY SELECTION
    ============================================================ */
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

    /* ============================================================
       NAVIGATION TO PRODUCT DETAIL
    ============================================================ */
    goToProductDetail(product) {
      if (product?.id && this.$router) {
        this.$router.push({ name: "ProductDetail", params: { id: product.id } });
      }
    },
  },
});
</script>

<style scoped>
</style>
