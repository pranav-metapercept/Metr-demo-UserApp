import DocPublisher from "./index";
import Projects from "./projects.vue";

export default [
  {
    path: "/docpublisher",
    component: DocPublisher,
    name: "DocPublisher",
   
  },
  {
    path: "/docpublisher/projectlist",
    component: Projects,
    name: "Projects",
    
  },
  
];
