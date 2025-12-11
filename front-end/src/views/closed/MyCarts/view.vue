<template>
  <div>
    <Header />

    <div class="container mx-auto p-4 relative">
      <h1 class="text-2xl font-bold mb-4">My Carts</h1>

      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      >
        <div class="bg-white p-6 rounded shadow flex flex-col items-center">
          <div class="loader mb-2"></div>
          <span class="text-gray-700 font-semibold">Loading your carts...</span>
        </div>
      </div>

      <!-- No carts -->
      <div v-if="!loading && carts.length === 0" class="text-center text-gray-500 py-10">
        You have no items in your cart.
      </div>

      <!-- Select All -->
      <div v-else-if="carts.length > 0" class="flex items-center mb-4">
        <input
          type="checkbox"
          v-model="selectAll"
          @change="toggleSelectAll"
          class="mr-2"
        />
        <span>Select All</span>
      </div>

      <!-- Cart List -->
      <div
        v-for="(cart, idx) in carts"
        :key="cart.warehouse.id"
        class="mb-6 border p-4 rounded shadow"
      >
        <!-- Warehouse Header -->
        <div class="flex justify-between items-center mb-3">
          <h2 class="font-semibold text-lg">{{ cart.warehouse.name }}</h2>
          <div class="flex items-center gap-2">
            <select v-model="cart.deliveryType" class="border rounded px-2 py-1 text-sm">
              <option value="self_delivery">Self Delivery</option>
              <option value="company_delivery">Company Delivery</option>
            </select>

            <select
              v-if="cart.deliveryType === 'company_delivery'"
              v-model="cart.vehicleType"
              class="border rounded px-2 py-1 text-sm"
            >
              <option disabled value="">Select Vehicle</option>
              <option
                v-for="vehicle in vehicleTypes"
                :key="vehicle.id"
                :value="vehicle.id"
              >
                {{ vehicle.title }} - starting: {{ vehicle.starting_price }} ETB
              </option>
            </select>
          </div>
        </div>

        <!-- Cart Items -->
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex items-center justify-between mb-3 border-b py-2"
        >
          <div class="flex items-center gap-2 cursor-pointer" @click="productDetail(item.product_sku.product)">
            <input type="checkbox" v-model="item.selected" @click.stop />
            <img
              :src="proxiedImage(item.product_sku.product.imageUrl)"
              alt=""
              class="w-12 h-12 object-cover rounded"
            />
            <div>
              <div class="font-semibold">{{ item.product_sku.product.name }}</div>
              <div class="text-sm text-gray-500">Price: {{ item.price }} ETB</div>
            </div>
          </div>

          <!-- Quantity & Delete -->
          <div class="flex items-center gap-2">
            <button @click="decreaseQuantity(item)" class="px-2 py-1 border rounded">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="px-2 py-1 border rounded">+</button>
            <button @click="deleteItem(cart, item)" class="text-red-500 ml-2">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Total Amount -->
        <div class="flex justify-end mt-2 font-semibold text-lg">
          Total: {{ getCartTotal(cart) }} ETB
        </div>

        <!-- Checkout Button -->
        <div class="flex justify-end mt-4">
          <button
            @click="checkout(cart)"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>

    <Footer />

    <!-- Payment Modal -->
    <WalletTelebirrSelect
      v-if="showPaymentModal"
      :checkout-data="checkoutData"
      @close="showPaymentModal = false"
    />

    <!-- Info / Error Modal -->
    <div
      v-if="modal.show"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded shadow w-96">
        <h2 class="text-lg font-semibold mb-4">{{ modal.title }}</h2>
        <p class="mb-4">{{ modal.message }}</p>
        <div class="flex justify-end">
          <button
            @click="modal.show = false"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../../opened/landing/header.vue";
import Footer from "../../opened/landing/footer.vue";
import WalletTelebirrSelect from "./WalletTelebirrSelect.vue";
import { request, gql } from "graphql-request";

export default {
  name: "MyCarts",
  components: { Header, Footer, WalletTelebirrSelect },
  data() {
    return {
      carts: [],
      selectAll: false,
      showPaymentModal: false,
      checkoutData: null,
      token: localStorage.getItem("token"),
      endpoint: import.meta.env.VITE_GRAPHQL_URL,
      loading: true,
      modal: { show: false, title: "", message: "" },
      vehicleTypes: [],
      payment_methods:[],
    };
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
async fetchPaymentMethods() {
  try {
    const token = localStorage.getItem("token");
    const endpoint = import.meta.env.VITE_GRAPHQL_URL;

    const query = gql`
      query ($first: Int!, $page: Int) {
        paymentTypes(first: $first, page: $page) {
          data {
            id
            name
          }
        }
      }
    `;

    const variables = {
      first: 50,   // you can change this
      page: 1      // default page
    };

    const res = await request(endpoint, query, variables, {
      Authorization: `Bearer ${token}`,
    });


    console.log("res payment methods",res);

    // Assign to component state
    this.payment_methods = res.paymentTypes?.data || [];

    console.log("Loaded payment methods:", this.payment_methods);

  } catch (err) {
    console.error("Failed to load payment methods:", err);
  }
}
,

    async fetchCarts() {
      this.loading = true;
      try {
        const headers = { Authorization: `Bearer ${this.token}` };

        // Fetch carts
        const cartQuery = gql`
          query {
            myCarts {
              warehouse { id name }
              items {
                id quantity price
                product_sku { id product { id name imageUrl } }
              }
            }
          }
        `;
        const cartData = await request(this.endpoint, cartQuery, {}, headers);
        this.carts = cartData.myCarts.map((cart) => ({
          ...cart,
          deliveryType: "self_delivery",
          vehicleType: "",
          items: cart.items.map((i) => ({ ...i, selected: false })),
        }));

        // Fetch vehicle types
        const vehicleQuery = gql`
          query($first: Int!, $page: Int!, $ordered_by: [OrderByInput]!) {
            vehicleTypes(first: $first, page: $page, orderBy: $ordered_by) {
              data { id title starting_price }
            }
          }
        `;
        const vehicleVars = { first: 50, page: 1, ordered_by: [] };
        const vehicleData = await request(this.endpoint, vehicleQuery, vehicleVars, headers);
        this.vehicleTypes = vehicleData.vehicleTypes.data;

      } catch (err) {
        console.error(err);
        this.showModal("Error", "Failed to fetch carts or vehicle types.");
      } finally {
        this.loading = false;
      }
    },
    toggleSelectAll() {
      this.carts.forEach((cart) =>
        cart.items.forEach((item) => (item.selected = this.selectAll))
      );
    },
    increaseQuantity(item) { item.quantity++; },
    decreaseQuantity(item) { if (item.quantity > 1) item.quantity--; },
    deleteItem(cart, item) {
      cart.items = cart.items.filter((i) => i.id !== item.id);
      this.showModal("Info", "Item removed from cart.");
    },
    getCartTotal(cart) {
      return cart.items
        .filter((i) => i.selected)
        .reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    checkout(cart) {
      const selectedItems = cart.items.filter((i) => i.selected);
      if (!selectedItems.length) {
        this.showModal("Warning", "Please select at least one item to checkout.");
        return;
      }
      if (cart.deliveryType === "company_delivery" && !cart.vehicleType) {
        this.showModal("Warning", "Please select vehicle type for company delivery.");
        return;
      }
      this.checkoutData = {
        warehouseId: cart.warehouse.id,
        cartIds: selectedItems.map((i) => i.id),
        deliveryOption: cart.deliveryType,
        vehicleTypeId: cart.vehicleType,
        totalAmount: this.getCartTotal(cart),
      };
      this.showPaymentModal = true;
    },
    showModal(title, message) { this.modal = { show: true, title, message }; },
    productDetail(product) {
      this.$router.push({ name: "ProductDetail", params: { id: product.id } });
    },
  },
  mounted() { this.fetchCarts();
    this.fetchPaymentMethods()
   },
};
</script>

<style scoped>
/* Loading spinner */
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid  #f97316;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
