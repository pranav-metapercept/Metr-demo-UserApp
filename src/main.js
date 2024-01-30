import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";
import Vuelidate from "vuelidate";
import VeeValidate from "vee-validate";
import VueSweetalert2 from "vue-sweetalert2";
import VueMask from "v-mask";
import * as VueGoogleMaps from "vue2-google-maps";
import VueYoutube from "vue-youtube";
import Loading from "vue-loading-overlay";
import vco from "v-click-outside";

import router from "./router";
import store from "@/state/store";
import i18n from "./i18n";
import VJstree from "vue-jstree";
import "@/assets/scss/app.scss";

import { initFirebaseBackend } from "./helpers/firebase/authUtils";

import { configureFakeBackend } from "./helpers/fakebackend/fake-backend";

const firebaseConfig = {
  apiKey: "AIzaSyC2b__m7MwoOp4U4HhMb0SsPtuyUlpmTHQ",
  authDomain: "metr-411707.firebaseapp.com",
  projectId: "metr-411707",
  storageBucket: "metr-411707.appspot.com",
  messagingSenderId: "1081449377795",
  appId: "1:1081449377795:web:a9389366267528a93f9e36",
  measurementId: "G-ZEL4BX00J9"
};
firebaseConfig;
initFirebaseBackend;
configureFakeBackend();

Vue.config.productionTip = false;
Vue.use(VueYoutube);
Vue.use(BootstrapVue);
Vue.use(Loading);
Vue.use(VeeValidate);
Vue.use(vco);
Vue.use(Vuelidate);
Vue.use(VueSweetalert2);
Vue.use(VueMask);
Vue.use(require("vue-chartist"));
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
    libraries: "places",
  },
  installComponents: true,
});
Vue.component("apexchart", VueApexCharts);
Vue.component("v-jstree", VJstree);
Vue.prototype.$eventBus = new Vue();
export const eventBus = new Vue();
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
