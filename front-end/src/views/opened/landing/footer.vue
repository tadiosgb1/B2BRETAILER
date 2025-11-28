<template>
  <footer class="bg-white text-gray-700 py-16 mt-20 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <!-- BRAND INFO -->
      <div>
        <h2 class="text-2xl font-bold text-orange-500">AntB2B.com</h2>
        <p class="mt-3 text-gray-600 leading-6">
          AntB2B is your trusted marketplace connecting global buyers and
          suppliers. Discover products, compare prices, and trade with
          confidence.
        </p>
      </div>

      <!-- BUYER LINKS -->
      <div>
        <h3 class="text-lg font-semibold text-orange-500 mb-4">For Buyers</h3>
        <ul class="space-y-2">
          <li><a href="#" class="hover:text-orange-500">Browse Products</a></li>
          <li><a href="#" class="hover:text-orange-500">Buyer Protection</a></li>
          <li>
            <a href="#" class="hover:text-orange-500">
              Request for Quotation (RFQ)
            </a>
          </li>
          <li>
            <a href="#" class="hover:text-orange-500">Shipping & Delivery</a>
          </li>
        </ul>
      </div>

      <!-- SUPPLIER LINKS -->
      <div>
        <h3 class="text-lg font-semibold text-orange-500 mb-4">For Suppliers</h3>
        <ul class="space-y-2">
          <li>
            <a href="#" class="hover:text-orange-500">Become a Supplier</a>
          </li>
          <li><a href="#" class="hover:text-orange-500">Sell on AntB2B</a></li>
          <li>
            <a href="#" class="hover:text-orange-500">Supplier Membership</a>
          </li>
          <li>
            <a href="#" class="hover:text-orange-500">Product Listing Guide</a>
          </li>
        </ul>
      </div>

      <!-- CONTACT & SOCIAL MEDIA -->
      <div>
        <h3 class="text-lg font-semibold text-orange-500 mb-4">Contact</h3>
        <ul class="space-y-2">
          <li><i class="fa-solid fa-envelope mr-2"></i> support@antb2b.com</li>
          <li><i class="fa-solid fa-phone mr-2"></i> +251 900 000 000</li>
          <li>
            <i class="fa-solid fa-location-dot mr-2"></i>
            Addis Ababa, Ethiopia
          </li>
        </ul>

        <!-- SOCIALS -->
        <div class="flex space-x-4 mt-4 text-2xl text-gray-500">
          <a href="#" class="hover:text-orange-500">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="#" class="hover:text-orange-500">
            <i class="fab fa-tiktok"></i>
          </a>
          <a href="#" class="hover:text-orange-500">
            <i class="fab fa-youtube"></i>
          </a>
          <a href="#" class="hover:text-orange-500">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="hover:text-orange-500">
            <i class="fab fa-telegram"></i>
          </a>
          <a href="#" class="hover:text-orange-500">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- COPYRIGHT -->
    <div class="text-center text-gray-500 mt-10 border-t border-gray-300 pt-6">
      © {{ new Date().getFullYear() }}
      <span class="text-orange-500 font-semibold">AntB2B</span> — All Rights
      Reserved
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped></style>
