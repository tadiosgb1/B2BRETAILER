<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-lg font-semibold mb-4">Select Payment Method</h2>

      <!-- Payment methods from GraphQL -->
      <div class="mb-4">
        <div v-for="method in payment_methods" :key="method.id" class="mt-2">
          <label class="flex items-center gap-2">
            <input
              type="radio"
              :value="method.name"
              v-model="selectedPayment"
            />
            {{ method.name }}
          </label>
        </div>
      </div>

      <div class="mb-4 font-semibold">
        Total Amount: {{ checkoutData.totalAmount }} ETB
      </div>

      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 border rounded">Cancel</button>

        <button
          @click="webCheckoutOrder"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          :disabled="!selectedPayment"
        >
          Confirm
        </button>
      </div>

      <!-- Success / Error Modal -->
      <div
        v-if="modal.show"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white p-6 rounded shadow w-96">
          <h2 class="text-lg font-semibold mb-4">{{ modal.title }}</h2>
          <p class="mb-4">{{ modal.message }}</p>
          <div class="flex justify-end">
            <button
              @click="modal.show=false; if(modal.success) $emit('close')"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";
import axios from "axios";

export default {
  name: "WalletTelebirrSelect",
  props: {
    checkoutData: Object,
  },
  data() {
    return {
      selectedPayment: "WALLET",
      endpoint: import.meta.env.VITE_GRAPHQL_URL,
      token: localStorage.getItem("token"),
      modal: { show: false, title: "", message: "", success: false },
      payment_methods: [],
    };
  },

  async mounted() {
    await this.fetchPaymentMethods();
  },

  methods: {
    /* -------------------------------------------------------
     * FETCH PAYMENT METHODS (GraphQL)
     * -----------------------------------------------------*/
    async fetchPaymentMethods() {
      try {
        const token = localStorage.getItem("token");
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

        const variables = { first: 50, page: 1 };

        const res = await request(this.endpoint, query, variables, {
          Authorization: `Bearer ${token}`,
        });

        console.log("res payment methods", res);

        this.payment_methods = res.paymentTypes?.data || [];
        console.log("Loaded payment methods:", this.payment_methods);
      } catch (err) {
        console.error("Failed to load payment methods:", err);
      }
    },

    /* -------------------------------------------------------
     * PRE-CHECKOUT: Call GraphQL Mutation before actual checkout
     * -----------------------------------------------------*/
  /* -------------------------------------------------------
 * PRE-CHECKOUT: Call GraphQL Mutation before actual checkout
 * -----------------------------------------------------*/
async webCheckoutOrder() {
  try {
    const token = localStorage.getItem("token");

    // Updated mutation to match backend schema
    const mutation = gql`
      mutation($payment_method: String!, $type: String, $items: [CartInput!]!) {
        webCheckoutOrder(input: { payment_method: $payment_method, type: $type, items: $items }) {
          url
        }
      }
    `;

    // Construct items array dynamically from checkoutData
    const items = [
      {
        delivery_option: this.checkoutData.deliveryOption?.toUpperCase() || "COMPANY_DELIVERY",
        vehicle_type_id: this.checkoutData.vehicleTypeId,
        warehouse_id: this.checkoutData.warehouseId || "92",
        cart_ids: this.checkoutData.cartIds || ["784"],
      }
    ];

    const variables = {
      payment_method: this.selectedPayment.toUpperCase(), // e.g., "WALLET" or "TELEBIRR"
      type: "INDIVIDUAL",
      items,
    };

    console.log("VARIABLES", variables);

    const res = await request(this.endpoint, mutation, variables, {
      Authorization: `Bearer ${token}`,
    });

    console.log("Pre-checkout result:", res);

    // If TELEBIRR, open the checkout URL
    if (res?.webCheckoutOrder?.url && variables.payment_method === "TELEBIRR") {
      window.location.href = res.webCheckoutOrder.url;
    }

  } catch (err) {
     console.error(err);
    const message =
    err?.response?.errors?.[0]?.message ||
    err?.message ||
    "Failed to add to cart.";

  this.$root.$refs.toast.showToast(message, 'error');
  }
}
,


    showModal(title, message, success) {
      this.modal = { show: true, title, message, success };
    },
  },
};
</script>

<style scoped></style>
