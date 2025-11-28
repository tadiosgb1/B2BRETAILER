<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-6">Deposit History</h2>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        @click="activeTab='slip'"
        :class="activeTab==='slip' ? activeTabClass : inactiveTabClass"
        class="px-4 py-2 rounded"
      >
        Slip Deposits
      </button>

      <button
        @click="activeTab='telebirr'"
        :class="activeTab==='telebirr' ? activeTabClass : inactiveTabClass"
        class="px-4 py-2 rounded"
      >
        Telebirr Deposits
      </button>
    </div>

    <!-- Slip Deposits -->
    <div v-if="activeTab==='slip'" class="flex flex-col gap-4">
      <div v-if="slip.length === 0" class="text-gray-500">No slip deposits found.</div>

      <div
        v-for="d in slip"
        :key="d.id"
        class="bg-white shadow p-4 rounded-lg border border-gray-200"
      >
        <div class="text-lg font-semibold">
          Slip #{{ d.id }}
        </div>

       <img :src="d.imageUrl" alt="Slip Image" />
        <div class="text-gray-700">
          Reference: <span class="font-medium">{{ d.reference_number }}</span>
        </div>

        <div class="text-gray-700">
          Amount: <span class="font-medium">{{ d.amount }} ETB</span>
        </div>
      </div>
    </div>

    <!-- Telebirr -->
    <div v-if="activeTab==='telebirr'" class="flex flex-col gap-4">
      <div v-if="telebirr.length === 0" class="text-gray-500">No Telebirr deposits found.</div>

      <div
        v-for="t in telebirr"
        :key="t.id"
        class="bg-white shadow p-4 rounded-lg border border-gray-200"
      >
        <div class="text-lg font-semibold">
          Telebirr Txn: {{ t.txn_ref }}
        </div>

        <div class="text-gray-700">
          Amount: <span class="font-medium">{{ t.amount }} ETB</span>
        </div>

        <div class="text-gray-500 text-sm">
          {{ formatDate(t.created_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";
import axios from 'axios';
export default {
  data() {
    return {
      activeTab: "slip",
      slip: [],
      telebirr: [],
      url: import.meta.env.VITE_GRAPHQL_URL,
      token: localStorage.getItem("token"),

      activeTabClass: "bg-orange-500 text-white font-semibold",
      inactiveTabClass: "bg-gray-200 text-gray-800",
    };
  },

  mounted() {
    this.testB2BCreateOrder(500);
    this.createC2BOrder(500);
    this.fetchSlipSchema();
    this.fetchSlipDeposits();
    this.fetchTelebirrDeposits();
  },

  methods: {

    async testB2BCreateOrder(amount = 15) {
  try {
    // Make POST request to your B2BCreateOrder endpoint
    const response = await axios.post(
      `${import.meta.env.VITE_REST_URL}/create/order`,
      {
        title: "Test B2B Order",
        amount: amount.toString(),
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`, // Use your actual token
          "x-app-key": import.meta.env.VITE_APP_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the full response for inspection
    console.log("B2B Create Order Response:", response.data);

    // Try to extract prepay_id safely
    const prepayId = response.data?.biz_content?.prepay_id;
    if (prepayId) {
      console.log("Prepay ID:", prepayId);
    } else {
      console.warn("No prepay_id found in response.");
    }
  } catch (err) {
    console.error("B2B Create Order Error:", err.response?.data || err.message);
  }
}
,
async createC2BOrder(amount) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_REST_URL}/c2b/create/order`,
      {
        title: "Deposit to wallet",
        amount: amount.toString(),
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "x-app-key": import.meta.env.VITE_APP_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("C2B Create Order Response:", response.data);

    // Parse query string
    const params = new URLSearchParams(response.data);
    const prepayId = params.get("prepay_id");

    console.log("prepayId:", prepayId);

    if (!prepayId) throw new Error("prepay_id not found in response");

    // Redirect to Telebirr checkout
   // window.location.href = `https://app.telebirr.com/checkout/pay?prepay_id=${prepayId}`;
  } catch (err) {
    console.error("C2B order error:", err);
    //alert("Failed to create C2B order.");
  }
}
,
    async fetchSlipSchema() {
  try {
    const introspectionQuery = gql`
      query {
        __type(name: "depositSlipHistory") {
          name
          fields {
            name
            type {
              name
              kind
            }
          }
        }
      }
    `;

    const res = await request(
      this.url,
      introspectionQuery,
      {},
      { Authorization: `Bearer ${this.token}` }
    );

    console.log("📌 DepositSlip Schema:", res.__type);
  } catch (err) {
    console.error("Schema fetch error:", err);
  }
}
,
    /* ------------------------- Slip Deposits ------------------------- */
    async fetchSlipDeposits() {
      try {
        const query = gql`
          query($search: String, $first: Int, $page: Int, $ordered_by: [OrderByInput]!) {
            depositSlips(
              search: $search,
              first: $first,
              page: $page,
              orderBy: $ordered_by
            ) {
              data {
                id
                imageUrl
              
              }
            }
          }
        `;

        const variables = {
          search: null,
          first: 20,
          page: 1,
          ordered_by: [{ column: "CREATED_AT", order: "DESC" }],
        };

        const res = await request(
          this.url,
          query,
          variables,
          { Authorization: `Bearer ${this.token}` }
        );

        this.slip = res.depositSlips.data;
      } catch (err) {
        console.error("Slip deposit error:", err);
      }
    },

    /* ---------------------- Telebirr Deposits ----------------------- */
    async fetchTelebirrDeposits() {
      try {
        const query = gql`
          query($first: Int!, $page: Int) {
            myTransactions(first: $first, page: $page) {
              data {
                id
                txn_ref
                amount
                payment_method
                created_at
              }
            }
          }
        `;

        const variables = { first: 50, page: 1 };

        const res = await request(
          this.url,
          query,
          variables,
          { Authorization: `Bearer ${this.token}` }
        );

        // Filter only telebirr
        this.telebirr = res.myTransactions.data.filter(
          (t) => t.payment_method === "TELEBIRR"
        );
      } catch (err) {
        console.error("Telebirr deposit error:", err);
      }
    },

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style scoped>
button {
  transition: 0.2s;
}
button:hover {
  opacity: 0.9;
}
</style>
