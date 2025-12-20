<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6 text-orange-700">
        Verify Phone
      </h2>

      <p class="text-gray-600 text-center mb-4">
        Enter the OTP sent to your phone: <strong>{{ phone }}</strong>
      </p>

      <form @submit.prevent="verifyOtp" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-1">OTP Code</label>
          <input
            v-model="otp"
            type="text"
            maxlength="6"
            required
            class="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            placeholder="Enter OTP"
          />
        </div>

        <p v-if="error" class="text-red-600 text-sm font-semibold">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm font-semibold">{{ success }}</p>

        <button
          type="submit"
          class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md shadow-lg transition"
          :disabled="loading"
        >
          <span v-if="!loading">Verify OTP</span>
          <span v-else>Verifying...</span>
        </button>
      </form>

      <p class="text-center mt-4 text-sm">
        Didn't receive OTP?
        <button
          @click="resendOtp"
          class="text-orange-600 font-semibold hover:underline"
          :disabled="resending"
        >
          <span v-if="!resending">Resend OTP</span>
          <span v-else>Sending...</span>
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";

export default {
  name: "OtpVerification",
  props: {
    phone: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      otp: "",
      error: "",
      success: "",
      loading: false,
      resending: false,
    };
  },
  methods: {
    async verifyOtp() {
      this.error = "";
      this.success = "";
      this.loading = true;

      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const mutation = gql`
        mutation VerifyPhone($phone: String!, $otp: String!) {
          verifyOtp(phone: $phone, otp: $otp) {
            message
            user {
              id
              phone
              status
            }
          }
        }
      `;

      try {
        const res = await request(endpoint, mutation, {
          phone: this.phone,
          otp: this.otp,
        });

        if (res.verifyOtp && res.verifyOtp.user.status === "verified") {
          this.success = res.verifyOtp.message || "Phone verified successfully!";
          this.$root.$refs.toast.showToast('Phone verified successfully! you can login', 'success');
          setTimeout(() => {
            this.$router.push("/login");
          }, 1500);
        } else {
          this.error = res.verifyOtp.message || "OTP verification failed.";
        }
      } catch (err) {
        this.error = err.message || "OTP verification failed.";
      } finally {
        this.loading = false;
      }
    },

    async resendOtp() {
      this.error = "";
      this.success = "";
      this.resending = true;

      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const mutation = gql`
        mutation resendOtp($phone: String!) {
          resendOtp(phone: $phone) {
            message
          }
        }
      `;

      try {
        const res = await request(endpoint, mutation, { phone: this.phone });
       this.success = res.resendOtp.message || "OTP sent successfully!";
          this.$root.$refs.toast.showToast('OTP sent successfully', 'success');
      } catch (err) {
        this.error = err.message || "Failed to resend OTP.";
      } finally {
        this.resending = false;
      }
    },
  },
};
</script>

<style scoped>
/* Optional animations */
</style>
