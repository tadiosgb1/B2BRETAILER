<template>
  <section class="relative overflow-hidden py-10 bg-white">
    <div
      class="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fadeIn"
    >
      <!-- Small Welcome Text -->
      <p class="text-green-600 font-semibold tracking-wide text-lg mb-4">
        Welcome to AntB2B — Your Trusted Wholesale Marketplace
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "B2BHero",
};
</script>

<style scoped>
/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 1.2s ease forwards;
}
</style>
