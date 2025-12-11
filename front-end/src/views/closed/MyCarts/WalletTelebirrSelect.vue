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
          @click="preCheckoutAndProceed"
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
async preCheckoutAndProceed() {
  try {
    const token = localStorage.getItem("token");

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

    // Construct items array dynamically from checkoutData
    const items = [
      {
        delivery_option: this.checkoutData.deliveryOption?.toUpperCase() || "COMPANY_DELIVERY",
        vehicle_type_id: this.checkoutData.vehicleTypeId || "24",
        warehouse_id: this.checkoutData.warehouseId || "92",
        cart_ids: this.checkoutData.cartIds || ["784"],
      }
    ];

    const variables = {
      payment_method: this.selectedPayment.toUpperCase(),// e.g., "WALLET" or "TELEBIRR"
      type: "INDIVIDUAL",
      items,
    };

    console.log("VARAIBLES",variables);

    const res = await request(this.endpoint, mutation, variables, {
      Authorization: `Bearer ${token}`,
    });


    if(res && variables.payment_method=='TELEBIRR'){
      await this.checkoutOrder();
    }
    // console.log("Pre-checkout GraphQL result:", res);

    // After mutation succeeds, proceed to existing checkout
  //  await this.checkoutOrder();
  } catch (err) {
    console.error("Pre-checkout failed:", err);
    this.showModal("Error", "Pre-checkout failed. Please try again.", false);
  }
},


    /* -------------------------------------------------------
     * CHECKOUT ORDER (Telebirr / Wallet) - Existing method
     * -----------------------------------------------------*/
    async checkoutOrder() {
      const url = `${import.meta.env.VITE_REST_URL}/c2b/create/order`;
      try {
        const payload = {
          // payment_method: this.selectedPayment,
          // type: "INDIVIDUAL",
          title: "iphone1",
          amount: "15",
          // delivery_option: this.checkoutData.deliveryOption.toUpperCase(),
          // vehicle_type_id: this.checkoutData.vehicleTypeId,
          // warehouse_id: this.checkoutData.warehouseId,
          // cart_ids: this.checkoutData.cartIds,
        };

        const response = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Full response:", response);
        console.log("Backend payload:", response.data);

        const payQuery = response.data;

        if (!payQuery || typeof payQuery !== "string") {
          throw new Error("Payment query parameters not returned from backend.");
        }

        const paygateUrl =
          `https://superapp.ethiomobilemoney.et:38443/payment/web/h5/paygate?${payQuery}` +
          `&version=1.0&trade_type=Checkout&use_notice_key=false&language=en`;

        console.log("Redirecting:", paygateUrl);

        window.location.href = paygateUrl;
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Checkout failed.";
        this.showModal("Error", msg, false);
      }
    },

    /* -------------------------------------------------------
     * UPLOAD DEPOSIT SLIP (GraphQL Mutation)
     * -----------------------------------------------------*/
    async submitDepositSlip(amount, reference_number, slipFile) {
      try {
        const token = localStorage.getItem("token");

        const mutation = gql`
          mutation ($amount: Float!, $reference_number: String!, $slip: Upload!) {
            createDepositSlip(
              input: {
                amount: $amount
                reference_number: $reference_number
                slip: $slip
              }
            ) {
              id
            }
          }
        `;

        const variables = { amount, reference_number, slip: slipFile };

        const result = await request(
          this.endpoint,
          mutation,
          variables,
          { Authorization: `Bearer ${token}` }
        );

        console.log("Deposit slip uploaded:", result);
        return result;
      } catch (err) {
        console.error("Deposit slip upload failed:", err);
        throw err;
      }
    },

    showModal(title, message, success) {
      this.modal = { show: true, title, message, success };
    },
  },
};
</script>

<style scoped></style>
