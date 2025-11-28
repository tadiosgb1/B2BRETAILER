<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <!-- WALLET TOP FIXED -->
    <div class="bg-orange-500 text-white rounded-lg mx-4 mt-4 p-4 mb-4 flex flex-col md:flex-row items-center justify-between shadow-md">
      <div class="flex items-center gap-4">
        <div class="text-lg font-semibold">
          {{ showBalance ? walletBalance + " ETB" : "••••• ETB" }}
        </div>
        <button @click="toggleBalance" class="text-white">
          <i :class="showBalance ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>

      <div class="flex gap-2 mt-3 md:mt-0">
        <button @click="showDepositModal=true" class="bg-white text-orange-500 px-3 py-2 rounded shadow hover:bg-gray-100">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>

    <div class="flex flex-1 bg-gray-50">
      <!-- SIDEBAR -->
      <div class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <h2 class="text-xl font-semibold mb-6">Account</h2>

        <button @click="activeTab='editAccount'" :class="tabClass('editAccount')" class="mb-2 px-4 py-2 rounded flex justify-between items-center">
          <span>Edit Account</span><i class="fas fa-chevron-right"></i>
        </button>

        <button @click="activeTab='geoLocation'" :class="tabClass('geoLocation')" class="mb-2 px-4 py-2 rounded flex justify-between items-center">
          <span>Geo Location</span><i class="fas fa-chevron-right"></i>
        </button>

        <button @click="activeTab='changePassword'" :class="tabClass('changePassword')" class="mb-2 px-4 py-2 rounded flex justify-between items-center">
          <span>Change Password</span><i class="fas fa-chevron-right"></i>
        </button>

        <button @click="activeTab='depositHistory'" :class="tabClass('depositHistory')" class="mb-2 px-4 py-2 rounded flex justify-between items-center">
          <span>Deposit History</span><i class="fas fa-chevron-right"></i>
        </button>

        <button @click="activeTab='returnedProducts'" :class="tabClass('returnedProducts')" class="mb-2 px-4 py-2 rounded flex justify-between items-center">
          <span>Returned Products</span><i class="fas fa-chevron-right"></i>
        </button>

        <button @click="logout" class="mb-2 px-4 py-2 rounded flex justify-between items-center text-purple-500">
          <span>Logout</span><i class="fas fa-sign-out-alt text-purple-500"></i>
        </button>
      </div>

      <!-- MAIN CONTENT -->
      <div class="flex-1 p-6 overflow-auto">
        <EditAccountInfo v-if="activeTab==='editAccount'" />
        <GeoLocation v-if="activeTab==='geoLocation'" />
        <ChangePassword v-if="activeTab==='changePassword'" :password="password" @changePassword="changePassword" />
        <DepositHistory v-if="activeTab==='depositHistory'" />
        <ReturnedProducts v-if="activeTab==='returnedProducts'" />
      </div>
    </div>

    <Footer />

    <!-- DEPOSIT MODAL -->
    <DepositModal v-if="showDepositModal" @close="showDepositModal=false" />
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
    };
  },

  async mounted() {
    await this.fetchWalletBalance();
  },

  methods: {
    tabClass(tab) {
      return this.activeTab===tab ? "bg-orange-100 font-semibold" : "hover:bg-gray-100";
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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        this.walletBalance = data.data.walletBalance;
      } catch (err) {
        console.error("Wallet error:", err);
      }
    },

    changePassword() {
      alert("Password change submitted!");
    },

    logout() {
    // Clear all local storage items
    localStorage.clear();

    // Optionally, you can also clear sessionStorage if used
    sessionStorage.clear();

    // Redirect to login page
    this.$router.push("/login"); // Vue Router navigation
    // OR, if you want a full page reload:
    // window.location.href = "/login";
  }
  },
};
</script>
