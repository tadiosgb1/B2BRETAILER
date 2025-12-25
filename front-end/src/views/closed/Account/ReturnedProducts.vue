<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-gray-800">Returned Products</h2>
    </div>

    <!-- Skeleton Loader -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="border rounded-lg p-4 shadow-sm bg-white animate-pulse"
      >
        <div class="w-full h-32 bg-gray-200 rounded mb-3"></div>
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="returns.length === 0"
      class="text-center text-lg text-gray-500 py-10"
    >
      No returned products found.
    </div>

    <!-- Returned Products Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="item in returns"
        :key="item.id"
        class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
      >
        <!-- Product Image -->
        <img
          v-if="item.orderItem?.product_sku?.product?.imageUrl"
          :src="item.orderItem.product_sku.product.imageUrl"
          class="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90 transition"
          @click="goToProductDetail(item.orderItem.product_sku.product)"
        />

        <h3 class="font-bold text-gray-900 mt-3 text-lg">
          {{ item.orderItem?.product_sku?.product?.name.slice(0, 50) || "Unnamed Product" }}
          
        </h3>
 
        

        <p class="text-sm text-gray-500">
          Quantity Returned: <span class="text-primary text-lg font-bold">{{ item.quantity }}</span>
        </p>

        <p class="text-sm text-gray-500">
          Reason: {{ item.reason }}
        </p>

        <p class="text-sm font-semibold text-gray-700">
          Status:  <span class="text-primary"> {{ item.status }}</span>
        </p>
        
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";

export default {
  name: "ReturnedProducts",

  data() {
    return {
      returns: [],
      loading: false,
      page: 1,
      perPage: 12,
    };
  },

  mounted() {
    this.fetchReturns();
  },

  methods: {
    authHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      };
    },

    goToProductDetail(product) {
      if (product?.id && this.$router) {
        this.$router.push({
          name: "ProductDetail",
          params: { id: product.id },
        });
      }
    },

    async fetchReturns() {
      this.loading = true;
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;

      const query = gql`
        query ($first: Int, $page: Int) {
          retailerProductReturns(
            first: $first
            page: $page
            orderBy: [{ column: "created_at", order: DESC }]
          ) {
            data {
              id
              quantity
              reason
              status
              orderItem {
                product_sku {
                  product {
                    id
                    name
                    imageUrl
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const res = await request(
          endpoint,
          query,
          { first: this.perPage, page: this.page },
          this.authHeaders()
        );

        this.returns = res.retailerProductReturns?.data || [];
      } catch (e) {
        console.error("Returned Products Error:", e);
        this.returns = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* clean & minimal */
</style>
