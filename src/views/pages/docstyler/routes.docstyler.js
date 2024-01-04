import styler from "./index.vue";
import PdfDocPublisher from './pdfstyler/components/docpublisher.vue'
import HtmlDocPublisher from './htmlstyler/components/docpublisher.vue'
export default [
  {
    path: "/docstyler/:repouser/:reponame/:repobranch",
    component: styler,
    name: "styler",
    props: (route) => ({
      repouser: decodeURIComponent(route.params.repouser),
      reponame: decodeURIComponent(route.params.reponame),
      repobranch: decodeURIComponent(route.params.repobranch),
    }),
  },
  {
    path: "/pdfdocstyler/docpublisher/:repouser/:reponame/:repobranch",
    component: PdfDocPublisher,
    name: "PdfDocPublisher",
    props: (route) => ({
      repouser: decodeURIComponent(route.params.repouser),
      reponame: decodeURIComponent(route.params.reponame),
      repobranch: decodeURIComponent(route.params.repobranch),
    }),
  },
  {
    path: "/htmldocstyler/docpublisher/:repouser/:reponame/:repobranch",
    component: HtmlDocPublisher,
    name: "HtmlDocPublisher",
    props: (route) => ({
      repouser: decodeURIComponent(route.params.repouser),
      reponame: decodeURIComponent(route.params.reponame),
      repobranch: decodeURIComponent(route.params.repobranch),
    }),
  },
];