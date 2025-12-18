<template>
  <header class="w-full bg-white shadow-md">
    <div
      class="container mx-auto py-3 px-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 mt-8"
    >
      <!-- Logo + Title -->
        <div class="flex items-center gap-2">
        <a href="/">
          <img
            src="../../../assets/img/logo.png"
            class="w-10 h-10 object-cover cursor-pointer"
            alt="Ant Retailer Logo"
          />
        </a>
        <h1 class="text-2xl font-bold text-orange-600">Ant Retailer</h1>
      </div>

      <!-- Navigation and Mega Menu -->
      <div class="flex items-center gap-4 flex-grow">
        <nav class="bg-white flex-grow">
          <div class="container mx-auto px-4 flex items-center justify-between text-sm font-medium">
            <div
              class="flex items-center space-x-6 cursor-pointer"
              @mouseover="showMegaMenu = true"
              @mouseleave="showMegaMenu = false"
            >
              <!--  ✅ ADDED HAMBURGER BUTTON -->
              <div
                class="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
                @click.stop="showMegaMenu = !showMegaMenu"
              >
                <i class="fa-solid fa-bars text-xl text-gray-700"></i>
              </div>

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

              <!-- Mega Menu -->
              <div
                v-if="showMegaMenu"
                class="w-full bg-white absolute top-[80px] -left-6 z-50 border-t border-gray-200 shadow-xl mt-10 lg:-mt-5"
              >
                <div class="container mx-auto flex">
                  
                  <!-- Categories list -->
                  <div
                    class="w-96 pt-4 pb-8 border-r border-gray-200 max-h-[420px] overflow-y-auto"
                  >
                    <h3 class="flex items-center text-base font-bold mb-3 px-3 text-gray-700">
                      Categories for you
                    </h3>

                    <div
                      v-for="category in categories"
                      :key="category.id"
                      @click="fetchSubCategories(category.id)"
                      class="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                    >
                      <i class="fa-solid fa-folder mr-2 text-xss text-orange-500"></i>
                      {{ category.name }}
                    </div>
                  </div>

                  <!-- Sub categories area -->
                  <div class="flex-grow p-4 max-h-[420px] overflow-y-auto">
                    <h3 class="text-xl font-bold mb-4 text-gray-700">
                      Sub Categories
                    </h3>

                    <!-- Skeleton Loader -->
                    <div
                      v-if="loading"
                      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    >
                      <div
                        v-for="n in 8"
                        :key="'skeleton-' + n"
                        class="border rounded-lg p-4 shadow-sm bg-white animate-pulse"
                      >
                        <div class="w-full h-24 sm:h-28 md:h-32 bg-gray-200 rounded mb-3"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      </div>
                    </div>

                    <!-- Sub-category list -->
                    <div
                      v-else
                      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    >
                      <div
                        v-for="sub in subCategories"
                        :key="sub.id"
                        class="flex flex-col items-center cursor-pointer group"
                      >
                        <div @click="goToShop(sub.parent_id)"
                          class="w-full h-24 sm:h-28 md:h-32 overflow-hidden rounded-md border border-gray-100 flex items-center justify-center bg-gray-50"
                        >
                          <!-- If image exists, show it. If not, show fallback icon -->
                          <img
                            v-if="sub.imageUrl"
                            :src="proxiedImage(sub.imageUrl)"
                            :alt="sub.name"
                            class="w-full h-full object-cover rounded-md transition-transform duration-200 group-hover:scale-105"
                          />
                          <img v-else
                              src="../../../assets/img/logo.png"
                              class="w-10 h-10 object-cover cursor-pointer"
                              alt="Ant Retailer Logo"
                            />
                        </div>

                        <p class="mt-2 text-sm text-gray-700 text-center">{{ sub.name }}</p>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </nav>
       <SearchComponent />
      </div>

      <!-- Menu Links -->
    <div class="flex flex-wrap items-center gap-4 text-sm justify-center md:justify-end w-full md:w-auto">

  <a v-if="!token" href="/login" class="px-4 py-2 text-orange-600 font-semibold border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition">Login</a>
  <a v-if="!token" href="/register" class="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">Register</a>
<a href="/shop" class="group relative">
  <i class="fa-solid fa-store text-2xl text-orange-400 group-hover:text-orange-600 transition"></i>
  <span class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
   Shop
  </span>
</a>


  <a href="/my-carts" class="relative group flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
    <span v-if="cardsCout > 0" class="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{{ cardsCout }}</span>
    <span class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
      Cart
    </span>
  </a>

  <a href="/orders" class="group relative flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
      <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM3.5 8v7.75c0 .414.336.75.75.75h11.5a.75.75 0 0 0 .75-.75V8h-13ZM5 4.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75H5ZM7.25 5A.75.75 0 0 1 8 4.25h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V5ZM11 4.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75H11Z" clip-rule="evenodd" />
    </svg>
    <span class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
      Orders
    </span>
  </a>

  <a href="/account" class="group relative flex items-center">
    <i class="fa-regular fa-user text-2xl text-black group-hover:text-orange-600 transition"></i>
    <span class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
      Account
    </span>
  </a>

</div>

    </div>

    <hr class="border-gray-200" />
  </header>
</template>

<script>
import { request, gql } from "graphql-request";

import SearchComponent from './searchComponent.vue';

export default {
  name: "Header",
  components:{
     SearchComponent
  },
  data() {
    return {
      showMegaMenu: false,
      categories: [],
      subCategories: [],
      loading: false,
      token: "",
      searchQuery: "",
      carts: [],
      endpoint: import.meta.env.VITE_GRAPHQL_URL,
      cardsCout:0,
    };
  },

  computed: {
    cartItemCount() {
        return this.carts[0].items.length;
    },

  },

  mounted() {
    this.fetchCategories();
    this.token = localStorage.getItem("token");
    if (this.token) this.fetchCarts();
  },

  methods: {
    proxiedImage(url) {      
    // Return default placeholder if no URL provided
        if (!url || url.trim() == '') {
          return '../../../assets/img/product/icon.jpg';
        }
        // Check Vite mode: 'development' or 'production'
        if (import.meta.env.MODE === 'production') {
          // In production, remove backend domain so HTTPS frontend works
          return url.replace(/^http:\/\/78\.47\.138\.239:8080/, '');
        } else {
          // In development, use full URL (local dev backend)
          return url;
        }
  },
     goToShop(category_id){
      this.$router.push({ name: "Shop", query: { category_id:category_id } });
    },
    async fetchCategories() {
      const query = gql`query { getTreeCategories { 
      id 
      name
         imageUrl
              children {
                id
                name
                imageUrl
               }
       } 
      }`;
      try {
        const data = await request(this.endpoint, query);
        this.categories = data.getTreeCategories;
        this.subCategories = this.categories.flatMap(cat => cat.children || []);
      } catch (e) {
        console.error(e);
      }
    },



 async fetchSubCategories(id) {
    console.log("id", id);
    this.loading = true;
    this.subCategories = [];

    try {
      // Recursive search inside the tree
      const findNode = (list, targetId) => {
        for (const node of list) {
          if (node.id === targetId) return node;
          if (node.children?.length) {
            const found = findNode(node.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const category = findNode(this.categories, id);
      console.log("category", category);

      // Map over children to include parent_id
      this.subCategories = (category?.children || []).map(sub => ({
        ...sub,
        parent_id: category.id
      }));

      console.log("subCategories with parent_id", this.subCategories);

    } catch (e) {
      console.error("SUB CATEGORY ERROR:", e);
    }

    this.loading = false;
  },
  


    async fetchCarts() {
      try {
        const headers = { Authorization: `Bearer ${this.token}` };
        const query = gql`
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
        const res = await request(this.endpoint, query, {}, headers);

        this.carts = res.myCarts;
        
        console.log("carts in the heaads",this.carts[0].items.length);
        this.cardsCout=this.carts[0].items.length;

      } catch (e) {
        console.error(e);
      }
    },

    onSearchInput() {},

    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ name: "Shop", query: { search: this.searchQuery } });
      }
    }
  }
};
</script>

<style scoped>
header { position: relative; }
.absolute { position: absolute; }
.w-64::-webkit-scrollbar { width: 6px; }
.w-64::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 3px; }
</style>
