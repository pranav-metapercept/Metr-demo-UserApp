<template>
  <div>
    <Layout>
      <!-- Page header component with title and icon -->
      <PageHeader
        :icon="'ri-dashboard-line h3'"
        :title="title"
        :items="items"
      />
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <div class="mr-2 dita-ot-cont px-1">
            <span class="dita-ot">DITA-OT Version:</span>
            <span class="dita-ot-version ml-2">4.3.2</span>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-4 bg-white">
          <div
            class="custom-notifications d-flex justify-content-between align-items-center flex-wrap"
          >
            <div class="custom-title mb-0">Output Screen</div>
          </div>

          <div class="card-body">
            <p class="mb-4">
              <span class="text-muted"> Source word file:</span>
              <span class="text-primary"> Angular.docx</span>
            </p>

            <div class="text-right pt-1">
              <!-- Button to download output as ZIP -->
              <button
                class="btn btn-sm btn-primary mr-2 mb-2 m-0"
                @click.prevent="downloadFolder"
              >
                <span
                  v-if="showSpinner"
                  class="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span class="sr-only">Downloading. Please wait.</span>
                </span>
                <span v-if="!showSpinner">Download as ZIP</span>
              </button>
              <!-- Button to commit output on GitHub -->
              <button
                class="btn btn-secondary btn-sm mb-2 m-0"
                @click="gitHubCommit"
              >
                Commit on GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import { eventBus } from "../../../../main";

import Layout from "../../../layouts/main";
import axios from "axios";

import Swal from "sweetalert2";
export default {
  components: {
    Layout,
  },
  data() {
    return {
      userId: null,
      orgId: null,
      ditaOtVersions: "4.3.2",
      showSpinner: false,

      title: "DocMigration",
      items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "DocMigration",
          active: true,
        },
      ],
    };
  },
  mounted() {
    // Emit an event to update the sidebar
    eventBus.$emit("update-sidebar", "menuitems.docmigration.text");
  },

  methods: {
    // Display a toast message
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    downloadFolder() {
      this.showSpinner = true;
      const downloadUrl =
        "https://demo-download-server.vercel.app/docmigration/download";

      // Make the request to download the file
      axios
        .get(downloadUrl, { responseType: "arraybuffer" })
        .then((response) => {
          this.showSuccessAlert();

          // Create a blob from the response data
          const blob = new Blob([response.data], { type: "application/zip" });

          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "angular.zip"; // Set the desired file name

          // Append the link to the body and trigger the download
          document.body.appendChild(link);
          link.click();

          // Remove the link from the body
          document.body.removeChild(link);
          this.showSpinner = false;
        })
        .catch((error) => {
          this.showSpinner = false;

          // Display error message using SweetAlert
          this.showErrorAlert(error);

          console.error("Error downloading ZIP file:", error);
        });
    },

    showSuccessAlert() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-primary btn-sm mr-2",
          cancelButton: "btn btn-light btn-sm",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons.fire({
        icon: "success",
        title: "Zip File Downloaded Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    showErrorAlert(error) {
      Swal.fire({
        icon: "error",
        title: "Download Error",
        text: `There was an error downloading the ZIP file: ${error.message}`,
        customClass: {
          confirmButton: "btn btn-danger btn-sm mr-2",
        },
        buttonsStyling: false,
      });
    },

    // Function to navigate to the GitHub commit screen
    gitHubCommit() {
      this.$router.push({
        path: `/docmigration/outputscreen/githubcommit`,
      });
    },
  },
};
</script>

<style scoped>
.custom-source {
  padding: 14px;
  gap: 24px;
}

.custom-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.5px;
  text-align: left;
  color: rgba(23, 35, 61, 1);
}

.project-name {
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: center;
  color: rgba(23, 35, 61, 1);
}

.dita-ot-cont {
  margin-top: 0.4rem;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
}

.dita-ot {
  color: rgba(23, 35, 61, 1);
}

.dita-ot-version {
  color: rgba(105, 111, 121, 1);
}

label {
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(23, 35, 61, 1);
}

.custom-notifications {
  padding: 14px;
  gap: 24px;
}

.custom-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.5px;
  text-align: left;
  color: rgba(23, 35, 61, 1);
}

.card-body {
  padding-top: 0rem;
}
</style>
