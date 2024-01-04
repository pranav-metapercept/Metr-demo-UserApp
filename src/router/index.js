import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/pages/account/routes.account/";
import Dashboard from "@/views/pages/dashboard/routes.dashboard/";
import DocManager from "@/views/pages/docmanager/routes.docmanager/";
import DocPublisher from "@/views/pages/docpublisher/routes.docpublisher/";
import DocMigration from "@/views/pages/docmigration/routes.docmigration/";
import frontmatter from "@/views/pages/docstyler/routes.docstyler/";
import DocEditor from "@/views/pages/doceditor/routes.doceditor/";
import Tables from "@/views/pages/tables/routes.tables/";
Vue.use(Router);
// Vue.use(VueMeta, {
//   // The component option name that vue-meta looks for meta info on.
//   keyName: 'page',
// })
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    ...Login,
    {
      path: "/dashboard",
      component: () => import("@/views/layouts/main/"),
      children: [
        ...Dashboard,
        ...DocManager,
        ...DocPublisher,
        ...DocMigration,
        ...frontmatter,
        ...DocEditor,
        ...Tables,
      ],
    },
    {
      path: "/doceditor/:repouser/:reponame/:repobranch",
      component: () => import("../views/pages/doceditor/index.vue"),
      props: (route) => ({
        repouser: decodeURIComponent(route.params.repouser),
        reponame: decodeURIComponent(route.params.reponame),
        repobranch: decodeURIComponent(route.params.repobranch),
      }),
    },

    // Redirect to 404 page, if no match found
    {
      path: "/not-found",
      component: () => import(/* webpackChunkName: "404" */ "@/views/Error404"),
    },
    { path: "*", redirect: "/not-found" },
  ],
});
router.afterEach(() => {
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});
export default router;
