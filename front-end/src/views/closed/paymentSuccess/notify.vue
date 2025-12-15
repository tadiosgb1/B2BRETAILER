<template>
     <Header />

  <div class="min-h-screen flex flex-col bg-gray-50 ">
    <!-- Header -->
   
    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-4 mt-20">
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100">
        <!-- Card Header -->
        <div class="flex items-center gap-3 px-6 py-5 border-b">
          <div
            class="h-10 w-10 flex items-center justify-center rounded-full"
            :class="isSuccess ? 'bg-green-100' : 'bg-orange-100'"
          >
            <svg
              v-if="isSuccess"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Payment Result</h2>
            <p
              class="text-sm font-medium"
              :class="isSuccess ? 'text-green-500' : 'text-orange-500'"
            >
              {{ notify.trade_status }}
            </p>
          </div>
        </div>

        <!-- Details (NO PROPS, NO CHILD COMPONENTS) -->
        <div class="px-6 py-6 space-y-4">
          <div class="flex justify-between gap-4">
            <span class="text-sm text-gray-500">Transaction ID</span>
            <span class="text-sm font-medium text-gray-800 break-all text-right">
              {{ notify.transId || '-' }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-sm text-gray-500">Merchant Order ID</span>
            <span class="text-sm font-medium text-gray-800 break-all text-right">
              {{ notify.merch_order_id || '-' }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-sm text-gray-500">Amount</span>
            <span class="text-sm font-medium text-gray-800">
              {{ notify.total_amount || '-' }} {{ notify.trans_currency }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-sm text-gray-500">Completed At</span>
            <span class="text-sm font-medium text-gray-800">
              {{ formattedDate }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end">
          <button
            class="px-5 py-2 rounded-xl font-medium text-white transition"
            :class="isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'"
            @click="goHome"
          >
            Done
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '../../opened/landing/header.vue'
import Footer from '../../opened/landing/footer.vue'

export default {
  name: 'NotifyPage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      notify: {
        transId: '',
        merch_order_id: '',
        total_amount: '',
        trans_currency: '',
        trade_status: 'Unknown',
        trans_end_time: ''
      }
    }
  },
  created() {
    const q = this.$route?.query || {}

    this.notify.transId = q.transId || ''
    this.notify.merch_order_id = q.merch_order_id || ''
    this.notify.total_amount = q.total_amount || ''
    this.notify.trans_currency = q.trans_currency || ''
    this.notify.trade_status = q.trade_status || 'Unknown'
    this.notify.trans_end_time = q.trans_end_time || ''
  },
  computed: {
    isSuccess() {
      return this.notify.trade_status === 'Completed'
    },
    formattedDate() {
      if (!this.notify.trans_end_time) return '-'
      const date = new Date(Number(this.notify.trans_end_time))
      return isNaN(date.getTime()) ? '-' : date.toLocaleString()
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
