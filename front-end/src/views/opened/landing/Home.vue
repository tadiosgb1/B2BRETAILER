<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 via-white to-green-50">
    <!-- HEADER -->
    <Header />

    <!-- HERO SECTION -->

    <Hero  />
    <Products />
    <!-- FAQs -->
    <section class="bg-green-50 py-20" v-if="faksshow">
      <Fqs />
    </section>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";
import Fqs from "./fqs.vue";
import Pricing from "./pricing.vue";
import Hero from "./hero.vue";
import Testimonals from "./testimonals.vue";
import Partners from "./partners.vue";
import Overview from "./overview.vue";
import ProductTour from "./productTour.vue";
import Products from "./products.vue";
// Simple reusable feature card component inside same file
export default {
  components: {
    Header,
    Footer,
    Fqs,
    Pricing,
    Hero,
    Testimonals,
    Partners,
    Overview,
    ProductTour,
    Products,
    FeatureCard: {
      props: ["title", "desc"],
      template: `
        <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
          <h3 class="text-xl font-semibold text-green-700">{{ title }}</h3>
          <p class="mt-3 text-gray-600">{{ desc }}</p>
        </div>
      `,
    },
  },
};
</script>

<style scoped></style>
