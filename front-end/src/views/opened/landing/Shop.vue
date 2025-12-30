<template>
  <div class="flex flex-col h-screen bg-gradient-to-r from-blue-50 via-white to-green-50">
    <!-- FIXED HEADER -->
    <Header class="fixed top-0 left-0 w-full z-50 shadow-md bg-white" />

    <!-- SCROLLABLE MAIN CONTENT -->
    <main class="flex-1 overflow-auto "> <!-- Adjust mt-[64px] to header height -->
      <Hero />
      <Products :category_id="category_id" />
      <Footer />
    </main>
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";
import Hero from "./hero.vue";
import Products from "./products.vue";

export default {
  components: {
    Header,
    Footer,
    Hero,
    Products,
  },
  data() {
    return {
      category_id: "",
    };
  },
  mounted() {
    this.category_id = this.$route.query.category_id;
  },
};
</script>

<style scoped>
/* Scrollbar styling for Chrome, Safari, Edge */
main::-webkit-scrollbar {
  width: 4px; /* ultra-thin scrollbar */
}

main::-webkit-scrollbar-track {
  background: transparent; /* invisible track */
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* subtle dark thumb */
  border-radius: 2px; /* rounded edges */
}

/* Scrollbar styling for Firefox */
main {
  scrollbar-width: thin; /* thin scrollbar */
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* thumb color + track color */
}
</style>
