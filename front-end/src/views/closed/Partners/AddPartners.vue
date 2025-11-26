
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Add Partners</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Logo</label>
          <input v-model="form.logo" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Website</label>
          <input v-model="form.website" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <input v-model="form.description" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  data() {
    return {
      form: {
        name: this.data?.name || '',
logo: this.data?.logo || '',
website: this.data?.website || '',
description: this.data?.description || ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("Add" === "Add") {
          await this.$apiPost("/partners", this.form);
        } else {
          await this.$apiPatch(`/partners/${this.data.id}/`, this.form);
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (e) { console.error(e); }
    }
  }
}
</script>
