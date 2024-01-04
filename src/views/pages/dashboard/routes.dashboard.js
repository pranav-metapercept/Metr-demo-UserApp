// Import the Dashboard component from its respective file
import Dashboard from "./index";

// Define an array with a single route object for the dashboard
export default [
  {
    // Define the path for the Dashboard route
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
  },
];
