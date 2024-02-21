<template>
  <Layout>
    <div class="row">
      <div class="col-md-8">
        <div class="card-body">
          <!-- Project selection card -->
          <div class="card shadow-sm">
            <div
              class="custom-notifications d-flex justify-content-between align-items-center flex-wrap"
            >
              <div class="custom-title">
                Please fill in the following fields to proceed to DocPublisher
              </div>
              <div></div>
            </div>
            <div class="container">
              <form>
                <div class="form-group row">
                  <label class="col-md-12 col-form-label"
                    >Select Project<span class="text-danger">*</span></label
                  >
                  <div class="col-md-12">
                    <multiselect
                      style="width: 100%"
                      v-model="selectedproject"
                      :options="projectList.map((item) => item.projectName)"
                      placeholder="Choose a Project"
                      class="custom-multiselect"
                      :max-height="250"
                    >
                    </multiselect>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-12 col-form-label"
                    >Select Branch<span class="text-danger">*</span></label
                  >
                  <div class="col-md-12">
                    <multiselect
                      v-model="selectedBranch"
                      :options="repobranchesdata.map((item) => item.text)"
                      placeholder="Choose a Project"
                      :max-height="250"
                    >
                    </multiselect>
                  </div>
                </div>
                <div class="row from-group">
                  <div class="col-md-12">
                    <button
                      type="submit"
                      class="btn btn-primary mb-3 btn-sm"
                      @click.prevent="
                        selectedproject !== '' &&
                          setdata(selectedProjectOwner, selectedProjectName)
                      "
                    >
                      Proceed To DocPublisher
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import Layout from "../../layouts/main";
import { eventBus } from "../../../main";

export default {
  components: {
    Layout,
    Multiselect,
  },
  data() {
    return {
      selectedproject: "",
      userId: null,
      items: "",
      selectedProjectOwner: "",
      selectedProjectName: null,
      selectedBranch: "",
      projectList: [
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "6595132d7883623234585dba",
          projectId: "65950c567883623234585db8",
          projectName: "Flowers",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User1-Metapercept",
          githubEmail: "user1@metapercept.com",
          githubUserId: "123456789",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-01-03T06:13:10.000Z",
          updatedAt: "2024-01-03T07:56:29.087Z",
          __v: 0,
          owner: "owner1-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "6595132f7883623234585dbb",
          projectId: "65950c557883623234585db6",
          projectName: "It-Book",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User2-Metapercept",
          githubEmail: "user2@metapercept.com",
          githubUserId: "987654321",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-01-03T06:09:05.000Z",
          updatedAt: "2024-01-03T07:56:31.467Z",
          __v: 0,
          owner: "owner2-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "659513297883623234585db9",
          projectId: "65950c557883623234585db5",
          projectName: "QuantumQuill",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User3-Metapercept",
          githubEmail: "user3@metapercept.com",
          githubUserId: "135792468",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-01-03T05:34:46.000Z",
          updatedAt: "2024-01-03T07:56:25.394Z",
          __v: 0,
          owner: "owner3-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "659513327883623234585dbc",
          projectId: "65950c547883623234585db3",
          projectName: "SynthWave",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User4-Metapercept",
          githubEmail: "user4@metapercept.com",
          githubUserId: "246813579",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2023-09-25T05:15:25.000Z",
          updatedAt: "2024-01-03T07:56:34.467Z",
          __v: 0,
          owner: "owner4-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "659513357883623234585dbd",
          projectId: "65950c527883623234585da7",
          projectName: "DataDynamo",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User5-Metapercept",
          githubEmail: "user5@metapercept.com",
          githubUserId: "369258147",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2023-06-28T12:13:14.000Z",
          updatedAt: "2024-01-03T07:56:37.837Z",
          __v: 0,
          owner: "owner5-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "6595132d7883623234585dba",
          projectId: "65950c567883623234585db8",
          projectName: "PulseForge",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User6-Metapercept",
          githubEmail: "user6@metapercept.com",
          githubUserId: "987654321",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-01-03T06:13:10.000Z",
          updatedAt: "2024-01-03T07:56:29.087Z",
          __v: 0,
          owner: "owner6-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "6595132f7883623234585dbb",
          projectId: "65950c557883623234585db6",
          projectName: "InfinityForge",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User7-Metapercept",
          githubEmail: "user7@metapercept.com",
          githubUserId: "123456789",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-01-03T06:09:05.000Z",
          updatedAt: "2024-01-03T07:56:31.467Z",
          __v: 0,
          owner: "owner7-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "659513297883623234585db9",
          projectId: "65950c557883623234585db5",
          projectName: "MysticMinds",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User8-Metapercept",
          githubEmail: "user8@metapercept.com",
          githubUserId: "135792468",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-01-03T05:34:46.000Z",
          updatedAt: "2024-01-03T07:56:25.394Z",
          __v: 0,
          owner: "owner8-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "659513327883623234585dbc",
          projectId: "65950c547883623234585db3",
          projectName: "TechTrove",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User9-Metapercept",
          githubEmail: "user9@metapercept.com",
          githubUserId: "246813579",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2023-09-25T05:15:25.000Z",
          updatedAt: "2024-01-03T07:56:34.467Z",
          __v: 0,
          owner: "owner9-metapercept",
        },
        {
          userRole: ["DocManager", "DocPublisher", "DocEditor", "DocMigration"],
          _id: "659513357883623234585dbd",
          projectId: "65950c527883623234585da7",
          projectName: "NebulaNexus",
          userId: "6595087f7883623234585d6f",
          githubUsername: "User10-Metapercept",
          githubEmail: "user10@metapercept.com",
          githubUserId: "369258147",
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
          createdAt: "2023-06-28T12:13:14.000Z",
          updatedAt: "2024-01-03T07:56:37.837Z",
          __v: 0,
          owner: "owner10-metapercept",
        },
      ],
      repobranchesdata: [
        {
          name: "dev",
          commit: {
            sha: "0f85dd8b02bdfec3673ed8cd81135d1a622f8bda",
            url: "https://api.github.com/repos/Vedantika-DITAxPresso/DITAOT-2/commits/0f85dd8b02bdfec3673ed8cd81135d1a622f8bda",
          },
          protected: false,
        },
        {
          name: "main",
          commit: {
            sha: "0f85dd8b02bdfec3673ed8cd81135d1a622f8bda",
            url: "https://api.github.com/repos/Vedantika-DITAxPresso/DITAOT-2/commits/0f85dd8b02bdfec3673ed8cd81135d1a622f8bda",
          },
          protected: false,
        },
      ].map((element) => ({
        value: element.name,
        text: element.name,
      })),
      title: "DocPublisher",
      item: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "DocPublisher",
          active: true,
        },
      ],
    };
  },

  created() {
    eventBus.$emit("update-sidebar", "menuitems.docpublisher.text");
  },
  computed: {
    isButtonDisabled() {
      return this.selectedProjectName === null || this.selectedBranch === "";
    },
    hasData() {
      return this.repobranchesdata.length > 0;
    },
  },
  methods: {
    ...mapActions({
      get: "userProjectDetails",
    }),
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    setdata(owner, projectName) {
      this.redirectProject(owner, projectName);
    },
    getProjectData() {
      this.$store.getters.client
        .get(`/projectuser/byuserid?userId=${this.userId}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            // Filter projects for the user role "DocPublisher"
            this.projectList = response.data.filter((project) =>
              project.userRole.includes("DocPublisher")
            );
            // Commit the complete project data to the Vuex store
            console.log(response.data);
          } else {
            // Handle the case where the response data is not an array
            this.messageToast(
              "Error",
              "danger",
              "Received invalid project data from the server"
            );
          }
        })
        .catch((error) => {
          // Handle the error by showing a message or performing other error handling actions
          this.messageToast(
            "Error",
            "danger",
            error.response
              ? error.response.data.message
              : "An error occurred while fetching project data."
          );
        });
    },
    async redirectProject() {
      this.$router.push({
        path: `/docpublisher`,
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
          // Handle errors here
          this.messageToast(
            "invalid request",
            "danger",
            error.response.data.message
          );
        })
        .finally(() => {});
    },
  },
  // watch: {
  //     selectedproject(newVal) {
  //         const selectedProject = this.projectList.find((item) => item.projectName === newVal);
  //         this.selectedProjectOwner = selectedProject.owner;
  //         this.selectedProjectName = selectedProject.projectName;
  //         this.repobranchesdata = [],
  //             this.getRepoBranch();
  //     },
  // },
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
