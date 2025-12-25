<template>
  <Header />

  <div class="min-h-screen flex flex-col bg-gray-50">
    <main class="container mx-auto p-6 flex-1">
      <h1 class="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
        My Orders
      </h1>

      <!-- Status Filter -->
      <div class="flex flex-wrap gap-3 mb-8">
        <button
          v-for="status in statuses"
          :key="status.value"
          @click="changeStatus(status.value)"
          :class="[
            'px-4 py-2 rounded-full font-semibold transition',
            selectedStatus === status.value
              ? 'bg-orange-600 text-white'
              : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
          ]"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-xl shadow-lg">
          <div class="loader mb-3"></div>
          Loading your orders...
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="orders.length === 0"
        class="text-center py-12 text-gray-400 text-lg"
      >
        No orders found.
      </div>

      <!-- Orders -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-xl shadow border"
        >
          <!-- Order Header -->
          <div class="p-6 flex justify-between border-b">
            <div>
              <p class="font-semibold text-lg">
                Order Code: {{ order.order_code }}
              </p>
              <p class="text-gray-600">Date: {{ order.created_at_human }}</p>
              <p class="text-gray-600">Items: {{ order.productSkuCount }}</p>
            </div>

            <span
              :class="[
                'px-3 py-1 h-8 rounded-lg text-sm font-semibold text-white',
                statusClass(order.status)
              ]"
            >
              {{ order.status }}
            </span>
          </div>

          <!-- Items -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex gap-4 p-4 border rounded-lg"
            >
              <img
                v-if="item.product_sku.product.imageUrl"
                :src="proxiedImage(item.product_sku.product.imageUrl)"
                class="w-24 h-24 rounded-lg object-cover"
              />

              <div class="flex-1">
                <p class="font-semibold">
                  {{ item.product_sku.product.name }}
                </p>
                <p class="text-gray-600">SKU: {{ item.product_sku.sku }}</p>
                <p class="text-gray-600">Qty: {{ item.quantity }}</p>

                <!-- Return Button -->
                <button
                  class="mt-3 inline-block rounded-lg border border-orange-500 px-4 py-1.5 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                  @click="openReturnForm(item.id)"
                >
                  Return Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>

  <!-- RETURN MODAL -->
  <div
    v-if="showForm"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">Return Product</h3>

      <label class="block mb-2 text-sm font-semibold">Quantity</label>
      <input
        type="number"
        min="1"
        v-model="quantity"
        class="w-full border rounded-lg px-3 py-2 mb-3"
      />

      <label class="block mb-2 text-sm font-semibold">Reason</label>
      <textarea
        v-model="reason"
        class="w-full border rounded-lg px-3 py-2 mb-4"
      ></textarea>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 rounded-lg border"
          @click="showForm = false"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-orange-600 text-white"
          @click="submitReturn"
        >
          Submit Return
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../../opened/landing/header.vue";
import Footer from "../../opened/landing/footer.vue";
import { request, gql } from "graphql-request";

export default {
  components: { Header, Footer },

  data() {
    return {
      orders: [],
      loading: false,
      selectedStatus: "ALL",
      endpoint: import.meta.env.VITE_GRAPHQL_URL,

      // return form
      showForm: false,
      selectedOrderItem: "",
      quantity: 1,
      reason: "",

      statuses: [
        { label: "All", value: "ALL" },
        { label: "Ordered", value: "ORDERED" },
        { label: "Payment Failed", value: "PAYMENT_FAILED" },
        { label: "Canceled", value: "CANCELED" },
        { label: "Ready for Delivery", value: "READY_FOR_DELIVERY" },
        { label: "On Delivery", value: "ON_DELIVERY" },
        { label: "Delivered", value: "DELIVERED" },
      ],
    };
  },

  mounted() {
    this.fetchOrders("ALL");
  },

  methods: {
    proxiedImage(url) {
      if (!url) return "/placeholder.png";
      return import.meta.env.MODE === "production"
        ? url.replace(/^http:\/\/78\.47\.138\.239:8080/, "")
        : url;
    },

    async fetchOrders(status) {
      this.loading = true;
      const token = localStorage.getItem("token");

      const query = gql`
        query MyOrders($status: String, $first: Int!, $page: Int) {
          myOrders(status: $status, first: $first, page: $page) {
            data {
              id
              status
              order_code
              created_at_human
              productSkuCount
              items {
                id
                quantity
                product_sku {
                  sku
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
          this.endpoint,
          query,
          {
            status: status === "ALL" ? null : status,
            first: 10,
            page: 1,
          },
          { Authorization: `Bearer ${token}` }
        );

        this.orders = res.myOrders?.data || [];
      } finally {
        this.loading = false;
      }
    },

    changeStatus(status) {
      this.selectedStatus = status;
      this.fetchOrders(status);
    },

    statusClass(status) {
      return {
        ORDERED: "bg-blue-500",
        PAYMENT_FAILED: "bg-red-500",
        CANCELED: "bg-gray-500",
        READY_FOR_DELIVERY: "bg-yellow-500 text-gray-900",
        ON_DELIVERY: "bg-purple-500",
        DELIVERED: "bg-green-500",
      }[status];
    },

    openReturnForm(orderItemId) {
      this.selectedOrderItem = orderItemId;
      this.showForm = true;
    },

    async submitReturn() {
      const endpoint = this.endpoint;

      const mutation = gql`
        mutation ($order_item_id: String!, $quantity: Int!, $reason: String!) {
          createProductReturn(
            input: {
              order_item_id: $order_item_id
              quantity: $quantity
              reason: $reason
            }
          ) {
            id
          }
        }
      `;

      try {
        const res = await request(
          endpoint,
          mutation,
          {
            order_item_id: String(this.selectedOrderItem),
            quantity: this.quantity,
            reason: this.reason,
          },
          {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          }
        );

        alert("Return created successfully! ID: " + res.createProductReturn.id);

        this.showForm = false;
        this.quantity = 1;
        this.reason = "";
        this.selectedOrderItem = "";
      } catch (e) {
        alert("Failed to create return.");
        console.error(e);
      }
    },
  },
};
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f97316;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
