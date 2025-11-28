<template>
  <section
    class="relative overflow-hidden py-10 bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url(${heroBg})` }"
  >
    <!-- Dark overlay with opacity -->
    <div class="absolute inset-0 bg-black  opacity-60 lg:opacity-70"></div>

    <div
      class="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fadeIn"
    >
      <p class="text-white font-semibold tracking-wide text-lg mb-4">
        Welcome to AntB2B — Your Trusted Wholesale Marketplace
      </p>
    </div>
  </section>
</template>

<script>
import heroBg from "../../../assets/img/hero/bgg.jpg"; // your image

export default {
  name: "B2BHero",
  data() {
    return {
      heroBg,
    };
  },
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
