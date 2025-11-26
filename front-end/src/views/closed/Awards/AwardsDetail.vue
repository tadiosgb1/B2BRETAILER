
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Awards Details</h2>

    <div class="space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Title:</strong> {{ item.title }}</div><div><strong>Description:</strong> {{ item.description }}</div><div><strong>Year:</strong> {{ item.year }}</div><div><strong>Image:</strong> {{ item.image }}</div>
    </div>

    <button @click="$router.back()" class="mt-4 text-blue-600">Back</button>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    this.item = (await this.$apiGet(`/awards/${id}/`)).data || {};
  }
}
</script>
