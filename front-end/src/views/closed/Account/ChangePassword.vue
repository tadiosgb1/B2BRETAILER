<template>
  <div class="bg-white p-6 rounded shadow-md mt-8 ">
    <h2 class="text-lg font-semibold mb-6">Change Password</h2>
    <form @submit.prevent="submitPasswordChange" class="flex flex-col lg:flex-row lg:flex-wrap lg:gap-x-6">
      
      <!-- New Password -->
      <div class="w-full lg:w-1/3 mb-4 flex flex-col">
        <label class="text-sm font-medium mb-1">New Password</label>
        <input
          v-model="form.new"
          type="password"
          class="border rounded p-2 w-full"
          required
        >
      </div>

      <!-- Confirm Password -->
      <div class="w-full lg:w-1/3 mb-4 flex flex-col">
        <label class="text-sm font-medium mb-1">Confirm Password</label>
        <input
          v-model="form.confirm"
          type="password"
          class="border rounded p-2 w-full"
          required
        >
      </div>

      <!-- Submit Button -->
      <div class="w-full mt-4">
        <button
          type="submit"
          class="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition w-full lg:w-auto"
        >
          Change
        </button>
      </div>

      <!-- Messages -->
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
