
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Contacts Details</h2>

    <div class="space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Name:</strong> {{ item.name }}</div><div><strong>Email:</strong> {{ item.email }}</div><div><strong>Phone:</strong> {{ item.phone }}</div><div><strong>Subject:</strong> {{ item.subject }}</div><div><strong>Message:</strong> {{ item.message }}</div>
    </div>

    <button @click="$router.back()" class="mt-4 text-blue-600">Back</button>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    this.item = (await this.$apiGet(`/contacts/${id}/`)).data || {};
  }
}
</script>
