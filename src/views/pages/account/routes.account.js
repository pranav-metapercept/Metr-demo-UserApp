// Import the Login and EmailVerification components from their respective files
import Login from "./login";
import EmailVerification from "./emailverification";

import ForgotPassword from "./forgotpassword";
import ResetPassword from "./resetpassword";

// Define an array of route objects
const routes = [
  {
    // Define the path for the Login route
    path: "/",
    component: Login,
    name: "Login",
    beforeEnter: (to, from, next) => {
      // Check if a token is stored in the local storage
      const token = localStorage.getItem("token");
      if (token) {
        // If a token is found, redirect the user to the dashboard
        next("/dashboard");
      } else {
        // If no token is found, allow navigation to the login page
        next();
      }
    },
  },
  {
    // Define the path for the EmailVerification route with a token parameter
    path: "/verify/:token",
    component: EmailVerification,
    name: "EmailVerification",
  },

  {
    // Forgot Password Route
    path: "/forgotpassword",
    component: ForgotPassword,
    name: "forgotpassword",
  },
  {
    // Reset Password Route
    path: "/resetpassword/:token",
    component: ResetPassword,
    name: "resetpassword",
  },
];

// Export the routes array for use in a Vue Router
export default routes;
