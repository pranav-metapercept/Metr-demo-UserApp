import store from "@/state/store";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/pages/account/login"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "home" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/pages/account/register"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "home" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot-password",
    component: () => import("../views/pages/account/forgot-password"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "home" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/logout",
    name: "logout",
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          store.dispatch("auth/logOut");
        } else {
          store.dispatch("authfack/logout");
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
          route.push("/login")
        );
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: "home" } : { ...routeFrom });
      },
    },
  },
  {
    path: "/",
    name: "home",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/dashboard/index"),
  },
  {
    path: "/doceditor",
    name: "doceditor",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/doceditor/index"),
  },
  {
    path: "/doceditor/projectlist",
    name: "DocEditorProjectList",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/doceditor/projectlist.vue"),
  },
  {
    path: "/docmanager",
    name: "DocManager",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/docmanager/index"),
  },
  {
    path: "/docmanager/details",
    name: "ProjectDetail",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/docmanager/details.vue"),
  },
  {
    path: "/docstyler",
    name: "styler",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/docstyler/index.vue"),
  },
  {
    path: "/docpublisher",
    name: "DocPublisher",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/docpublisher/index.vue"),
  },
  {
    path: "/docpublisher/projectlist",
    name: "Projects",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/docpublisher/projects.vue"),
  },
  {
    path: "/docmigration",
    name: "DocMigration",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/docmigration/index.vue"),
  },
  {
    path: "/docmigration/outputscreen",
    name: "outputscreen",
    meta: {
      authRequired: true,
    },
    component: () =>
      import("../views/pages/docmigration/components/outputscreen.vue"),
  },
  {
    path: "/docmigration/outputscreen/githubcommit",
    name: "githubcommit",
    meta: {
      authRequired: true,
    },
    component: () =>
      import("../views/pages/docmigration/components/githubcommit.vue"),
  },
  {
    path: "/release",
    name: "Releasetable",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/tables/releasetable.vue"),
  },
  {
    path: "/userrole",
    name: "userrole",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/tables/userroletable.vue"),
  },
];
