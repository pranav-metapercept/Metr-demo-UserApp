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
    path: "/docmanager/details",
    component: ProjectDetail,
    name: "ProjectDetail",
  },
];
