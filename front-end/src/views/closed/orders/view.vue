<template>
  <Header />
  <div class="min-h-screen flex flex-col bg-gray-50">
    <main class="container mx-auto p-6 flex-1">
      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">My Orders</h1>

      <!-- Filter Bar -->
      <div class="flex flex-wrap gap-3 mb-8">
        <button
          v-for="status in statuses"
          :key="status.value"
          @click="selectedStatus = status.value"
          :class="[
            'px-4 py-2 rounded-full font-semibold transition-all duration-200',
            selectedStatus === status.value
              ? 'bg-orange-600 text-white'
              : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
          ]"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- NEW LOADING OVERLAY -->
      <div
        v-if="loading"
        class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      >
        <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <div class="loader mb-3"></div>
          <span class="text-gray-700 font-semibold">Loading your orders...</span>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredOrders.length === 0"
        class="text-center py-12 text-gray-400 text-lg font-medium"
      >
        No orders found for this filter.
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
        >
          <!-- Order Header -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200"
          >
            <div class="space-y-1">
              <p class="text-lg md:text-xl font-semibold text-gray-800">
                Order Code: {{ order.order_code }}
              </p>
              <p class="text-gray-600">Date: {{ order.created_at_human }}</p>
              <p class="text-gray-600">Items: {{ order.productSkuCount }}</p>
              <p class="text-gray-600">
                Total:
                <span class="font-semibold">{{ order.total_price }} ETB</span>
              </p>
            </div>

            <span
              :class="[
                'mt-3 md:mt-0 px-3 py-1 rounded-full text-sm font-semibold text-white',
                statusClass(order.status)
              ]"
            >
              {{ order.status }}
            </span>
          </div>

          <!-- Order Items -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
              @click="productDetail(item.product_sku.product)"
            >
              <img
                v-if="item.product_sku.product.media.length"
                :src="proxiedImage(item.product_sku.product.media[0].original_url)"
                alt="Product"
                class="w-24 h-24 object-cover rounded-lg shadow-sm"
              />

              <div class="flex-1">
                <p class="font-semibold text-gray-800">
                  {{ item.product_sku.product.name }}
                </p>
                <p class="text-gray-600">SKU: {{ item.product_sku.sku }}</p>
                <p class="text-gray-600">Qty: {{ item.quantity }}</p>
                <p class="text-gray-600">
                  Price: {{ item.product_sku.price }} ETB
                </p>
                <p class="text-gray-800 font-semibold">
                  Subtotal:
                  {{ (item.quantity * item.product_sku.price).toFixed(2) }} ETB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from "../../opened/landing/header.vue";
import Footer from "../../opened/landing/footer.vue";
import axios from "axios";

export default {
  components: { Header, Footer },

  data() {
    return {
      orders: [],
      loading: true,
      selectedStatus: "ALL",
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

  computed: {
    filteredOrders() {
      if (this.selectedStatus === "ALL") return this.orders;
      return this.orders.filter((order) => order.status === this.selectedStatus);
    },
  },

  methods: {
     proxiedImage(url) {
    if (!url) return '/placeholder.png';

    // Check Vite mode: 'development' or 'production'
    if (import.meta.env.MODE === 'production') {
      // In production, remove backend domain so HTTPS frontend works
      return url.replace(/^http:\/\/78\.47\.138\.239:8080/, '');
    } else {
      // In development, use full URL (local dev backend)
      return url;
    }
  },
    statusClass(status) {
      switch (status) {
        case "ORDERED": return "bg-blue-500";
        case "PAYMENT_FAILED": return "bg-red-500";
        case "CANCELED": return "bg-gray-500";
        case "READY_FOR_DELIVERY": return "bg-yellow-500 text-gray-900";
        case "ON_DELIVERY": return "bg-purple-500";
        case "DELIVERED": return "bg-green-500";
        default: return "bg-gray-400";
      }
    },

    productDetail(product) {
      if (!product?.id) return;
      this.$router.push({ name: "ProductDetail", params: { id: product.id } });
    },
  },

  async mounted() {
    const token = localStorage.getItem("token");
    const endpoint = `${import.meta.env.VITE_REST_URL}/my-orders`;

    try {
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.orders = res.data.data || [];
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}

/* 🔥 Orange Spinner Loader */
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f97316; /* orange-500 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
