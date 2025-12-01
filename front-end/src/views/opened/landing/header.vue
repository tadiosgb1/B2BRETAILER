<template>
  <header class="w-full bg-white shadow-md">
    <div
      class="container mx-auto py-3 px-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 mt-8"
    >
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-orange-600">Ant Retailer</h1>

        <!-- Search Component -->
        <div class="relative w-full md:w-80">
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
        </div>
      </div>

      <!-- Menu -->
      <div class="flex flex-wrap items-center gap-4 text-sm justify-center md:justify-end w-full md:w-auto">

        <a v-if="!token"
          href="/login"
          class="px-4 py-2 text-orange-600 font-semibold border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition"
        >
          Login
        </a>

        <a v-if="!token"
          href="/register"
          class="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          Register
        </a>
        
        <a href="/" class="group">
          <i class=""><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          </i>
        </a>

        <a href="/shop" class="group relative">
      <i class="">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75v11.25a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75zM3 9.75h18M6 21v-6h12v6" />
        </svg>
      </i>
    </a>


        <!-- Cart with badge -->
        <a  href="/my-carts" class="relative group">
          <i class=""><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg></i>
          <span v-if="cartItemCount > 0" class="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{{ cartItemCount }}</span>
        </a>



        <a href="/orders" class="group">
          <i class=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
          <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM3.5 8v7.75c0 .414.336.75.75.75h11.5a.75.75 0 0 0 .75-.75V8h-13ZM5 4.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75H5ZM7.25 5A.75.75 0 0 1 8 4.25h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V5ZM11 4.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75H11Z" clip-rule="evenodd" />
        </svg>
        </i>
        </a>

        <a href="/account" class="group">
          <i class="fa-regular fa-user text-2xl text-black group-hover:text-orange-600 transition"></i>
        </a>

      </div>
    </div>

    <!-- Navigation and Mega Menu -->
    <nav class="bg-white">
      <div
        class="container mx-auto px-4 flex items-center justify-between text-sm font-medium"
      >
        <div
          class="flex items-center space-x-6"
          @mouseover="showMegaMenu = true"
          @mouseleave="showMegaMenu = false"
        >
          <a
            href="#"
            class="py-3 px-1 text-gray-900 border-b-2 font-semibold relative"
            :class="{
              'border-green-600': showMegaMenu,
              'border-transparent': !showMegaMenu,
            }"
          >
            All categories
          </a>

          <div
            v-if="showMegaMenu"
            class="w-full bg-white absolute top-[80px] -left-6 z-50 border-t border-gray-200 shadow-xl mt-20 lg:mt-7"
          >
            <div class="container mx-auto flex">
              <!-- Categories list with scroll -->
              <div
                class="w-96 pt-4 pb-8 border-r border-gray-200 max-h-[420px] overflow-y-auto"
              >
                <h3
                  class="flex items-center text-base font-bold mb-3 px-3 text-gray-700"
                >
                  Categories for you
                </h3>

                <div @click="fetchProductsByCategory(category.id)"
                     v-for="category in categories"
                     :key="category.id"
                     class="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                >
                  <i class="fa-solid fa-folder mr-2 text-xss text-orange-500"></i>
                  {{ category.name }}
                </div>
              </div>

              <!-- Products grid -->
              <div class="flex-grow p-4 max-h-[420px] overflow-y-auto">
                <h3 class="text-xl font-bold mb-4 text-gray-700">
                  Products for you
                </h3>

                <!-- PROFESSIONAL SKELETON LOADER -->
                <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div
                    v-for="n in 8"
                    :key="'skeleton-' + n"
                    class="border rounded-lg p-4 shadow-sm bg-white animate-pulse"
                  >
                    <div class="w-full h-24 sm:h-28 md:h-32 bg-gray-200 rounded mb-3"></div>
                    <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div class="h-10 bg-gray-300 rounded mt-4"></div>
                  </div>
                </div>

                <!-- REAL PRODUCTS GRID -->
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div
                    @click="productDetail(product)"
                    v-for="product in productsGrid"
                    :key="product.id"
                    class="flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      class="w-full h-24 sm:h-28 md:h-32 overflow-hidden rounded-md border border-gray-100"
                    >
                      <img
                        :src="proxiedImage(product.imageSrc)"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                      />
                    </div>

                    <p class="mt-2 text-sm text-gray-700 text-center">{{ product.name }}</p>
                    <div class="flex space-x-1">
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
                          v-else
                          class="w-6 h-6 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z"/>
                        </svg>
                      </template>
                    </div>
                    <p class="text-xs text-gray-400 mt-1 truncate w-full text-center">
                      {{ product.categoryName || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <a href="https://admin.ant.et/login" class="py-3 hover:text-green-600">Become a supplier</a>
          <a href='https://play.google.com/store/apps/details?id=com.netease.mail'  class="py-3 hover:text-green-600">Get Mobile App</a>
        </div>
      </div>
    </nav>

    <hr class="border-gray-200" />
  </header>
</template>

<script>
import { request, gql } from "graphql-request";

export default {
  name: "Header",
  data() {
    return {
      showMegaMenu: false,
      categories: [],
      productsGrid: [],
      loading: false,
      token: "",
      searchQuery: "",
      carts: [],       // <-- NEW
      endpoint: import.meta.env.VITE_GRAPHQL_URL,
    };
  },
  computed: {
    cartItemCount() {
      return this.carts.reduce((total, cart) => {
        return total + cart.items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
    this.token = localStorage.getItem("token");
    if(this.token) {
      this.fetchCarts(); // <-- NEW
    }
  },
  methods: {
    proxiedImage(url) {
      if (!url) return '/placeholder.png';
      if (import.meta.env.MODE === 'production') {
        return url.replace(/^http:\/\/78\.47\.138\.239:8080/, '');
      } else return url;
    },
    productDetail(product) {
      this.$router.push({ name: "ProductDetail", params: { id: product.id } });
    },
    async fetchProductsByCategory(categoryId) {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      this.loading = true;
      this.productsGrid = [];
      const query = gql`
        query ($first: Int!, $page: Int!, $categoryId: String!) {
          products(first: $first, page: $page, orderBy: [{ column: "created_at", order: DESC }], category_id: $categoryId) {
            data { id name rate imageUrl minimum_order_quantity category { id name } }
          }
        }
      `;
      try {
        const data = await request(endpoint, query, { first: 12, page: 1, categoryId });
        this.productsGrid = data.products.data.map(p => ({
          id: p.id, name: p.name, imageSrc: p.imageUrl, categoryName: p.category.name, rate: p.rate || 0
        }));
      } catch (err) {
        console.error(err);
      } finally { this.loading = false; }
    },
    async fetchCategories() {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const query = gql`query { getTreeCategories { id name } }`;
      try {
        const data = await request(endpoint, query);
        this.categories = data.getTreeCategories;
      } catch (err) { console.error(err); }
    },
    async fetchProducts() {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      this.loading = true;
      const query = gql`query ($first: Int!, $page: Int!) {
        products(first: $first, page: $page, orderBy: [{ column: "created_at", order: DESC }]) {
          data { id name imageUrl rate minimum_order_quantity category { name } }
        }
      }`;
      try {
        const data = await request(endpoint, query, { first: 12, page: 1 });
        this.productsGrid = data.products.data.map(p => ({
          id: p.id, name: p.name, imageSrc: p.imageUrl, categoryName: p.category.name || 'N/A', rate: p.rate || 0
        }));
      } catch (err) { console.error(err); }
      finally { this.loading = false; }
    },
    async fetchCarts() {
      this.loading = true;
      try {
        const headers = { Authorization: `Bearer ${this.token}` };
        const cartQuery = gql`
          query {
            myCarts {
              warehouse { id name }
              items {
                id quantity price
                product_sku { id product { id name imageUrl } }
              }
            }
          }
        `;
        const cartData = await request(this.endpoint, cartQuery, {}, headers);
        this.carts = cartData.myCarts.map(cart => ({
          ...cart,
          items: cart.items.map(i => ({ ...i })),
        }));
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    onSearchInput() {},
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ name: "Shop", query: { search: this.searchQuery } });
      }
    }
  },
};
</script>

<style scoped>
header { position: relative; }
.absolute { position: absolute; }
.w-64::-webkit-scrollbar { width: 6px; }
.w-64::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 3px; }
</style>
