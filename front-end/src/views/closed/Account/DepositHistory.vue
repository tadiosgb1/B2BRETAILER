<template>
  <div class="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-3xl font-semibold text-gray-800">
        Deposit History
      </h2>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        @click="activeTab='slip'"
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition',
          activeTab === 'slip'
            ? 'bg-orange-600 text-white shadow'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        ]"
      >
        Slip Deposits
      </button>

      <button
        @click="activeTab='telebirr'"
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition',
          activeTab === 'telebirr'
            ? 'bg-orange-600 text-white shadow'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        ]"
      >
        Telebirr Deposits
      </button>
    </div>

    <!-- SLIP DEPOSITS TABLE -->
    <div v-if="activeTab === 'slip'">

      <div
        v-if="paginatedSlip.length === 0"
        class="bg-white p-10 rounded-lg shadow-sm text-center text-gray-500"
      >
        No slip deposits found.
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th class="px-4 py-3 text-left">Reference</th>
                <th class="px-4 py-3 text-left">Amount</th>
                <th class="px-4 py-3 text-left">Confirmed By</th>
                <th class="px-4 py-3 text-left">Confirmed At</th>
                <th class="px-4 py-3 text-left">Created At</th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr
                v-for="d in paginatedSlip"
                :key="d.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 font-medium text-gray-800">
                  {{ d.reference_number }}
                </td>

                <td class="px-4 py-3">
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {{ d.amount }} ETB
                  </span>
                </td>

                <td class="px-4 py-3 text-gray-600">
                  {{ d.confirmed_by ?? "Pending" }}
                </td>

                <td class="px-4 py-3 text-gray-600">
                  {{ formatDate(d.confirmed_at) }}
                </td>

                <td class="px-4 py-3 text-gray-600">
                  {{ formatDate(d.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-end items-center gap-3 px-4 py-3 border-t bg-gray-50 text-sm">
          <button
            class="px-3 py-1.5 border rounded disabled:opacity-50"
            :disabled="slipPage === 1"
            @click="slipPage--"
          >
            Prev
          </button>

          <span class="font-medium text-gray-700">
            Page {{ slipPage }} of {{ totalSlipPages }}
          </span>

          <button
            class="px-3 py-1.5 border rounded disabled:opacity-50"
            :disabled="slipPage === totalSlipPages"
            @click="slipPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- TELEBIRR DEPOSITS TABLE -->
    <div v-if="activeTab === 'telebirr'">

      <div
        v-if="paginatedTelebirr.length === 0"
        class="bg-white p-10 rounded-lg shadow-sm text-center text-gray-500"
      >
        No Telebirr deposits found.
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th class="px-4 py-3 text-left">Transaction Ref</th>
                <th class="px-4 py-3 text-left">Amount</th>
                <th class="px-4 py-3 text-left">Created At</th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr
                v-for="t in paginatedTelebirr"
                :key="t.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 font-medium text-gray-800">
                  {{ t.txn_ref }}
                </td>

                <td class="px-4 py-3">
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {{ t.amount }} ETB
                  </span>
                </td>

                <td class="px-4 py-3 text-gray-600">
                  {{ formatDate(t.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-end items-center gap-3 px-4 py-3 border-t bg-gray-50 text-sm">
          <button
            class="px-3 py-1.5 border rounded disabled:opacity-50"
            :disabled="telebirrPage === 1"
            @click="telebirrPage--"
          >
            Prev
          </button>

          <span class="font-medium text-gray-700">
            Page {{ telebirrPage }} of {{ totalTelebirrPages }}
          </span>

          <button
            class="px-3 py-1.5 border rounded disabled:opacity-50"
            :disabled="telebirrPage === totalTelebirrPages"
            @click="telebirrPage++"
          >
            Next
          </button>
        </div>
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
