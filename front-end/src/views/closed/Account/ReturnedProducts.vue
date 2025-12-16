<template>
  <div>
    <!-- Header with Plus Icon -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-gray-800">Returned Products</h2>
      <button @click="showForm = true" class="text-white bg-orange-500 hover:bg-orange-600 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
        +
      </button>
    </div>

    <!-- Add Product Return Modal -->
    <transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <!-- Close button -->
          <button @click="showForm = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>

          <h3 class="text-xl font-semibold mb-4">Add Product Return</h3>

          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">Order Item</label>
            <select v-model="selectedOrderItem" class="w-full border rounded p-2">
              <option value="" disabled>Select an order</option>
              <option
                v-for="item in orders"
                :key="item.id"
                :value="item.id"
              >
                {{ item.order_code }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">Quantity</label>
            <input type="number" v-model.number="quantity" min="1" class="w-full border rounded p-2" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">Reason</label>
            <input type="text" v-model="reason" placeholder="Enter reason for return" class="w-full border rounded p-2" />
          </div>

          <div class="flex justify-end">
     <button
  @click="submitReturn"
  class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
>
  Submit
</button>
          </div>
        </div>
      </div>
    </transition>

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
        <h3 class="font-bold text-gray-900 mt-3 text-lg">{{ item.orderItem?.product_sku?.product?.name || "Unnamed Product" }}</h3>
        <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
        <p class="text-sm text-gray-500">Price: {{ item.orderItem?.price || 0 }} ETB</p>
        <p class="text-sm text-gray-500">Reason: {{ item.reason }}</p>
        <p class="text-sm text-gray-500">Status: {{ item.status }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";
import axios from "axios";

export default {
  name: "ReturnedProducts",
  data() {
    return {
      returns: [],
      loading: false,
      page: 1,
      perPage: 12,

      // Add Return Form
      showForm: false,
      orders: [],
      selectedOrderItem: "",
      quantity: 1,
      reason: "",
    };
  },
  async mounted() {
    await this.fetchOrders();
    await this.fetchReturns();
  },
  methods: {
    // Get auth token header
    getAuthHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      };
    },

    // Fetch orders
 async fetchOrders() {
  try {
    const endpoint = `${import.meta.env.VITE_REST_URL}/my-orders`;
    const res = await axios.get(endpoint, { headers: this.getAuthHeaders() });
    console.log("res orders", res.data);
    this.orders = res.data?.data || []; // <-- access the inner array
  } catch (e) {
    console.error("Error fetching orders:", e);
    this.orders = [];
  }
},

    // Fetch returned products
    async fetchReturns() {
      this.loading = true;
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;

      const query = gql`
        query($first: Int, $page: Int) {
          retailerProductReturns(first: $first, page: $page, orderBy: [{ column: "created_at", order: DESC }]) {
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
                    imageUrl
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

      try {
        const res = await request(endpoint, query, { first: this.perPage, page: this.page }, { headers: this.getAuthHeaders() });
        this.returns = res.retailerProductReturns?.data || [];
      } catch (e) {
        console.error("Returned Products Error:", e);
      } finally {
        this.loading = false;
      }
    },

    // Submit new product return
    async submitReturn() {
  const selected = this.orders.find(o => o.id === this.selectedOrderItem);
  if (!selected) return;

  const endpoint = import.meta.env.VITE_GRAPHQL_URL;
  const mutation = gql`
    mutation($order_item_id: String!, $quantity: Int!, $reason: String!) {
      createProductReturn(input: { order_item_id: $order_item_id, quantity: $quantity, reason: $reason }) {
        id
      }
    }
  `;

  try {
    const res = await request(
      endpoint,
      mutation,
      {
        order_item_id: String(selected.id), // convert number to string
        quantity: this.quantity,
        reason: this.reason,
      },
      {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}` // token directly here
      }
    );

    alert("Return created successfully! ID: " + res.createProductReturn.id);

    // Reset form
    this.selectedOrderItem = "";
    this.quantity = 1;
    this.reason = "";
    this.showForm = false;

    // Refresh returned products
    await this.fetchReturns();
  } catch (e) {
    console.error("Error creating return:", e);
    alert("Failed to create return.");
  }
}

  },
};
</script>

<style scoped>
/* Fade transition for modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
