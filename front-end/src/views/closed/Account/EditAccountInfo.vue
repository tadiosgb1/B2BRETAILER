<template>
  <div class="bg-white p-6 rounded shadow-md">
    <h2 class="text-lg font-semibold mb-4">Edit Account Info</h2>

    <form v-if="form" @submit.prevent="submitUpdate" class="lg:w-1/2">
      <label class="block mb-1">Name</label>
      <input
        v-model="form.name"
        type="text"
        class="w-full border rounded p-2 mb-4"
        required
      />

      <label class="block mb-1">Phone</label>
      <input disabled
        v-model="form.phone"
        type="text"
        class="w-full border rounded p-2 mb-4 "
        required
      />

      <label class="block mb-1">Email (optional)</label>
      <input
        v-model="form.email"
        type="email"
        class="w-full border rounded p-2 mb-4"
      />

      <button
        type="submit"
        class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Save
      </button>
    </form>

    <p v-else>Loading account info...</p>
  </div>
</template>

<script>
import axios from "axios";
import { request, gql } from "graphql-request";

export default {
  name: "EditAccountInfo",

  data() {
    return {
      form: null,
      userId: null,
    };
  },

  async mounted() {
    await this.fetchAccount();
  },

  methods: {
    async fetchAccount() {
      try {
        const token = localStorage.getItem("token");
        const endpoint = `${import.meta.env.VITE_REST_URL}/profile`;

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map REST API fields to form
        this.userId = res.data.user?.id || res.data.id;
        this.form = {
          name: res.data.user?.name || "",
          phone: res.data.user?.phone || "",
          email: res.data.user?.email || "",
        };
      } catch (err) {
        console.error(err);
        alert("Failed to load account info.");
      }
    },

    async submitUpdate() {
      if (!this.userId) return;

      try {
        const token = localStorage.getItem("token");

        const mutation = gql`
          mutation (
            $id: ID!,
            $name: String!,
            $email: String,
          ) {
            updateUser(
              id: $id,
              input: {
                name: $name,
                email: $email,
                # profile_image: Upload! // add if needed
              }
            ) {
              id
              name
              email
              phone
            }
          }
        `;

        const variables = {
          id: this.userId,
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
        };

        const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_URL;

      const res=  await request(graphqlEndpoint, mutation, variables, {
          Authorization: `Bearer ${token}`,
        });

        if(res){
            this.$root.$refs.toast.showToast('Edited successfully', 'success');
        }

      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast('Editing failed', 'error');
      }
    },
  },
};
</script>
