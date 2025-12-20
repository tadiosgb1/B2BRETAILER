<template>
  <div class="bg-white p-6 rounded shadow-md ">
    <h2 class="text-lg font-semibold mb-4">Change Password</h2>
    <form @submit.prevent="submitPasswordChange" class="lg:w-1/2">
      <label class="block mb-2">Current Password</label>
      <input v-model="form.current" type="password" class="w-full border rounded p-2 mb-4" required>

      <label class="block mb-2">New Password</label>
      <input v-model="form.new" type="password" class="w-full border rounded p-2 mb-4" required>

      <label class="block mb-2">Confirm Password</label>
      <input v-model="form.confirm" type="password" class="w-full border rounded p-2 mb-4" required>

      <button type="submit" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
        Change
      </button>

      <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-600 text-sm mt-2">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import { gql, request } from "graphql-request";

export default {
  name: "ChangePassword",

  data() {
    return {
      form: {
        current: "",
        new: "",
        confirm: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },

  methods: {
    async submitPasswordChange() {
  this.errorMessage = "";
  this.successMessage = "";

  if (this.form.new !== this.form.confirm) {
    this.errorMessage = "New password and confirmation do not match.";
    return;
  }

  const mutation = gql`
    mutation(
      $current_password: String!,
      $password: String!,
      $password_confirmation: String!
    ) {
      updatePassword(
        input: {
          current_password: $current_password,
          password: $password,
          password_confirmation: $password_confirmation
        }
      ) {
        status
      }
    }
  `;

  const variables = {
    current_password: this.form.current,
    password: this.form.new,
    password_confirmation: this.form.confirm,
  };

  try {
    const token = localStorage.getItem("token");   // ← token retrieved here

    const res = await request(
      import.meta.env.VITE_GRAPHQL_URL,
      mutation,
      variables,
      {
        Authorization: `Bearer ${token}`  // ← token included in headers
      }
    );

    if (res) {
      this.$root.$refs.toast.showToast("Password changed successfully", "success");
    }

    if (res.updatePassword.status === "SUCCESS") {
      this.successMessage = "Password updated successfully!";
      this.form.current = "";
      this.form.new = "";
      this.form.confirm = "";
    } else {
      this.errorMessage = "Password update failed.";
    }

  } catch (err) {
    this.errorMessage =
      err.response?.errors?.[0]?.message || "Error updating password.";
    this.$root.$refs.toast.showToast("Password change failed", "error");
  }
}

  }
};
</script>
