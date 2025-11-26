
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">News Details</h2>

    <div class="space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Title:</strong> {{ item.title }}</div><div><strong>Content:</strong> {{ item.content }}</div><div><strong>Author:</strong> {{ item.author }}</div><div><strong>Date:</strong> {{ item.date }}</div><div><strong>Category:</strong> {{ item.category }}</div><div><strong>Image:</strong> {{ item.image }}</div>
    </div>

    <button @click="$router.back()" class="mt-4 text-blue-600">Back</button>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    this.item = (await this.$apiGet(`/news/${id}/`)).data || {};
  }
}
</script>
