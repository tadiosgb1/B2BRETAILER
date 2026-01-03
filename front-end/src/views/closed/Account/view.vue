<template>

  <div class="h-screen flex flex-col overflow-hidden">
   <Header class="fixed top-0 w-full z-50 shadow-md bg-white" />
   <main class="flex-1 overflow-y-auto ">

  <div class="flex flex-col min-h-screen">
   
    <!-- WALLET TOP FIXED -->
  <div
  class="bg-gray-100 text-gray-900 rounded-xl mx-4 mt-4 p-4 mb-4
         flex flex-col sm:flex-row items-start sm:items-center
         justify-between gap-3 border border-gray-200 shadow-sm"
>
  <!-- Balance + Toggle -->
  <div class="flex items-center gap-4 w-full sm:w-auto">
    <div class="text-lg font-semibold tracking-wide text-primary">
       {{showBalance ?  this.$formatPrice(walletBalance) + " ETB" : "••••• ETB" }}
    </div>

    <button
      @click="toggleBalance"
      class="text-blue-500 hover:text-orange-900 transition"
      aria-label="Toggle balance visibility"
    >
      <i :class="showBalance ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </button>
  </div>

  <!-- Action -->
  <div class="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
    <button
      @click="showDepositModal = true"
      class="flex items-center justify-center gap-2
             bg-orange-500 text-white px-4 py-2 rounded-lg
             shadow hover:bg-orange-600 transition w-full sm:w-auto"
    >
      <i class="fas fa-plus"></i>
      <span class="text-sm font-medium">Deposit</span>
    </button>
  </div>
</div>


    <!-- LOADING OVERLAY FOR WALLET BALANCE -->
    <div
      v-if="loadingBalance"
      class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
        <div class="loader mb-3"></div>
        <span class="text-gray-700 font-semibold">Loading wallet...</span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row flex-1 bg-gray-50">
      <!-- SIDEBAR -->
      <div
        class="w-full sm:w-64 bg-white border-b sm:border-b-0 sm:border-r border-gray-200 p-4 flex flex-col"
      >
        <h2 class="text-xl font-semibold mb-6">Account</h2>

        <button
          @click="activeTab = 'editAccount'"
          :class="tabClass('editAccount')"
          class="mb-2 px-4 py-2 rounded flex justify-between items-center w-full"
        >
          <span>Edit Account</span><i class="fas fa-chevron-right"></i>
        </button>

        <button
          @click="activeTab = 'geoLocation'"
          :class="tabClass('geoLocation')"
          class="mb-2 px-4 py-2 rounded flex justify-between items-center w-full"
        >
          <span>Geo Location</span><i class="fas fa-chevron-right"></i>
        </button>

        <button
          @click="activeTab = 'changePassword'"
          :class="tabClass('changePassword')"
          class="mb-2 px-4 py-2 rounded flex justify-between items-center w-full"
        >
          <span>Change Password</span><i class="fas fa-chevron-right"></i>
        </button>

        <button
          @click="activeTab = 'depositHistory'"
          :class="tabClass('depositHistory')"
          class="mb-2 px-4 py-2 rounded flex justify-between items-center w-full"
        >
          <span>Deposit History</span><i class="fas fa-chevron-right"></i>
        </button>

        <button
          @click="activeTab = 'returnedProducts'"
          :class="tabClass('returnedProducts')"
          class="mb-2 px-4 py-2 rounded flex justify-between items-center w-full"
        >
          <span>Returned Products</span><i class="fas fa-chevron-right"></i>
        </button>

        <button
          @click="logout"
          class="mb-2 px-4 py-2 rounded flex justify-between items-center w-full text-orange-500"
        >
          <span>Logout</span
          ><i class="fas fa-sign-out-alt text-orange-500"></i>
        </button>
      </div>

      <!-- MAIN CONTENT -->
      <div class="flex-1 p-4 sm:p-6 overflow-auto">
        <EditAccountInfo v-if="activeTab === 'editAccount'" />
        <GeoLocation v-if="activeTab === 'geoLocation'" />
        <ChangePassword
          v-if="activeTab === 'changePassword'"
          :password="password"
          @changePassword="changePassword"
        />
        <DepositHistory v-if="activeTab === 'depositHistory'" />
        <ReturnedProducts v-if="activeTab === 'returnedProducts'" />
      </div>
    </div>

    <Footer />

    <!-- DEPOSIT MODAL -->
    <DepositModal v-if="showDepositModal" @close="showDepositModal = false" />
  </div>
  </main>
</div>

</template>

<script>
import Header from "../../opened/landing/header.vue";
import Footer from "../../opened/landing/footer.vue";

import EditAccountInfo from "./EditAccountInfo.vue";
import GeoLocation from "./GeoLocation.vue";
import ChangePassword from "./ChangePassword.vue";
import DepositHistory from "./DepositHistory.vue";
import ReturnedProducts from "./ReturnedProducts.vue";
import DepositModal from "./DepositModal.vue";

export default {
  components: {
    Header,
    Footer,
    EditAccountInfo,
    GeoLocation,
    ChangePassword,
    DepositHistory,
    ReturnedProducts,
    DepositModal,
  },

  data() {
    return {
      activeTab: "editAccount",
      walletBalance: 0,
      showBalance: false,
      showDepositModal: false,
      password: { current: "", new: "", confirm: "" },
      loadingBalance: true,
    };
  },

  async mounted() {
    await this.fetchWalletBalance();
  },

  methods: {
    tabClass(tab) {
      return this.activeTab === tab
        ? "bg-orange-100 font-semibold"
        : "hover:bg-gray-100";
    },

    toggleBalance() {
      this.showBalance = !this.showBalance;
    },

    async fetchWalletBalance() {
      try {
        const token = localStorage.getItem("token");
        const query = `query { walletBalance }`;

        const res = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        });

        const data = await res.json();
        this.walletBalance = data.data.walletBalance;
      } catch (err) {
        console.error("Wallet error:", err);
      } finally {
        this.loadingBalance = false;
      }
    },

    changePassword() {
      alert("Password change submitted!");
    },

    logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* ORANGE SPINNER */
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f97316; /* orange-500 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
main::-webkit-scrollbar {
  width: 4px; /* ultra-thin scrollbar */
}

main::-webkit-scrollbar-track {
  background: transparent; /* invisible track */
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* subtle dark thumb */
  border-radius: 2px; /* rounded edges */
}

/* Scrollbar styling for Firefox */
main {
  scrollbar-width: thin; /* thin scrollbar */
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* thumb color + track color */
}
</style>
