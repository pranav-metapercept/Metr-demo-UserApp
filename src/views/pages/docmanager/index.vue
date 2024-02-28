<template>
  <div>
    <Layout>
      <!-- Page Header component -->
      <PageHeader
        :icon="'fas fa-clipboard-list'"
        :title="title"
        :items="item"
      />
      <!-- Modal for Workspace Setup -->
      <b-modal
        id="modal-progress"
        hide-header
        ref="modalprogress"
        title="Setting Up Your Workspace"
        title-class="font-18"
        hide-footer
        hide-close
        no-close-on-backdrop
        no-close-on-esc
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Setting Up Your Workspace</h5>
            <!-- Checkbox for DITA-OT -->
            <div class="custom-control custom-checkbox mb-3">
              <input
                type="checkbox"
                class="custom-control-input"
                id="customCheck1"
                disabled
                checked
              />
              <label class="custom-control-label" for="customCheck1"
                >DITA-OT</label
              >
            </div>
            <!-- Checkbox for Projects -->
            <div class="custom-control custom-checkbox mb-3">
              <input
                type="checkbox"
                class="custom-control-input"
                id="customCheck2"
                disabled
                checked
              />
              <label class="custom-control-label" for="customCheck2"
                >Projects</label
              >
            </div>
            <!-- Progress bar for setup progress -->
            <b-progress :value="75" :max="100" animated></b-progress>
          </div>
        </div>
      </b-modal>
      <!-- Modal for Processing -->
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
        <!-- Progress bar for processing progress -->
        <b-progress
          :value="progress"
          :max="100"
          class="custom-progress"
        ></b-progress>
      </b-modal>
      <div class="row">
        <div class="col-md-3 col-sm-12 mb-0">
          <div class="d-flex align-items-center mb-1">
            <!-- Input for searching projects -->
            <b-form-input
              class="w-100"
              v-model="search"
              placeholder="Search Projects"
              @input="searchProject"
            ></b-form-input>
          </div>
        </div>
        <div class="col-md-9 col-sm-12">
          <div class="d-flex align-items-center justify-content-end mb-1">
            <!-- Button to refresh projects -->
            <button
              class="btn btn-primary btn-sm custom-button"
              @click.prevent="syncprojects"
            >
              <span class="custom-icon">
                <i class="mdi mdi-folder-refresh mdi-16px"></i>
              </span>
              <span class="custom-text ml-2">Refresh</span>
            </button>
          </div>
        </div>
      </div>
      <!-- Project Cards -->
      <div class="row">
        <div class="col-xl-12">
          <b-row class="mt-4">
            <b-col
              cols="12"
              md="6"
              lg="6"
              v-for="item in paginatedProjectList"
              :key="item.id"
            >
              <projectcard :items="item" />
            </b-col>
          </b-row>
          <!-- Pagination for project list -->
          <div class="d-flex justify-content-end">
            <b-pagination
              v-model="currentPage"
              :total-rows="this.projectList.length"
              :per-page="perPage"
            />
          </div>
        </div>
      </div>
      <!-- GitHub Login Modal -->
      <div>
        <div class="my-4 text-center">
          <b-modal
            hide-footer
            hide-close
            no-close-on-backdrop
            no-close-on-escer
            id="modal-standard"
            ref="modal"
            title="Github Login"
            title-class="font-18"
          >
            <div class="row">
              <div class="col-lg-12">
                <b-card no-body class="text-center">
                  <b-card-body>
                    <!-- GitHub login image -->
                    <img
                      src="@/assets/images/github/Octocat.png"
                      height="200"
                    />
                    <b-card-title>
                      <h4 class="card-title">Connect with GitHub</h4>
                    </b-card-title>
                    <b-card-text>
                      To access the project using GitHub, you need to log in to
                      GitHub.
                    </b-card-text>
                    <!-- Button to initiate GitHub login -->
                    <button
                      class="btn btn-primary btn-sm btn-block custom-button"
                      @click="syncGithub"
                    >
                      Login
                    </button>
                  </b-card-body>
                </b-card>
              </div>
            </div>
          </b-modal>
        </div>
      </div>
    </Layout>
  </div>
</template>
<script>
import projectcard from "./components/projectcard";

import Layout from "../../layouts/main";
import { eventBus } from "../../../main";
import { BRow, BCol, BPagination } from "bootstrap-vue";

export default {
  components: {
    Layout,
    projectcard,
    BRow,
    BCol,
    BPagination,
  },
  data() {
    return {
      title: "Projects",
      item: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Projects",
          active: true,
        },
      ],
      gitToken: null,
      projectData: null,

      appAccess: {},
      isLoading: false,
      orgGithubUser: "",
      orgAccessURL: "",
      userGithubUsername: "",
      projectListSearch: [], // Array to store the original project list data for searching
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

      currentPage: parseInt(localStorage.getItem("currentPage")) || 1,
      progress: 0,
      perPage: 6,
      gitCode: null,
      search: "",
    };
  },

  computed: {
    paginatedProjectList() {
      if (this.projectList === null) {
        return []; // return empty array if projectList is null
      }
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.projectList.slice(startIndex, endIndex);
    },
  },
  watch: {
    currentPage(newVal) {
      localStorage.setItem("currentPage", newVal);
    },
  },
  mounted() {
    eventBus.$emit("update-sidebar", "menuitems.docmanager.text");
  },
  methods: {
    initializeProjectListSearch() {
      this.projectListSearch = [...this.projectList];
    },
    syncprojects() {
      this.messageToast("Success", "primary", "Sync complete");
    },

    // Method to filter project list based on search input
    searchProject() {
      if (!this.projectListSearch.length) {
        // Initialize projectListSearch if it's empty
        this.initializeProjectListSearch();
      }
      if (this.search.trim() !== "") {
        // Perform search filtering
        this.projectList = this.projectListSearch.filter((project) =>
          project.projectName
            .toLowerCase()
            .includes(this.search.trim().toLowerCase())
        );
      } else {
        // Reset projectList to the original data if search input is empty
        this.projectList = [...this.projectListSearch];
      }
    },

    syncGithub() {
      window.location.href = `${this.clientId}`;
    },
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    makeToast(variant = null) {
      this.$bvToast.toast("Toast body content", {
        title: `Toast ${variant || "default"}`,
        variant: variant,
        solid: true,
      });
    },
  },
};
</script>
<style scoped>
.custom-control-label {
  cursor: default;
}

.custom-button {
  display: inline;
  float: right;
  margin-left: auto;
}

.custom-icon {
  display: inline-block;
}

.custom-text {
  margin-left: 5px;
}

.custom-progress {
  height: 5px;
}
</style>
