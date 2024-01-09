// Import the DocManager and ProjectDetail components from their respective files
import DocManager from "./index";
import ProjectDetail from "./details";
// Define an array of route objects
export default [
  {
    // Define a route for the DocManager component
    path: "/docmanager",
    component: DocManager,
    name: "DocManager",
  },
  {
    // Define a route for the ProjectDetail component with dynamic parameters
    path: "/docmanager/:repouser/:reponame",
    component: ProjectDetail,
    name: "ProjectDetail",
    props: (route) => ({
      // Decode and pass dynamic parameters from the URL as props to the component
      repouser: decodeURIComponent(route.params.repouser),
      reponame: decodeURIComponent(route.params.reponame),
    }),
  },
];
