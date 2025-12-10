<template>
  <div>
    <Header />

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">

      <!-- Loading / Not Found -->
    <div
        v-if="loading"
        class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      >
        <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <div class="loader mb-3"></div>
          <span class="text-gray-700 font-semibold">Loading your product detail...</span>
        </div>
      </div>

      <div v-else-if="!product" class="text-center py-16 text-red-600 font-semibold text-xl">
        <i class="fas fa-exclamation-triangle mr-2"></i> Product not found. Please check the URL.
      </div>

      <div v-else class="space-y-6">

        <!-- PRODUCT IMAGE & DETAILS -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

          <!-- Left: Main Image -->
          <div class="md:col-span-5 relative">
            <div class="w-full h-96 rounded-xl overflow-hidden mb-4 cursor-pointer border border-gray-200 relative"
                 @click="openModal(selectedImage)">
              <img :src="proxiedImage(selectedImage)" alt="Main Product Image"
                   class="w-full h-full object-contain p-4 bg-gray-50 transition duration-300 transform hover:scale-[1.01]" />

              <!-- Image fraction -->
              <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm font-semibold">
                {{ selectedIndex + 1 }}/{{ totalImages }}
              </div>

              <!-- Navigation -->
              <button @click.stop="prevImage"
                      :disabled="selectedIndex === 0"
                      class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-orange-100 transition z-10 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button @click.stop="nextImage"
                      :disabled="selectedIndex === (product.images?.length || 0) - 1 || (product.images?.length || 0) === 0"
                      class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-orange-100 transition z-10 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Small images scrollable -->
            <div v-if="product.images?.length" class="flex gap-2 overflow-x-auto py-2">
              <div v-for="(img, index) in product.images" :key="index"
                   class="flex-shrink-0 w-20 h-20 rounded-lg border border-gray-200 overflow-hidden cursor-pointer"
                   :class="{'ring-2 ring-orange-500': selectedIndex === index}"
                   @click="selectedIndex = index">
                <img :src="proxiedImage(img.original_url)" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Right: Details -->
          <div class="md:col-span-7 space-y-4">

            <!-- Title & Price -->
            <div class="pb-2 border-b border-gray-100">
              <h1 class="text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
                {{ product.name || 'Untitled Product' }}
              </h1>
              <p class="mt-1 text-gray-500 text-lg">
                {{ product.short_description || 'No short description available.' }}
              </p>

              <div class="mt-3">
                <span class="inline-flex items-center px-4 py-2 text-xl font-black bg-orange-600 text-white rounded-lg shadow-md shadow-orange-300/50">
 
                  {{ product.skus[0].sell_price }} ETB
                </span>
              </div>
              <div class="mt-3 flex items-center">
  <!-- Stars -->
  <div class="flex space-x-1">
    <!-- Loop 5 times for 5 stars -->
    <template v-for="i in 5" :key="i">
      <svg
        v-if="i <= Math.floor(product.rate)"
        class="w-6 h-6 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z" />
      </svg>
      <svg
        v-else-if="i - product.rate < 1"
        class="w-6 h-6 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stop-color="currentColor" />
            <stop offset="50%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z"/>
      </svg>
      <svg
        v-else
        class="w-6 h-6 text-gray-300"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.962z" />
      </svg>
    </template>
  </div>

  <!-- Numeric rating -->
  <span class="ml-3 px-2 py-1 text-sm font-bold bg-orange-600 text-white rounded-lg shadow-md shadow-orange-300/50">
    {{ product.rate.toFixed(1) }}
  </span>
</div>

            </div>

            <!-- Product Meta -->
            <div class="pt-2 bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium border border-gray-200">
              <div class="flex items-center">
                <i class="fas fa-folder-open text-orange-500 mr-3 text-lg w-5 text-center"></i>
                <div>
                  <span class="text-xs text-gray-500 block">Category</span>
                  <span class="text-gray-900 font-semibold">{{ product.category?.name || 'N/A' }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <i class="fas fa-layer-group text-orange-500 mr-3 text-lg w-5 text-center"></i>
                <div>
                  <span class="text-xs text-gray-500 block">Type</span>
                  <span class="text-gray-900 font-semibold">{{ product.product_type || 'N/A' }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <i class="fas fa-box text-orange-500 mr-3 text-lg w-5 text-center"></i>
                <div>
                  <span class="text-xs text-gray-500 block">Min. Order</span>
                  <span class="text-gray-900 font-semibold">{{ product.minimum_order_quantity ?? 'N/A' }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-500 mr-3 text-lg w-5 text-center"></i>
                <div>
                  <span class="text-xs text-gray-500 block">Total Reviews</span>
                  <span class="text-gray-900 font-semibold">{{ product.total_reviews ?? 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Availability & Delivery -->
            <div class="pt-4 space-y-3">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center border-b border-gray-100 pb-1 mb-2">
                <i class="fas fa-shopping-basket text-orange-500 mr-2 text-base"></i> Availability & Delivery
              </h3>

              <div v-if="product.skus?.length">
                <div v-for="sku in product.skus.slice(0, 1)" :key="sku.id"
                     class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm text-sm">
                  <span class="font-mono text-gray-800 flex items-center">
                    <i class="fas fa-barcode text-gray-500 mr-2"></i> SKU: {{ sku.sku }}
                  </span>
                  <span class="font-semibold flex items-center">
                    <i class="fas fa-boxes text-gray-500 mr-1"></i> Stock: 
                    <span :class="{'text-red-600': sku.stockCount < 10, 'text-green-600': sku.stockCount >= 10, 'text-gray-500': !sku.stockCount}">
                      {{ sku.stockCount ?? 0 }}
                    </span>
                  </span>
                </div>
                <p v-if="product.skus.length > 1" class="text-xs text-gray-500 mt-1 ml-2">
                  ({{ product.skus.length - 1 }} more SKUs available in Attributes section)
                </p>
              </div>

              <div v-if="product.delivery_estimation?.length">
                <div v-for="est in product.delivery_estimation.slice(0, 1)" :key="est.warehouse?.name"
                     class="p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center text-sm">
                  <span class="font-semibold text-gray-800 flex items-center">
                    <i class="fas fa-map-marker-alt text-orange-400 mr-2"></i> {{ est.warehouse?.name || 'N/A' }}
                  </span>
                  <span class="text-gray-700">
                    <i class="far fa-calendar-alt mr-1 text-orange-500"></i>
                    {{ est.min_period }} - {{ est.max_period }} {{ est.period_type }}
                  </span>
                </div>
              </div>

            </div>

            <!-- Discount -->
            <div v-if="product.discount" class="mt-4 p-3 bg-orange-100 border-l-4 border-orange-400 rounded-r-lg flex items-center gap-3">
              <i class="fas fa-percentage text-orange-600 text-xl flex-shrink-0"></i>
              <div class="text-sm">
                <span class="font-bold text-orange-700">Discount Applied:</span>
                <span class="font-semibold text-orange-800 ml-1">
                  {{ product.discount.discount_value }} {{ product.discount.discount_value_type }}
                </span>
                <span class="text-gray-500 ml-2">(Valid until: {{ product.discount.end_date }})</span>
              </div>
            </div>

              <!-- Product Description -->
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 class="text-xl font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
            <i class="fas fa-book-open text-orange-500 mr-3"></i> Product Description
          </h2>
          <p class="text-gray-700 leading-relaxed">
            {{ product.description || 'No description available for this product.' }}
          </p>
        </div>

        <!-- Product Reviews -->
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 class="text-xl font-bold text-gray-800 mb-3 flex items-center border-b pb-2 justify-between">
            <span><i class="fas fa-comments text-orange-500 mr-3"></i> Product Reviews ({{ product.total_reviews ?? 0 }})</span>
            <button v-if="token" @click="openReviewModal"
                    class="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition">
              Review Product
            </button>
          </h2>
       <div v-if="product.total_reviews > 0" class="text-gray-600">
          <p>Here latest reviews...</p>
          <ul class="mt-3 ml-3">
            <li v-for="r in product.reviews" :key="r.id">
              {{ r.review }}
            </li>
          </ul>
        </div>
          <p v-else class="text-gray-500 italic">Be the first to review this product.</p>
        </div>

        <!-- Attributes -->
        <div v-if="product.attributes?.length">
          <h2 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <i class="fas fa-microchip text-orange-500 mr-3"></i> Technical Specifications
          </h2>
          <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-gray-700 p-4 border rounded-lg bg-gray-50">
            <li v-for="attr in product.attributes" :key="attr.id" class="flex justify-between items-start border-b pb-1 border-dashed">
              <span class="font-medium text-gray-800 text-sm">{{ attr.name }}:</span>
              <span class="text-right ml-4 text-sm">
                <span v-for="(val, index) in attr.values" :key="val.id" class="inline-block text-gray-700">
                  {{ val.value }}<span v-if="index < attr.values.length - 1">, </span>
                </span>
              </span>
            </li>
          </ul>
        </div>

        <!-- All SKUs -->
        <div v-if="product.skus?.length > 1">
          <h2 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <i class="fas fa-list-ol text-orange-500 mr-3"></i> All Available SKUs
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="sku in product.skus" :key="sku.id"
                 class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span class="font-mono text-sm text-gray-800">{{ sku.sku }}</span>
              <span class="text-sm font-semibold">
                <i class="fas fa-boxes text-gray-500 mr-1"></i> Stock: 
                <span :class="{'text-red-600': sku.stockCount < 10, 'text-green-600': sku.stockCount >= 10, 'text-gray-500': !sku.stockCount}">
                  {{ sku.stockCount ?? 0 }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Quantity & Choose Warehouse -->
        <div class="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <label for="quantity-input" class="text-lg font-medium text-gray-700 flex-shrink-0">Quantity:</label>
            <input id="quantity-input" type="number" v-model.number="quantity"
                   min="1" :max="product.skus?.[0]?.stockCount || 1000"
                   class="w-24 p-2 border border-gray-300 rounded-lg text-center focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
          </div>

          <button v-if="token" @click="WarehouseModalOpen = true"
                  class="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition shadow-md shadow-orange-300/50 flex items-center justify-center gap-2">
            <i class="fas fa-warehouse text-lg"></i> Choose Warehouse
          </button>
        </div>

          </div>
        </div> 

        <hr class="border-gray-100">

      

        <!-- Related Products -->
        <div  class="pt-6 border-t border-gray-200 mt-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-sitemap text-orange-500 mr-3"></i> Related Products
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="p in relatedProducts.slice(0, 6)" :key="p.id"
                 class="border rounded-lg p-3 hover:shadow-lg transition cursor-pointer bg-white"
                 @click="goToProductDetail(p)">
              <img :src="proxiedImage(p.imageSrc)" class="w-full h-24 object-contain rounded mb-2 border border-gray-100" alt="Related Product" />
              <h3 class="font-semibold text-sm truncate">{{ p.name }}</h3>
              <p class="text-gray-500 text-xs mt-0.5">{{ p.categoryName }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Modals -->
      <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
        <div class="relative bg-white rounded-lg p-2 max-w-4xl w-full mx-4 sm:mx-8">
          <button @click="closeModal" class="absolute top-2 right-2 text-gray-700 hover:text-orange-500 z-10 p-2">
            <i class="fas fa-times text-2xl"></i>
          </button>
          <img :src="proxiedImage(modalImage)" class="w-full h-auto rounded max-h-[90vh]" alt="Enlarged Product Image" />
        </div>
      </div>

      <!-- Review Modal -->
      <div v-if="ReviewModalOpen" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
        <div class="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 sm:mx-8 shadow-2xl">
          <button @click="closeReviewModal" class="absolute top-2 right-2 text-gray-700 hover:text-orange-500 z-10 p-2">
            <i class="fas fa-times text-xl"></i>
          </button>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Submit Your Review</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <div class="flex space-x-1 text-2xl">
                <i v-for="star in 5" :key="star"
                   :class="['fas fa-star cursor-pointer transition', star <= reviewRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300']"
                   @click="reviewRating = star"></i>
              </div>
            </div>

            <div>
              <label for="review-text" class="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea id="review-text" v-model="reviewText" rows="4" placeholder="Write your detailed review here..."
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"></textarea>
            </div>

            <button @click="submitReview()"
                    :disabled="reviewRating === 0 || reviewText.length < 5"
                    class="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition disabled:opacity-50">
              Submit Review
            </button>
          </div>
        </div>
      </div>

      <!-- Warehouse Modal Component -->
      <ChooseWarehouseAddToCart
        :open="WarehouseModalOpen"
        :product="product"
        :quantity="quantity"
        @close="WarehouseModalOpen = false"
        @added="onAddedToCart"
      />

    </div>
    <Footer />
  </div>
</template>

<script>
import { request, gql } from "graphql-request";
import Header from "./header.vue";
import Footer from "./footer.vue";
import ChooseWarehouseAddToCart from "./ChooseWarehouseAddToCart.vue";

export default {
  name: "ProductDetail",
  components: { Header, Footer, ChooseWarehouseAddToCart },
  data() {
    return {
      product: null,
      loading: true,
      selectedIndex: 0,
      modalOpen: false,
      modalImage: "",
      quantity: 1,
      ReviewModalOpen: false,
      WarehouseModalOpen: false,
      reviewRating: 0,
      reviewText: "",
      placeholderImage: "https://via.placeholder.com/400?text=No+Image",
      relatedProducts: [],
      token:""
    };
  },
  computed: {
    selectedImage() {
      return this.product?.images?.[this.selectedIndex]?.original_url || this.product?.imageUrl || this.placeholderImage;
    },
    totalImages() {
      return this.product?.images?.length || 0;
    }
  },
  methods: {
      proxiedImage(url) {
    if (!url) return '/placeholder.png';

    // Check Vite mode: 'development' or 'production'
    if (import.meta.env.MODE === 'production') {
      // In production, remove backend domain so HTTPS frontend works
      return url.replace(/^http:\/\/78\.47\.138\.239:8080/, '');
    } else {
      // In development, use full URL (local dev backend)
      return url;
    }
  },
    async fetchRelatedProducts(categoryId, excludeProductId) {
    const endpoint = import.meta.env.VITE_GRAPHQL_URL;

    const query = gql`
      query ($first: Int!, $page: Int!, $categoryId: String!) {
        products(
          first: $first
          page: $page
          orderBy: [{ column: "created_at", order: DESC }]
          category_id: $categoryId
        ) {
          data {
            id
            name
            imageUrl
            category { id name }
          }
        }
      }
    `;

    const variables = { first: 12, page: 1, categoryId };

    try {
      const data = await request(endpoint, query, variables);
      this.relatedProducts = data.products.data
        .filter(p => p.id !== excludeProductId) // exclude current product
        .map(p => ({
          id: p.id,
          name: p.name,
          imageSrc: p.imageUrl || "https://via.placeholder.com/150?text=No+Image",
          categoryName: p.category.name
        }));
    } catch (err) {
      console.error(`Failed to fetch related products for category ${categoryId}:`, err);
    }
  },
    nextImage() { if (this.selectedIndex < this.totalImages - 1) this.selectedIndex++; },
    prevImage() { if (this.selectedIndex > 0) this.selectedIndex--; },
    openModal(img) { this.modalImage = img; this.modalOpen = true; },
    closeModal() { this.modalOpen = false; },
    openReviewModal() { this.ReviewModalOpen = true; },
    closeReviewModal() { this.ReviewModalOpen = false; },

    async submitReview() {

      console.log("to be submitted");


      if (this.reviewRating === 0 || this.reviewText.trim().length < 5) {
        this.reviewError = "Please provide a rating and a review text (min 5 characters).";
        return;
      }

      this.submittingReview = true;
      this.reviewError = "";
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;
      const token = localStorage.getItem("token"); // user must be logged in

      const mutation = gql`
        mutation($product_id: String!, $rating: Int, $review: String) {
          createProductReview(input: { product_id: $product_id, rating: $rating, review: $review }) {
            id
          }
        }
      `;

      const variables = {
        product_id: this.product.id,
        rating: this.reviewRating,
        review: this.reviewText
      };


      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const data = await request(endpoint, mutation, variables, headers);
        if(data){
           this.$root.$refs.toast.showToast('Reviewed and thanks', 'success');
        }

        console.log("data",data);
        this.reviewSuccess = "Review submitted successfully!";
        this.closeReviewModal();

        // Optionally, refetch product to update review count
       // await this.fetchProduct(this.product.id);

      } catch (err) {
        console.error(err);
        this.reviewError = "Failed to submit review. Please try again.";
        this.$root.$refs.toast.showToast('Failed', 'error');

      } finally {
        this.submittingReview = false;
      }
    },
    onAddedToCart() { alert("Product added to cart successfully!"); },
    goToProductDetail(p) { console.log("Go to", p); }
  },
  async mounted() {
    this.token=localStorage.getItem("token");
    try {
      const productId = this.$route.params.id;
      const endpoint = import.meta.env.VITE_GRAPHQL_URL;

    // Fetch the main product
    const productQuery = gql`
      query ($id: ID!) {
        product(id: $id) {
          id
          name
          rate
          short_description
          description
          skus { id sku sell_price stockCount }
          images { original_url }
          category { id name }
          attributes { id name values { id value } }
          total_reviews
          product_type
          reviews {
            id
            review
          }
          minimum_order_quantity
          discount { id discount_value discount_value_type end_date }
          delivery_estimation { warehouse { id name } min_period max_period period_type }
        }
      }
    `;
    const res = await request(endpoint, productQuery, { id: productId });

    console.log("res",res);

    this.product = res.product;

    // Fetch related products by category
    if (this.product?.category?.id) {
      await this.fetchRelatedProducts(this.product.category.id, productId);
    }

  } catch (err) {
    console.error(err);
  } finally {
    this.loading = false;
  }
},
};
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f97316; /* orange-500 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Optional: scrollbar for small images */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #f97316;
  border-radius: 3px;
}

</style>
