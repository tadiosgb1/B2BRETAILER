<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-lg font-semibold mb-4">Deposit Funds</h2>

      <!-- Tabs -->
      <div class="flex gap-2 mb-4">
        <button
          :class="activeTab === 'slip' ? activeTabClass : inactiveTabClass"
          @click="activeTab = 'slip'"
          class="flex-1 text-center px-2 py-1 rounded"
        >
          Deposit by Slip
        </button>
        <button
          :class="activeTab === 'telebirr' ? activeTabClass : inactiveTabClass"
          @click="activeTab = 'telebirr'"
          class="flex-1 text-center px-2 py-1 rounded"
        >
          Deposit by Telebirr
        </button>
      </div>

      <!-- Deposit by Slip -->
      <div v-if="activeTab === 'slip'" class="flex flex-col gap-3">
        <label>Upload Slip</label>
        <input type="file" @change="handleSlipFile" class="w-full border p-2 rounded mt-1" />

        <input type="number" v-model.number="depositAmount" placeholder="Amount" class="w-full border p-2 rounded mt-1" />

        <input type="text" v-model="depositRef" placeholder="Reference Number" class="w-full border p-2 rounded mt-1" />

        <button @click="submitDepositSlip" class="bg-orange-500 text-white px-4 py-2 rounded mt-2 w-full">
          Submit Slip
        </button>
      </div>

      <!-- Deposit by Telebirr -->
      <div v-if="activeTab === 'telebirr'" class="flex flex-col gap-3">
        <input type="number" v-model.number="telebirrAmount" placeholder="Amount" class="w-full border p-2 rounded mt-1" />
        <input type="text" v-model="telebirrRef" placeholder="Reference Number (optional)" class="w-full border p-2 rounded mt-1" />

        <button @click="submitTelebirrDeposit" class="bg-orange-500 text-white px-4 py-2 rounded mt-2 w-full">
          Deposit Telebirr
        </button>
      </div>

      <!-- Cancel Button -->
      <div class="flex justify-end mt-4">
        <button @click="$emit('close')" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";
import axios from 'axios'
export default {
  name: "DepositModal",
  data() {
    return {
      activeTab: "slip",
      depositAmount: 0,
      depositRef: "",
      depositFile: null,
      telebirrAmount: 0,
      telebirrRef: "",
      activeTabClass: "bg-orange-100 font-semibold",
      inactiveTabClass: "hover:bg-gray-100",
    };
  },
  methods: {
    handleSlipFile(event) {
      this.depositFile = event.target.files[0];
    },

    async submitDepositSlip() {
      if (!this.depositAmount || !this.depositFile || !this.depositRef)
        return alert("Amount, file, and reference number are required");

      const token = localStorage.getItem("token"); // <--- always use token

      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation($amount: Float!, $slip: Upload!, $reference_number: String!) {
            createDepositSlip(input:{ amount:$amount, slip:$slip, reference_number:$reference_number }) { id }
          }`,
          variables: { amount: this.depositAmount, slip: null, reference_number: this.depositRef },
        })
      );
      formData.append("map", JSON.stringify({ "0": ["variables.slip"] }));
      formData.append("0", this.depositFile);

      await fetch(import.meta.env.VITE_GRAPHQL_URL, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Deposit slip submitted!");
      this.$emit("close");
    },

async submitTelebirrDeposit() {
  if (!this.telebirrAmount) return alert("Amount is required");

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "/telebirr/c2b/start/pay", // <-- PROXY FIX (NO CORS)
      { amount: this.telebirrAmount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Telebirr response:", response.data);

    // if (!response.data.returnData) {
    //   alert("❌ Telebirr payment error: missing returnData");
    //   return;
    // }

    // Build Telebirr redirect URL
    const telebirrUrl =
      "https://superapp.ethiomobilemoney.et:38443/payment/web/h5/paygate?" +
      "12345";

    // Redirect to Telebirr checkout
    window.location.href = telebirrUrl;

  } catch (error) {
        const telebirrUrl =
      "https://superapp.ethiomobilemoney.et:38443/payment/web/h5/paygate?" +
      "12345";

    // Redirect to Telebirr checkout
    window.location.href = telebirrUrl;

    console.error("Telebirr error:", error);
    alert("Something went wrong while creating Telebirr order");
  }
}



  },
};
</script>

<style scoped>
button {
  transition: all 0.2s;
}
button:hover {
  background-color: #fef3c7;
}
</style>
