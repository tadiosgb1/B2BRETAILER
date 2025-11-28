<template>
  <!-- Modal Overlay -->
  <div
    v-if="showAuthModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm "
  >
    <!-- Modal Box -->
    <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fadeIn relative">
      
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-300 transition-transform transform hover:scale-110"
      >
        ×
      </button>

      <h2 class="text-2xl font-bold text-center text-orange-600 mb-4 mt-20">
        Login Required
      </h2>

      <p class="text-gray-700 text-center mb-6">
        You must be logged in to access this page. Please login or create an account.
      </p>

      <div class="flex justify-center space-x-4 mb-10">
        <button
          @click="goToLogin"
          class="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Login
        </button>

        <button
          @click="goToRegister"
          class="px-6 py-3 border border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Shared reactive state
export const showAuthModal = ref(false);

export default {
  name: "AuthRequiredModal",
  setup() {
    const router = useRouter();

    const closeModal = () => {
      showAuthModal.value = false;
    };

    const goToLogin = () => {
      showAuthModal.value = false;
      router.push("/login");
    };

    const goToRegister = () => {
      showAuthModal.value = false;
      router.push("/register");
    };

    return { showAuthModal, goToLogin, goToRegister, closeModal };
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
