<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero />

    <!-- Categories Section -->
<div class="relative px-6 py-6">
  <!-- Title -->
  <h2 class="text-lg font-semibold mb-4">View by Category</h2>

  <!-- 2-Row Horizontal Scrolling Grid -->
  <div
    class="grid grid-rows-2 auto-cols-max gap-x-8 gap-y-6 overflow-x-auto scroll-smooth no-scrollbar"
    style="grid-auto-flow: column;"
    ref="categoriesContainer"
    @scroll="updateCategoryScrollArrows"
  >

    <!-- View All -->
    <div
      class="flex flex-col items-center cursor-pointer"
      @click="goToShop(null)"
    >
      <div
        class="w-20 h-20 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold"
      >
        All
      </div>
      <p class="text-sm mt-2 text-center font-medium">View All</p>
    </div>

    <!-- Category Items -->
    <div
      v-for="cat in categories"
      :key="cat.id"
      class="flex flex-col items-center cursor-pointer"
      @click="goToShop(cat.id)"
    >
      <div
        class="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shadow"
      >
        <img
          :src="proxiedImage(cat.imageUrl,'cat',cat.name)"
          alt=""
          class="w-full h-full object-cover"
        />
      </div>
      <p class="text-sm mt-2 font-medium text-center">{{ cat.name }}</p>
    </div>

  </div>

  <!-- LEFT ARROW -->
  <button
    @click="scrollCategories(-300)"
    :disabled="!canScrollPrevCategory"
    class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow z-20 disabled:opacity-40"
  >
    <i class="fas fa-chevron-left"></i>
  </button>

  <!-- RIGHT ARROW -->
  <button
    @click="scrollCategories(300)"
    :disabled="!canScrollNextCategory"
    class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow z-20 disabled:opacity-40"
  >
    <i class="fas fa-chevron-right"></i>
  </button>

</div>





    <!-- Product Sections -->
    <div v-for="section in sections" :key="section.id" class="p-4">
      <h2 class="text-2xl font-bold mb-4">{{ section.title }}</h2>
      <div class="relative">
        <!-- Left arrow -->
        <button
          v-if="section.scroll.prev"
          @click="scrollProducts(-300, section.id)"
          class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Products container -->
        <div
          :ref="'section-' + section.id"
          class="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          @scroll="updateProductScrollArrows(section.id)"
        >
          <!-- Skeleton loader (updated like Products.vue) -->
          <div
            v-if="section.loading"
            v-for="n in 8"
            :key="'skeleton-' + n"
            class="p-4 border border-gray-200 rounded-xl bg-white shadow-sm animate-pulse w-48 flex-shrink-0"
          >
            <div class="w-full h-40 bg-gray-200 rounded-xl"></div>
            <div class="mt-3 space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>

          <!-- Products -->
          <div
            v-for="product in section.products"
            :key="product.id"
            class="w-48 flex-shrink-0 bg-white rounded-lg shadow p-3 cursor-pointer hover:shadow-lg transition relative"
          >
            <div class="relative w-full h-40 mb-2 group">
              <img
                :src="proxiedImage(product.imageSrc,'product',product.name)"
                :alt="product.name"
                class="w-full h-full object-cover rounded"
              />
              <div
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition rounded cursor-pointer"
                @click.stop="goToProductDetail(product)"
              >
                <i class="fas fa-search text-white text-xl"></i>
              </div>
            </div>
            <div class="text-lg font-semibold">{{ product.name }}</div>
            <div class="text-gray-500 text-sm">{{ product.categoryName }}</div>
            <div class="text-gray-700 text-sm">MOQ: {{ product.minimum_order_quantity }}</div>
            <div class="flex mt-1">
              <template v-for="i in 5" :key="i">
                <svg
                  v-if="i <= Math.floor(product.rate)"
                  class="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z"/>
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z"/>
                </svg>
              </template>
            </div>
          </div>
        </div>

        <!-- Right arrow -->
        <button
          v-if="section.scroll.next"
          @click="scrollProducts(300, section.id)"
          class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from "./header.vue";
import Hero from "./hero.vue";
import Footer from "./footer.vue";
import { request, gql } from "graphql-request";

export default {
  components: { Header, Hero, Footer },
  data() {
    return {
      categories: [],
      sections: [
        { id: 1, title: "Popular Products", products: [], loading: false, scroll: { prev: false, next: false } },
        { id: 2, title: "Most Sold Products", products: [], loading: false, scroll: { prev: false, next: false } },
        { id: 3, title: "New Products", products: [], loading: false, scroll: { prev: false, next: false } },
      ],
      canScrollPrevCategory: false,
      canScrollNextCategory: false,
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
    this.updateCategoryScrollArrows();
    window.addEventListener("resize", this.updateCategoryScrollArrows);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCategoryScrollArrows);
  },
  methods: {
        proxiedImage(url,type,name) {
          console.log("url,type,name",url,type,name);
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
    scrollCategories(amount) {
      const container = this.$refs.categoriesContainer;
      if (!container) return;
      container.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(this.updateCategoryScrollArrows, 200);
    },
    updateCategoryScrollArrows() {
      const container = this.$refs.categoriesContainer;
      if (!container) return;
      this.canScrollPrevCategory = container.scrollLeft > 0;
      this.canScrollNextCategory = container.scrollLeft + container.clientWidth < container.scrollWidth - 1;
    },
    scrollProducts(amount, sectionId) {
      let container = this.$refs["section-" + sectionId];
      if (!container) return;
      if (Array.isArray(container)) container = container[0];
      container.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(() => this.updateProductScrollArrows(sectionId), 200);
    },
    updateProductScrollArrows(sectionId) {
      let container = this.$refs["section-" + sectionId];
      if (!container) return;
      if (Array.isArray(container)) container = container[0];

      const section = this.sections.find(s => s.id === sectionId);
      if (!section) return;

      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      section.scroll.prev = scrollLeft > 0;
      section.scroll.next = scrollLeft < maxScroll - 1;
    },
    goToProductDetail(product) {
      if (product?.id && this.$router) {
        this.$router.push({ name: "ProductDetail", params: { id: product.id } });
      }
    },
    async fetchCategories() {
      try {
        const endpoint = import.meta.env.VITE_GRAPHQL_URL;
        const query = gql`query { getTreeCategories { id name  imageUrl } }`;
        const data = await request(endpoint, query);
        this.categories = data.getTreeCategories || [];
        this.$nextTick(() => this.updateCategoryScrollArrows());
      } catch (err) {
        console.error("Categories fetch error", err);
      }
    },
    async fetchProducts(categoryId = null) {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;

      for (const section of this.sections) {
        section.loading = true;
        section.products = [];

        let query, variables = { first: 12, page: 1 };

        if (categoryId) {
          query = gql`
            query ProductsByCategory($first:Int!,$page:Int!,$categoryId:String!){
              products(first:$first,page:$page,orderBy:[{column:"created_at",order:DESC}], category_id:$categoryId){
                data { id name imageUrl minimum_order_quantity rate category {name} }
              }
            }
          `;
          variables.categoryId = categoryId;
        } else {
          query = gql`
            query AllProducts($first:Int!,$page:Int!){
              products(first:$first,page:$page,orderBy:[{column:"created_at",order:DESC}]) {
                data { id name imageUrl minimum_order_quantity rate category {name} }
              }
            }
          `;
        }

        try {
          const res = await request(endpoint, query, variables);
          section.products = (res.products?.data || []).map(p => ({
            id: p.id,
            name: p.name,
            imageSrc: p.imageUrl || "https://via.placeholder.com/150",
            categoryName: p.category?.name || "N/A",
            minimum_order_quantity: p.minimum_order_quantity,
            rate: p.rate || 0
          }));
        } catch (err) {
          console.error(`Products fetch error for section ${section.id}`, err);
        } finally {
          section.loading = false;
          this.$nextTick(() => this.updateProductScrollArrows(section.id));
        }
      }
    },
  }
};
</script>

<style scoped>
.flex::-webkit-scrollbar { display: none; }
.flex { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
