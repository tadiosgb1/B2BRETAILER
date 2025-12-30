<template>
  <div class="h-screen flex flex-col overflow-hidden">
  <Header class="fixed top-0 w-full z-50 shadow-md bg-white "/>
  <main class="flex-1 overflow-y-auto ">

  <div class="min-h-screen flex flex-col bg-gray-50">
    <main class="container mx-auto p-6 flex-1">
      <!-- Header + Search -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 class="text-3xl font-bold text-gray-800 border-b pb-2 flex-1">
          My Orders
        </h1>
        <input
          v-model="searchQuery"
          @input="orderPage = 1; fetchOrders()"
          type="text"
          placeholder="Search by order code..."
          class="border rounded px-3 py-1 w-full sm:w-64 text-sm"
        />
      </div>

      <!-- Status Filter -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="status in statuses"
          :key="status.value"
          @click="changeStatus(status.value)"
          :class="[
            'px-3 py-1 rounded-full text-xs font-semibold transition',
            selectedStatus === status.value
              ? 'bg-orange-600 text-white'
              : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
          ]"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-lg text-center">
          <div class="loader mb-3 mx-auto"></div>
          Loading your orders...
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="orders.length === 0" class="text-center py-6 text-gray-500 text-sm">
        No orders found.
      </div>

      <!-- Orders List -->
      <div v-else class="flex flex-col gap-2 overflow-x-auto">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white shadow p-2 rounded-lg border border-gray-200 flex items-center gap-2 text-xs"
        >
          <!-- Order Fields Horizontal -->
          <div class="flex flex-col min-w-[80px]">
            <span class="text-gray-500 font-semibold">Order</span>
            <span class="px-1 py-0.5 bg-gray-100 rounded">{{ order.order_code }}</span>
          </div>

          <div class="flex flex-col min-w-[70px]">
            <span class="text-gray-500 font-semibold">Date</span>
            <span class="px-1 py-0.5 bg-gray-100 rounded">{{ order.created_at_human }}</span>
          </div>

          <div class="flex flex-col min-w-[50px]">
            <span class="text-gray-500 font-semibold">Items</span>
            <span class="px-1 py-0.5 bg-blue-100 rounded">{{ order.productSkuCount }}</span>
          </div>

          <div class="flex flex-col min-w-[60px]">
            <span class="text-gray-500 font-semibold">Status</span>
            <span
              class="px-1 py-0.5 rounded text-white font-bold"
              :class="statusClass(order.status)"
            >
              {{ order.status }}
            </span>
          </div>

          <!-- Buttons -->
          <div class="flex gap-2">
            <!-- Ordered Products Button -->
            <button
              class="px-2 py-1 border-2 border-orange-600 text-orange-600 text-xs rounded hover:bg-orange-600 hover:text-white transition"
              @click="openProductsModal(order)"
            >
              Ordered Products
            </button>

            <!-- Return Product Button -->
            <button
              class="px-2 py-1 border-2 border-green-600 text-green-600 text-xs rounded hover:bg-green-600 hover:text-white transition"
              @click="openReturnForm(order.items[0].id)"
            >
              Return Product
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center items-center gap-2 mt-2 text-sm">
          <button
            class="px-2 py-1 border rounded text-gray-700 disabled:opacity-50"
            :disabled="orderPage === 1"
            @click="orderPage--"
          >
            Prev
          </button>

          <span class="px-2 py-1 font-semibold text-gray-800">
            Page {{ orderPage }} / {{ totalOrderPages }}
          </span>

          <button
            class="px-2 py-1 border rounded text-gray-700 disabled:opacity-50"
            :disabled="orderPage === totalOrderPages"
            @click="orderPage++"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <Footer />
  </div>

  <!-- PRODUCTS MODAL -->
  <transition name="slide-right">
    <div
      v-if="showProductsModal && selectedOrder"
      class="fixed inset-0 bg-black/40 flex justify-end z-50 "
    >
      <div class="bg-white w-full sm:max-w-md h-full shadow-xl p-4 overflow-y-auto relative">
        <button
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          @click="showProductsModal = false"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold mb-3">Ordered Products</h3>
        <div class="flex flex-col gap-2">
          <div
            v-for="item in selectedOrder.items ?? []"
            :key="item.id"
            class="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded"
          >
            <img
              v-if="item.product_sku?.product?.imageUrl"
              :src="item.product_sku.product.imageUrl"
              class="w-12 h-12 object-cover rounded"
            />
            <div class="flex flex-col">
              <span class="font-semibold">{{ item.product_sku?.product?.name ?? "Unnamed" }}</span>
              <span class="text-gray-500">SKU: {{ item.product_sku?.sku ?? "-" }}</span>
              <span class="text-gray-500">Qty: {{ item.quantity ?? "-" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- RETURN MODAL -->
  <div v-if="showReturnModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">Return Product</h3>

      <label class="block mb-2 text-sm font-semibold">Quantity</label>
      <input
        type="number"
        min="1"
        v-model="returnForm.quantity"
        class="w-full border rounded-lg px-3 py-2 mb-3"
      />

      <label class="block mb-2 text-sm font-semibold">Reason</label>
      <textarea
        v-model="returnForm.reason"
        class="w-full border rounded-lg px-3 py-2 mb-4"
      ></textarea>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 rounded-lg border"
          @click="showReturnModal = false"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
          @click="submitReturn"
        >
          Submit Return
        </button>
      </div>
    </div>
  </div>
</main>
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
      searchQuery: "",
      orderPage: 1,
      totalOrderPages: 1,
      endpoint: import.meta.env.VITE_GRAPHQL_URL,

      // Modals
      showProductsModal: false,
      selectedOrder: null,
      showReturnModal: false,
      returnForm: { quantity: 1, reason: "", orderItemId: null },

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
  watch: {
    orderPage() {
      this.fetchOrders();
    },
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    statusClass(status) {
      return {
        ORDERED: "bg-blue-500",
        PAYMENT_FAILED: "bg-red-500",
        CANCELED: "bg-gray-500",
        READY_FOR_DELIVERY: "bg-yellow-500 text-gray-900",
        ON_DELIVERY: "bg-purple-500",
        DELIVERED: "bg-green-500",
      }[status] ?? "bg-gray-500";
    },
    async fetchOrders() {
      this.loading = true;
      const token = localStorage.getItem("token");

      const query = gql`
        query MyOrders($status: String, $first: Int!, $page: Int, $search: String) {
          myOrders(status: $status, first: $first, page: $page, search: $search) {
            data {
              id
              order_code
              status
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
            paginatorInfo {
              currentPage
              lastPage
            }
          }
        }
      `;

      try {
        const res = await request(
          this.endpoint,
          query,
          {
            status: this.selectedStatus === "ALL" ? null : this.selectedStatus,
            first: 5,
            page: this.orderPage,
            search: this.searchQuery || null,
          },
          { Authorization: `Bearer ${token}` }
        );

        this.orders = res.myOrders?.data ?? [];
        this.totalOrderPages = res.myOrders?.paginatorInfo?.lastPage ?? 1;
      } catch (err) {
        console.error(err);
        this.orders = [];
        this.totalOrderPages = 1;
      } finally {
        this.loading = false;
      }
    },
    changeStatus(status) {
      this.selectedStatus = status;
      this.orderPage = 1;
      this.fetchOrders();
    },
    openProductsModal(order) {
      this.selectedOrder = order;
      this.showProductsModal = true;
    },
    openReturnForm(orderItemId) {
      this.returnForm = { quantity: 1, reason: "", orderItemId };
      this.showReturnModal = true;
    },
    async submitReturn() {
      if (!this.returnForm.orderItemId) return;
      const token = localStorage.getItem("token");
      const mutation = gql`
        mutation($order_item_id: String!, $quantity: Int!, $reason: String!) {
          createProductReturn(
            input: {
              order_item_id: $order_item_id,
              quantity: $quantity,
              reason: $reason
            }
          ) {
            id
          }
        }
      `;
      try {
        const res = await request(
          this.endpoint,
          mutation,
          {
            order_item_id: String(this.returnForm.orderItemId),
            quantity: Number(this.returnForm.quantity),
            reason: this.returnForm.reason,
          },
          { Authorization: `Bearer ${token}` }
        );
        alert("Return created successfully! ID: " + res.createProductReturn.id);
        this.showReturnModal = false;
      } catch (err) {
        console.error(err);
        alert("Failed to create return.");
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
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}
main::-webkit-scrollbar {
  width: 4px; /* ultra-thin scrollbar */
}

main::-webkit-scrollbar-track {
  background: transparent; /* invisible track */
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* subtle dark thumb */
  border-radius: 2px; /* rounded edges */
}

/* Scrollbar styling for Firefox */
main {
  scrollbar-width: thin; /* thin scrollbar */
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* thumb color + track color */
}
</style>
