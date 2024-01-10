// Import necessary components and libraries
import DocMigration from "../docmigration/index.vue";
import PopUpMessage from "./components/popupmessage.vue";
import outputscreen from "./components/outputscreen.vue";
import githubcommit from "./components/githubcommit.vue";

// Define the secret key used for encryption and decryption

// Define an array of route objects
export default [
  {
    // Define a route for the DocMigration component
    path: "/docmigration",
    component: DocMigration,
    name: "DocMigration",
    
  },
  {
    // Define a route for the PopUpMessage component
    path: "/noaccess",
    component: PopUpMessage,
    name: "PopUpMessage",
  },
  {
    // Define a route for the outputscreen component with dynamic parameters
    path: "/docmigration/outputscreen/:selectedfolder",
    component: outputscreen,
    name: "outputscreen",
   
  },
  {
    // Define a route for the githubcommit component with dynamic parameters
    path: "/docmigration/outputscreen/githubcommit/:selectedfolder",
    component: githubcommit,
    name: "githubcommit",
    props: (route) => ({
      repouser: decodeURIComponent(route.params.selectedfolder),
    }),
  },
];
