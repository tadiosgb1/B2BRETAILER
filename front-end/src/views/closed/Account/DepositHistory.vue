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

    <!-- SLIP DEPOSITS -->
    <div v-if="activeTab==='slip'" class="flex flex-col gap-4">
      <div v-if="slip.length === 0" class="text-gray-500">No slip deposits found.</div>

      <div
        v-for="d in slip"
        :key="d.id"
        class="bg-white shadow p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4"
      >
        <!-- LEFT (or TOP on mobile): Slip Image -->
        <img
          v-if="d.slip"
          :src="d.slip"
          alt="Slip Image"
          class="w-full sm:w-40 sm:h-40 object-cover rounded shadow cursor-pointer hover:opacity-80 transition"
          @click="openModal(d.slip)"
        />

        <!-- RIGHT (or BOTTOM on mobile): Slip Details -->
        <div class="flex flex-col justify-between">
          <div class="text-lg font-semibold">Slip #{{ d.id }}</div>

          <div class="text-gray-700">
            Reference: <span class="font-medium">{{ d.reference_number }}</span>
          </div>

          <div class="text-gray-700">
            Amount: <span class="font-medium">{{ d.amount }} ETB</span>
          </div>

          <div class="text-gray-700">
            Confirmed By:
            <span class="font-medium">{{ d.confirmed_by ?? "Pending" }}</span>
          </div>

          <div class="text-gray-700">
            Confirmed At:
            <span class="font-medium">{{ formatDate(d.confirmed_at) }}</span>
          </div>

          <div class="text-gray-700">
            Created At:
            <span class="font-medium">{{ formatDate(d.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TELEBIRR (GraphQL — unchanged) -->
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

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <img
        :src="modalImage"
        class="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
        @click.stop
      />
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";
import axios from "axios";

export default {
  data() {
    return {
      activeTab: "slip",
      slip: [],
      telebirr: [],
      url: import.meta.env.VITE_GRAPHQL_URL,
      token: localStorage.getItem("token"),

      showModal: false,
      modalImage: null,

      activeTabClass: "bg-orange-500 text-white font-semibold",
      inactiveTabClass: "bg-gray-200 text-gray-800",
    };
  },

  mounted() {
    this.fetchSlipDeposits();      // REST
    this.fetchTelebirrDeposits();  // GRAPHQL
  },

  methods: {
    /* ------------------------- SLIP via REST ------------------------- */
    async fetchSlipDeposits() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REST_URL}/deposit-history`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        // Backend structure: { data: [ ... ] }
        this.slip = res.data.data || res.data;
      } catch (err) {
        console.error("Slip REST error:", err.response?.data || err.message);
      }
    },

    /* ---------------------- TELEBIRR via GRAPHQL ---------------------- */
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

        this.telebirr = res.myTransactions.data.filter(
          (t) => t.payment_method === "TELEBIRR"
        );
      } catch (err) {
        console.error("Telebirr GraphQL error:", err);
      }
    },

    /* ------------------------- MODAL ------------------------- */
    openModal(url) {
      this.modalImage = url;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalImage = null;
    },

    /* ---------------------- Date Format ----------------------- */
    formatDate(date) {
      if (!date) return "—";
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
