<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-2xl">
    <Toast ref="toast" />
    <h2 class="text-3xl font-bold text-center mb-6 text-orange-700">
      Login to Alpha Account
    </h2>

    <form @submit.prevent="login" class="space-y-5">
      <div>
        <label class="block text-gray-700 font-semibold mb-1" for="email"
          >Email Address/Username</label
        >
        <input
          id="email"
          type="email"
          v-model="form.email"
          required
          class="text-black w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label class="block text-gray-700 font-semibold mb-1" for="password"
          >Password</label
        >
        <input
          id="password"
          type="password"
          v-model="form.password"
          required
          class="text-black w-full px-4 py-2 border rounded-md"
        />
      </div>

      <p v-if="error" class="text-red-600 text-sm font-semibold">{{ error }}</p>

      <button
        type="submit"
        class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md"
        :disabled="loading"
      >
        <span v-if="!loading">Login</span>
        <span v-else>Logging in...</span>
      </button>
    </form>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import { request, gql } from "graphql-request";

export default {
  name: "LoginPage",
  components: { Toast },

  data() {
    return {
      form: { email: "", password: "" },
      error: "",
      loading: false,
    };
  },

  methods: {
    async login() {
      this.error = "";
      this.loading = true;

      // Validate endpoint
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      if (!endpoint) {
        console.error("VITE_GRAPHQL_URL is not set in .env");
        this.error = "Server configuration error. Please contact admin.";
        this.loading = false;
        return;
      }
      console.log("Endpoint:", endpoint);

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
        const response = await request(endpoint, mutation, {
          email: this.form.email,
          password: this.form.password,
        });

        if (!response || !response.login) {
          throw new Error("Invalid response from server");
        }

        const { token, roles, permissions } = response.login;

        localStorage.setItem("token", token);
        localStorage.setItem("roles", JSON.stringify(roles));
        localStorage.setItem("permissions", JSON.stringify(permissions));

        this.$refs.toast?.showSuccessToastMessage("Login successful!");
        this.$router.push("/dashboard/first-dash");
      } catch (err) {
        console.error(err);
        this.error = err.message || "Login failed";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
