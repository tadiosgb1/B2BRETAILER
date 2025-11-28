<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- HEADER -->
    <Header />

    <!-- BACKGROUND -->
    <div
      class="flex-1 flex items-center justify-center bg-cover bg-center relative"
      :style="{ backgroundImage: `url(${registerBg})` }"
    >
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- REGISTER CARD -->
      <div
        class="my-16 mb-5 relative z-10 w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 animate-fadeInUp"
      >
        <Toast ref="toast" />

        <h2 class="text-3xl font-bold text-center mb-6 text-orange-700 drop-shadow-md">
          Create Retailer Account
        </h2>

        <form @submit.prevent="registerUser" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              v-model="form.name"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-1">Phone Number</label>
            <input
              v-model="form.phone"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              v-model="form.email"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              v-model="form.password"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              v-model="form.password_confirmation"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm font-semibold">
            {{ error }}
          </p>

          <button
            type="submit"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md shadow-lg transition"
            :disabled="loading"
          >
            <span v-if="!loading">Register</span>
            <span v-else>Creating account...</span>
          </button>
        </form>

        <!-- LOGIN LINK -->
        <p class="text-center mt-4 text-sm">
          Already have an account?
          <router-link to="/login" class="text-orange-600 font-semibold hover:underline">
            Login here
          </router-link>
        </p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "../landing/header.vue";
import Footer from "../landing/footer.vue";
import Toast from "../../../components/Toast.vue";
import registerBg from "../../../assets/img/hero/bgg.jpg";

import { request, gql } from "graphql-request";

export default {
  name: "RegisterPage",
  components: { Header, Footer, Toast },

  data() {
    return {
      form: {
        name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      error: "",
      loading: false,
      registerBg,
    };
  },

  methods: {
    async registerUser() {
      this.error = "";
      this.loading = true;

      const endpoint = import.meta.env.VITE_GRAPHQL_URL;

      const mutation = gql`
        mutation(
          $name: String!
          $phone: String!
          $email: String!
          $password: String!
          $password_confirmation: String!
        ) {
          register(
            input: {
              name: $name
              phone: $phone
              email: $email
              password: $password
              password_confirmation: $password_confirmation
            }
          ) {
            token
            status
          }
        }
      `;

      try {
        const res = await request(endpoint, mutation, {
          ...this.form,
        });

        if (!res || !res.register) throw new Error("Invalid server response");

        localStorage.setItem("token", res.register.token);

        this.$refs.toast?.showSuccessToastMessage("Account created successfully!");

        this.$router.push("/login");
      } catch (err) {
        this.error = err.message || "Registration failed.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.9s ease forwards;
}
</style>
