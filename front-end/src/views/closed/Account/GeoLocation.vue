<template>
  <div class="bg-white p-6 rounded shadow-md">
    <h2 class="text-lg font-semibold mb-4">Edit Geo Location</h2>

    <form v-if="form" @submit.prevent="submitUpdate" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Row 1 -->
      <div>
        <label class="block mb-1 font-medium">Name</label>
        <input v-model="form.name" type="text" class="w-full border rounded p-2">
      </div>
      <div>
        <label class="block mb-1 font-medium">Region</label>
        <input v-model="form.region" type="text" class="w-full border rounded p-2">
      </div>

      <!-- Row 2 -->
      <div>
        <label class="block mb-1 font-medium">City</label>
        <input v-model="form.city" type="text" class="w-full border rounded p-2">
      </div>
      <div class="col-span-1 sm:col-span-1">
        <label class="block mb-1 font-medium">Street Address</label>
        <input v-model="form.address" type="text" class="w-full border rounded p-2">
      </div>

      <!-- Row 3: Location full width -->
      <div class="sm:col-span-2">
        <label class="block mb-1 font-medium">Location</label>
        <div class="flex gap-2">
          <input
            v-model="form.location"
            type="text"
            class="flex-1 border rounded p-2"
            readonly
          >
          <button
            @click.prevent="getLocation"
            class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Get Location
          </button>
        </div>
      </div>

      <!-- Row 4 -->
      <div>
        <label class="block mb-1 font-medium">Contact Phone</label>
        <input v-model="form.contactPhone" type="text" class="w-full border rounded p-2">
      </div>
      <div>
        <label class="block mb-1 font-medium">Contact Email</label>
        <input v-model="form.contactEmail" type="email" class="w-full border rounded p-2">
      </div>

      <!-- Submit Button full width -->
      <div class="sm:col-span-2">
        <button
          type="submit"
          class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
        >
          Save
        </button>
      </div>
    </form>

    <p v-else>Loading geo location...</p>
  </div>
</template>


<script>
import axios from "axios";
import { request, gql } from "graphql-request";

export default {
  name: "GeoLocation",
  data() {
    return {
      form: null,
      geoId: null,
    };
  },
  async mounted() {
    await this.fetchGeoData();
  },
  methods: {
    async fetchGeoData() {
      try {
        const token = localStorage.getItem("token");
        const endpoint = `${import.meta.env.VITE_REST_URL}/profile`;

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("profile res",res);

        // Map REST API fields to form
        this.geoId = res.data.id;
        this.form = {
          name: res.data.name || "",
          region: res.data.region?.name || "",
          city: res.data.city || "",
          // format backend geo {lat, lng} as "lat,lng"
          location: res.data._geo ? `${res.data._geo.lat},${res.data._geo.lng}` : "",
          address: res.data.address || "",
          contactPhone: res.data.contact_phone || "",
          contactEmail: res.data.contact_email || "",
        };
      } catch (err) {
        console.error(err);
        alert("Failed to load geo location.");
      }
    },

    getLocation() {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          this.form.location = `${lat},${lng}`;
        },
        (err) => {
          console.error(err);
          alert("Failed to get current location. Please allow location access.");
        }
      );
    },

    async submitUpdate() {
      if (!this.geoId) return;

      try {
        const token = localStorage.getItem("token");

        const mutation = gql`
          mutation (
            $id: ID!,
            $name: String!,
            $region: String!,
            $city: String!,
            $location: String!,
            $address: String!,
            $contactPhone: String!,
            $contactEmail: String
          ) {
            updateGeoLocation(
              id: $id,
              input: {
                name: $name,
                region: $region,
                city: $city,
                location: $location,
                address: $address,
                contactPhone: $contactPhone,
                contactEmail: $contactEmail
              }
            ) {
              id
              name
              region
              city
              location
              address
              contactPhone
              contactEmail
            }
          }
        `;

        const variables = {
          id: this.geoId,
          name: this.form.name,
          region: this.form.region,
          city: this.form.city,
          location: this.form.location,
          street: this.form.street,
          contactPhone: this.form.contactPhone,
          contactEmail: this.form.contactEmail,
        };

        const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_URL;

        await request(graphqlEndpoint, mutation, variables, {
          Authorization: `Bearer ${token}`,
        });

        alert("Geo location updated successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to update geo location.");
      }
    },
  },
};
</script>
