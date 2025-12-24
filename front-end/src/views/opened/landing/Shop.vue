<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 via-white to-green-50">
    <!-- HEADER -->
    <Header />

    <!-- HERO SECTION -->

    <Hero  />
     <Products :category_id="category_id" />
    <!-- FAQs -->
   

    <!-- FOOTER -->
    <Footer />
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";
import Hero from "./hero.vue";
import Products from "./products.vue";
// Simple reusable feature card component inside same file
export default {
  components: {
    Header,
    Footer,
    Hero,
  
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


  data(){
    return{
      category_id:"",
    }
  },


  mounted(){
    this.category_id=this.$route.query.category_id;
    console.log("categoy id",this.category_id);
  }

};
</script>

<style scoped>
   .custom-scroll::-webkit-scrollbar {
  width: 2px;  /* super thin */
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f3f3f3;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #a1a1aa;
  border-radius: 1px;
}

.custom-scroll {
  scrollbar-width: thin;          /* Firefox */
  scrollbar-color: #a1a1aa #f3f3f3; /* Firefox */
}
</style>
