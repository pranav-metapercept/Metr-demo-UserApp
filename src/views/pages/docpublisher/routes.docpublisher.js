import DocPublisher from "./index";
import Projects from "./projects.vue";

export default [
  {
    path: "/docpublisher/:repouser/:reponame/:repobranch/:repoowner",
    component: DocPublisher,
    name: "DocPublisher",
    props: (route) => ({
      repouser: decodeURIComponent(route.params.repouser),
      reponame: decodeURIComponent(route.params.reponame),
      repobranch: decodeURIComponent(route.params.repobranch),
      repoowner: decodeURIComponent(route.params.repoowner),
    }),
  },
  {
    path: "/docpublisher",
    component: Projects,
    name: "Projects",
    props: (route) => ({
      repouser: decodeURIComponent(route.params.repouser),
      reponame: decodeURIComponent(route.params.reponame),
      repobranch: decodeURIComponent(route.params.repobranch),
    }),
  },
  
];
