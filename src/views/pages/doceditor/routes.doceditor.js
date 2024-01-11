// Import the Docpublisher and ProjectList components from their respective files

import ProjectList from "./projectlist.vue";

// Define an array of route objects
export default [
  
  {
    // Define a route for the ProjectList component
    path: "/doceditor/projectlist",
    component: ProjectList,
    name: "DocEditorProjectList",
  },
];
