// Import necessary components and libraries
import DocMigration from "../docmigration/index.vue";
import PopUpMessage from "./components/popupmessage.vue";
import outputscreen from "./components/outputscreen.vue";
import githubcommit from "./components/githubcommit.vue";
import axios from "axios";
import { URL } from "@/api/global.env.js";
import CryptoJS from "crypto-js";
import { secretKey } from "@/api/global.env.js";
// Define the secret key used for encryption and decryption

// Define an array of route objects
export default [
  {
    // Define a route for the DocMigration component
    path: "/docmigration",
    component: DocMigration,
    name: "DocMigration",
    beforeEnter: (to, from, next) => {
      // Before entering this route, fetch user data from the API
      const decryptData = (encryptedData) => {
        try {
          const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          return decryptedData;
        } catch (error) {
          return null;
        }
      };
      const userId = decryptData(localStorage.getItem("userId"));
      axios
        .get(`${URL}api/orguser/details?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${decryptData(
              localStorage.getItem("token")
            )}`,
            sessionId: decryptData(localStorage.getItem("sessionId")),
            userId: decryptData(localStorage.getItem("userId")),
            orgId: decryptData(localStorage.getItem("orgId")),
          },
        })
        .then((res) => {
          if (res.data && res.data.userRole.includes("DocMigration")) {
            // If the user has the DocMigration role, allow access to this route
            next();
          } else {
            // If the user does not have the DocMigration role, disable this route
            next(false);
          }
        })
        .catch(() => {
          // Handle an error fetching user data from the API

          next(false); // Disable this route
        });
    },
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
