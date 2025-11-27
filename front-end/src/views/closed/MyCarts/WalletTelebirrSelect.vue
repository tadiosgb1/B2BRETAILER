<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-lg font-semibold mb-4">Select Payment Method</h2>

      <div class="mb-4">
        <label class="flex items-center gap-2">
          <input type="radio" value="WALLET" v-model="selectedPayment" />
          Wallet
        </label>
        <label class="flex items-center gap-2 mt-2">
          <input type="radio" value="TELEBIRR" v-model="selectedPayment" />
          Telebirr
        </label>
      </div>

      <div class="mb-4 font-semibold">Total Amount: {{ checkoutData.totalAmount }} ETB</div>

      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 border rounded">Cancel</button>
        <button
          @click="checkoutOrder"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          :disabled="!selectedPayment"
        >
          Confirm
        </button>
      </div>

      <!-- Success / Error Modal -->
      <div v-if="modal.show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
    };
  },
  methods: {
    async checkoutOrder() {
      const mutation = gql`
        mutation($payment_method: String!, $type: String, $items: [CartInput!]!) {
          checkoutOrder(input: { payment_method: $payment_method, type: $type, items: $items }) {
            link {
              result
              code
              msg
              nonce_str
              sign
              sign_type
              biz_content {
                merch_order_id
                prepay_id
                receiveCode
              }
            }
            orders {
              id
            }
          }
        }
      `;

      const variables = {
        payment_method: this.selectedPayment,
        type: "INDIVIDUAL",
        items: [
          {
            delivery_option: this.checkoutData.deliveryOption.toUpperCase(),
            vehicle_type_id: this.checkoutData.vehicleTypeId,
            warehouse_id: this.checkoutData.warehouseId,
            cart_ids: this.checkoutData.cartIds,
          },
        ],
      };

      try {
        const headers = { Authorization: `Bearer ${this.token}` };
        const data = await request(this.endpoint, mutation, variables, headers);
        console.log("Checkout response", data);
        this.showModal("Success", "Checkout successful!", true);
      } catch (err) {
        console.error(err);
        const msg = err.response?.errors?.[0]?.message || "Checkout failed.";
        this.showModal("Error", msg, false);
      }
    },
    showModal(title, message, success) {
      this.modal = { show: true, title, message, success };
    },
  },
};
</script>

<style scoped></style>
