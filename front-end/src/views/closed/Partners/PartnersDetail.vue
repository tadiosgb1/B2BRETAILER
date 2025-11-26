
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Partners Details</h2>

    <div class="space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Name:</strong> {{ item.name }}</div><div><strong>Logo:</strong> {{ item.logo }}</div><div><strong>Website:</strong> {{ item.website }}</div><div><strong>Description:</strong> {{ item.description }}</div>
    </div>

    <button @click="$router.back()" class="mt-4 text-blue-600">Back</button>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    this.item = (await this.$apiGet(`/partners/${id}/`)).data || {};
  }
}
</script>
