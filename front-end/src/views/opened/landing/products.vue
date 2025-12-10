<template>
  <div class="flex min-h-screen bg-gray-50">
    <div class="flex flex-col lg:flex-row w-full">
      
      <!-- SIDEBAR CATEGORY LIST -->
      <div
        class="lg:w-64 w-full bg-white border-r border-gray-200 overflow-y-auto lg:h-screen lg:flex-shrink-0"
        style="z-index: 10;"
        aria-label="sidebar"
      >
        <ul class="relative">
          <h3 class="px-4 py-2 font-semibold text-lg text-gray-800 border-b bg-white sticky top-0">
            Product Categories
          </h3>

          <!-- ALL CATEGORIES -->
          <li class="relative">
         
            <div
              @click="handleCategorySelection(null);allCliked=true"
              class="px-4 py-2 cursor-pointer rounded hover:bg-orange-100 flex justify-between items-center mt-2 border-t bg-white"
            >
              <span class="font-bold text-gray-800">All Categories</span>
            </div>
          </li>

          <!-- CATEGORY TREE ITEMS -->
          <CategoryItem
            v-for="cat in categories"
            :key="cat.id"
            :category="cat"
            @select-category="handleCategorySelection"
          />
        </ul>
      </div>

      
      <!-- MAIN PRODUCTS CONTENT -->
      <div class="flex-1 p-3 overflow-auto">
      <div class="mb-6 mx-0 lg:mx-0 flex items-center gap-4 bg-white  rounded-lg border border-gray-200 p-2 hover:shadow-lg transition-shadow duration-300">
      <input
        v-model="searchTerm"
        @input="fetchProducts(null,searchTerm)"
        type="text"
        placeholder="Search products..."
        class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-700 placeholder-gray-400"
        />
      </div>

<!-- All Filters Modal -->
<dialog id="filtersModal" class="rounded-xl p-0 w-full max-w-3xl shadow-2xl">

  <form method="dialog" class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

    <!-- Header -->
    <div class="flex justify-between items-center pb-2 border-b">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <i class="fas fa-sliders-h text-orange-500"></i>
        All Filters
      </h2>
      <button class="text-gray-500 hover:text-red-500 text-xl">&times;</button>
    </div>

    <!-- 2 Column Responsive Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Color -->
      <div class="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
        <label class="text-sm font-semibold flex items-center gap-1 mb-2">
          <i class="fas fa-palette text-orange-500 text-xs"></i> Color
        </label>
        <select v-model="color" class="w-full border rounded-full px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400">
          <option>Any</option>
          <option>Red</option>
          <option>Blue</option>
          <option>Black</option>
          <option>White</option>
        </select>
      </div>

      <!-- Reviews -->
      <div class="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
        <label class="text-sm font-semibold flex items-center gap-1 mb-2">
          <i class="fas fa-star text-orange-500 text-xs"></i> Minimum Rating
        </label>
        <select v-model="rate" class="w-full border rounded-full px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400">
          <option>Any</option>
          <option>4★ & Up</option>
          <option>3★ & Up</option>
        </select>
      </div>

      <!-- Age Group -->
      <div class="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
        <label class="text-sm font-semibold flex items-center gap-1 mb-2">
          <i class="fas fa-child text-orange-500 text-xs"></i> Age Group
        </label>
        <select v-model="ageGroup" class="w-full border rounded-full px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400">
          <option>All</option>
          <option>Kids</option>
          <option>Teens</option>
          <option>Adults</option>
        </select>
      </div>

      <!-- Occasion -->
      <div class="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
        <label class="text-sm font-semibold flex items-center gap-1 mb-2">
          <i class="fas fa-calendar text-orange-500 text-xs"></i> Occasion
        </label>
        <select v-model="occasion" class="w-full border rounded-full px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400">
          <option>Any</option>
          <option>Casual</option>
          <option>Formal</option>
          <option>Party</option>
        </select>
      </div>

      <!-- Material -->
      <div class="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
        <label class="text-sm font-semibold flex items-center gap-1 mb-2">
          <i class="fas fa-tshirt text-orange-500 text-xs"></i> Material
        </label>
        <select v-model="material" class="w-full border rounded-full px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400">
          <option>Any</option>
          <option>Cotton</option>
          <option>Leather</option>
          <option>Polyester</option>
        </select>
      </div>

      <!-- Region -->
      <div class="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
        <label class="text-sm font-semibold flex items-center gap-1 mb-2">
          <i class="fas fa-globe text-orange-500 text-xs"></i> Region
        </label>
        <select v-model="region" class="w-full border rounded-full px-3 py-2 text-sm focus:ring-1 focus:ring-orange-400">
          <option>Any</option>
          <option>China</option>
          <option>USA</option>
          <option>Turkey</option>
        </select>
      </div>

    </div>

    <!-- Footer -->
    <div>
      <button class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-sm shadow-md">
        Apply Filters
      </button>
    </div>

  </form>
</dialog>



   <!-- Filter Bar Wrapper -->
<!-- Filter Bar Wrapper -->
<div class="w-full bg-white/80 backdrop-blur border-b shadow-sm py-3">

  <!-- Filter Header -->
  <div class="flex items-center justify-between px-4 pb-1">
    <div class="flex items-center gap-2">
      <i class="fas fa-filter text-orange-500 text-sm"></i>
      <h2 class="text-sm font-semibold">Filters</h2>
    </div>

    <button onclick="document.getElementById('filtersModal').showModal()"
            class="text-sm text-orange-600 hover:underline font-medium ">
      All Filters
    </button>
  </div>

  <!-- Horizontal Filters -->
  <div class="relative">
    <div class="flex items-center gap-4 px-4 overflow-x-auto scrollbar-thin
                scrollbar-thumb-gray-300 scrollbar-track-transparent py-2 whitespace-nowrap">

      <!-- ALL FILTERS / RESET BUTTON -->
      <div @click="fetchProducts(null,null)" class="border border-gray-200 rounded-xl p-2 px-3 bg-white shadow-sm
                  flex flex-col justify-center items-center h-20 cursor-pointer hover:bg-orange-50">
        <label class="text-[11px] font-semibold flex items-center gap-1 mb-0 mr-10">
          <i class="fas fa-th-large text-orange-500 text-xs "></i> All
        </label>
      </div>

      <!-- SORT FILTER -->
      <div class="border border-gray-200 rounded-xl p-2 px-3 bg-white shadow-sm
                  flex flex-col h-20 min-w-[140px] sm:min-w-[150px] md:min-w-[160px]">
        <label class="text-[11px] font-semibold flex items-center gap-1 mb-1">
          <i class="fas fa-sort text-orange-500 text-xs"></i> Sort By
        </label>
        <select @change="fetchProducts(null,null)" v-model="sortOption" class="border rounded-full px-3 py-1.5 text-xs w-full focus:ring-1 focus:ring-orange-400 h-8">
          <option value="new">New Arrivals</option>
          <option value="old">Old Arrivals</option>
          <option value="highest_price">Highest Price</option>
          <option value="lower_price">Lowest Price</option>
        </select>
      </div>

      <!-- Min Order Box -->
      <div class="border border-gray-200 rounded-xl p-2 px-3 bg-white shadow-sm 
                  flex flex-col h-20 min-w-[140px] sm:min-w-[150px] md:min-w-[160px]">
        <label class="text-[11px] font-semibold flex items-center gap-1 mb-1">
          <i class="fas fa-sort-numeric-up text-orange-500 text-xs"></i> Min Order
        </label>
        <input v-model="min_order" type="number"
          class="border rounded-full px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-400 h-8 w-full"
          placeholder="Enter MOQ" />
      </div>

      <!-- Price Box -->
      <div class="border border-gray-200 rounded-xl p-2 px-3 bg-white shadow-sm 
                  flex flex-col h-20 min-w-[140px] sm:min-w-[150px] md:min-w-[160px]">
        <label class="text-[11px] font-semibold flex items-center gap-1 mb-1">
          <i class="fas fa-tag text-orange-500 text-xs"></i> Price Range
        </label>
        <div class="flex gap-1 h-8">
          <input v-model="min_price" type="number"
            placeholder="Min"
            class="border rounded-full px-3 py-1.5 w-full text-[11px] focus:ring-1 focus:ring-orange-400" />
          <input v-model="max_price" type="number"
            placeholder="Max"
            class="border rounded-full px-3 py-1.5 w-full text-[11px] focus:ring-1 focus:ring-orange-400" />
        </div>
      </div>

      <!-- Location Box -->
      <div class="border border-gray-200 rounded-xl p-2 px-3 bg-white shadow-sm 
                  flex flex-col h-20 min-w-[140px] sm:min-w-[150px] md:min-w-[160px]">
        <label class="text-[11px] font-semibold flex items-center gap-1 mb-1">
          <i class="fas fa-map-marker-alt text-orange-500 text-xs"></i> Location
        </label>
        <select v-model="location" class="border rounded-full px-3 py-1.5 text-xs w-full focus:ring-1 focus:ring-orange-400 h-8">
          <option>Any</option>
          <option>Lagos</option>
          <option>Abuja</option>
          <option>Kano</option>
        </select>
      </div>

      <!-- Gender Box -->
      <div class="border border-gray-200 rounded-xl p-2 px-3 bg-white shadow-sm 
                  flex flex-col h-20 min-w-[140px] sm:min-w-[150px] md:min-w-[160px]">
        <label class="text-[11px] font-semibold flex items-center gap-1 mb-1">
          <i class="fas fa-venus-mars text-orange-500 text-xs"></i> Gender
        </label>
        <select v-model="gender" class="border rounded-full px-3 py-1.5 text-xs w-full focus:ring-1 focus:ring-orange-400 h-8">
          <option>All</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

    </div>

    <!-- Floating Apply Button for Desktop -->
    <div class="absolute right-0 top-1/2 -translate-y-1/2 pr-4 hidden sm:block">
      <button @click="fetchProducts(null,null,min_price,max_price)" class="bg-orange-500 hover:bg-orange-600 transition text-white 
                     px-5 py-2 rounded-xl text-sm shadow-lg font-medium">
        Apply
      </button>
    </div>

    <!-- Mobile Apply Button (Full Width) -->
    <div class="px-4 mt-2 sm:hidden">
      <button class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm shadow-md">
        Apply Filters
      </button>
    </div>

  </div>
</div>







        <div class="px-4">

  <!-- HEADER -->
  <h2 class="text-3xl font-bold mb-6 text-gray-800">
    Products —
    <span class="text-orange-500">
      {{ selectedSubCategory?.name || selectedCategory?.name  }}
    </span>
  </h2>

  <!-- SKELETON LOADER -->
  <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="n in 8"
      :key="'skeleton-' + n"
      class="border rounded-lg p-4 shadow-sm bg-white animate-pulse"
    >
      <div class="w-full h-32 bg-gray-200 rounded mb-3"></div>
      <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
      <div class="h-3 bg-gray-200 rounded w-1/3"></div>
      <div class="h-10 bg-gray-300 rounded mt-4"></div>
    </div>
  </div>

  <!-- NO PRODUCTS MESSAGE -->
  <div
    v-else-if="productsGrid.length === 0"
    class="text-center text-lg text-gray-500"
  >
    No products found for this category.
  </div>

  <!-- REAL PRODUCTS GRID -->
  <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="product in productsGrid"
      :key="product.id"
      class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer flex flex-col"
      @click="goToProductDetail(product)"
    >
      <div class="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
        <img :src="proxiedImage(product.imageSrc)" class="w-full h-full object-cover" :alt="product.name" />
      </div>

      <h3 class="font-bold text-gray-900 mt-3 text-lg">{{ product.name }}</h3>
      <p class="text-sm text-gray-500">Category: {{ product.categoryName || 'N/A' }}</p>
      <p class="text-xs text-gray-400">MOQ: {{ product.minimum_order_quantity }}</p>
   <!-- Price Badge -->
      <p class="inline-block bg-orange-100 text-orange-700 text-lg font-semibold px-2 py-1 rounded-full">
        Price: {{ product.skus[0]?.sell_price }} ETB
      </p>

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
      <button
        class="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
      >
        View Details
      </button>
    </div>
  </div>

</div>

      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { request, gql } from "graphql-request";
import CategoryItem from "./CategoryItem.vue";

export default defineComponent({
  components: { CategoryItem },
   props: {
    category_id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      searchTerm: "",
      searchTimeout: null,
      categories: [],
      selectedCategory: null,
      selectedSubCategory: null,
      productsGrid: [],
      loading: false,
      allCliked:false,
      sortOption:'new',
      min_order:"",
    };
  },

async mounted() {
  await this.fetchCategories();

  if (this.allCliked) {
    await this.fetchProducts(null,null,null,null);
  } else if (this.category_id) {
    console.log("Loading category from prop:", this.category_id);
    this.handleCategorySelection({ id: this.category_id });
  } else {
    console.log("Loading all products");
    await this.fetchProducts(null,null,null,null);
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
  



    async fetchCategories() {
      this.loading = true;

      try {
        const endpoint = import.meta.env.VITE_GRAPHQL_URL;
        const query = gql`
          query {
            getTreeCategories {
              id
              name
              imageUrl
              children {
                id
                name
                imageUrl
                children {
                  id
                  name
                  imageUrl
                  children {
                    id
                    name
                    imageUrl
                  }
                }
              }
            }
          }
        `;

        const res = await request(endpoint, query);
        this.categories = res?.getTreeCategories || [];
      } catch (e) {
        console.error("CATEGORY ERROR:", e);
      } finally {
        this.loading = false;
      }
    },

    /* ============================================================
       FETCH PRODUCTS (BY CATEGORY OR ALL)
    ============================================================ */
async fetchProducts(
  categoryId = null, 
  search = null, 
  min_price = null, 
  max_price = null, 
) {
  console.log("min and max prices", min_price, max_price);

  this.loading = true;
  this.productsGrid = [];

  const endpoint = import.meta.env.VITE_GRAPHQL_URL;
  let query;
  let variables = { first: 12, page: 1 };

  // Default server-side order
  let ordered_by = [{ column: "created_at", order: "DESC" }];
console.log("sortOption",this.sortOption);
  if (this.sortOption) {
    switch (this.sortOption) {
      case "new":
        ordered_by = [{ column: "created_at", order: "DESC" }];
        break;
      case "old":
        ordered_by = [{ column: "created_at", order: "ASC" }];
        break;
      case "lowest_price":
        ordered_by = [{ column: "min_price", order: "ASC" }];
        break;
      // case "highest_price":
      //   ordered_by = [{ column: "min_price", order: "DESC" }];
      //   break;
    }
  }

  if (categoryId) {
    query = gql`
      query ProductsByCategory(
        $first: Int!, 
        $page: Int!, 
        $categoryId: String!, 
        $search: String,
        $min_price: Float, 
        $max_price: Float,
        $ordered_by: [OrderByInput]!
      ) {
        products(
          first: $first
          page: $page
          category_id: $categoryId
          search: $search
          min_price: $min_price
          max_price: $max_price
          orderBy: $ordered_by
        ) {
          data {
            id
            name
            imageUrl
            minimum_order_quantity
            skus { id sku sell_price stockCount }  # ✅ removed price
            category { id name }
            rate
          }
        }
      }
    `;

    variables.categoryId = categoryId;
    variables.search = search;
    variables.min_price = min_price;
    variables.max_price = max_price;
    variables.ordered_by = ordered_by;

  } else {
    query = gql`
      query AllProducts(
        $first: Int!, 
        $page: Int!, 
        $search: String,
        $min_price: Float, 
        $max_price: Float,
        $ordered_by: [OrderByInput]!
      ) {
        products(
          first: $first
          page: $page
          search: $search
          min_price: $min_price
          max_price: $max_price
          orderBy: $ordered_by
        ) {
          data {
            id
            name
            rate
            imageUrl
            minimum_order_quantity
            skus { id sku sell_price stockCount }  # ✅ removed price
            category { name }
          }
        }
      }
    `;

    variables.search = search;
    variables.min_price = min_price;
    variables.max_price = max_price;
    variables.ordered_by = ordered_by;
  }

  try {
    const res = await request(endpoint, query, variables);
    console.log("res", res);

    this.productsGrid = (res.products?.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      imageSrc: p.imageUrl || "https://via.placeholder.com/150?text=No+Image",
      categoryName: p.category ? p.category.name : "N/A",
      rate: p.rate || 0,
      minimum_order_quantity:p.minimum_order_quantity,
      skus: p.skus
    }));


    if(this.sortOption=='highest_price'){
       this.productsGrid.sort((a, b) => b.skus[0].sell_price - a.skus[0].sell_price);
    }

   if (this.min_order) {
  this.productsGrid = this.productsGrid.filter(
    product => product.minimum_order_quantity <= this.min_order
  );
}


  } catch (e) {
    console.error("PRODUCT ERROR:", e);
  } finally {
    this.loading = false;
  }
}
,

    /* ============================================================
       CATEGORY SELECTION
    ============================================================ */
    handleCategorySelection(category) {
      if (!category) {
        this.selectedCategory = null;
        this.selectedSubCategory = null;
        this.fetchProducts(null);
        return;
      }

      this.selectedCategory = null;
      this.selectedSubCategory = null;

      if (category.children && category.children.length > 0) {
        this.selectedCategory = category;
      } else {
        this.selectedSubCategory = category;
      }

      this.fetchProducts(category.id);
    },

    /* ============================================================
       NAVIGATION TO PRODUCT DETAIL
    ============================================================ */
    goToProductDetail(product) {
      if (product?.id && this.$router) {
        this.$router.push({ name: "ProductDetail", params: { id: product.id } });
      }
    },
  },
});
</script>

<style scoped>
  .scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
</style>
