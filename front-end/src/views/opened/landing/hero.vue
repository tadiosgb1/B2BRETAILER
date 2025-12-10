<template>
  <section
    class="relative overflow-hidden py-12 bg-cover bg-center bg-no-repeat mt-1 transition-all duration-700"
    :style="{ backgroundImage: `url(${currentBg})` }"
  >
    <!-- Orange overlay -->
    <div class="absolute inset-0 bg-orange-900/80 lg:bg-orange-900/60"></div>

    <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <!-- Subheading -->
      <p v-if="a"
        class="text-white font-semibold tracking-wide text-base mb-2 opacity-0 animate-fadeIn delay-200"
      >
        Welcome to AntB2B — Your Trusted Wholesale Marketplace
      </p>

      <!-- Main heading -->
      <h1
        class="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase opacity-0 animate-fadeIn delay-500"
      >
        <span class="block lg:inline mr-0 lg:mr-4 text-white font-extrabold">Connect.</span>
        <span class="block lg:inline mr-0 lg:mr-4 text-orange-500 font-extrabold">Trade</span>
        <span class="block lg:inline text-white">.Grow</span>
        <span class="block lg:inline animate-gradientText"> Your Business</span>
      </h1>
    </div>
  </section>
</template>

<script>
import bgg from "../../../assets/img/hero/bgg.jpg";
import bgg1 from "../../../assets/img/hero/bgg1.jpg";
import bgg2 from "../../../assets/img/hero/bgg2.jpg";
import bgg3 from "../../../assets/img/hero/bgg3.jpg";

export default {
  name: "B2BHero",

  data() {
    return {
      images: [bgg, bgg1, bgg2,bgg3],
      currentIndex: 0,
      a: true, // Keep your existing condition
    };
  },

  computed: {
    currentBg() {
      return this.images[this.currentIndex];
    },
  },

  mounted() {
    this.startCarousel();
  },

  methods: {
    startCarousel() {
      setInterval(() => {
        this.currentIndex =
          (this.currentIndex + 1) % this.images.length;
      }, 5000); // ⏱ Change image every 5 seconds
    },
  },
};
</script>

<style scoped>
/* Fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 1s ease forwards;
}
.animate-fadeIn.delay-200 { animation-delay: 0.2s; }
.animate-fadeIn.delay-500 { animation-delay: 0.5s; }

/* Gradient text animation */
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradientText {
  background-image: linear-gradient(90deg, #fb923c, #f97316, #facc15);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 3s ease infinite;
}
</style>
