<template>
  <div class="min-h-screen flex flex-col bg-gray-100">

    <!-- 🌟 HEADER -->
    <Header />

    <!-- PAGE BACKGROUND -->
    <div
      class="flex-1 flex items-center justify-center bg-cover bg-center relative"
      :style="{ backgroundImage: `url(${loginBg})` }"
    >
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- LOGIN CARD -->
      <div
        class="my-16 mb-5 relative z-10 w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 animate-fadeInUp"
      >
        <Toast ref="toast" />

        <h2 class="text-3xl font-bold text-center mb-6 text-orange-700 drop-shadow-md">
          Login Retailer Dashboard
        </h2>

        <form @submit.prevent="login" class="space-y-6">
          <!-- EMAIL -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1" for="email">
              Email Address / Username
            </label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm
                     focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <!-- PASSWORD -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1" for="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              v-model="form.password"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm
                     focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />

            <!-- FORGOT PASSWORD -->
            <div class="text-right mt-1">
              <router-link
                to="/forgot-password"
                class="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Forgot password?
              </router-link>
            </div>
          </div>

          <!-- ERROR -->
          <p v-if="error" class="text-red-600 text-sm font-semibold">
            {{ error }}
          </p>

          <!-- SUBMIT BUTTON -->
          <button
            type="submit"
            class="w-full bg-orange-600 hover:bg-orange-700 transition text-white font-bold py-3 rounded-md shadow-lg"
            :disabled="loading"
          >
            <span v-if="!loading">Login</span>
            <span v-else>Logging in...</span>
          </button>
        </form>

        <!-- NO ACCOUNT -->
        <div class="text-center mt-6">
          <p class="text-gray-700 text-sm">
            Don’t have an account?
            <router-link
              to="/register"
              class="text-orange-600 font-semibold hover:text-orange-700"
            >
              Register here
            </router-link>
          </p>
        </div>

      </div>
    </div>

    <!-- 🌟 FOOTER -->
    <Footer />
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import Header from "../landing/header.vue";
import Footer from "../landing/footer.vue";
import loginBg from "../../../assets/img/hero/bgg.jpg";
import { request, gql } from "graphql-request";

export default {
  name: "LoginPage",
  components: { Toast, Header, Footer },

  data() {
    return {
      form: { email: "", password: "" },
      error: "",
      loading: false,
      loginBg,
    };
  },

  methods: {
    async login() {
      this.error = "";
      this.loading = true;

      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      if (!endpoint) {
        this.error = "Server configuration error. Contact admin.";
        this.loading = false;
        return;
      }

      const mutation = gql`
        mutation ($email: String!, $password: String!) {
          login(input: { email: $email, password: $password }) {
            token
            roles
            permissions {
              name
            }
          }
        }
      `;

      try {
        const res = await request(endpoint, mutation, {
          email: this.form.email,
          password: this.form.password,
        });

        if (!res || !res.login) throw new Error("Invalid server response");

        const { token, roles, permissions } = res.login;

        localStorage.setItem("token", token);
        localStorage.setItem("roles", JSON.stringify(roles));
        localStorage.setItem("permissions", JSON.stringify(permissions));

        this.$refs.toast?.showSuccessToastMessage("Login successful!");
        this.$router.push("/");
      } catch (err) {
        this.error = err.message || "Login failed";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Smooth card entrance */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 1s ease forwards;
}
</style>
