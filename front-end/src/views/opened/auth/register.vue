<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- HEADER -->
    <Header />

    <!-- BACKGROUND -->
    <div
      class="flex-1 flex items-center justify-center bg-cover bg-center relative p-4 md:p-0"
      :style="{ backgroundImage: `url(${registerBg})` }"
    >
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- REGISTER CARD -->
      <div
        class="my-16 relative z-10 w-full max-w-3xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 animate-fadeInUp shadow-lg"
      >
        <Toast ref="toast" />

        <h2 class="text-3xl font-bold text-center mb-8 text-orange-700 drop-shadow-md">
          Create Retailer Account
        </h2>

        <form
          @submit.prevent="registerUser"
          class="grid grid-cols-1 md:grid-cols-2 gap-6"
          enctype="multipart/form-data"
        >
          <!-- Full Name -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              v-model="form.name"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Phone Number</label>
            <input
              v-model="form.phone"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              v-model="form.email"
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Role -->
         


          <!-- Profile Image -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 font-semibold mb-1">Profile Image</label>
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="w-full"
            />
          </div>

          
          <!-- Password -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              v-model="form.password"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              v-model="form.password_confirmation"
              required
              class="text-black w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Error message -->
          <p class="text-red-600 text-sm font-semibold md:col-span-2" v-if="error">
            {{ error }}
          </p>

          <!-- Submit button -->
          <button
            type="submit"
            class="w-full md:col-span-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md shadow-lg transition"
            :disabled="loading"
          >
            <span v-if="!loading">Register</span>
            <span v-else>Creating account...</span>
          </button>
        </form>

        <!-- LOGIN LINK -->
        <p class="text-center mt-6 text-sm">
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
        profile_image: null,
        role: "retailer",
      },
      error: "",
      loading: false,
      registerBg,
    };
  },

  methods: {
    handleFileUpload(event) {
      this.form.profile_image = event.target.files[0];
    },

    async registerUser() {
      this.error = "";
      this.loading = true;

      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const mutation = `
        mutation CreateNew(
          $name: String!
          $phone: String!
          $email: String
          $password: String!
          $password_confirmation: String!
          $profile_image: Upload
          $role: String!
        ) {
          createNew(
            name: $name
            phone: $phone
            email: $email
            password: $password
            password_confirmation: $password_confirmation
            profile_image: $profile_image
            role: $role
          ) {
            id
            name
            phone
            status
            role
            profile_image
          }
        }
      `;

      try {
        const formData = new FormData();

        formData.append(
          "operations",
          JSON.stringify({
            query: mutation,
            variables: {
              name: this.form.name,
              phone: this.form.phone,
              email: this.form.email,
              password: this.form.password,
              password_confirmation: this.form.password_confirmation,
              profile_image: null,
              role: this.form.role,
            },
          })
        );

        formData.append(
          "map",
          JSON.stringify({
            "0": ["variables.profile_image"],
          })
        );

        if (this.form.profile_image) {
          formData.append("0", this.form.profile_image);
        }

        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (result.errors) throw new Error(result.errors[0].message);

        this.$root.$refs.toast.showToast(
          "Account created! Verify OTP sent to your phone.",
          "success"
        );

        // Redirect to OTP verification page
        this.$router.push({
          name: "OtpVerification",
          query: { phone: this.form.phone },
        });
      } catch (err) {
        console.error(err);
        const message = err?.message || "Failed to create account.";
        this.$root.$refs.toast.showToast(message, "error");
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
