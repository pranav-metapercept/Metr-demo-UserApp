// Import the Docpublisher and ProjectList components from their respective files
import Docpublisher from "./docpublisher.vue";
import ProjectList from "./projectlist.vue";

// Define an array of route objects
export default [
  {
    // Define a route for the Docpublisher component with dynamic parameters
    path: "/doceditor/docpublisher/:repouser/:reponame/:repobranch",
    component: Docpublisher,
    name: "Docpublisher",
    props: (route) => ({
      // Decode and pass dynamic parameters from the URL as props to the component
      repouser: decodeURIComponent(route.params.repouser),
      reponame: decodeURIComponent(route.params.reponame),
      repobranch: decodeURIComponent(route.params.repobranch),
    }),
  },
  {
    // Define a route for the ProjectList component
    path: "/doceditor",
    component: ProjectList,
    name: "DocEditor",
  },
];
