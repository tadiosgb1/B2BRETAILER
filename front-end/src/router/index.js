import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/opened/landing/Home.vue';
import ProductDetail from "../views/opened/landing/ProductDetail.vue";
import Orders from "../views/closed/orders/view.vue";
import MyCarts from "../views/closed/MyCarts/view.vue";
import Account from "../views/closed/Account/view.vue";
import Login from '../views/opened/auth/login.vue';
import Register from '../views/opened/auth/register.vue';
import ContactUs from '../views/opened/landing/contactUs.vue';
import Services from '../views/opened/landing/services.vue';
import About from '../views/opened/landing/about.vue';
import ResetPassword from '../views/opened/auth/ResetPassword.vue';
import ForgotPasssword from '../views/opened/auth/forgotPassword.vue';
import Reset from '../views/opened/auth/reset.vue';
import AccessDenied from "../views/opened/auth/accessDenied.vue";
import Dashboard from '../views/closed/dashboard.vue';
import { showAuthModal } from "../components/AuthRequiredModal.vue";
const routes = [
  // Public routes
  { path: "/", name: "home", component: Home },
  { path: "/product/:id", name: "ProductDetail", component: ProductDetail, props: true },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/contact-us", name: "contact-us", component: ContactUs },
  { path: "/about", name: "about", component: About },
  { path: "/services", name: "services", component: Services },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPasssword, props: true },
  { path: "/:lang/reset-password", name: "ResetPassword", component: ResetPassword, props: true },
  { path: "/reset/:token", name: "reset", component: Reset },
  { path: "/dashboard", name: "dashboard", component: Dashboard },

  // Protected routes
  { path: "/orders", name: "orders-view", component: Orders, meta: { requiresAuth: true } },
  { path: "/my-carts", name: "my-carts", component: MyCarts, meta: { requiresAuth: true } },
  { path: "/account", name: "account", component: Account, meta: { requiresAuth: true } },

  // Catch-all
  { path: "/:pathMatch(.*)*", name: "accessDenied", component: AccessDenied },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Show alert or redirect
       showAuthModal.value = true; // show modal
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
