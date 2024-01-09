<template>
  <div>
    <!-- PageHeader component with dynamic properties -->
    <PageHeader :title="title" :icon="'ri-file-edit-fill h2'" :items="item" />
    <!-- Main content -->
    <div class="row">
      <div class="col-md-8">
        <div class="card-body">
          <!-- Project selection card -->
          <div class="card shadow-sm">
            <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
              <div class="custom-title">
                Please fill in the following fields to proceed to docEditor
              </div>

            </div>
            <div class="container">
              <form>
                <!-- Select Project -->
                <div class="form-group row">
                  <label class="col-md-12 col-form-label">Select Project<span class="text-danger">*</span></label>
                  <div class="col-md-12">
                    <!-- Multiselect for project selection -->
                    <multiselect style="width: 100%" v-model="selectedproject"
                      :options="projectList.map((item) => item.projectName)" placeholder="Choose a Project"
                      class="custom-multiselect"></multiselect>
                  </div>
                </div>
                <!-- Select Branch (visible only when there is data) -->
                <div class="form-group row">
                  <label class="col-md-12 col-form-label">Select Branch<span class="text-danger">*</span></label>
                  <div class="col-md-12">
                    <!-- Multiselect for branch selection -->
                    <multiselect v-model="selectedBranch" :options="repobranchesdata.map((item) => item.text)"
                      placeholder="Choose a Branch"></multiselect>
                  </div>
                </div>
                <!-- Proceed to Editor Button -->
                <div class="row form-group">
                  <div class="col-md-12">
                    <!-- Button to proceed to the editor with conditions -->
                    <button type="submit" class="btn btn-primary btn-sm"
                      :disabled="isButtonDisabled || selectedproject === ''" @click.prevent="
                        setdata(selectedProjectOwner, selectedProjectName)
                        ">
                      Proceed To DocEditor
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import { eventBus } from "../../../main";
import CryptoJS from "crypto-js";
import { secretKey } from "../../../api/global.env";
import encryptionModule from "../../../components/functions";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      selectedproject: "",
      userId: null,
      items: "",
      selectedBranch: "",
      selectedProjectOwner: "",
      selectedProjectName: null,
      projectList: [
        {
          "userRole": [
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
          ],
          "_id": "6595132d7883623234585dba",
          "projectId": "65950c567883623234585db8",
          "projectName": "learning",
          "userId": "6595087f7883623234585d6f",
          "githubUsername": "Jyoti-Metapercept",
          "githubEmail": "jyotikamal.s@metapercept.com",
          "githubUserId": "124129047",
          "acceptInvitation": false,
          "isActive": true,
          "isDeleted": false,
          "createdAt": "2024-01-03T06:13:10.000Z",
          "updatedAt": "2024-01-03T07:56:29.087Z",
          "__v": 0,
          "owner": "pranav-metapercept"
        },
        {
          "userRole": [
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
          ],
          "_id": "6595132f7883623234585dbb",
          "projectId": "65950c557883623234585db6",
          "projectName": "ditamap-01",
          "userId": "6595087f7883623234585d6f",
          "githubUsername": "Jyoti-Metapercept",
          "githubEmail": "jyotikamal.s@metapercept.com",
          "githubUserId": "124129047",
          "acceptInvitation": false,
          "isActive": true,
          "isDeleted": false,
          "createdAt": "2024-01-03T06:09:05.000Z",
          "updatedAt": "2024-01-03T07:56:31.467Z",
          "__v": 0,
          "owner": "pranav-metapercept"
        },
        {
          "userRole": [
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
          ],
          "_id": "659513297883623234585db9",
          "projectId": "65950c557883623234585db5",
          "projectName": "it-book",
          "userId": "6595087f7883623234585d6f",
          "githubUsername": "Jyoti-Metapercept",
          "githubEmail": "jyotikamal.s@metapercept.com",
          "githubUserId": "124129047",
          "acceptInvitation": false,
          "isActive": true,
          "isDeleted": false,
          "createdAt": "2024-01-03T05:34:46.000Z",
          "updatedAt": "2024-01-03T07:56:25.394Z",
          "__v": 0,
          "owner": "pranav-metapercept"
        },
        {
          "userRole": [
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
          ],
          "_id": "659513327883623234585dbc",
          "projectId": "65950c547883623234585db3",
          "projectName": "EnableXSmoothDoc",
          "userId": "6595087f7883623234585d6f",
          "githubUsername": "Jyoti-Metapercept",
          "githubEmail": "jyotikamal.s@metapercept.com",
          "githubUserId": "124129047",
          "acceptInvitation": false,
          "isActive": true,
          "isDeleted": false,
          "createdAt": "2023-09-25T05:15:25.000Z",
          "updatedAt": "2024-01-03T07:56:34.467Z",
          "__v": 0,
          "owner": "gurupawar05"
        },
        {
          "userRole": [
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
          ],
          "_id": "659513357883623234585dbd",
          "projectId": "65950c527883623234585da7",
          "projectName": "DocEditorResearech",
          "userId": "6595087f7883623234585d6f",
          "githubUsername": "Jyoti-Metapercept",
          "githubEmail": "jyotikamal.s@metapercept.com",
          "githubUserId": "124129047",
          "acceptInvitation": false,
          "isActive": true,
          "isDeleted": false,
          "createdAt": "2023-06-28T12:13:14.000Z",
          "updatedAt": "2024-01-03T07:56:37.837Z",
          "__v": 0,
          "owner": "Jyoti-Metapercept"
        }
      ],
      repobranchesdata: [
        {
          "name": "dev",
          "commit": {
            "sha": "0f85dd8b02bdfec3673ed8cd81135d1a622f8bda",
            "url": "https://api.github.com/repos/Vedantika-DITAxPresso/DITAOT-2/commits/0f85dd8b02bdfec3673ed8cd81135d1a622f8bda"
          },
          "protected": false
        },
        {
          "name": "main",
          "commit": {
            "sha": "0f85dd8b02bdfec3673ed8cd81135d1a622f8bda",
            "url": "https://api.github.com/repos/Vedantika-DITAxPresso/DITAOT-2/commits/0f85dd8b02bdfec3673ed8cd81135d1a622f8bda"
          },
          "protected": false
        }
      ].map((element) => ({
        value: element.name,
        text: element.name,
      }))
      ,
      title: "DocEditor",
      item: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "DocEditor",
          active: true,
        },
      ],
    };
  },
  mounted() {
    // Emit event to update the sidebar
    eventBus.$emit("update-sidebar", "menuitems.doceditor.text");
  },

  computed: {
    // Determine if the button should be disabled based on conditions
    isButtonDisabled() {
      return this.selectedproject === null || this.selectedBranch === "";
    },
    // Check if there is data in repobranchesdata
    hasData() {
      return this.repobranchesdata.length > 0;
    },
  },
  methods: {
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    ...mapActions({
      get: "userProjectDetails",
    }),
    getProjectData() {
      // Fetch user's projects and set projectList
      this.$store.getters.client
        .get(`/projectuser/byuserid?userId=${this.userId}`)
        .then((response) => {
          this.projectList = response.data.filter((project) =>
            project.userRole.includes("DocEditor")
          );
          this.$store.commit("setProjectsList", response.data);
        });
    },
    setdata(owner, projectName) {
      this.redirectProject(owner, projectName);
    },
    async redirectProject(repouser, reponame) {
      // Encrypt and encode data for the URL, then redirect
      const encryptedRepouser = encryptionModule.encrypt(repouser);
      const encryptedReponame = CryptoJS.AES.encrypt(
        reponame,
        secretKey
      ).toString();
      const encryptedBranch = CryptoJS.AES.encrypt(
        this.selectedBranch,
        secretKey
      ).toString();
      localStorage.setItem("repouser", encryptedRepouser);
      localStorage.setItem("reponame", encryptedReponame);
      const encodedRepouser = encodeURIComponent(encryptedRepouser);
      const encodedReponame = encodeURIComponent(encryptedReponame);
      const encodedBranch = encodeURIComponent(encryptedBranch);
      this.$router.push({
        path: `/doceditor/${encodedRepouser}/${encodedReponame}/${encodedBranch}`,
      });
    },
    async getRepoBranch() {

      this.$store.getters.client
        .get(
          `orguser/repobranches?repoUser=${this.selectedProjectOwner}&repoName=${this.selectedProjectName}`
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            let length = response.data.length - 1;
            this.brachName = response.data[length].name;
            this.selectedBranch = response.data[0].name;
            this.repobranchesdata = response.data.map((element) => ({
              value: element.name,
              text: element.name,
            }));
          } else {
            // Handle the case when the response is empty or does not contain branches.
            this.messageToast(
              "invalid request",
              "danger",
              "No branches found in the Project."
            );
          }
        })
        .catch((error) => {
          // Handle errors here, e.g., show an error message or log the error.
          this.messageToast(
            "invalid request",
            "danger",
            error.response.data.message
          );
        })
        .finally(() => {

        });
    },
  },
  watch: {
    selectedproject(newVal) {
      // When the selected project changes, update related data
      const selectedProject = this.projectList.find(
        (item) => item.projectName === newVal
      );
      this.selectedProjectOwner = selectedProject.owner;
      this.selectedProjectName = selectedProject.projectName;
      this.repobranchesdata = [];
      this.getRepoBranch();
    },
  },
};
</script>
<style scoped>
label {
  font-weight: 400;
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

.custom-multiselect .multiselect__content-wrapper {
  max-height: 100px !important;
  overflow-y: auto !important;
}

.custom-multiselect .multiselect__content {
  max-height: 100px !important;
}
</style>
