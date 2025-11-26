<template>
  <div class="p-4 w-full">

    <!-- MAIN CATEGORY LIST -->
    <ul class="space-y-2">
      <CategoryItem
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
      />
    </ul>

  </div>
</template>

<script>
import CategoryItem from "./CategoryItem.vue";
import { gql } from "graphql-request";
export default {
  components: { CategoryItem },

  data() {
    return {
      categories: [],
    };
  },

  async mounted() {
    const query = gql`
      query {
        getTreeCategories {
          id
          name
          imageUrl
          children {
            id
            name
            imageUrl
            children {
              id
              name
              imageUrl
              children {
                id
                name
                imageUrl
              }
            }
          }
        }
      }
    `;

    try {
      const res = await this.$apiClient.request(query);
      this.categories = res.getTreeCategories;
    } catch (e) {
      console.error("Error loading categories", e);
    }
  },
};
</script>
