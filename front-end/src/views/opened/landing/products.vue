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
              class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center mt-2 bg-white">
              <span class="font-bold text-gray-800">Filter by Categories</span>
            </div>
          </li>

          <!-- CATEGORY TREE ITEMS (limit 5 shown, add toggle for all) -->
          <CategoryItem
            v-for="(cat, index) in visibleCategories"
            :key="cat.id"
            :category="cat"
            class="ml-5"
            @select-category="handleCategorySelection"
          />
          
          <li v-if="categories.length > 5" class="px-4 py-2 cursor-pointer text-sm text-orange-500 hover:text-orange-600"
              @click="showAllCategories = !showAllCategories">
            {{ showAllCategories ? 'Show Less' : 'View All' }}
          </li>
        </ul>

        <!-- VERTICAL FILTERS -->
        <div class="w-full bg-white/80 backdrop-blur border-b shadow-sm py-3">
          <div class="relative">
            <div class="flex flex-col gap-4 px-4 py-2">

              <!-- SORT FILTER -->
              <div class="flex flex-col">
                <label for="sortOption" class="text-sm font-semibold mb-1 flex items-center gap-1 text-gray-600">
                  <i class="fas fa-sort text-orange-500 text-xs"></i> Sort By
                </label>
                <select id="sortOption" @change="fetchProducts(null, null)" v-model="sortOption"
                  class="border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400 w-full shadow-sm">
                  <option value="new">New Arrivals</option>
                  <option value="old">Old Arrivals</option>
                  <option value="highest_price">Highest Price</option>
                  <option value="lowest_price">Lowest Price</option>
                </select>
              </div>

              <!-- MIN ORDER -->
              <div class="flex flex-col">
                <label for="minOrder" class="text-sm font-semibold mb-1 flex items-center gap-1 text-gray-600">
                  <i class="fas fa-sort-numeric-up text-orange-500 text-xs"></i> Min Order
                </label>
                <input id="minOrder" v-model="min_order" type="number" placeholder="Enter MOQ"
                  class="border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400 w-full shadow-sm" />
              </div>

              <!-- PRICE RANGE -->
              <div class="flex flex-col">
                <label class="text-sm font-semibold mb-1 flex items-center gap-1 text-gray-600">
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

  <div
    v-for="product in productsGrid"
    :key="product.id"
    class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer flex flex-col min-h-[450px]"
  >

    <!-- PRODUCT IMAGE (NO CROP, TALL) -->
    <div
      @click="goToProductDetail(product)"
      class="relative w-full h-56 rounded flex items-center justify-center"
    >
      <img
        :src="proxiedImage(product.imageSrc)"
        :alt="product.name.slice(0, 50)"
        class="w-full h-full object-contain p-2"
      />
    </div>

    <!-- PRODUCT NAME -->
    <h3 class="text-sm font-medium truncate mt-2">
      {{ product.name }}
    </h3>

    <!-- CATEGORY -->
    <p class="text-sm text-gray-500 mt-1">
      Category: {{ product.categoryName || 'N/A' }}
    </p>

    <!-- PRICE & MOQ -->
    <div class="flex items-center justify-between w-full mt-2">
      <p class="inline-block bg-orange-100 text-dark text-xs font-semibold px-2 py-1 rounded-full">
        <span class="text-primary text-lg">
          {{ this.$formatPrice(product.skus[0]?.sell_price) }}
        </span>
        ETB
      </p>

      <p class="text-xs text-gray-400 text-right">
        MOQ: {{ product.minimum_order_quantity }}
      </p>
    </div>

    <!-- RATING -->
    <div class="flex space-x-1 mt-2">
      <template v-for="i in 5" :key="i">
        <svg
          v-if="i <= Math.floor(product.rate)"
          class="w-6 h-6 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z"
          />
        </svg>

        <svg
          v-else
          class="w-6 h-6 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1  0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 0 00.95-.69l1.286-3.962z"
          />
        </svg>
      </template>
    </div>

    <!-- ADD TO CART BUTTON -->
    <button
      @click.stop="openWarehouseModal(product)"
      class="mt-4 mb-3 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-primary hover:bg-orange-100"
    >
      Add to Cart
    </button>
  </div>
</div>


        </div>
      </div>

    </div>

    <!-- CART MODAL -->
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
  components: { CategoryItem, ChooseWarehouseAddToCart },
  props: { category_id: { type: String, required: false } },
  data() {
    return {
      product: null,
      quantity: 1,
      categories: [],
      selectedCategory: null,
      selectedSubCategory: null,
      productsGrid: [],
      loading: false,
      allCliked: false,
      sortOption: "new",
      min_order: "",
      min_price: null,
      max_price: null,
      WarehouseModalOpen: false,
      showAllCategories: false,
    };
  },
  computed: {
    visibleCategories() {
      if (this.showAllCategories) return this.categories;
      return this.categories.slice(0, 5);
    },
  },
  async mounted() {
    await this.fetchCategories();
    if (this.allCliked) {
      await this.fetchProducts();
    } else if (this.category_id) {
      this.handleCategorySelection({ id: this.category_id });
    } else {
      await this.fetchProducts();
    }
  },
  methods: {
    proxiedImage(url) {
      if (!url) return "/placeholder.png";
      if (import.meta.env.MODE === "production") {
        return url.replace(/^http:\/\/78\.47\.138\.239:8080/, "");
      }
      return url;
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
              children { id name imageUrl children { id name imageUrl children { id name imageUrl } } }
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
    async fetchProducts(categoryId = null, search = null, min_price = null, max_price = null) {
      this.loading = true;
      this.productsGrid = [];
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      let query;
      let variables = { first: 12, page: 1 };
      let ordered_by = [{ column: "created_at", order: "DESC" }];
      switch (this.sortOption) {
        case "new": ordered_by = [{ column: "created_at", order: "DESC" }]; break;
        case "old": ordered_by = [{ column: "created_at", order: "ASC" }]; break;
        case "lowest_price": ordered_by = [{ column: "min_price", order: "ASC" }]; break;
      }
      if (categoryId) {
        query = gql`
          query ProductsByCategory($first: Int!, $page: Int!, $categoryId: String!, $search: String, $min_price: Float, $max_price: Float, $ordered_by: [OrderByInput]!) {
            products(first: $first, page: $page, category_id: $categoryId, search: $search, min_price: $min_price, max_price: $max_price, orderBy: $ordered_by) {
              data { id name imageUrl minimum_order_quantity skus { id sku sell_price stockCount } category { id name } rate delivery_estimation { warehouse { id name } min_period max_period period_type } }
            }
          }
        `;
        variables = { ...variables, categoryId, search, min_price, max_price, ordered_by };
      } else {
        query = gql`
          query AllProducts($first: Int!, $page: Int!, $search: String, $min_price: Float, $max_price: Float, $ordered_by: [OrderByInput]!) {
            products(first: $first, page: $page, search: $search, min_price: $min_price, max_price: $max_price, orderBy: $ordered_by) {
              data { id name rate imageUrl minimum_order_quantity skus { id sku sell_price stockCount } category { name } delivery_estimation { warehouse { id name } min_period max_period period_type } }
            }
          }
        `;
        variables = { ...variables, search, min_price, max_price, ordered_by };
      }
      try {
        const res = await request(endpoint, query, variables);
        this.productsGrid = (res.products?.data || []).map(p => ({
          id: p.id,
          name: p.name,
          imageSrc: p.imageUrl || "https://via.placeholder.com/150?text=No+Image",
          categoryName: p.category ? p.category.name : "N/A",
          rate: p.rate || 0,
          minimum_order_quantity: p.minimum_order_quantity,
          skus: p.skus,
          delivery_estimation: p.delivery_estimation || []
        }));
        if (this.sortOption === "highest_price") {
          this.productsGrid.sort((a, b) => b.skus[0].sell_price - a.skus[0].sell_price);
        }
        if (this.min_order) {
          this.productsGrid = this.productsGrid.filter(p => p.minimum_order_quantity <= this.min_order);
        }
      } catch (e) {
        console.error("PRODUCT ERROR:", e);
      } finally {
        this.loading = false;
      }
    },
    openWarehouseModal(product) {
      this.product = product;
      this.WarehouseModalOpen = true;
    },
    handleCategorySelection(category) {
      if (!category) {
        this.selectedCategory = null;
        this.selectedSubCategory = null;
        this.fetchProducts();
        return;
      }
      this.selectedCategory = null;
      this.selectedSubCategory = null;
      if (category.children && category.children.length > 0) this.selectedCategory = category;
      else this.selectedSubCategory = category;
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
.custom-scroll::-webkit-scrollbar {
  width: 2px;
}
.custom-scroll::-webkit-scrollbar-track { background: #f3f3f3; }
.custom-scroll::-webkit-scrollbar-thumb { background-color: #a1a1aa; border-radius: 1px; }
.custom-scroll { scrollbar-width: thin; scrollbar-color: #a1a1aa #f3f3f3; }
.scrollbar-thin::-webkit-scrollbar { height: 4px; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
</style>
