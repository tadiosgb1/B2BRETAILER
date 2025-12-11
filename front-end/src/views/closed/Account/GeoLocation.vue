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
import { request, gql } from "graphql-request";

export default {
  name: "GeoLocation",
  data() {
    return {
      form: {
        name: "",
        region: "",
        region_id: "",
        city: "",
        address: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        location: ""
      },
    };
  },

  async mounted() {
    await this.fetchGeoData();
  },

  methods: {
    // ---------------------------------------------------------
    // FETCH RETAILER INFO (IF EXISTS)
    // ---------------------------------------------------------
   async fetchGeoData() {
  try {
    const token = localStorage.getItem("token");
    const graphqlURL = import.meta.env.VITE_GRAPHQL_URL;

    const query = gql`
      query {
        auth {
          id
          name
          phone
          email
          retailer {
            id
            name
            address
            city
            contact_name
            contact_phone
            contact_email
            region { id name }
            _geo { lat lng }
          }
        }
      }
    `;

    const res = await request(graphqlURL, query, {}, {
      Authorization: `Bearer ${token}`
    });

    const auth = res.auth;
    const retailer = auth.retailer;

    // -------------------------------
    // CASE 1: RETAILER EXISTS
    // -------------------------------
    if (retailer) {
      const lat = retailer._geo?.lat ?? "";
      const lng = retailer._geo?.lng ?? "";

      this.form = {
        name: retailer.name ?? auth.name,  // fallback
        region: retailer.region?.name ?? "",
        region_id: retailer.region?.id ?? "",
        city: retailer.city ?? "",
        address: retailer.address ?? "",
        contact_name: retailer.contact_name ?? retailer.name ?? auth.name,
        contact_phone: retailer.contact_phone ?? auth.phone,
        contact_email: retailer.contact_email ?? auth.email,
        location: lat && lng ? `${lat},${lng}` : ""
      };
    }

    // -------------------------------
    // CASE 2: RETAILER IS NULL
    // → Use auth fields
    // -------------------------------
    else {
      this.form = {
        name: auth.name,
        region: "",
        region_id: "",
        city: "",
        address: "",
        contact_name: auth.name,
        contact_phone: auth.phone,
        contact_email: auth.email,
        location: ""
      };
    }

  } catch (err) {
    console.error(err);
  }
}
,

    // ---------------------------------------------------------
    // GET BROWSER GPS LOCATION
    // ---------------------------------------------------------
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          this.form.location = `${lat},${lng}`;
        },
        () => alert("Location access denied.")
      );
    },

    // ---------------------------------------------------------
    // SUBMIT selfUpdateRetailer
    // ---------------------------------------------------------
    async submitUpdate() {
      try {
        const token = localStorage.getItem("token");
        const graphqlURL = import.meta.env.VITE_GRAPHQL_URL;

        // Convert "12.345,45.678" into object
        let geo = null;
        if (this.form.location.includes(",")) {
          const [lat, lng] = this.form.location.split(",");
          geo = { lat: Number(lat), lng: Number(lng) };
        }

        const mutation = gql`
          mutation(
            $name: String!
            $address: String!
            $city: String
            $_geo: GeoInput
            $contact_name: String!
            $contact_email: String
            $contact_phone: String!
            $region_id: String!
          ) {
            selfUpdateRetailer(input: {
              name: $name
              address: $address
              city: $city
              _geo: $_geo
              contact_name: $contact_name
              contact_email: $contact_email
              contact_phone: $contact_phone
              region_id: $region_id
            }) {
              id
              name
            }
          }
        `;

        const variables = {
          name: this.form.name,
          address: this.form.address,
          city: this.form.city,
          _geo: geo,
          contact_name: this.form.contact_name,
          contact_email: this.form.contact_email,
          contact_phone: this.form.contact_phone,
          region_id: "2",
        };

        await request(graphqlURL, mutation, variables, {
          Authorization: `Bearer ${token}`
        });

        this.$root.$refs.toast.showToast("Geolocation updated successfully", "success");

      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Update failed", "error");
      }
    },
  },
};
</script>




