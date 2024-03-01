<template>
  <div>
    <Layout>
      <!-- Page Header -->
      <PageHeader
        :icon="'ri-dashboard-line h3'"
        :title="title"
        :items="items"
      />
      <!-- Project Info -->
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <div class="mr-2 px-1">
            <span class="project-name">{{ projectName }}</span>
          </div>
          <div class="mr-2 dita-ot-cont px-1">
            <span class="dita-ot">DITA-OT Version:</span>
            <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
          </div>
        </div>
        <button
          class="btn btn-primary btn-sm"
          type="submit"
          @click="openEditor()"
        >
          <span class="d-flex align-items-center justify-content-center">
            <span>
              <i class="mdi mdi-file-edit mdi-16px"></i>
            </span>
            <span class="ml-2"> DocEditor </span>
          </span>
        </button>
      </div>
      <!-- Branches Dropdown -->
      <div class="row mb-2 mt-3">
        <label class="col-label ml-3"
          >Select Branch <span class="text-danger">*</span></label
        >
        <div class="col-lg-12">
          <select
            class="form-control"
            v-model="selected"
            placeholder="Select Branch"
          >
            <option value="" disabled>Please Choose Branch</option>
            <option
              v-for="(option, index) in repobranchesdata"
              :key="index"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
      <!-- Source and Target -->
      <div class="row">
        <!-- Source Section -->
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div
                        class="custom-source d-flex justify-content-between align-items-center flex-wrap"
                      >
                        <div class="custom-title mb-0">Source</div>
                      </div>
                      <div class="border-top">
                        <simplebar
                          v-if="treeData.length > 0"
                          class="mt-1 custom-jstree"
                        >
                          <v-jstree
                            :data="treeData"
                            multiple
                            allow-batch
                            whole-row
                            @item-click="itemClick"
                          ></v-jstree>
                        </simplebar>
                        <template v-else>
                          <div
                            class="d-flex justify-content-center align-items-center no-output-cont"
                          >
                            <div class="mb-5 no-output-div">
                              <img src="../../../assets/placeholder.png" />
                              <div class="no-output-text">
                                No output generated.
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div
                        class="custom-source d-flex justify-content-between align-items-center flex-wrap"
                      >
                        <div class="custom-title mb-0">Target</div>
                      </div>
                      <div class="border-top">
                        <div class="download-field" @click="downloadFolder">
                          <div
                            v-if="isLoading"
                            class="spinner-border text-primary"
                            role="status"
                          >
                            <span class="sr-only"
                              >Downloading. Please wait.</span
                            >
                          </div>

                          <div v-else class="download-btn">
                            <span>Download as Zip</span>

                            <img
                              class="downloadImg"
                              src="../../../assets/toolbarsvgs/download.svg"
                              alt="SVG Image"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import simplebar from "simplebar-vue";
import { eventBus } from "../../../main";
import axios from "axios";
import Layout from "../../layouts/main";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    simplebar,
  },

  data() {
    return {
      title: "DocManager",
      items: [
        {
          text: "Projects",
          href: `/docmanager`,
        },
        {
          text: "DocManager",
          active: true,
        },
      ],
      folderId: "AIzaSyC2b__m7MwoOp4U4HhMb0SsPtuyUlpmTHQ",
      clientID:
        "1081449377795-7ia93vfa3b4vr4ipbaeq168f7798pda4.apps.googleusercontent.com",
      clientSecret: "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",
      apiKey: "AIzaSyC2b__m7MwoOp4U4HhMb0SsPtuyUlpmTHQ",
      treeData: [
        {
          text: "output",
          children: [
            {
              text: "commonltr.css",
              children: [],
              sha: "b1ae8e04c6d6566bcd8a537b53fa3e38c3ded45d",
              icon: "ri-file-text-line",
              opened: false,
            },
            {
              text: "commonrtl.css",
              children: [],
              sha: "9a2784d5c76a981ec46a17b0ed7c5466960b8e62",
              icon: "ri-file-text-line",
              opened: true,
            },
            {
              text: "concepts",
              children: [
                {
                  text: "notices.html",
                  children: [],
                  sha: "10887a46b2c76c0f9dd23dc316c63a44e15358d7",
                  icon: "ri-file-text-line",
                  opened: true,
                },
                {
                  text: "taskbook-abstract.html",
                  children: [],
                  sha: "db2335bec9f62846dd5046e5d0b354f028fc65ae",
                  icon: "ri-file-text-line",
                  opened: true,
                },
                {
                  text: "images",
                  children: [
                    {
                      text: "image1.png",
                      children: [],
                      sha: "fd8b2a9e01c9c2f8c5cb66a2e0b9fb7c8a6a9c34",
                      icon: "ri-file-image-line",
                      opened: true,
                    },
                    {
                      text: "image2.png",
                      children: [],
                      sha: "a4d3f6e7bd1b632a5e3e1f9dca865dbd3a91b2f9",
                      icon: "ri-file-image-line",
                      opened: true,
                    },
                  ],
                  sha: "a97b8b3e77c61ec10f6c00289941a6c35f93aa3a",
                  opened: true,
                },
              ],
              sha: "7acb0578d41b82e31675bd021ef6d6c217fd76a8",
              opened: true,
            },
            {
              text: "index.html",
              children: [],
              sha: "31d8e2af8b5efc7b6549115306ec151edbbeebbf",
              icon: "ri-file-text-line",
              opened: true,
            },
            {
              text: "scripts",
              children: [
                {
                  text: "script1.js",
                  children: [],
                  sha: "e2f0f2c9b9b8e64138d3c3c17bf0f9e6c0c1d45e",
                  icon: "ri-file-code-line",
                  opened: true,
                },
                {
                  text: "script2.js",
                  children: [],
                  sha: "7d33c28a9a35df02a302a8ea096bc68e321163c5",
                  icon: "ri-file-code-line",
                  opened: true,
                },
              ],
              sha: "e5ef48a85c02bca4a1f575438a9d3e4a6a1b3d7d",
              opened: true,
            },
          ],
          sha: "70e5166a1c141760286f9d3413c7288e3165efc7",
          opened: true,
        },
      ],
      selected: "",
      repobranchesdata: [
        { value: "main", text: "main" },
        { value: "deployment", text: "deployment" },
        { value: "production", text: "production" },
      ],
      ditaotVersion: "",
      projectName: null,
      repouser: null,

      isLoading: false,
      downloadURL: "",
      brachName: "main",
      urlParserRegex: /^[/]([^/]+)[/]([^/]+)[/]tree[/]([^/]+)[/](.*)/,
      outputURL: null,
      gitToken: null,
      isDocEditor: null,
      isDocPublisher: null,
      editor: ClassicEditor,
      editorData: null,
      editorLoader: false,
      modal: false,
      userId: null,
      ditaOtVersions: "4.3.2",
    };
  },
  async mounted() {
    eventBus.$emit("update-sidebar", "menuitems.docmanager.text");
  },
  methods: {
    async openEditor() {
      this.navigateToEditor();
    },
    navigateToEditor() {
      this.$router.push({
        path: `/doceditor`,
      });
    },
    downloadFolder() {
      const downloadUrl = "https://demo-download-server.vercel.app/download";
      this.isLoading = true; // Set loading state to true

      // Make the request to download the file
      axios
        .get(downloadUrl, { responseType: "arraybuffer" })
        .then((response) => {
          // Display success message using SweetAlert
          this.showSuccessAlert();

          // Create a blob from the response data
          const blob = new Blob([response.data], { type: "application/zip" });

          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "output.zip"; // Set the desired file name

          // Append the link to the body and trigger the download
          document.body.appendChild(link);
          link.click();

          // Remove the link from the body
          document.body.removeChild(link);

          // Reset loading state after successful download
          this.isLoading = false;
        })
        .catch((error) => {
          // Reset loading state in case of an error
          this.isLoading = false;

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
        title: "Downloaded successfull!",
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

    itemClick(node) {
      node.model;
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

.btabs-height {
  height: 100%;
}

/* Media query for Z Fold when the screen is folded */
@media screen and (max-width: 280px) {
  .font-size-15 {
    font-size: 8px !important;
  }
}

.card-body {
  padding: 5px 0px 5px 0px;
}

.custom-jstree {
  height: 60vh;
  padding-bottom: 5rem;
}

.source-card,
.target-card {
  height: 60vh;
}

.source-card .media-body,
.target-card .media-body {
  background: #007bff;
}

.no-output-cont {
  height: 60vh;
}

.no-output-text {
  color: #666;
  font-size: 20px;
}

.no-output-div {
  text-align: center;
}

.no-output {
  height: 60vh;
  text-align: center;
  color: #666;
  font-size: 20px;
}

.height-100 {
  height: 100% !important;
}

.gap-3 {
  gap: 0.75rem;
}

.pointer {
  cursor: pointer;
}

.custom-doceditor-btn {
  float: right;
}

.download-field {
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  height: 200px;
  margin-top: 2rem;
  margin: 2rem;
  border: 1.5px dashed rgba(15, 52, 96, 1);
  border-radius: 8px;
  background-color: rgba(113, 165, 203, 0.05);
}

.download-btn {
  text-align: center;
  cursor: pointer;
}

.download-text {
  display: block;
  font-size: 1.8rem;
  font-family: "Roboto";
}

.download-icon {
  display: block;
  height: zz;
  margin: 0 auto;
}

.downloadImg {
  display: block;
  margin: 0 auto;
  height: 64px;
  width: 64px;
}

.download-field .download-btn span {
  font-size: 24px;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 0.5px;
  text-align: center;
  color: rgba(23, 35, 61, 1);
}

img {
  height: 32px;
  margin-bottom: 0px;
}

/* Media query for Z Fold when the screen is folded */
@media screen and (max-width: 280px) {
  body {
    font-size: 15px;
  }

  .downloadImg {
    height: 5rem;
  }

  .btn {
    font-size: 10px;
    height: 20px;
    margin: 0;
    padding: 2px 4px;
  }

  .font-size-15 {
    font-size: 9px !important;
  }

  img {
    height: 200px;
  }
}
</style>
