<template>
  <header class="w-full bg-white shadow-md">
    <div
      class="container mx-auto py-3 px-4 flex items-center justify-between border-b border-gray-100"
    >
      <div class="flex items-center">
        <h1 class="text-2xl font-bold text-orange-600">Ant Retailer </h1>
      </div>
      
 <div class="flex items-center space-x-6 text-sm">

    <!-- Cart -->
    <a href="/cart" class="group transition-all duration-200">
      <i class="fa-solid fa-cart-shopping text-2xl text-orange-500
                 transition-all duration-200
                 group-hover:text-orange-600 group-hover:scale-125"></i>
    </a>

    <!-- Orders -->
    <a href="/orders" class="group transition-all duration-200">
      <i class="fa-solid fa-box text-2xl text-orange-500
                 transition-all duration-200
                 group-hover:text-orange-600 group-hover:scale-125"></i>
    </a>

    <!-- Account -->
    <a href="/account" class="group transition-all duration-200">
      <i class="fa-regular fa-user text-2xl text-orange-500
                 transition-all duration-200
                 group-hover:text-orange-600 group-hover:scale-125"></i>
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

          <a href="#" class="py-3 hover:text-green-600">Returned Products</a>
    

          <div
            v-if="showMegaMenu"
            class="w-full bg-white absolute top-[80px] -left-6 z-50 border-t border-gray-200 shadow-xl mt-7"
          >
            <div class="container mx-auto px-4 flex">
              <!-- Categories list with scroll -->
              <div
                class="w-64 pt-4 pb-8 border-r border-gray-200 max-h-[420px] overflow-y-auto"
              >
                <h3
                  class="flex items-center text-base font-bold mb-3 px-3 text-gray-700"
                >
                  <i class="fa-solid fa-star mr-2 text-xl"></i>
                  Categories for you
                </h3>

                <div @click="fetchProductsByCategory(category.id)"
                  v-for="category in categories"
                  :key="category.id"
                  class="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                >
                  <i class="fa-solid fa-folder mr-2 text-lg"></i>
                  {{ category.name }}
                </div>
              </div>

              <!-- Products grid -->
              <div class="flex-grow p-4">
                <h3 class="text-xl font-bold mb-4 text-gray-700">
                  Products for you
                </h3>
                <div class="grid grid-cols-6 gap-6">
                  <div
                  @click="productDetail(product)"
                    v-for="product in productsGrid"
                    :key="product.name"
                    class="flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      class="w-full h-24 overflow-hidden rounded-md border border-gray-100"
                    >
                      <img
                        :src="product.imageSrc"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <p class="mt-2 text-sm text-gray-700 text-center">
                      {{ product.name }}
                    </p>
                    <p
                      class="text-xs text-gray-400 mt-1 truncate w-full text-center"
                      :title="product.imageSrc"
                    >
                      {{ product.imageSrc.split("?text=")[0] }}
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
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
    console.log("fields are", this.getProductFieldsRecursive());
  },
  methods: {


    orders(){
     
    },
    async searchProducts(query) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REST_URL}search-products`,
          {
            params: { query },
            headers: {
              Accept: "application/json",
            },
          }
        );

        this.products = response.data;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching products:", err);
      } finally {
        this.loading = false;
      }
    },
    productDetail(product){

      console.log("product",product);

      this.$router.push({ name: "ProductDetail", params: { id: product.id } });
    },
async fetchProductsByCategory(categoryId) {
  const endpoint = import.meta.env.VITE_GRAPHQL_URL;

  const query = gql`
    query ($first: Int!, $page: Int!, $categoryId: String!) {
      products(
        first: $first
        page: $page
        orderBy: [{ column: "created_at", order: DESC }]
        category_id :$categoryId
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

  const variables = { first: 12, page: 1, categoryId };

  try {
    const data = await request(endpoint, query, variables);
    this.productsGrid = data.products.data.map((product) => ({
      name: product.name,
      id:product.id,
      imageSrc:
        product.imageUrl || "https://via.placeholder.com/150?text=No+Image",
      categoryName: product.category.name,
    }));
  } catch (err) {
    console.error(
      `Failed to fetch products for category ${categoryId}:`,
      err
    );
  }
}

,
    async getProductFieldsRecursive() {
  const endpoint = import.meta.env.VITE_GRAPHQL_URL;

  // Generic recursive introspection query
  const getTypeFields = async (typeName) => {
    const query = gql`
      query ($name: String!) {
        __type(name: $name) {
          name
          kind
          fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    `;

    try {
      const res = await request(endpoint, query, { name: typeName });
      return res.__type;
    } catch (err) {
      console.error("Failed to fetch type:", typeName, err);
      return null;
    }
  };

  // Recursively process a type and its subtypes
  const processType = async (typeName, visited = new Set()) => {
    if (!typeName || visited.has(typeName)) return null;
    visited.add(typeName);

    const typeInfo = await getTypeFields(typeName);
    if (!typeInfo || !typeInfo.fields) return null;

    const result = { name: typeName, fields: [] };

    for (const field of typeInfo.fields) {
      let fieldType = field.type.name || field.type.ofType?.name;
      let kind = field.type.kind;

      const fieldEntry = {
        name: field.name,
        type: fieldType || "Unknown",
        kind: kind,
        subType: null,
      };

      // Recursively fetch OBJECT types only
      if (
        kind === "OBJECT" ||
        (kind === "NON_NULL" && field.type.ofType?.kind === "OBJECT") ||
        (kind === "LIST" && field.type.ofType?.kind === "OBJECT")
      ) {
        const nestedTypeName =
          field.type.name || field.type.ofType?.name || null;

        if (nestedTypeName) {
          fieldEntry.subType = await processType(nestedTypeName, visited);
        }
      }

      result.fields.push(fieldEntry);
    }

    return result;
  };

  // Start recursion from Product
  return await processType("Product");
}
,

    async fetchCategories() {
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const query = gql`
        query {
          getTreeCategories {
            id
            name
          }
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
      const query = gql`
        query ($first: Int!, $page: Int!) {
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
      const variables = { first: 12, page: 1 };
      try {
        const data = await request(endpoint, query, variables);
        this.productsGrid = data.products.data.map((product) => ({
          name: product.name,
          id:product.id,
          imageSrc:
            product.imageUrl || "https://via.placeholder.com/150?text=No+Image",
        }));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    },
  },
};
</script>

<style scoped>
header {
  position: relative;
}
.absolute {
  position: absolute;
}
/* Optional: thin scrollbar for left categories */
.w-64::-webkit-scrollbar {
  width: 6px;
}
.w-64::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
