import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from "bootstrap-vue";
import VueSweetalert2 from "vue-sweetalert2";
import VeeValidate from "vee-validate";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import vco from "v-click-outside";
import router from "./router";
import store from "@/state/store";
import i18n from "./i18n";
import VJstree from "vue-jstree";
import "@/assets/scss/app.scss";
// Import and register your global components
import PageHeader from "@/components/pageheader";
import Simplebar from "simplebar-vue";
// Load environment variables
require("dotenv").config();
// Register global components
Vue.component("PageHeader", PageHeader);
// Vue.config.devtools = process.env.NODE_ENV !== "production";
Vue.component("Simplebar", Simplebar);
Vue.config.productionTip = false;
Vue.use(Loading);
Vue.use(BootstrapVue);
Vue.use(VeeValidate);
Vue.use(vco);
Vue.use(VueSweetalert2);
Vue.component("v-jstree", VJstree);
Vue.prototype.$eventBus = new Vue();
export const eventBus = new Vue(); // creating an event bus.
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
