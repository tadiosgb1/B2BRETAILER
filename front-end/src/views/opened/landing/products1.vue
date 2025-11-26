<template>
  <div class="w-full bg-gray-50 min-h-screen">
    <!-- TOP CATEGORY BAR - HORIZONTAL (hidden scrollbar + nav arrows) -->
    <div class="bg-white w-full shadow">
      <div class="relative px-4 py-3">
        <!-- left arrow -->
        <button
          @click="scrollLeft"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow rounded-full p-2"
          aria-label="Scroll categories left"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <!-- scrollable categories -->
        <div
          ref="catBar"
          class="flex items-center space-x-1 overflow-x-auto scrollbar-hide py-1 pl-12 pr-12"
        >
          <div
            v-for="(cat, i) in categories"
            :key="i"
            @click="selectCategory(cat.name)"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer border transition text-sm whitespace-nowrap"
            :class="
              selectedCategory === cat.name
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            "
          >
            <i :class="cat.icon" class="text-base"></i>
            <span class="font-medium">{{ cat.name }}</span>
          </div>
        </div>

        <!-- right arrow -->
        <button
          @click="scrollRight"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow rounded-full p-2"
          aria-label="Scroll categories right"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- SEARCH BAR -->
    <div class="bg-white shadow p-4">
      <div class="flex items-center space-x-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products, suppliers..."
          class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
        />
        <button
          class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Search
        </button>
      </div>
    </div>

    <!-- MAIN PRODUCT GRID -->
    <div class="mt-8">
      <div class="max-w-6xl mx-auto bg-white rounded-lg shadow p-4">
        <h3 class="font-bold text-lg mb-4">
          Products — <span class="text-orange-500">{{ selectedCategory }}</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="border rounded-lg p-4 shadow-sm bg-white"
          >
            <!-- IMAGE SECTION -->
            <div
              class="relative w-full h-56 bg-gray-100 rounded overflow-hidden"
            >
              <img
                :src="product.images[product.currentImage]"
                class="w-full h-full object-cover transition-all duration-300"
              />

              <!-- Prev -->
              <button
                v-if="product.images.length > 1"
                @click="prevImage(product)"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow p-2 rounded-full"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>

              <!-- Next -->
              <button
                v-if="product.images.length > 1"
                @click="nextImage(product)"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow p-2 rounded-full"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <!-- PRODUCT DETAILS -->
            <div class="mt-4">
              <h2 class="font-bold text-gray-900 text-lg">
                {{ product.title }}
              </h2>

              <p class="text-sm text-gray-500 mt-1">
                Supplier: {{ product.supplier }}
              </p>

              <div class="flex items-center mt-2">
                <i class="fa-solid fa-star text-yellow-400 mr-1"></i>
                <span class="text-gray-700">{{ product.rating }}</span>
                <span class="text-gray-400 ml-1">({{ product.reviews }})</span>
              </div>

              <p class="text-2xl text-orange-500 font-bold mt-3">
                {{ product.price }}
              </p>

              <p class="text-sm text-gray-500">MOQ: {{ product.moq }}</p>

              <p class="text-sm text-gray-600 mt-2">
                {{ product.description }}
              </p>

              <p
                class="mt-3 font-semibold"
                :class="product.inStock ? 'text-orange-500' : 'text-red-500'"
              >
                {{ product.inStock ? "In Stock" : "Out of Stock" }}
              </p>

              <button
                class="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
              >
                <i class="fa-solid fa-cart-shopping mr-2"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      selectedCategory: "Consumer Electronics",

      categories: [
        { name: "Consumer Electronics", icon: "fa-solid fa-headphones" },
        { name: "Shoes & Accessories", icon: "fa-solid fa-shoe-prints" },
        { name: "Apparel & Accessories", icon: "fa-solid fa-shirt" },
        { name: "Home & Kitchen", icon: "fa-solid fa-blender" },
        { name: "Beauty", icon: "fa-solid fa-spa" },
        { name: "Sports", icon: "fa-solid fa-football" },
        { name: "Toys", icon: "fa-solid fa-puzzle-piece" },
        { name: "Automotive", icon: "fa-solid fa-car" },
        { name: "Office", icon: "fa-solid fa-briefcase" },
        { name: "Toyffs", icon: "fa-solid fa-puzzle-piece" },
        { name: "Autoffmotive", icon: "fa-solid fa-car" },
        { name: "Offffice", icon: "fa-solid fa-briefcase" },
      ],

      products: [
        {
          id: 1,
          category: "Consumer Electronics",
          title: "Electric Wire Bundle",
          supplier: "Global Tech Supplies Co.",
          rating: 4.7,
          reviews: 128,
          price: "$12.50 / piece",
          moq: "50 pieces",
          inStock: true,
          description: "Durable copper wiring ideal for electronic projects.",
          currentImage: 0,
          images: [
            "/mnt/data/fd21ed21-d095-4449-83fa-d4cd875df538.png",
            "https://via.placeholder.com/400x300/00A86B",
          ],
        },

        {
          id: 2,
          category: "Consumer Electronics",
          title: "Smart Power Adapter",
          supplier: "Universal Electronics Hub",
          price: "$7.80 / piece",
          rating: 4.6,
          reviews: 99,
          moq: "30 pieces",
          inStock: true,
          currentImage: 0,
          description: "Fast charging compact power adapter.",
          images: [
            "https://via.placeholder.com/400x300/ddd",
            "https://via.placeholder.com/400x300/aaa",
          ],
        },

        {
          id: 3,
          category: "Consumer Electronics",
          title: "Mini Bluetooth Speaker",
          supplier: "SoundMax Factory",
          rating: 4.4,
          reviews: 210,
          price: "$9.99 / piece",
          moq: "20 pieces",
          description: "Portable speaker with high-definition sound.",
          inStock: true,
          currentImage: 0,
          images: [
            "https://via.placeholder.com/400x300/ffaaaa",
            "https://via.placeholder.com/400x300/ff6666",
          ],
        },

        {
          id: 4,
          category: "Consumer Electronics",
          title: "LED USB Light Strip",
          supplier: "Bright LED Manufacturing",
          price: "$5.40 / piece",
          moq: "40 pieces",
          rating: 4.8,
          reviews: 160,
          inStock: true,
          currentImage: 0,
          description: "RGB LED strip for decorations and gaming setups.",
          images: [
            "https://via.placeholder.com/400x300/99ccff",
            "https://via.placeholder.com/400x300/6699cc",
          ],
        },
      ],
    };
  },

  computed: {
    filteredProducts() {
      return this.products.filter((p) => p.category === this.selectedCategory);
    },
  },

  methods: {
    selectCategory(cat) {
      this.selectedCategory = cat;
      // ensure selected category is visible in the center-ish of the bar
      this.$nextTick(() => {
        const bar = this.$refs.catBar;
        if (!bar) return;
        const el = [...bar.children].find((c) =>
          c.textContent.trim().startsWith(cat.split(" ")[0])
        );
        if (el) {
          const offset =
            el.offsetLeft - bar.clientWidth / 2 + el.clientWidth / 2;
          bar.scrollTo({ left: offset, behavior: "smooth" });
        }
      });
    },

    nextImage(product) {
      product.currentImage = (product.currentImage + 1) % product.images.length;
    },

    prevImage(product) {
      product.currentImage =
        (product.currentImage - 1 + product.images.length) %
        product.images.length;
    },

    // scroll controls for category bar
    scrollLeft() {
      const bar = this.$refs.catBar;
      if (!bar) return;
      bar.scrollBy({ left: -180, behavior: "smooth" });
    },
    scrollRight() {
      const bar = this.$refs.catBar;
      if (!bar) return;
      bar.scrollBy({ left: 180, behavior: "smooth" });
    },
  },
};
</script>

<style>
/* hide default scrollbar while keeping scrolling usable */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE + Edge */
  scrollbar-width: none; /* Firefox */
}

/* small visual tweak: prevent arrow buttons from covering the first/last items too much */
@media (min-width: 640px) {
  .pl-12 {
    padding-left: 3rem; /* leaves room for left arrow */
  }
  .pr-12 {
    padding-right: 3rem; /* leaves room for right arrow */
  }
}
</style>
