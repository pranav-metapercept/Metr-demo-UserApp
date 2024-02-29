<template>
  <div>
    <!-- Progress Modal -->
    <b-modal
      id="modal-progress"
      ref="modaloutputprogress"
      title="Processing"
      title-class="font-18"
      hide-header
      hide-footer
      hide-close
      no-close-on-backdrop
      no-close-on-esc
    >
      <strong>Please wait</strong>
      <br />
      <p>loading . . .</p>
      <b-progress :value="75" :max="100" animated></b-progress>
    </b-modal>
    <!-- Commit Modal -->
    <b-modal
      id="modal-commit"
      v-model="showModal"
      ref="modalcommit"
      title="Commit Output"
      title-class="font-18"
      hide-header
      hide-footer
      hide-close
      no-close-on-backdrop
      no-close-on-esc
    >
      <div>
        <b-form-group label="Commit Message">
          <b-form-input for="text" v-model="commitMsg"></b-form-input>
        </b-form-group>
        <button class="btn btn-primary btn-sm" v-on:click="commitOutput()">
          Commit
        </button>
      </div>
    </b-modal>
    <div v-if="hideform" class="row justify-content-center">
      <div class="col-md-6">
        <div class="bg-primary text-white"></div>
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-4">Project Name : Flowers</h5>
            <div class="mb-2" v-if="disabledownloadbutton">
              Important! Commit changes to download the output.
            </div>
            <div class="d-flex justify-content-end pt-1">
              <button
                class="btn btn-primary btn-sm mr-2 mb-2"
                :disabled="disablecommitbutton"
                @click.prevent="githubCommit"
              >
                <span class="d-flex align-items-center">
                  <span> Commit on GitHub </span>
                </span></button
              ><button
                @click="downloadFolder()"
                class="btn btn-light btn-sm mr-2 mb-2"
                :disabled="disabledownloadbutton"
              >
                <span class="d-flex align-items-center">
                  <span
                    v-if="isLoading"
                    class="spinner-border spinner-border-sm"
                    role="status"
                  >
                  </span>
                  <span v-if="!isLoading"> Download Output </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Conditional HR -->

    <div v-if="!hideform" class="card">
      <div class="card-body">
        <form novalidate @submit.prevent>
          <!-- Title Input -->
          <div class="form-group">
            <label>Title <span class="text-secondary">*</span></label>
            <input
              v-validate="'required'"
              required
              v-model="typeform.releaseTitle"
              @keydown.space="preventLeadingSpace"
              name="releaseTitle"
              type="text"
              id="releaseTitle"
              class="form-control"
              placeholder="Enter release title"
              :class="{
                'is-invalid': submitted && $v.releaseTitle.$error,
              }"
            />
            <p
              class="text-danger text-sm"
              v-show="
                errors.has('releaseTitle') &&
                _.find(errors.items, { field: 'releaseTitle' }).rule ==
                  'required'
              "
            ></p>
          </div>
          <!-- Input Source Dropdown -->
          <div class="form-group">
            <label
              >Input Source Ditamap <span class="text-secondary">*</span></label
            >
            <div>
              <select
                class="form-control"
                v-validate="'required'"
                required
                v-model="typeform.inputPath"
              >
                <option value="" disabled selected>
                  Select source Ditamap
                </option>
                <option
                  v-for="data in selectInput"
                  :key="data.path"
                  :value="data.path"
                >
                  {{ data.fileName }}
                </option>
              </select>
              <p
                class="text-danger text-sm"
                v-show="
                  errors.has('typeform.inputPath') &&
                  $v.typeform.inputPath.required
                "
              >
                <span>Input Format selection is required</span>
              </p>
            </div>
          </div>
          <!-- Output Format Dropdown -->
          <div class="form-group">
            <label>Output Format <span class="text-secondary">*</span></label>
            <div>
              <select
                class="form-control"
                v-validate="'required'"
                required
                v-model="typeform.outputFormat"
              >
                <option value="" disabled selected>Select output format</option>
                <option
                  v-for="data in selectOutputFormat"
                  :key="data.id"
                  :value="data.transtype"
                >
                  {{ data.transtype }}
                </option>
              </select>
              <p
                class="text-danger text-sm"
                v-show="
                  errors.has('typeform.outputFormat') &&
                  $v.typeform.outputFormat.required
                "
              >
                <span>Output Format selection is required</span>
              </p>
            </div>
          </div>
          <!-- Buttons for Generating Output and Resetting Form -->
          <div class="form-group text-right mb-0">
            <div>
              <button
                :disabled="
                  !(
                    typeform.outputFormat &&
                    typeform.inputPath &&
                    typeform.releaseTitle
                  )
                "
                class="btn btn-sm btn-primary"
                v-on:click="generateOutputFun(projectPath, workspacePath)"
              >
                Transform
              </button>
              <button
                @click="resetform"
                class="btn btn-light btn-sm m-l-5 ml-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- Pull Request Modal -->
    <b-modal
      ref="pull-modal"
      hide-footer
      hide-header
      hide-close
      no-close-on-backdrop
      no-close-on-escer
    >
      <div class="d-block text-center">
        <h3>
          Sync to update.
          <br />
          You are getting slow! Sync now to baseline with the source code.
        </h3>
      </div>
      <hr class="my-2" />
      <button class="btn btn-primary btn-sm" block @click="createPullreq()">
        Pull Repository
      </button>
    </b-modal>
  </div>
</template>

<script>
import _ from "lodash";
import Swal from "sweetalert2";
import axios from "axios";
import { eventBus } from "../../../../../main";

export default {
  props: {
    ditaotVersion: String,
  },
  data() {
    return {
      userId: null,
      orgId: null,
      isLoading: false,
      userName: null,
      typeform: {
        inputPath: "",
        outputPath: "",
        outputFormat: "",
        releaseTitle: "",
      },
      selectInput: [
        {
          fileName: "introduction.ditamap",
          path: "/home/pranav-metapercept/DITAxPressoWorkspace/6595087f7883623234585d6f/ditamap-01/Chapter1/introduction.ditamap",
        },
      ],
      projectName: null,
      repouser: null,
      brachName: null,
      selectOutputFormat: [
        {
          _id: "63da59c14f68a337a4ef3637",
          type: "pdf",
          name: "DITA-OT PDF",
          packageName: "org.dita.pdf2",
          transtype: "pdf",
          description: "Basic PDF output",
          company: "www.dita-ot.org",
          createdAt: "2023-02-01T12:23:29.895Z",
          __v: 0,
        },
        {
          _id: "63da5a284f68a337a4ef3638",
          type: "html",
          name: "DITA-OT HTML",
          packageName: "org.dita.html5",
          transtype: "html5",
          description: "Basic HTML5 output",
          company: "www.dita-ot.org",
          createdAt: "2023-02-01T12:25:12.010Z",
          __v: 0,
        },
      ],
      submitted: false,
      projectPath: null,
      typesubmit: false,
      workspacePath: null,
      disablebutton: false,
      disablecommitbutton: true,
      disabledownloadbutton: true,
      commitMsg: null,
      hideform: false,
      showModal: false,
      model: "",
      releaseParams: null,
    };
  },
  created() {
    this.hideform = false;
  },
  mounted() {
    this.hideform = false;
  },
  computed: {
    _() {
      return _;
    },
  },
  methods: {
    preventLeadingSpace(e) {
      // only prevent the keypress if the value is blank
      if (!e.target.value) e.preventDefault();
      // otherwise, if the leading character is a space, remove all leading white-space
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },

    createPullreq() {
      this.$store.getters.client
        .post(
          `/orguser/workspace/pullGitChanges?projectName=${this.projectName}`
        )
        .then(() => {
          this.$store.getters.client
            .get(`/orguser/workspace/filecontent?path=${this.currentfilePath}`)
            .then((res) => {
              eventBus.$emit("getcontent", {
                content: res.data,
                path: this.currentfilePath,
              });
              eventBus.$emit("textViewContent", {
                content: res.data,
                path: this.currentfilePath,
              });
              eventBus.$emit("clearHistory");
            })
            .catch(() => {});
          this.$refs["pull-modal"].hide();

          this.messageToast("Success", "success", "Pull request completed");
        })
        .catch((err) => {
          this.messageToast(
            "Error",
            "danger",
            err.response
              ? err.response.data.message
              : "An error occurred during the pull request."
          );
        });
    },
    async getWorkspace() {
      await this.$store.getters.client
        .get(`/orguser/workspace/byuserId?userId=${this.userId}`)
        .then(async (res) => {
          let path = res.data.installedPath + `/${this.projectName}`;
          this.workspacePath = res.data.installedPath;
          this.projectPath = res.data.installedPath + "/" + this.projectName;
          await this.$store.getters.client
            .post(`/orguser/workspace/fetchGitRemoteChanges?path=${path}`)
            .then((res) => {
              if (
                res.data.message.includes("please pull your branch to proceed")
              ) {
                this.$refs["pull-modal"].show();
              }
            });
          let ext = "ditamap";
          await this.$store.getters.client
            .get(`/orguser/workspace/inputfiles?path=${path}&extenssion=${ext}`)
            .then((res) => {
              this.selectInput = res.data;
            })
            .catch(() => {});
          await this.$store.getters.client
            .get(`/orguser/workspace/repotree?path=${path}`)
            .then((tres) => {
              this.model = tres.data;
            })
            .catch(() => {});
        })
        .catch(() => {});
    },

    async generateOutputFun() {
      this.disablebutton = true;
      this.releaseParams = {
        ditaMapFileName: this.typeform.inputPath.split("/").pop(),
        outputFormat: this.typeform.outputFormat,
        ditaotVersion: this.ditaotVersion,
        orgId: this.orgId,
        userId: this.userId,
        releaseTitle: this.typeform.releaseTitle,
        releasedBy: this.userName,
        projectName: this.projectName,
      };
      this.messageToast("Success", "success", "Output generated successfully!");
      this.disablebutton = false;
      setTimeout(() => {
        this.typeform.inputPath = null;
        this.hideform = true;
        this.typeform.outputFormat = null;
        this.disablecommitbutton = false;
        this.typeform.releaseTitle = null;
      }, 1000);
    },
    commitOnGithub() {
      this.showModal = true;
    },
    githubCommit() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-primary btn-sm mr-2",
          cancelButton: "btn btn-light btn-sm",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Add description to submit and commit.",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Submit",
          showLoaderOnConfirm: true,
          confirmButtonColor: "#556ee6",
          cancelButtonColor: "#f46a6a",
          preConfirm: (commitMsg) => {
            return new Promise((resolve, reject) => {
              if (commitMsg.trim() === "") {
                reject(new Error("Please enter a commit message."));
              } else {
                resolve(commitMsg);
              }
            });
          },
          allowOutsideClick: false,
          inputValidator: (value) => {
            return value.trim() !== ""
              ? undefined
              : "Please enter a commit message.";
          },
        })
        .then(({ value: commitMsg }) => {
          if (commitMsg !== undefined) {
            swalWithBootstrapButtons.fire({
              title: "Commit request in progress...",
              allowOutsideClick: false,
            });
            swalWithBootstrapButtons.fire({
              icon: "success",
              title: "Commit request completed.",
            });
            this.disabledownloadbutton = false;
          }
        });
    },

    resetform() {
      this.typeform.inputPath = "";
      this.typeform.outputFormat = "";
      this.typeform.releaseTitle = "";
    },
    downloadFolder() {
      const downloadUrl = "https://demo-download-server.vercel.app/download";
      this.isLoading = true; // Set loading state to true

      // Make the request to download the file
      axios
        .get(downloadUrl, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          // Display success message using SweetAlert
          this.showSuccessAlert();

          // Create a blob from the response data
          const blob = new Blob([response.data], {
            type: "application/zip",
          });

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
  },
};
</script>

<style scoped>
label {
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(23, 35, 61, 1);
}
</style>
