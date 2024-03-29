<template>
  <div>
    <Layout>
      <!-- Page header component with title and icon -->
      <PageHeader :title="title" :icon="'ri-dashboard-line h3'" :items="item" />
      <div>
        <div class="mr-2 dita-ot-cont px-1">
          <span class="dita-ot">DITA-OT Version:</span>
          <span class="dita-ot-version ml-2">4.3.2</span>
        </div>
      </div>
      <!-- Modal for committing output to GitHub -->
      <b-modal
        id="modal-commit"
        ref="modalcommit"
        title="Commit Output"
        title-class="font-18"
        hide-footer
        hide-close
        no-close-on-backdrop
        no-close-on-esc
      >
        <div>
          <b-form-group label="Commit Message">
            <b-form-input for="text" v-model="commitMsg"></b-form-input>
          </b-form-group>
          <button class="btn btn-sm btn-primary" v-on:click="commitOutput()">
            Commit on GitHub
          </button>
        </div>
      </b-modal>
      <!-- Modal for showing progress -->
      <b-modal
        id="modal-progress"
        ref="modaloutputprogress"
        title="Processing"
        hide-header
        title-class="font-18"
        hide-footer
        hide-close
        no-close-on-backdrop
        no-close-on-esc
      >
        <strong>Please wait</strong>
        <br />
        <p>loading . . .</p>
        <b-progress
          :value="progress"
          :max="100"
          class="custom-progress"
        ></b-progress>
      </b-modal>
      <div class="row justify-content-center">
        <div class="col-md-4 bg-white">
          <!-- GitHub commit form -->
          <div
            class="custom-notifications d-flex justify-content-between align-items-center flex-wrap"
          >
            <div class="custom-title mb-0">Github Commit</div>
          </div>

          <div class="card-body">
            <label>Select Project<span class="text-danger">*</span></label>

            <!-- Multiselect for project selection -->
            <multiselect
              v-model="selectedproject"
              :options="projectList.map((item) => item.projectName)"
              placeholder="Choose a Project"
              :max-height="100"
            >
            </multiselect>

            <div class="text-right pt-1">
              <!-- Buttons for committing and syncing projects -->
              <button
                type="submit"
                class="btn btn-primary btn-sm mr-2"
                @click.prevent="syncprojects"
              >
                Sync Projects
              </button>
              <button
                :disabled="!disabledCommit"
                type="submit"
                class="btn btn-secondary btn-sm"
                @click.prevent="commitOutput"
              >
                Commit on Github
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import _ from "lodash";
import Multiselect from "vue-multiselect";
import Layout from "../../../layouts/main";
import Swal from "sweetalert2";

import { eventBus } from "../../../../main";

export default {
  components: {
    Layout,
    Multiselect,
  },
  props: {
    items: Object,
  },
  data() {
    return {
      ditaOtVersions: "4.3.2",
      progress: 0,
      selectedproject: "",
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
      ], // List of user projects
      commitMsg: null,
      userId: null,
      orgId: null,
      disabledCommit: false,
      title: "DocMigration",
      item: [
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
  computed: {
    _() {
      return _;
    },
    isCommitButtonDisabled() {
      return this.commitMsg.length === 0;
    },
  },
  watch: {
    selectedproject: function (newVal) {
      if (newVal) {
        this.disabledCommit = true;
      } else {
        this.disabledCommit = false;
      }
    },
  },
  mounted() {
    // Emit an event to update the sidebar
    eventBus.$emit("update-sidebar", "menuitems.docmigration.text");
    // this.getprojectslist()
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

    // Fetch the list of projects
    getprojectslist() {
      const projects = [
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
      ]; // List of user projects;
      this.projectlist = projects.map((project) => ({
        value: project.projectName,
        text: project.projectName,
      }));
    },
    // Show the GitHub commit modal
    gitHubCommit() {
      this.$refs["modalcommit"].show();
    },
    // Commit the selected output to GitHub
    commitOutput() {
      this.progress = 0;
      const targetProgress = 100;
      const totalTime = 5000;
      const increment = (targetProgress / totalTime) * 50;
      const intervalId = setInterval(() => {
        if (this.progress < targetProgress) {
          this.progress += increment;
        } else {
          clearInterval(intervalId);
        }
      }, 50);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-primary btn-sm mr-2",
          cancelButton: "btn btn-light btn-sm",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Submit Commit Message to commit on Github",
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
            this.showCommitBtn = false;
            swalWithBootstrapButtons.fire({
              icon: "success",
              title: "Commit request completed successfully!",
            });
            this.$router.push({
              path: `/docmigration`,
            });
            (this.commitMsg = null), (this.selectedproject = "");
          }
        });
    },
    // Sync projects with GitHub
    syncprojects() {
      Swal.fire({
        icon: "success",
        title: "Project sync successfully!",
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

.btn-primary {
  background-color: #2b313f !important;
  color: #fff !important;
  transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #4c5aa7 !important;
}

.custom-progress {
  height: 5px;
}

.card-body {
  padding-top: 0rem;
}
</style>
