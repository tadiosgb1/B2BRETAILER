
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Add Managers</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">First_name</label>
          <input v-model="form.first_name" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Middle_name</label>
          <input v-model="form.middle_name" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Last_name</label>
          <input v-model="form.last_name" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Phone</label>
          <input v-model="form.phone" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Role</label>
          <input v-model="form.role" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
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
        first_name: this.data?.first_name || '',
middle_name: this.data?.middle_name || '',
last_name: this.data?.last_name || '',
email: this.data?.email || '',
phone: this.data?.phone || '',
role: this.data?.role || ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("Add" === "Add") {
          await this.$apiPost("/managers", this.form);
        } else {
          await this.$apiPatch(`/managers/${this.data.id}/`, this.form);
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (e) { console.error(e); }
    }
  }
}
</script>
