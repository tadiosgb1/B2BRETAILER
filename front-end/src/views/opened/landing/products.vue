<template>
  <div class="flex bg-gray-50">
    <div class="flex flex-col lg:flex-row w-full">

      <!-- SIDEBAR CATEGORY LIST -->
      <div
        class="lg:w-1/5 w-full bg-white border-r border-gray-200 overflow-y-auto custom-scroll lg:h-screen lg:flex-shrink-0"
        style="z-index: 10;" aria-label="sidebar">
        <ul class="relative">
          <h3 class="px-4 py-2 font-semibold text-lg text-gray-800 border-b bg-white sticky top-0">
            Product filters
          </h3>

          <!-- ALL CATEGORIES -->
          <li class="relative">

            <div @click="handleCategorySelection(null); allCliked = true"
              class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center mt-2  bg-white">
              <span class="font-bold text-gray-800">Filter by Categories</span>
            </div>
          </li>

          <!-- CATEGORY TREE ITEMS -->
          <CategoryItem class="ml-5" v-for="cat in categories" :key="cat.id" :category="cat"
            @select-category="handleCategorySelection" />
        </ul>

  <div class="w-full bg-white/80 backdrop-blur border-b shadow-sm py-3">

  <!-- Vertical Filters -->
  <div class="relative">
    <div class="flex flex-col gap-4 px-4 py-2">

      <!-- SORT FILTER -->
      <div class="flex flex-col">
        <label for="sortOption" class="text-sm font-semibold mb-1 flex items-center gap-1">
          <i class="fas fa-sort text-orange-500 text-xs"></i> Sort By
        </label>
        <select id="sortOption" @change="fetchProducts(null, null)" v-model="sortOption"
          class="border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400 w-full shadow-sm">
          <option value="new">New Arrivals</option>
          <option value="old">Old Arrivals</option>
          <option value="highest_price">Highest Price</option>
          <option value="lower_price">Lowest Price</option>
        </select>
      </div>

      <!-- MIN ORDER -->
      <div class="flex flex-col">
        <label for="minOrder" class="text-sm font-semibold mb-1 flex items-center gap-1">
          <i class="fas fa-sort-numeric-up text-orange-500 text-xs"></i> Min Order
        </label>
        <input id="minOrder" v-model="min_order" type="number" placeholder="Enter MOQ"
          class="border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400 w-full shadow-sm" />
      </div>

      <!-- PRICE RANGE -->
      <div class="flex flex-col">
        <label class="text-sm font-semibold mb-1 flex items-center gap-1">
          <i class="fas fa-tag text-orange-500 text-xs"></i> Price Range
        </label>
        <div class="flex gap-2">
          <input v-model="min_price" type="number" placeholder="Min"
            class="border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400 w-full shadow-sm" />
          <input v-model="max_price" type="number" placeholder="Max"
            class="border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400 w-full shadow-sm" />
        </div>
      </div>

      <!-- APPLY BUTTON -->
      <button @click="fetchProducts(null, null, min_price, max_price)" 
              class="bg-orange-500 hover:bg-orange-600 transition text-white px-5 py-2 rounded-xl text-sm shadow-lg font-medium mt-2 w-full">
        Apply Filters
      </button>

    </div>
  </div>
</div>



      </div>


      <!-- MAIN PRODUCTS CONTENT -->
      <div class="flex-1 p-3 overflow-auto">










        <div class="px-4">

          <!-- HEADER -->
          <h2 class="text-3xl font-bold mb-6 text-gray-800">
            
            <span class="text-orange-500">
              {{ selectedSubCategory?.name || selectedCategory?.name }}
            </span>
          </h2>

          <!-- SKELETON LOADER -->
          <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="n in 8" :key="'skeleton-' + n" class="border rounded-lg p-4 shadow-sm bg-white animate-pulse">
              <div class="w-full h-32 bg-gray-200 rounded mb-3"></div>
              <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
              <div class="h-10 bg-gray-300 rounded mt-4"></div>
            </div>
          </div>

          <!-- NO PRODUCTS MESSAGE -->
          <div v-else-if="productsGrid.length === 0" class="text-center text-lg text-gray-500">
            No products found for this category.
          </div>

          <!-- REAL PRODUCTS GRID -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="product in productsGrid" :key="product.id"
              class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer flex flex-col"
             >
              <div  @click="goToProductDetail(product)" class="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                <img :src="this.$proxiedImage(product.imageSrc)" class="w-full h-full object-cover"
                  :alt=" product.name.slice(0, 50)" />
              </div>

             

              <h3 class="text-sm font-medium">
               {{ product.name.length > 50 ? product.name.slice(0, 50) + '...' : product.name }}
              </h3>
              <p class="text-sm text-gray-500">Category: {{ product.categoryName || 'N/A' }}</p>
              <div class="flex flex-col space-x-0 lg:flex-row lg:space-x-4">
                  <p class="text-xs text-gray-400">MOQ: {{ product.minimum_order_quantity }}</p>
              <!-- Price Badge -->

              <p class="inline-block bg-orange-100 text-dark text-xs font-semibold px-2 py-1 rounded-full">
                Price: <span class="text-primary text-lg">{{ product.skus[0]?.sell_price }}</span> ETB
              </p>
              </div>
 


              <div class="flex space-x-1">
                <!-- Loop 5 times for 5 stars -->
                <template v-for="i in 5" :key="i">
                  <svg v-if="i <= Math.floor(product.rate)" class="w-6 h-6 text-yellow-400" fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z" />
                  </svg>
                  <svg v-else-if="i - product.rate < 1" class="w-6 h-6 text-yellow-400" fill="currentColor"
                    viewBox="0 0 20 20">
                    <defs>
                      <linearGradient id="half">
                        <stop offset="50%" stop-color="currentColor" />
                        <stop offset="50%" stop-color="transparent" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#half)"
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z" />
                  </svg>
                </template>
              </div>
                       <button  @click.stop="openWarehouseModal(product)"
                        class="my-3 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-primary hover:bg-orange-100"
                      >
                        Add to Cart
                     </button>
            </div>
          </div>

        </div>

      </div>

    </div>

      <ChooseWarehouseAddToCart
        :open="WarehouseModalOpen"
        :product="product"
        :quantity="quantity"
        @close="WarehouseModalOpen = false"
        @added="onAddedToCart"
      />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { request, gql } from "graphql-request";
import CategoryItem from "./CategoryItem.vue";
import ChooseWarehouseAddToCart from "./ChooseWarehouseAddToCart.vue";
export default defineComponent({
  components: { CategoryItem,ChooseWarehouseAddToCart },
  data() { },
  props: {
    category_id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      product:null,
      searchTerm: "",
      searchTimeout: null,
      categories: [],
      selectedCategory: null,
      selectedSubCategory: null,
      productsGrid: [],
      loading: false,
      allCliked: false,
      sortOption: 'new',
      min_order: "",
      color: "",
      gender: "any",
      WarehouseModalOpen:false,
    };
  },

  async mounted() {
    await this.fetchCategories();

    if (this.allCliked) {
      await this.fetchProducts(null, null, null, null);
    } else if (this.category_id) {
      console.log("Loading category from prop:", this.category_id);
      this.handleCategorySelection({ id: this.category_id });
    } else {
      console.log("Loading all products");
      await this.fetchProducts(null, null, null, null);
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
    async fetchProducts(
      categoryId = null,
      search = null,
      min_price = null,
      max_price = null,
    ) {
      console.log("min and max prices", min_price, max_price);

      this.loading = true;
      this.productsGrid = [];

      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      let query;
      let variables = { first: 12, page: 1 };

      // Default server-side order
      let ordered_by = [{ column: "created_at", order: "DESC" }];
      console.log("sortOption", this.sortOption);
      if (this.sortOption) {
        switch (this.sortOption) {
          case "new":
            ordered_by = [{ column: "created_at", order: "DESC" }];
            break;
          case "old":
            ordered_by = [{ column: "created_at", order: "ASC" }];
            break;
          case "lowest_price":
            ordered_by = [{ column: "min_price", order: "ASC" }];
            break;
          // case "highest_price":
          //   ordered_by = [{ column: "min_price", order: "DESC" }];
          //   break;
        }
      }

      if (categoryId) {
        query = gql`
      query ProductsByCategory(
        $first: Int!, 
        $page: Int!, 
        $categoryId: String!, 
        $search: String,
        $min_price: Float, 
        $max_price: Float,
        $ordered_by: [OrderByInput]!
      ) {
        products(
          first: $first
          page: $page
          category_id: $categoryId
          search: $search
          min_price: $min_price
          max_price: $max_price
          orderBy: $ordered_by
        ) {
          data {
            id
            name
            imageUrl
            minimum_order_quantity
            skus { id sku sell_price stockCount }  # ✅ removed price
            category { id name }
            rate
            delivery_estimation { warehouse { id name } min_period max_period period_type }
          }
        }
      }
    `;

        variables.categoryId = categoryId;
        variables.search = search;
        variables.min_price = min_price;
        variables.max_price = max_price;
        variables.ordered_by = ordered_by;

      } else {
        query = gql`
      query AllProducts(
        $first: Int!, 
        $page: Int!, 
        $search: String,
        $min_price: Float, 
        $max_price: Float,
        $ordered_by: [OrderByInput]!
      ) {
        products(
          first: $first
          page: $page
          search: $search
          min_price: $min_price
          max_price: $max_price
          orderBy: $ordered_by
        ) {
          data {
            id
            name
            rate
            imageUrl
            minimum_order_quantity
            skus { id sku sell_price stockCount }  # ✅ removed price
            category { name }
            delivery_estimation { warehouse { id name } min_period max_period period_type }
          }
        }
      }
    `;

        variables.search = search;
        variables.min_price = min_price;
        variables.max_price = max_price;
        variables.ordered_by = ordered_by;
      }

      try {
        const res = await request(endpoint, query, variables);
        console.log("res", res);

        this.productsGrid = (res.products?.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          imageSrc: p.imageUrl || "https://via.placeholder.com/150?text=No+Image",
          categoryName: p.category ? p.category.name : "N/A",
          rate: p.rate || 0,
          minimum_order_quantity: p.minimum_order_quantity,
          skus: p.skus,
          delivery_estimation: p.delivery_estimation || []   // ✅ ADD THIS
        }));


        if (this.sortOption == 'highest_price') {
          this.productsGrid.sort((a, b) => b.skus[0].sell_price - a.skus[0].sell_price);
        }

        if (this.min_order) {
          this.productsGrid = this.productsGrid.filter(
            product => product.minimum_order_quantity <= this.min_order
          );
        }


      } catch (e) {
        console.error("PRODUCT ERROR:", e);
      } finally {
        this.loading = false;
      }
    }
    ,

    openWarehouseModal(product) {
    this.product = product;          // selected product
    this.WarehouseModalOpen = true;
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
.custom-scroll::-webkit-scrollbar {
  width: 2px;
  /* super thin */
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f3f3f3;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #a1a1aa;
  border-radius: 1px;
}

.custom-scroll {
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: #a1a1aa #f3f3f3;
  /* Firefox */
}

.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
</style>
