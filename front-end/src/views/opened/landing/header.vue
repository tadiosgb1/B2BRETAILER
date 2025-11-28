<template>
  <header class="w-full bg-white shadow-md">
    <div
      class="container mx-auto py-3 px-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 mt-8"
    >
      <!-- Logo -->
      <div class="flex items-center">
        <h1 class="text-2xl font-bold text-orange-600">Ant Retailer</h1>
      </div>

      <!-- Menu -->
      <div class="flex flex-wrap items-center gap-4 text-sm justify-center md:justify-end w-full md:w-auto">

        <a
          href="/login"
          class="px-4 py-2 text-orange-600 font-semibold border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition"
        >
          Login
        </a>

        <a
          href="/register"
          class="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          Register
        </a>

        <a href="/" class="group">
          <i class="fa-solid fa-home text-2xl text-orange-500 group-hover:text-orange-600 transition"></i>
        </a>

        <a href="/my-carts" class="group">
          <i class="fa-solid fa-cart-shopping text-2xl text-orange-500 group-hover:text-orange-600 transition"></i>
        </a>

        <a href="/orders" class="group">
          <i class="fa-solid fa-box text-2xl text-orange-500 group-hover:text-orange-600 transition"></i>
        </a>

        <a href="/account" class="group">
          <i class="fa-regular fa-user text-2xl text-orange-500 group-hover:text-orange-600 transition"></i>
        </a>

      </div>
    </div>

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
                        :src="product.imageSrc"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                      />
                    </div>

                    <p class="mt-2 text-sm text-gray-700 text-center">{{ product.name }}</p>

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
      loading: false, // added loading state
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
    console.log("fields are", this.getProductFieldsRecursive());
  },
  methods: {
    orders() {},
    productDetail(product) {
      console.log("product", product);
      this.$router.push({ name: "ProductDetail", params: { id: product.id } });
    },
    async fetchProductsByCategory(categoryId) {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      this.loading = true;
      this.productsGrid = [];

      const query = gql`
        query ($first: Int!, $page: Int!, $categoryId: String!) {
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
              category { id name }
            }
          }
        }
      `;

      const variables = { first: 12, page: 1, categoryId };

      try {
        const data = await request(endpoint, query, variables);
        this.productsGrid = data.products.data.map((product) => ({
          name: product.name,
          id: product.id,
          imageSrc: product.imageUrl || "https://via.placeholder.com/150?text=No+Image",
          categoryName: product.category.name,
        }));
      } catch (err) {
        console.error(`Failed to fetch products for category ${categoryId}:`, err);
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const query = gql`
        query {
          getTreeCategories { id name }
        }
      `;
      try {
        const data = await request(endpoint, query);
        this.categories = data.getTreeCategories;
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    },
    async fetchProducts() {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      this.loading = true;
      const query = gql`
        query ($first: Int!, $page: Int!) {
          products(first: $first, page: $page, orderBy: [{ column: "created_at", order: DESC }]) {
            data {
              id
              name
              imageUrl
              minimum_order_quantity
              category { name }
            }
          }
        }
      `;
      const variables = { first: 12, page: 1 };
      try {
        const data = await request(endpoint, query, variables);
        this.productsGrid = data.products.data.map((product) => ({
          name: product.name,
          id: product.id,
          imageSrc: product.imageUrl || "https://via.placeholder.com/150?text=No+Image",
          categoryName: product.category.name || 'N/A',
        }));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        this.loading = false;
      }
    },
    async getProductFieldsRecursive() {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const getTypeFields = async (typeName) => {
        const query = gql`
          query ($name: String!) {
            __type(name: $name) {
              name
              kind
              fields {
                name
                type { name kind ofType { name kind } }
              }
            }
          }
        `;
        try { return (await request(endpoint, query, { name: typeName })).__type; }
        catch (err) { console.error("Failed to fetch type:", typeName, err); return null; }
      };

      const processType = async (typeName, visited = new Set()) => {
        if (!typeName || visited.has(typeName)) return null;
        visited.add(typeName);
        const typeInfo = await getTypeFields(typeName);
        if (!typeInfo || !typeInfo.fields) return null;

        const result = { name: typeName, fields: [] };
        for (const field of typeInfo.fields) {
          let fieldType = field.type.name || field.type.ofType?.name;
          let kind = field.type.kind;
          const fieldEntry = { name: field.name, type: fieldType || "Unknown", kind, subType: null };
          if (kind === "OBJECT" || (kind === "NON_NULL" && field.type.ofType?.kind === "OBJECT") || (kind === "LIST" && field.type.ofType?.kind === "OBJECT")) {
            const nestedTypeName = field.type.name || field.type.ofType?.name || null;
            if (nestedTypeName) fieldEntry.subType = await processType(nestedTypeName, visited);
          }
          result.fields.push(fieldEntry);
        }
        return result;
      };

      return await processType("Product");
    },
  },
};
</script>

<style scoped>
header { position: relative; }
.absolute { position: absolute; }
/* Optional: thin scrollbar for left categories */
.w-64::-webkit-scrollbar { width: 6px; }
.w-64::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 3px; }
</style>
