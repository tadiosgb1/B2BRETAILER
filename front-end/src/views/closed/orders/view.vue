<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-50">
    <!-- Header -->
    <Header class="fixed top-0 w-full z-50 shadow bg-white" />

    <!-- Main -->
    <main class="flex-1 overflow-y-auto pt-20">
      <div class="container mx-auto px-6 pb-10">

        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 class="text-3xl font-semibold text-gray-800">
            My Orders
          </h1>

          <!-- Search -->
          <div class="relative w-full sm:w-80">
            <span class="absolute left-3 top-2.5 text-gray-400 text-sm"></span>
            <input
              v-model="searchQuery"
              @input="onSearch"
              type="text"
              placeholder="Search by order code"
              class="pl-9 pr-8 py-2 w-full border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Status Filters -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="status in statuses"
            :key="status.value"
            @click="changeStatus(status.value)"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-medium transition',
              selectedStatus === status.value
                ? 'bg-orange-600 text-white shadow'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            ]"
          >
            {{ status.label }}
          </button>
        </div>

        <!-- Loading Overlay -->
        <div v-if="loading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <div class="loader"></div>
            <span class="text-sm font-medium text-gray-700">
              Loading orders...
            </span>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="orders.length === 0"
          class="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500"
        >
          No orders found.
        </div>

        <!-- Orders Table -->
        <div v-else class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left">
              <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th class="px-4 py-3">Order Code</th>
                  <th class="px-4 py-3">Date</th>
                  <th class="px-4 py-3 text-center">Items</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y">
                <tr
                  v-for="order in orders"
                  :key="order.id"
                  class="hover:bg-gray-50 transition"
                >
                  <!-- Order Code -->
                  <td class="px-4 py-3 font-medium text-gray-800">
                    {{ order.order_code }}
                  </td>

                  <!-- Date -->
                  <td class="px-4 py-3 text-gray-600">
                    {{ order.created_at_human }}
                  </td>

                  <!-- Items -->
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {{ order.productSkuCount }}
                    </span>
                  </td>

                  <!-- Status -->
             <td class="px-4 py-3">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold text-white"
                :class="statusClass(order.status)"
              >
                {{
                  order.status
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, char => char.toUpperCase())
                }}
              </span>
            </td>


                  <!-- Actions -->
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="openProductsModal(order)"
                        class="px-3 py-1.5 border border-orange-600 text-orange-600 rounded-md text-xs hover:bg-orange-600 hover:text-white transition"
                      >
                        View Ordered Products
                      </button>

                      <button
                        @click="openReturnForm(order.items[0].id)"
                        class="px-3 py-1.5 border border-green-600 text-green-600 rounded-md text-xs hover:bg-green-600 hover:text-white transition"
                      >
                        Return Product
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination (Right Aligned) -->
          <div class="flex justify-end items-center gap-3 px-4 py-3 border-t bg-gray-50 text-sm">
            <button
              class="px-3 py-1.5 border rounded disabled:opacity-50"
              :disabled="orderPage === 1"
              @click="orderPage--"
            >
              Prev
            </button>

            <span class="font-medium text-gray-700">
              Page {{ orderPage }} of {{ totalOrderPages }}
            </span>

            <button
              class="px-3 py-1.5 border rounded disabled:opacity-50"
              :disabled="orderPage === totalOrderPages"
              @click="orderPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>

    <!--Ordered  PRODUCTS MODAL -->
    <transition name="slide-right">
      <div
        v-if="showProductsModal && selectedOrder"
        class="fixed inset-0 bg-black/40 flex justify-end z-50"
      >
        <div class="bg-white w-full sm:max-w-md h-full shadow-xl p-5 overflow-y-auto relative">
          <button
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            @click="showProductsModal = false"
          >
            ✕
          </button>

          <h3 class="text-lg font-semibold mb-4">
            Ordered Products
          </h3>

          <div class="space-y-3">
            <div
              v-for="item in selectedOrder.items ?? []"
              :key="item.id"
              class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
            >
              <img
                v-if="item.product_sku?.product?.imageUrl"
                :src="item.product_sku.product.imageUrl"
                class="w-14 h-14 rounded object-cover border"
              />

              <div>
                <p class="font-semibold text-sm">
                  {{ item.product_sku?.product?.name ?? "Unnamed" }}
                </p>
                <p class="text-xs text-gray-500">
                  SKU: {{ item.product_sku?.sku ?? "-" }}
                </p>
                <p class="text-xs text-gray-500">
                  Qty: {{ item.quantity ?? "-" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- RETURN MODAL -->
  <!-- RETURN MODAL -->
    <transition name="slide-right">
      <div
        v-if="showReturnModal"
        class="fixed inset-0 bg-black/40 flex justify-end z-50"
      >
        <div class="bg-white w-full sm:max-w-md h-full shadow-xl p-6 relative">

          <!-- Close Button -->
          <button
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            @click="showReturnModal = false"
          >
            ✕
          </button>

          <h3 class="text-xl font-semibold mb-6 text-gray-800">
            Return Product
          </h3>

          <!-- Quantity -->
          <label class="block text-sm font-medium mb-1 text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            v-model="returnForm.quantity"
            class="w-full border rounded-lg px-3 py-2 mb-4
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  focus:outline-none"
          />

          <!-- Reason -->
          <label class="block text-sm font-medium mb-1 text-gray-700">
            Reason
          </label>
          <textarea
            v-model="returnForm.reason"
            rows="4"
            class="w-full border rounded-lg px-3 py-2 mb-6
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  focus:outline-none"
          ></textarea>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
              @click="showReturnModal = false"
            >
              Cancel
            </button>

            <button
              class="px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg
                    hover:bg-orange-600 hover:text-white transition"
              @click="submitReturn"
            >
              Submit Return
            </button>
          </div>
        </div>
      </div>
    </transition>


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
