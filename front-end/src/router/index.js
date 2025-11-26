import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/opened/landing/Home.vue';
import ProductDetail  from "../views/opened/landing/ProductDetail.vue";
import Orders from "../views/closed/orders/view.vue"
import Login from '../views/opened/auth/login.vue';
import ContactUs from '../views/opened/landing/contactUs.vue';
import Services from '../views/opened/landing/services.vue';
import About from '../views/opened/landing/about.vue';
import ResetPassword from '../views/opened/auth/ResetPassword.vue';
import ForgotPasssword from '../views/opened/auth/forgotPassword.vue';
import Registration from '../views/opened/auth/login.vue'; // note: same file as login
import Reset from '../views/opened/auth/reset.vue';
import AccessDenied from "../views/opened/auth/accessDenied.vue";
import first_dash from '../views/closed/first_dash.vue';
import dashboard from '../views/closed/dashboard.vue';
import User_view from '../views/closed/users/view.vue';
import UserDetail from '../views/closed/users/detail.vue';
import Permissions from '../views/closed/permissions/view.vue';
import Roles from '../views/closed/groups/view.vue';
import Notifications from '../views/closed/notifications/view.vue';
import notificationDetail from '../views/closed/notifications/notificationDeatil.vue';
import Commissions from '../views/closed/commissions/view.vue';
import Messages from '../views/closed/Messages/message.vue';
import Inbox from '../views/closed/inbox/view.vue';
const routes = [
  // Public routes
  { path: "/", name: "home", component: Home, meta: { requiresGuest: true } },
 
 
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true, // allows you to pass route params as props if needed
  },
 {
        path: "/orders",
        name: "orders-view",
        component: Orders,
      },


  { path: "/login", name: "login", component: Login, meta: { requiresGuest: true } },
  { path: "/register", name: "register", component: Registration, meta: { requiresGuest: true } },
  { path: "/contact-us", name: "contact-us", component: ContactUs, meta: { requiresGuest: true } },
  { path: "/about", name: "about", component: About, meta: { requiresGuest: true } },
  { path: "/services", name: "services", component: Services, meta: { requiresGuest: true } },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPasssword, props: true },
  { path: "/:lang/reset-password", name: "ResetPassword", component: ResetPassword, props: true },
  { path: "/reset/:token", name: "reset", component: Reset, meta: { requiresGuest: true } },

  // Dashboard (protected area)
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
    meta: { requiresGuest: true },
    children: [

 
      {
        path: "testimonials",
        name: "Testimonials-view",
        component: () => import('../views/closed/Testimonials/TestimonialsView.vue'),
      },
      {
        path: "testimonials/add",
        name: "Testimonials-add",
        component: () => import('../views/closed/Testimonials/AddTestimonials.vue'),
      },
      {
        path: "testimonials/edit/:id",
        name: "Testimonials-edit",
        component: () => import('../views/closed/Testimonials/EditTestimonials.vue'),
        props: true,
      },
      {
        path: "testimonials/detail/:id",
        name: "Testimonials-detail",
        component: () => import('../views/closed/Testimonials/TestimonialsDetail.vue'),
        props: true,
      },

      {
        path: "testimonials",
        name: "Testimonials-view",
        component: () => import('../views/closed/Testimonials/TestimonialsView.vue'),
      },
      {
        path: "testimonials/add",
        name: "Testimonials-add",
        component: () => import('../views/closed/Testimonials/AddTestimonials.vue'),
      },
      {
        path: "testimonials/edit/:id",
        name: "Testimonials-edit",
        component: () => import('../views/closed/Testimonials/EditTestimonials.vue'),
        props: true,
      },
      {
        path: "testimonials/detail/:id",
        name: "Testimonials-detail",
        component: () => import('../views/closed/Testimonials/TestimonialsDetail.vue'),
        props: true,
      },

      {
        path: "teams",
        name: "Teams-view",
        component: () => import('../views/closed/Teams/TeamsView.vue'),
      },
      {
        path: "teams/add",
        name: "Teams-add",
        component: () => import('../views/closed/Teams/AddTeams.vue'),
      },
      {
        path: "teams/edit/:id",
        name: "Teams-edit",
        component: () => import('../views/closed/Teams/EditTeams.vue'),
        props: true,
      },
      {
        path: "teams/detail/:id",
        name: "Teams-detail",
        component: () => import('../views/closed/Teams/TeamsDetail.vue'),
        props: true,
      },

      {
        path: "users",
        name: "Users-view",
        component: () => import('../views/closed/Users/UsersView.vue'),
      },
      {
        path: "users/add",
        name: "Users-add",
        component: () => import('../views/closed/Users/AddUsers.vue'),
      },
      {
        path: "users/edit/:id",
        name: "Users-edit",
        component: () => import('../views/closed/Users/EditUsers.vue'),
        props: true,
      },
      {
        path: "users/detail/:id",
        name: "Users-detail",
        component: () => import('../views/closed/Users/UsersDetail.vue'),
        props: true,
      },

      {
        path: "subscribers",
        name: "Subscribers-view",
        component: () => import('../views/closed/Subscribers/SubscribersView.vue'),
      },
      {
        path: "subscribers/add",
        name: "Subscribers-add",
        component: () => import('../views/closed/Subscribers/AddSubscribers.vue'),
      },
      {
        path: "subscribers/edit/:id",
        name: "Subscribers-edit",
        component: () => import('../views/closed/Subscribers/EditSubscribers.vue'),
        props: true,
      },
      {
        path: "subscribers/detail/:id",
        name: "Subscribers-detail",
        component: () => import('../views/closed/Subscribers/SubscribersDetail.vue'),
        props: true,
      },

      {
        path: "awards",
        name: "Awards-view",
        component: () => import('../views/closed/Awards/AwardsView.vue'),
      },
      {
        path: "awards/add",
        name: "Awards-add",
        component: () => import('../views/closed/Awards/AddAwards.vue'),
      },
      {
        path: "awards/edit/:id",
        name: "Awards-edit",
        component: () => import('../views/closed/Awards/EditAwards.vue'),
        props: true,
      },
      {
        path: "awards/detail/:id",
        name: "Awards-detail",
        component: () => import('../views/closed/Awards/AwardsDetail.vue'),
        props: true,
      },

      {
        path: "contacts",
        name: "Contacts-view",
        component: () => import('../views/closed/Contacts/ContactsView.vue'),
      },
      {
        path: "contacts/add",
        name: "Contacts-add",
        component: () => import('../views/closed/Contacts/AddContacts.vue'),
      },
      {
        path: "contacts/edit/:id",
        name: "Contacts-edit",
        component: () => import('../views/closed/Contacts/EditContacts.vue'),
        props: true,
      },
      {
        path: "contacts/detail/:id",
        name: "Contacts-detail",
        component: () => import('../views/closed/Contacts/ContactsDetail.vue'),
        props: true,
      },

      {
        path: "services",
        name: "Services-view",
        component: () => import('../views/closed/Services/ServicesView.vue'),
      },
      {
        path: "services/add",
        name: "Services-add",
        component: () => import('../views/closed/Services/AddServices.vue'),
      },
      {
        path: "services/edit/:id",
        name: "Services-edit",
        component: () => import('../views/closed/Services/EditServices.vue'),
        props: true,
      },
      {
        path: "services/detail/:id",
        name: "Services-detail",
        component: () => import('../views/closed/Services/ServicesDetail.vue'),
        props: true,
      },

      {
        path: "partners",
        name: "Partners-view",
        component: () => import('../views/closed/Partners/PartnersView.vue'),
      },
      {
        path: "partners/add",
        name: "Partners-add",
        component: () => import('../views/closed/Partners/AddPartners.vue'),
      },
      {
        path: "partners/edit/:id",
        name: "Partners-edit",
        component: () => import('../views/closed/Partners/EditPartners.vue'),
        props: true,
      },
      {
        path: "partners/detail/:id",
        name: "Partners-detail",
        component: () => import('../views/closed/Partners/PartnersDetail.vue'),
        props: true,
      },

      {
        path: "news",
        name: "News-view",
        component: () => import('../views/closed/News/NewsView.vue'),
      },
      {
        path: "news/add",
        name: "News-add",
        component: () => import('../views/closed/News/AddNews.vue'),
      },
      {
        path: "news/edit/:id",
        name: "News-edit",
        component: () => import('../views/closed/News/EditNews.vue'),
        props: true,
      },
      {
        path: "news/detail/:id",
        name: "News-detail",
        component: () => import('../views/closed/News/NewsDetail.vue'),
        props: true,
      },

      {
        path: "events",
        name: "Events-view",
        component: () => import('../views/closed/Events/EventsView.vue'),
      },
      {
        path: "events/add",
        name: "Events-add",
        component: () => import('../views/closed/Events/AddEvents.vue'),
      },
      {
        path: "events/edit/:id",
        name: "Events-edit",
        component: () => import('../views/closed/Events/EditEvents.vue'),
        props: true,
      },
      {
        path: "events/detail/:id",
        name: "Events-detail",
        component: () => import('../views/closed/Events/EventsDetail.vue'),
        props: true,
      },

      {
        path: "categories",
        name: "Categories-view",
        component: () => import('../views/closed/Categories/CategoriesView.vue'),
      },
      {
        path: "categories/add",
        name: "Categories-add",
        component: () => import('../views/closed/Categories/AddCategories.vue'),
      },
      {
        path: "categories/edit/:id",
        name: "Categories-edit",
        component: () => import('../views/closed/Categories/EditCategories.vue'),
        props: true,
      },
      {
        path: "categories/detail/:id",
        name: "Categories-detail",
        component: () => import('../views/closed/Categories/CategoriesDetail.vue'),
        props: true,
      },

      {
        path: "galleries",
        name: "Galleries-view",
        component: () => import('../views/closed/Galleries/GalleriesView.vue'),
      },
      {
        path: "galleries/add",
        name: "Galleries-add",
        component: () => import('../views/closed/Galleries/AddGalleries.vue'),
      },
      {
        path: "galleries/edit/:id",
        name: "Galleries-edit",
        component: () => import('../views/closed/Galleries/EditGalleries.vue'),
        props: true,
      },
      {
        path: "galleries/detail/:id",
        name: "Galleries-detail",
        component: () => import('../views/closed/Galleries/GalleriesDetail.vue'),
        props: true,
      },



      {
        path: "testimonials",
        name: "Testimonials-view",
        component: () => import('../views/closed/Testimonials/TestimonialsView.vue'),
      },
      {
        path: "testimonials/add",
        name: "Testimonials-add",
        component: () => import('../views/closed/Testimonials/AddTestimonials.vue'),
      },
      {
        path: "testimonials/edit/:id",
        name: "Testimonials-edit",
        component: () => import('../views/closed/Testimonials/EditTestimonials.vue'),
        props: true,
      },
      {
        path: "testimonials/detail/:id",
        name: "Testimonials-detail",
        component: () => import('../views/closed/Testimonials/TestimonialsDetail.vue'),
        props: true,
      },

      {
        path: "teams",
        name: "Teams-view",
        component: () => import('../views/closed/Teams/TeamsView.vue'),
      },
      {
        path: "teams/add",
        name: "Teams-add",
        component: () => import('../views/closed/Teams/AddTeams.vue'),
      },
      {
        path: "teams/edit/:id",
        name: "Teams-edit",
        component: () => import('../views/closed/Teams/EditTeams.vue'),
        props: true,
      },
      {
        path: "teams/detail/:id",
        name: "Teams-detail",
        component: () => import('../views/closed/Teams/TeamsDetail.vue'),
        props: true,
      },

      {
        path: "users",
        name: "Users-view",
        component: () => import('../views/closed/Users/UsersView.vue'),
      },
      {
        path: "users/add",
        name: "Users-add",
        component: () => import('../views/closed/Users/AddUsers.vue'),
      },
      {
        path: "users/edit/:id",
        name: "Users-edit",
        component: () => import('../views/closed/Users/EditUsers.vue'),
        props: true,
      },
      {
        path: "users/detail/:id",
        name: "Users-detail",
        component: () => import('../views/closed/Users/UsersDetail.vue'),
        props: true,
      },

      {
        path: "subscribers",
        name: "Subscribers-view",
        component: () => import('../views/closed/Subscribers/SubscribersView.vue'),
      },
      {
        path: "subscribers/add",
        name: "Subscribers-add",
        component: () => import('../views/closed/Subscribers/AddSubscribers.vue'),
      },
      {
        path: "subscribers/edit/:id",
        name: "Subscribers-edit",
        component: () => import('../views/closed/Subscribers/EditSubscribers.vue'),
        props: true,
      },
      {
        path: "subscribers/detail/:id",
        name: "Subscribers-detail",
        component: () => import('../views/closed/Subscribers/SubscribersDetail.vue'),
        props: true,
      },

      {
        path: "awards",
        name: "Awards-view",
        component: () => import('../views/closed/Awards/AwardsView.vue'),
      },
      {
        path: "awards/add",
        name: "Awards-add",
        component: () => import('../views/closed/Awards/AddAwards.vue'),
      },
      {
        path: "awards/edit/:id",
        name: "Awards-edit",
        component: () => import('../views/closed/Awards/EditAwards.vue'),
        props: true,
      },
      {
        path: "awards/detail/:id",
        name: "Awards-detail",
        component: () => import('../views/closed/Awards/AwardsDetail.vue'),
        props: true,
      },

      {
        path: "contacts",
        name: "Contacts-view",
        component: () => import('../views/closed/Contacts/ContactsView.vue'),
      },
      {
        path: "contacts/add",
        name: "Contacts-add",
        component: () => import('../views/closed/Contacts/AddContacts.vue'),
      },
      {
        path: "contacts/edit/:id",
        name: "Contacts-edit",
        component: () => import('../views/closed/Contacts/EditContacts.vue'),
        props: true,
      },
      {
        path: "contacts/detail/:id",
        name: "Contacts-detail",
        component: () => import('../views/closed/Contacts/ContactsDetail.vue'),
        props: true,
      },

      {
        path: "services",
        name: "Services-view",
        component: () => import('../views/closed/Services/ServicesView.vue'),
      },
      {
        path: "services/add",
        name: "Services-add",
        component: () => import('../views/closed/Services/AddServices.vue'),
      },
      {
        path: "services/edit/:id",
        name: "Services-edit",
        component: () => import('../views/closed/Services/EditServices.vue'),
        props: true,
      },
      {
        path: "services/detail/:id",
        name: "Services-detail",
        component: () => import('../views/closed/Services/ServicesDetail.vue'),
        props: true,
      },

      {
        path: "partners",
        name: "Partners-view",
        component: () => import('../views/closed/Partners/PartnersView.vue'),
      },
      {
        path: "partners/add",
        name: "Partners-add",
        component: () => import('../views/closed/Partners/AddPartners.vue'),
      },
      {
        path: "partners/edit/:id",
        name: "Partners-edit",
        component: () => import('../views/closed/Partners/EditPartners.vue'),
        props: true,
      },
      {
        path: "partners/detail/:id",
        name: "Partners-detail",
        component: () => import('../views/closed/Partners/PartnersDetail.vue'),
        props: true,
      },

      {
        path: "news",
        name: "News-view",
        component: () => import('../views/closed/News/NewsView.vue'),
      },
      {
        path: "news/add",
        name: "News-add",
        component: () => import('../views/closed/News/AddNews.vue'),
      },
      {
        path: "news/edit/:id",
        name: "News-edit",
        component: () => import('../views/closed/News/EditNews.vue'),
        props: true,
      },
      {
        path: "news/detail/:id",
        name: "News-detail",
        component: () => import('../views/closed/News/NewsDetail.vue'),
        props: true,
      },

      {
        path: "events",
        name: "Events-view",
        component: () => import('../views/closed/Events/EventsView.vue'),
      },
      {
        path: "events/add",
        name: "Events-add",
        component: () => import('../views/closed/Events/AddEvents.vue'),
      },
      {
        path: "events/edit/:id",
        name: "Events-edit",
        component: () => import('../views/closed/Events/EditEvents.vue'),
        props: true,
      },
      {
        path: "events/detail/:id",
        name: "Events-detail",
        component: () => import('../views/closed/Events/EventsDetail.vue'),
        props: true,
      },

      {
        path: "categories",
        name: "Categories-view",
        component: () => import('../views/closed/Categories/CategoriesView.vue'),
      },
      {
        path: "categories/add",
        name: "Categories-add",
        component: () => import('../views/closed/Categories/AddCategories.vue'),
      },
      {
        path: "categories/edit/:id",
        name: "Categories-edit",
        component: () => import('../views/closed/Categories/EditCategories.vue'),
        props: true,
      },
      {
        path: "categories/detail/:id",
        name: "Categories-detail",
        component: () => import('../views/closed/Categories/CategoriesDetail.vue'),
        props: true,
      },

      {
        path: "galleries",
        name: "Galleries-view",
        component: () => import('../views/closed/Galleries/GalleriesView.vue'),
      },
      {
        path: "galleries/add",
        name: "Galleries-add",
        component: () => import('../views/closed/Galleries/AddGalleries.vue'),
      },
      {
        path: "galleries/edit/:id",
        name: "Galleries-edit",
        component: () => import('../views/closed/Galleries/EditGalleries.vue'),
        props: true,
      },
      {
        path: "galleries/detail/:id",
        name: "Galleries-detail",
        component: () => import('../views/closed/Galleries/GalleriesDetail.vue'),
        props: true,
      },


      {
        path: "sites",
        name: "Sites-view",
        component: () => import('../views/closed/sites/SitesView.vue'),
      },
      {
        path: "sites/add",
        name: "Sites-add",
        component: () => import('../views/closed/sites/AddSites.vue'),
      },
      {
        path: "sites/edit/:id",
        name: "Sites-edit",
        component: () => import('../views/closed/sites/EditSites.vue'),
        props: true,
      },
      {
        path: "sites/detail/:id",
        name: "Sites-detail",
        component: () => import('../views/closed/sites/SitesDetail.vue'),
        props: true,
      },

      {
        path: "proporties",
        name: "Property-view",
        component: () => import('../views/closed/Proporties/PropertyView.vue'),
      },
      {
        path: "proporties/add",
        name: "Property-add",
        component: () => import('../views/closed/Proporties/AddProperty.vue'),
      },
      {
        path: "proporties/edit/:id",
        name: "Property-edit",
        component: () => import('../views/closed/Proporties/EditProperty.vue'),
        props: true,
      },
      {
        path: "proporties/detail/:id",
        name: "Property-detail",
        component: () => import('../views/closed/Proporties/PropertyDetail.vue'),
        props: true,
      },





      { path: "users", name: "users", component: User_view },
      { path: "roles", name: "roles", component: Roles },
      { path: "permissions", name: "permissions", component: Permissions },
      { path: "user-detail/:id", name: "user-detail", component: UserDetail },
      { path: "first-dash", name: "first-dash", component: first_dash },
      { path: "messages", name: "messages", component: Messages },
      { path: "inbox", name: "inbox", component: Inbox },
      { path: "notifications", name: "notifications", component: Notifications },
      { path: "notification/:id", name: "notificationDetail", component: notificationDetail },
      { path: "commissions", name: "commissions", component: Commissions },
    ],
  },

  // Catch-all
  { path: "/:pathMatch(.*)*", name: "accessDenied", component: AccessDenied, meta: { requiresGuest: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiredRole = to.meta.role;

  if (requiresAuth) {
    if (!isAuthenticated) {
      next("/login");
    } else if (requiredRole && userRole !== requiredRole) {
      localStorage.clear();
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
