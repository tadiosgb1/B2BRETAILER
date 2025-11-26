
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Managers</h1>

      <button
        @click="openAddModal"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-150 flex items-center space-x-1 text-sm"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Managers</span>
      </button>
    </div>

    <!-- Desktop Table -->
    <div class="bg-white overflow-hidden rounded-xl border border-gray-200 hidden md:block">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 text-left">#</th>
              <th class="px-6 py-3 text-left">First_name</th><th class="px-6 py-3 text-left">Middle_name</th><th class="px-6 py-3 text-left">Last_name</th><th class="px-6 py-3 text-left">Email</th><th class="px-6 py-3 text-left">Phone</th><th class="px-6 py-3 text-left">Role</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="hover:bg-green-50 transition duration-150"
            >
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.first_name }}</td><td class="px-6 py-4 whitespace-nowrap">{{ item.middle_name }}</td><td class="px-6 py-4 whitespace-nowrap">{{ item.last_name }}</td><td class="px-6 py-4 whitespace-nowrap">{{ item.email }}</td><td class="px-6 py-4 whitespace-nowrap">{{ item.phone }}</td><td class="px-6 py-4 whitespace-nowrap">{{ item.role }}</td>

              <td class="px-6 py-4 text-center space-x-3">
                <button @click="editItem(item)" class="text-green-600 hover:text-green-800">Edit</button>
                <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>

            <tr v-if="items.length === 0">
              <td colspan="8" class="text-center py-6 text-gray-400 italic">
                No data found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-4">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="bg-white border border-gray-200 rounded-xl shadow p-4"
      >
        <div class="flex justify-between mb-3">
          <h2 class="font-bold text-gray-800">Managers #{{ index + 1 }}</h2>

          <div class="flex gap-3 text-sm">
            <button @click="editItem(item)" class="text-green-600 hover:text-green-700">Edit</button>
            <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-700">Delete</button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
          
            <div class="col-span-2">
              <span class="font-medium text-gray-600">First_name:</span>
              {{ item.first_name }}
            </div>
            <div class="col-span-2">
              <span class="font-medium text-gray-600">Middle_name:</span>
              {{ item.middle_name }}
            </div>
            <div class="col-span-2">
              <span class="font-medium text-gray-600">Last_name:</span>
              {{ item.last_name }}
            </div>
            <div class="col-span-2">
              <span class="font-medium text-gray-600">Email:</span>
              {{ item.email }}
            </div>
            <div class="col-span-2">
              <span class="font-medium text-gray-600">Phone:</span>
              {{ item.phone }}
            </div>
            <div class="col-span-2">
              <span class="font-medium text-gray-600">Role:</span>
              {{ item.role }}
            </div>
        </div>
      </div>

      <p v-if="items.length === 0" class="text-center text-gray-400 py-6 italic">
        No data found.
      </p>
    </div>

    <!-- Add Modal -->
    <add-managers
      v-if="showModal && !editMode"
      :data="selectedItem"
      @close="showModal=false"
      @saved="fetchItems"
    />

    <!-- Edit Modal -->
    <edit-managers
      v-if="showModal && editMode"
      :data="selectedItem"
      @close="showModal=false"
      @saved="fetchItems"
    />

  </div>
</template>

<script>
import AddManagers from "./AddManagers.vue";
import EditManagers from "./EditManagers.vue";

export default {
  components: { AddManagers, EditManagers },
  data() {
    return { items: [], showModal: false, editMode: false, selectedItem: null };
  },
  methods: {
    async fetchItems() {
      this.items = (await this.$apiGet("/managers")).data || [];
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = item; this.showModal = true; },
    async deleteItem(id) {
      if (confirm("Are you sure?")) {
        await this.$apiDelete(`/managers/${id}/`);
        this.fetchItems();
      }
    }
  },
  mounted() { this.fetchItems(); }
}
</script>
