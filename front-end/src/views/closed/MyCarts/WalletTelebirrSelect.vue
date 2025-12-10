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
import axios from 'axios'
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
  const url = `${import.meta.env.VITE_REST_URL}/c2b/create/order`;

  try {
    // Step 1: call backend with single-item payload (not array)
    const payload = {
      payment_method: this.selectedPayment,
      type: "INDIVIDUAL",
      title: "iphone1",      // e.g., "iphone1"
      amount: 1500,    // e.g., "15"
      delivery_option: this.checkoutData.deliveryOption.toUpperCase(),
      vehicle_type_id: this.checkoutData.vehicleTypeId,
      warehouse_id: this.checkoutData.warehouseId,
      cart_ids: this.checkoutData.cartIds,
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response",response);

    const data = response.data;
    console.log("Order created:", data);

    // Step 2: build H5 payment URL
    const params = new URLSearchParams({
      title: data.title || payload.title,
      amount: data.amount || payload.amount,
      order_id: data.order_id || "",        // if backend returns order_id
      // add other required fields here
    });

    const paygateUrl = `https://superapp.ethiomobilemoney.et:38443/payment/web/h5/paygate?${params.toString()}`;

    // Step 3: redirect user to H5 payment page
    window.location.href = paygateUrl;

  } catch (err) {
    console.error(err);
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.message ||
      "Checkout failed.";
    this.showModal("Error", msg, false);
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
