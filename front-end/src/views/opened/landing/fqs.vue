<template>
  <div class="max-w-4xl mx-auto px-6">
    <h2 class="text-3xl font-bold text-center text-green-800 mb-10">
      Frequently Asked Questions
    </h2>

    <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
      <button
        @click="toggle(index)"
        class="w-full bg-white p-4 shadow rounded-lg flex justify-between items-center"
      >
        <span class="font-medium text-gray-800">{{ faq.question }}</span>

        <!-- ICONS (FontAwesome) -->
        <i
          :class="[
            'text-xl',
            active === index ? 'fa-solid fa-minus' : 'fa-solid fa-plus',
          ]"
        ></i>
      </button>

      <div
        v-if="active === index"
        class="p-4 bg-gray-50 border border-gray-200 rounded-b-lg text-gray-700"
      >
        {{ faq.answer }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: null,
      faqs: [
        {
          question: "What is AntB2B.com?",
          answer:
            "AntB2B is a global B2B marketplace that connects buyers and suppliers, offering millions of products across a wide range of categories.",
        },
        {
          question: "How do I buy products on AntB2B?",
          answer:
            "You can browse products, contact suppliers, request quotations (RFQ), negotiate prices, and place secure orders through our platform.",
        },
        {
          question: "Is my payment secure on AntB2B?",
          answer:
            "Yes. AntB2B offers Buyer Protection and secure payment channels to ensure your transactions are safe.",
        },
        {
          question: "How can suppliers join AntB2B?",
          answer:
            "Suppliers can register, create a store, upload products, and start receiving buyer inquiries immediately.",
        },
        {
          question: "Do you support shipping and logistics?",
          answer:
            "Yes. AntB2B partners with logistics providers to offer shipping support, tracking, and delivery management.",
        },
      ],
    };
  },
  methods: {
    toggle(i) {
      this.active = this.active === i ? null : i;
    },
  },
};
</script>

<style scoped></style>
