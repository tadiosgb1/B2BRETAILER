<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-6">Deposit History</h2>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        @click="activeTab='slip'"
        :class="activeTab==='slip' ? activeTabClass : inactiveTabClass"
        class="px-4 py-2 rounded text-sm"
      >
        Slip Deposits
      </button>
      <button
        @click="activeTab='telebirr'"
        :class="activeTab==='telebirr' ? activeTabClass : inactiveTabClass"
        class="px-4 py-2 rounded text-sm"
      >
        Telebirr Deposits
      </button>
    </div>

    <!-- SLIP DEPOSITS -->
    <div v-if="activeTab==='slip'" class="flex flex-col gap-2">
      <div v-if="paginatedSlip.length === 0" class="text-gray-500 text-sm">
        No slip deposits found.
      </div>

      <div
        v-for="d in paginatedSlip"
        :key="d.id"
        class="bg-white shadow p-3 rounded-lg border border-gray-200 flex gap-4 overflow-x-auto"
      >
    

        <div class="flex flex-col text-xs min-w-[90px]">
          <span class="text-gray-500 font-semibold">Reference</span>
          <span class="px-1 py-0.5 bg-gray-100 rounded">{{ d.reference_number }}</span>
        </div>

        <div class="flex flex-col text-xs min-w-[90px]">
          <span class="text-gray-500 font-semibold">Amount</span>
          <span class="px-1 py-0.5 bg-green-100 rounded">{{ d.amount }} ETB</span>
        </div>

        <div class="flex flex-col text-xs min-w-[90px]">
          <span class="text-gray-500 font-semibold">Confirmed By</span>
          <span class="px-1 py-0.5 bg-blue-100 rounded">{{ d.confirmed_by ?? "Pending" }}</span>
        </div>

        <div class="flex flex-col text-xs min-w-[120px]">
          <span class="text-gray-500 font-semibold">Confirmed At</span>
          <span class="px-1 py-0.5 bg-purple-100 rounded">{{ formatDate(d.confirmed_at) }}</span>
        </div>

        <div class="flex flex-col text-xs min-w-[120px]">
          <span class="text-gray-500 font-semibold">Created At</span>
          <span class="px-1 py-0.5 bg-gray-100 rounded">{{ formatDate(d.created_at) }}</span>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-2 text-sm">
        <button
          class="px-2 py-1 border rounded text-gray-700 disabled:opacity-50"
          :disabled="slipPage === 1"
          @click="slipPage--"
        >
          Prev
        </button>

        <span class="px-2 py-1 font-semibold text-gray-800">
          Page {{ slipPage }} / {{ totalSlipPages }}
        </span>

        <button
          class="px-2 py-1 border rounded text-gray-700 disabled:opacity-50"
          :disabled="slipPage === totalSlipPages"
          @click="slipPage++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- TELEBIRR DEPOSITS -->
    <div v-if="activeTab==='telebirr'" class="flex flex-col gap-2">
      <div v-if="paginatedTelebirr.length === 0" class="text-gray-500 text-sm">
        No Telebirr deposits found.
      </div>

      <div
        v-for="t in paginatedTelebirr"
        :key="t.id"
        class="bg-white shadow p-3 rounded-lg border border-gray-200 flex gap-4 overflow-x-auto"
      >
        <div class="flex flex-col text-xs min-w-[90px]">
          <span class="text-gray-500 font-semibold">Txn</span>
          <span class="px-1 py-0.5 bg-orange-100 rounded">{{ t.txn_ref }}</span>
        </div>

        <div class="flex flex-col text-xs min-w-[90px]">
          <span class="text-gray-500 font-semibold">Amount</span>
          <span class="px-1 py-0.5 bg-green-100 rounded">{{ t.amount }} ETB</span>
        </div>

        <div class="flex flex-col text-xs min-w-[120px]">
          <span class="text-gray-500 font-semibold">Created At</span>
          <span class="px-1 py-0.5 bg-gray-100 rounded">{{ formatDate(t.created_at) }}</span>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-2 text-sm">
        <button
          class="px-2 py-1 border rounded text-gray-700 disabled:opacity-50"
          :disabled="telebirrPage === 1"
          @click="telebirrPage--"
        >
          Prev
        </button>

        <span class="px-2 py-1 font-semibold text-gray-800">
          Page {{ telebirrPage }} / {{ totalTelebirrPages }}
        </span>

        <button
          class="px-2 py-1 border rounded text-gray-700 disabled:opacity-50"
          :disabled="telebirrPage === totalTelebirrPages"
          @click="telebirrPage++"
        >
          Next
        </button>
      </div>
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
      slipPage: 1,
      telebirrPage: 1,
      perPage: 5, // Items per page
      url: import.meta.env.VITE_GRAPHQL_URL,
      token: localStorage.getItem("token"),

      activeTabClass: "bg-orange-500 text-white font-semibold",
      inactiveTabClass: "bg-gray-200 text-gray-800",
    };
  },

  computed: {
    // SLIP pagination
    paginatedSlip() {
      const start = (this.slipPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.slip.slice(start, end);
    },
    totalSlipPages() {
      return Math.ceil(this.slip.length / this.perPage) || 1;
    },

    // TELEBIRR pagination
    paginatedTelebirr() {
      const start = (this.telebirrPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.telebirr.slice(start, end);
    },
    totalTelebirrPages() {
      return Math.ceil(this.telebirr.length / this.perPage) || 1;
    },
  },

  mounted() {
    this.fetchSlipDeposits();      // REST
    this.fetchTelebirrDeposits();  // GRAPHQL
  },

  methods: {
    async fetchSlipDeposits() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REST_URL}/deposit-history`,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.slip = res.data.data || res.data;
      } catch (err) {
        console.error("Slip REST error:", err.response?.data || err.message);
      }
    },

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
        const res = await request(this.url, query, variables, {
          Authorization: `Bearer ${this.token}`,
        });
        this.telebirr = res.myTransactions.data.filter(
          (t) => t.payment_method === "TELEBIRR"
        );
      } catch (err) {
        console.error("Telebirr GraphQL error:", err);
      }
    },

    formatDate(date) {
      if (!date) return "—";
      return new Date(date).toLocaleString();
    },
  },
};
</script>
