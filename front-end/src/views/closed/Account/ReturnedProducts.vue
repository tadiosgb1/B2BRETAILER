<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Returned Products</h2>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="'skeleton-' + n" class="border rounded-lg p-4 shadow-sm bg-white animate-pulse">
        <div class="w-full h-32 bg-gray-200 rounded mb-3"></div>
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        <div class="h-10 bg-gray-300 rounded mt-4"></div>
      </div>
    </div>

    <!-- No Returns -->
    <div v-else-if="returns.length === 0" class="text-center text-lg text-gray-500">
      No returned products found.
    </div>

    <!-- Returned Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="item in returns"
        :key="item.id"
        class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer"
      >
        <h3 class="font-bold text-gray-900 mt-3 text-lg">{{ item.orderItem.product_sku.product.name }}</h3>
        <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
        <p class="text-sm text-gray-500">Price: {{ item.orderItem.price }} ETB</p>
        <p class="text-sm text-gray-500">Reason: {{ item.reason }}</p>
        <p class="text-sm text-gray-500">Status: {{ item.status }}</p>

        <button class="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg">
          View Details
        </button>
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
  async mounted() {
    await this.fetchReturns();
  },
  methods: {
    async fetchReturns() {
      this.loading = true;
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;

      const query = gql`
        query($first: Int, $page: Int) {
          productReturns(first: $first, page: $page, orderBy: [{ column: "created_at", order: DESC }]) {
            data {
              id
              quantity
              reason
              status
              orderItem {
                price
                product_sku {
                  product {
                    id
                    name
                  }
                }
              }
            }
            paginatorInfo {
              total
              currentPage
              lastPage
              perPage
              hasMorePages
            }
          }
        }
      `;

      const variables = {
        first: this.perPage,
        page: this.page,
      };

      try {
        const res = await request(endpoint, query, variables);
        this.returns = res.productReturns.data || [];
      } catch (e) {
        console.error("Returned Products Error:", e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
