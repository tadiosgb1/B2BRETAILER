<template>
  <div class="bg-white p-6 rounded shadow-md mx-auto mt-8">
    <h2 class="text-lg font-semibold mb-4">Change Password</h2>
    <form @submit.prevent="submitPasswordChange">
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

      // Frontend password confirmation check
      if (this.form.new !== this.form.confirm) {
        this.errorMessage = "New password and confirmation do not match.";
        return;
      }

      const mutation = gql`
        mutation ResetPassword($newPassword: String!) {
          reset_password_new(new_password: $newPassword) {
            status
            message
            user {
              id
              name
              email
            }
          }
        }
      `;

      const variables = {
        newPassword: this.form.new,
      };

      try {
        const token = localStorage.getItem("token"); // User must be authenticated

        const res = await request(
          import.meta.env.VITE_GRAPHQL_URL,
          mutation,
          variables,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        const result = res.reset_password_new;

        if (result.status === "SUCCESS") {
          this.successMessage = result.message || "Password updated successfully!";
          this.form.new = "";
          this.form.confirm = "";
          this.$root.$refs.toast.showToast(this.successMessage, "success");
        } else {
          this.errorMessage = result.message || "Password update failed.";
          this.$root.$refs.toast.showToast(this.errorMessage, "error");
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
