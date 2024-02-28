<template>
  <div>
    <!-- Navbar -->
    <div class="custom-bg">
      <b-navbar toggleable="md" type="light" class="m-0 p-0">
        <!-- Brand Logo -->
        <div class="navbar-brand-box bg-white text-center">
          <!-- Dark logo -->
          <div class="logo logo-dark">
            <!-- Dark version of the logo -->
            <span class="logo-sm">
              <!-- Small logo for mobile view -->
              <img
                src="@/assets/images/metr-logo.svg"
                alt
                class="logo-image-sm"
              />
            </span>
            <span class="logo-lg">
              <!-- Large logo for desktop view -->
              <img
                src="@/assets/images/metr-logo.svg"
                alt
                class="logo-image-lg"
              />
            </span>
          </div>
          <!-- Light logo -->
          <div class="logo logo-light bg-white">
            <!-- Light version of the logo -->
            <span class="logo-sm">
              <img
                src="@/assets/images/metr-logo.svg"
                alt
                class="logo-image-sm"
              />
            </span>
            <span class="logo-lg">
              <img
                src="@/assets/images/metr-logo.svg"
                alt
                class="logo-image-lg"
              />
            </span>
          </div>
        </div>
        <!-- Navbar Toggle Button -->
        <b-navbar-toggle
          target="nav-collapse"
          type="button"
          class="btn btn-sm px-3 font-size-24 header-item waves-effect"
          id="vertical-menu-btn"
        >
          <i class="ri-menu-2-line align-middle"></i>
        </b-navbar-toggle>
        <!-- Navbar Collapse (Navigation) -->
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <div class="d-flex align-items-center ml-2">
              
              <div class="d-flex align-items-center mr-2"></div>
              <div class="d-flex align-items-center mr-1">
                <button
                  type="button"
                  class="btn btn-sm header-item noti-icon waves-effect"
                  @click="initFullScreen"
                >
                  <i class="ri-fullscreen-line"></i>
                </button>
              </div>
              <b-dropdown
                right
                variant="black"
                toggle-class="header-item"
                class="d-inline-block user-dropdown"
              >
                <template v-slot:button-content>
                  <img
                    class="rounded-circle header-profile-user"
                    src="@/assets/images/users/avatar-2.jpg"
                    alt="Header Avatar"
                  />
                  <span class="d-none d-xl-inline-block ml-1">{{
                    $t("navbar.dropdown.kevin.text")
                  }}</span>
                  <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                </template>

                <a class="dropdown-item text-danger" href="/logout">
                  <i
                    class="ri-shut-down-line align-middle mr-1 text-danger"
                  ></i>
                  {{ $t("navbar.dropdown.kevin.list.signout") }}
                </a>
              </b-dropdown>
            </div>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
// Import required modules and libraries
import Swal from "sweetalert2";

import i18n from "../../../../i18n";

export default {
  data() {
    return {
      isOnline: navigator.onLine,
      ditaOtVersions: "4.3.2",

      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "spanish",
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      current_language: "en",
    };
  },
  created() {
    // Add event listeners for online and offline status
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  destroyed() {
    // Clean up event listeners when the component is destroyed
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },

  methods: {
    // Handler for the "Go Back" button
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    updateOnlineStatus() {
      // Update the 'isOnline' data property based on the current navigator status
      this.isOnline = navigator.onLine;
      if (!navigator.onLine) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-primary btn-sm mr-2",
            cancelButton: "btn btn-light btn-sm",
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons.fire({
          icon: "error",
          title: "Oops...",
          text: "Sorry, you are offline. Please check your internet connection and try again later.",
        });
      }
    },
    logOut() {
      this.$store.commit("removeToken");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      this.$router.push("/");
      this.$router.push({
        name: "Login",
      });
    },
    // Toggle menu
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    // Initialize full screen mode
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    setLanguage(locale) {
      i18n.locale = locale;
      this.current_language = i18n.locale;
    },
  },
};
</script>

<style scoped>
.logo-image-sm {
  width: 36px;
  height: auto;
}

.logo-image-lg {
  width: 4rem;
  height: auto;
}

.logo-text {
  font-size: 13px;
  color: white;
}

a {
  cursor: pointer;
}

.custom-bg {
  background-color: #fff;
}

.logo-img {
  width: auto;
  height: auto;
}

@media screen and (max-width: 280px) {
  .btn {
    font-size: 8px;
    margin-top: 5px;
  }

  .font-size-15 {
    font-size: 10px !important;
  }
}
</style>
