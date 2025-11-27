<template>
  <div v-if="open" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
    <div class="relative bg-white rounded-lg p-6 max-w-lg w-full mx-4 sm:mx-8 shadow-2xl">
      
      <button @click="close" class="absolute top-2 right-2 text-gray-700 hover:text-orange-500 z-10 p-2">
        <i class="fas fa-times text-xl"></i>
      </button>

      <h3 class="text-2xl font-bold text-gray-800 mb-4">
        Select Warehouse for Order (Qty: {{ quantity }})
      </h3>

      <div v-if="product.delivery_estimation?.length" class="space-y-3">
        <div
          v-for="est in product.delivery_estimation"
          :key="est.warehouse?.id"
          @click="selectedWarehouse = est.warehouse"
          class="p-4 rounded-lg border-2 cursor-pointer transition duration-150"
          :class="{'border-orange-500 bg-orange-50 shadow-md': selectedWarehouse?.id === est.warehouse?.id, 'border-gray-200 hover:border-orange-300 bg-white': selectedWarehouse?.id !== est.warehouse?.id}"
        >
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-800 flex items-center">
              <i class="fas fa-map-marker-alt text-orange-400 mr-2"></i> {{ est.warehouse?.name }}
            </span>
            <span class="text-sm text-gray-700">
              <i class="far fa-calendar-alt mr-1 text-orange-500"></i>
              {{ est.min_period }} - {{ est.max_period }} {{ est.period_type }}
            </span>
          </div>
        </div>

        <button
          @click="addToCart"
          :disabled="!selectedWarehouse"
          class="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i class="fas fa-cart-plus"></i>
          Add {{ quantity }} to Cart from {{ selectedWarehouse?.name || 'Selected Warehouse' }}
        </button>
      </div>

      <p v-else class="text-red-500">No delivery estimations or warehouses available for this product.</p>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";

export default {
  name: "ChooseWarehouseAddToCart",
  props: {
    open: { type: Boolean, required: true },
    product: { type: Object, required: true },
    quantity: { type: Number, required: true }
  },
  data() {
    return {
      selectedWarehouse: null
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
   async addToCart() {
  console.log("product", this.product);

  if (!this.selectedWarehouse) return;

  if (this.quantity < (this.product.minimum_order_quantity || 1)) {
    alert(`Minimum order quantity is ${this.product.minimum_order_quantity || 1}.`);
    return;
  }

  const endpoint = import.meta.env.VITE_GRAPHQL_URL;

  const mutation = gql`
    mutation($quantity: Int!, $product_sku_id: String!, $warehouse_id: String!, $product_discount_id: String) {
      createCart(input: {quantity: $quantity, product_sku_id: $product_sku_id, warehouse_id: $warehouse_id, product_discount_id: $product_discount_id}) {
        id
        quantity
      }
    }
  `;

  const variables = {
    quantity: this.quantity,
    product_sku_id: this.product.skus?.[0]?.id?.toString(),
    warehouse_id: this.selectedWarehouse.id?.toString(),
    product_discount_id: this.product.discount?.id?.toString() || null
  };

  console.log("variables", variables);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  try {
    const data = await request(endpoint, mutation, variables, {
      Authorization: `Bearer ${token}`
    });

    if (data?.createCart) {
      alert(`Added ${this.quantity} of ${this.product.name} to cart from ${this.selectedWarehouse.name}!`);
      this.close();
      this.$emit("added"); // parent can refresh cart count or show toast
    }
  } catch (err) {
    console.error(err);
    // graphql-request errors come as "response.errors"
    alert(err.response?.errors?.[0]?.message || err.message || "Failed to add to cart.");
  }
}
  }
};
</script>

<style scoped>
button:focus { outline: none; }
</style>
