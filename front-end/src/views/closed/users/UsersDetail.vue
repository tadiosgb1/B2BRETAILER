
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Users Details</h2>

    <div class="space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>FirstName:</strong> {{ item.firstName }}</div><div><strong>MiddleName:</strong> {{ item.middleName }}</div><div><strong>LastName:</strong> {{ item.lastName }}</div><div><strong>Email:</strong> {{ item.email }}</div><div><strong>Phone:</strong> {{ item.phone }}</div><div><strong>Role:</strong> {{ item.role }}</div>
    </div>

    <button @click="$router.back()" class="mt-4 text-blue-600">Back</button>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    this.item = (await this.$apiGet(`/users/${id}/`)).data || {};
  }
}
</script>
