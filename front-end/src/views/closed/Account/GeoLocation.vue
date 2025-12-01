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
      <div class="gap-2">
        <label class="block mb-1 font-medium">Location</label>
        <div class="flex flex-col lg:flex-row gap-2">
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
        <input v-model="form.contact_phone" type="text" class="w-full border rounded p-2">
      </div>
      <div>
        <label class="block mb-1 font-medium">Contact Email</label>
        <input v-model="form.contact_email" type="email" class="w-full border rounded p-2">
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

        console.log("profile response:", res);

        this.geoId = res.data.id;

        const lat = res.data._geo?.lat || "";
        const lng = res.data._geo?.lng || "";

        this.form = {
          name: res.data.name || "",
          region: res.data.region?.name || "",
          city: res.data.city || "",
          address: res.data.address || "",
          contact_phone: res.data.contact_phone || "",
          contact_email: res.data.contact_email || "",
          location: lat && lng ? `${lat},${lng}` : ""
        };
      } catch (err) {
        console.error(err);
        alert("Failed to load geo location.");
      }
    },

    getLocation() {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));

          // template expects STRING
          this.form.location = `${lat},${lng}`;
        },
        () => alert("Failed to get location — please allow permission.")
      );
    },

    async submitUpdate() {
      if (!this.geoId) return;

      try {
        const token = localStorage.getItem("token");

        // convert "lat,lng" string → { lat, lng }
        let geo = null;
        if (this.form.location.includes(",")) {
          const [lat, lng] = this.form.location.split(",");
          geo = {
            lat: Number(lat),
            lng: Number(lng),
          };
        }

        const mutation = gql`
          mutation(
            $id: ID!
            $name: String!
            $address: String!
            $_geo: GeoInput
            $city: String
            $contact_name: String!
            $contact_phone: String!
          ) {
            updateRetailer(
              id: $id
              input: {
                name: $name
                address: $address
                _geo: $_geo
                city: $city
                contact_name: $contact_name
                contact_phone: $contact_phone
              }
            ) {
              id
              name
            }
          }
        `;

        const variables = {
          id: this.geoId,
          name: this.form.name,
          address: this.form.address,
          _geo: geo,
          city: this.form.city,
          contact_name: this.form.contact_name ?? this.form.contact_phone, // adjust as needed
          contact_phone: this.form.contact_phone,
        };

        const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_URL;

        await request(graphqlEndpoint, mutation, variables, {
          Authorization: `Bearer ${token}`,
        });

      //  alert("Geo location updated successfully!");

        this.$root.$refs.toast.showToast('Geolocation edited successfully', 'success');
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast( 'Geolocation edit failed', 'error');
      }
    },
  },
};
</script>

