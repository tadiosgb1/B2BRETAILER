/**
 * create-page.cjs
 * Generates Vue3 CRUD pages and injects routing + sidebar.
 * Usage:
 *   node create-page.cjs PageName src views opened admin field1 field2 field3
 *   node create-page.cjs PageName src views closed admin
 */

const fs = require("fs");
const path = require("path");

// Read args
const args = process.argv.slice(2);
const [pageName, srcFolder, type, apiType, role, ...dynamicFields] = args;

if (!pageName || !srcFolder || !type || !apiType || !role) {
  console.error("Usage: node create-page.cjs PageName src views opened|closed admin [fields...]");
  process.exit(1);
}

// Utility
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Use provided fields or default
const fields = dynamicFields.length ? dynamicFields : ["Field1", "Field2", "Field3"];

// OUTPUT directory
const baseDir = path.join(process.cwd(), srcFolder, type, apiType, role);
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });


// ------------------ COMPONENT TEMPLATES ------------------

const modalTemplate = (mode) => `
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">${mode} ${capitalize(pageName)}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        ${fields
    .map(
      (f) => `
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">${capitalize(f)}</label>
          <input v-model="form.${f}" type="text" required class="border border-gray-300 rounded-lg w-full px-3 py-2" />
        </div>`
    )
    .join("")}

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">${mode}</button>
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
        ${fields.map((f) => `${f}: this.data?.${f} || ''`).join(",\n")}
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("${mode}" === "Add") {
          await this.$apiPost("/${pageName.toLowerCase()}", this.form);
        } else {
          await this.$apiPatch(\`/${pageName.toLowerCase()}/\${this.data.id}/\`, this.form);
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (e) { console.error(e); }
    }
  }
}
</script>
`;


const viewTemplate = `
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">${capitalize(pageName)}</h1>

      <button
        @click="openAddModal"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-150 flex items-center space-x-1 text-sm"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add ${capitalize(pageName)}</span>
      </button>
    </div>

    <!-- Desktop Table -->
    <div class="bg-white overflow-hidden rounded-xl border border-gray-200 hidden md:block">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 text-left">#</th>
              ${fields
    .map(f => `<th class="px-6 py-3 text-left">${capitalize(f)}</th>`)
    .join("")}
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="hover:bg-green-50 transition duration-150"
            >
              <td class="px-6 py-4">{{ index + 1 }}</td>
              ${fields
    .map(
      f => `<td class="px-6 py-4 whitespace-nowrap">{{ item.${f} }}</td>`
    )
    .join("")}

              <td class="px-6 py-4 text-center space-x-3">
                <button @click="editItem(item)" class="text-green-600 hover:text-green-800">Edit</button>
                <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>

            <tr v-if="items.length === 0">
              <td colspan="${fields.length + 2}" class="text-center py-6 text-gray-400 italic">
                No data found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-4">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="bg-white border border-gray-200 rounded-xl shadow p-4"
      >
        <div class="flex justify-between mb-3">
          <h2 class="font-bold text-gray-800">${capitalize(pageName)} #{{ index + 1 }}</h2>

          <div class="flex gap-3 text-sm">
            <button @click="editItem(item)" class="text-green-600 hover:text-green-700">Edit</button>
            <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-700">Delete</button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
          ${fields
    .map(
      f => `
            <div class="col-span-2">
              <span class="font-medium text-gray-600">${capitalize(f)}:</span>
              {{ item.${f} }}
            </div>`
    )
    .join("")}
        </div>
      </div>

      <p v-if="items.length === 0" class="text-center text-gray-400 py-6 italic">
        No data found.
      </p>
    </div>

    <!-- Add Modal -->
    <add-${pageName.toLowerCase()}
      v-if="showModal && !editMode"
      :data="selectedItem"
      @close="showModal=false"
      @saved="fetchItems"
    />

    <!-- Edit Modal -->
    <edit-${pageName.toLowerCase()}
      v-if="showModal && editMode"
      :data="selectedItem"
      @close="showModal=false"
      @saved="fetchItems"
    />

  </div>
</template>

<script>
import Add${capitalize(pageName)} from "./Add${capitalize(pageName)}.vue";
import Edit${capitalize(pageName)} from "./Edit${capitalize(pageName)}.vue";

export default {
  components: { Add${capitalize(pageName)}, Edit${capitalize(pageName)} },
  data() {
    return { items: [], showModal: false, editMode: false, selectedItem: null };
  },
  methods: {
    async fetchItems() {
      this.items = (await this.$apiGet("/${pageName.toLowerCase()}")).data || [];
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = item; this.showModal = true; },
    async deleteItem(id) {
      if (confirm("Are you sure?")) {
        await this.$apiDelete(\`/${pageName.toLowerCase()}/\${id}/\`);
        this.fetchItems();
      }
    }
  },
  mounted() { this.fetchItems(); }
}
</script>
`;



const detailTemplate = `
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">${capitalize(pageName)} Details</h2>

    <div class="space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      ${fields
    .map((f) => `<div><strong>${capitalize(f)}:</strong> {{ item.${f} }}</div>`)
    .join("")}
    </div>

    <button @click="$router.back()" class="mt-4 text-blue-600">Back</button>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    this.item = (await this.$apiGet(\`/${pageName.toLowerCase()}/\${id}/\`)).data || {};
  }
}
</script>
`;


// ------------------ WRITE COMPONENT FILES ------------------

fs.writeFileSync(path.join(baseDir, `Add${capitalize(pageName)}.vue`), modalTemplate("Add"));
fs.writeFileSync(path.join(baseDir, `Edit${capitalize(pageName)}.vue`), modalTemplate("Edit"));
fs.writeFileSync(path.join(baseDir, `${capitalize(pageName)}View.vue`), viewTemplate);
fs.writeFileSync(path.join(baseDir, `${capitalize(pageName)}Detail.vue`), detailTemplate);

console.log(`✅ Generated CRUD components for ${capitalize(pageName)} in ${baseDir}`);


// ------------------ ROUTER INJECTION ------------------

// const routerPath = path.join(process.cwd(), srcFolder, "router", "index.js");

// if (fs.existsSync(routerPath)) {
//   let routerContent = fs.readFileSync(routerPath, "utf8");

//   let snippet = "";

//   // OPENED → OUTSIDE dashboard
//   if (type === "opened") {
//     snippet = `
//   { path: "/${pageName.toLowerCase()}", name: "${capitalize(pageName)}-view",
//     component: () => import("../${type}/${apiType}/${role}/${capitalize(pageName)}View.vue") },

//   { path: "/${pageName.toLowerCase()}/add", name: "${capitalize(pageName)}-add",
//     component: () => import("../${type}/${apiType}/${role}/Add${capitalize(pageName)}.vue") },

//   { path: "/${pageName.toLowerCase()}/edit/:id", name: "${capitalize(pageName)}-edit",
//     component: () => import("../${type}/${apiType}/${role}/Edit${capitalize(pageName)}.vue"), props: true },

//   { path: "/${pageName.toLowerCase()}/detail/:id", name: "${capitalize(pageName)}-detail",
//     component: () => import("../${type}/${apiType}/${role}/${capitalize(pageName)}Detail.vue"), props: true },
// `;

//     routerContent = routerContent.replace(
//       /\/\/ Public routes/,
//       `// Public routes\n${snippet}`
//     );
//   }

//   // CLOSED → inside dashboard children
//   if (type === "closed") {
//     snippet = `
//       {
//         path: "${pageName.toLowerCase()}",
//         name: "${capitalize(pageName)}-view",
//         component: () => import('../${type}/${apiType}/${role}/${capitalize(pageName)}View.vue'),
//       },
//       {
//         path: "${pageName.toLowerCase()}/add",
//         name: "${capitalize(pageName)}-add",
//         component: () => import('../${type}/${apiType}/${role}/Add${capitalize(pageName)}.vue'),
//       },
//       {
//         path: "${pageName.toLowerCase()}/edit/:id",
//         name: "${capitalize(pageName)}-edit",
//         component: () => import('../${type}/${apiType}/${role}/Edit${capitalize(pageName)}.vue'),
//         props: true,
//       },
//       {
//         path: "${pageName.toLowerCase()}/detail/:id",
//         name: "${capitalize(pageName)}-detail",
//         component: () => import('../${type}/${apiType}/${role}/${capitalize(pageName)}Detail.vue'),
//         props: true,
//       },
// `;

//     routerContent = routerContent.replace(
//       /children:\s*\[/,
//       `children: [${snippet}`
//     );
//   }

//   fs.writeFileSync(routerPath, routerContent);
//   console.log(`✅ Router updated successfully for ${capitalize(pageName)}.`);

// } else {
//   console.warn("⚠ Router file not found. Skipping routing.");
// }


// ------------------ SIDEBAR UPDATE ------------------

// ------------------ UPDATE ROUTER ------------------
const routerPath = path.join(process.cwd(), srcFolder, 'router', 'index.js');

if (fs.existsSync(routerPath)) {
  let routerContent = fs.readFileSync(routerPath, 'utf8');

  const routeSnippet = `
      {
        path: "${role.toLowerCase()}",
        name: "${capitalize(pageName)}-view",
        component: () => import('../${type}/${apiType}/${role}/${capitalize(pageName)}View.vue'),
      },
      {
        path: "${role.toLowerCase()}/add",
        name: "${capitalize(pageName)}-add",
        component: () => import('../${type}/${apiType}/${role}/Add${capitalize(pageName)}.vue'),
      },
      {
        path: "${role.toLowerCase()}/edit/:id",
        name: "${capitalize(pageName)}-edit",
        component: () => import('../${type}/${apiType}/${role}/Edit${capitalize(pageName)}.vue'),
        props: true,
      },
      {
        path: "${role.toLowerCase()}/detail/:id",
        name: "${capitalize(pageName)}-detail",
        component: () => import('../${type}/${apiType}/${role}/${capitalize(pageName)}Detail.vue'),
        props: true,
      },`;

  routerContent = routerContent.replace(/children:\s*\[/, `children: [${routeSnippet}\n`);

  fs.writeFileSync(routerPath, routerContent);
  console.log(`✅ Router updated with ${capitalize(pageName)} routes.`);
} else {
  console.warn(`⚠ Router file not found at ${routerPath}. Skipping route injection.`);
}

const sidebarPath = path.join(process.cwd(), srcFolder, "components", "layouts", "leftSidevar.vue");

if (fs.existsSync(sidebarPath)) {
  let sidebarContent = fs.readFileSync(sidebarPath, "utf8");

  const sidebarSnippet = `
    {
      name: "${capitalize(pageName)}",
      route: "${capitalize(pageName)}-view",
      icon: "fas fa-folder",
      color: "#22c55e"
    },
`;

  sidebarContent = sidebarContent.replace(
    /(menuItems:\s*\[)/,
    `$1\n${sidebarSnippet}`
  );

  fs.writeFileSync(sidebarPath, sidebarContent);
  console.log(`✅ Sidebar updated with ${capitalize(pageName)}.`);
} else {
  console.warn("⚠ Sidebar not found. Skipping menu update.");
}

