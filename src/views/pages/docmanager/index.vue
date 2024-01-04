<template>
<div>
    <!-- Page Header component -->
    <PageHeader :icon="'fas fa-clipboard-list'" :title="title" :items="item" />
    <!-- Modal for Workspace Setup -->
    <b-modal id="modal-progress" hide-header ref="modalprogress" title="Setting Up Your Workspace" title-class="font-18"  hide-footer hide-close no-close-on-backdrop no-close-on-esc>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Setting Up Your Workspace</h5>
                <!-- Checkbox for DITA-OT -->
                <div class="custom-control custom-checkbox mb-3">
                    <input type="checkbox" class="custom-control-input" id="customCheck1" disabled checked />
                    <label class="custom-control-label" for="customCheck1">DITA-OT</label>
                </div>
                <!-- Checkbox for Projects -->
                <div class="custom-control custom-checkbox mb-3">
                    <input type="checkbox" class="custom-control-input" id="customCheck2" disabled checked />
                    <label class="custom-control-label" for="customCheck2">Projects</label>
                </div>
                <!-- Progress bar for setup progress -->
                <b-progress :value="75" :max="100" animated></b-progress>
            </div>
        </div>
    </b-modal>
    <!-- Modal for Processing -->
    <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" hide-header title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
        <strong>Please wait</strong>
        <br />
        <p>loading . . .</p>
        <!-- Progress bar for processing progress -->
        <b-progress :value="progress" :max="100" class="custom-progress"></b-progress>
    </b-modal>
    <div class="row">
        <div class="col-md-3 col-sm-12 mb-0">
            <div class="d-flex align-items-center mb-1">
                <!-- Input for searching projects -->
                <b-form-input class="w-100" v-model="search" placeholder="Search Projects" @input="searchProject"></b-form-input>
            </div>
        </div>
        <div class="col-md-9 col-sm-12">
            <div class="d-flex align-items-center justify-content-end mb-1">
                <!-- Button to refresh projects -->
                <button class="btn btn-primary btn-sm custom-button" @click.prevent="syncprojects">
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
                <b-col cols="12" md="6" lg="6" v-for="item in paginatedProjectList" :key="item.id">
                    <projectcard :items="item" />
                </b-col>
            </b-row>
            <!-- Pagination for project list -->
            <div class="d-flex justify-content-end">
                <b-pagination v-model="currentPage" :total-rows="this.projectList.length" :per-page="perPage" />
            </div>
        </div>
    </div>
    <!-- GitHub Login Modal -->
    <div>
        <div class="my-4 text-center">
            <b-modal hide-footer hide-close no-close-on-backdrop no-close-on-escer id="modal-standard" ref="modal" title="Github Login" title-class="font-18">
                <div class="row">
                    <div class="col-lg-12">
                        <b-card no-body class="text-center">
                            <b-card-body>
                                <!-- GitHub login image -->
                                <img src="@/assets/images/github/Octocat.png" height="200" />
                                <b-card-title>
                                    <h4 class="card-title">Connect with GitHub</h4>
                                </b-card-title>
                                <b-card-text>
                                    To access the project using GitHub, you need to log in to GitHub.
                                </b-card-text>
                                <!-- Button to initiate GitHub login -->
                                <button class="btn btn-primary btn-sm btn-block custom-button" @click="syncGithub">Login</button>
                            </b-card-body>
                        </b-card>
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</div>
</template>
<script>
import projectcard from "./components/projectcard";
import CryptoJS from "crypto-js";
import {
    mapActions
} from "vuex";

import {
    BRow,
    BCol,
    BPagination
} from "bootstrap-vue";
import {
    URL,
    ClientId,
    InstalledPath
} from "@/api/global.env.js";
import {
    eventBus
} from "../../../main";
import {
    secretKey
} from "../../../api/global.env";
export default {
    components: {
        projectcard,
        BRow,
        BCol,
        BPagination,
      
    },
    data() {
        return {
            title: "Projects",
            item: [{
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
            clientId: `${ClientId}`,
            appAccess: {},
            isLoading: false,
            orgGithubUser: "",
            orgAccessURL: "",
            userGithubUsername: "",
            projectList: [],
            currentPage: parseInt(localStorage.getItem("currentPage")) || 1,
            progress: 0,
            perPage: 6,
            gitCode: null,
            search: "",
            projectListSearch: "",
        };
    },
    created() {
        eventBus.$emit("update-sidebar", "menuitems.docmanager.text");
        this.gitToken = this.$store.state.Auth.gitToken;
        this.orgId = this.$store.state.Auth.orgId;
        this.userId = this.$store.state.Auth.userId;
        this.userGithubUsername = JSON.parse(CryptoJS.AES.decrypt(
            localStorage.getItem("githubUsername"),
            secretKey
        ).toString(CryptoJS.enc.Utf8));
        if (this.$store.state.Auth.projectsData.length) {
            this.projectList = this.$store.state.Auth.projectsData;
            this.projectListSearch = this.$store.state.Auth.projectsData;
        } else {
            this.getProjectData();
        }
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
        this.getToken();
        this.getfoldertree()
        if (
            this.gitToken === "" ||
            this.gitToken === null ||
            this.gitToken === "null" ||
            this.gitToken === undefined ||
            this.gitToken === "undefined"
        ) {
            if (!window.location.search.includes("code")) this["$refs"].modal.show();
        }
    },
    methods: {
        ...mapActions({
            get: "userProjectDetails"
        }),
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
        searchProject() {
            if (this.search) {
                this.projectList = this.projectListSearch.filter((prct) => {
                    return prct.projectName.toLowerCase().includes(this.search);
                });
            } else {
                this.projectList = this.projectListSearch;
            }
        },
        async getfoldertree() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            await this.$store.getters.client
                .get(
                    `/orguser/workspace/byuserId?userId=${this.$store.state.Auth.userId}`
                )
                .then((res) => {
                    loader.hide()
                  this.$store.commit("setWorkspaceStatus", res.data)
                })
                .catch(() => { });
        },
        // This method is use to validate get token using github api
        async getToken() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const gitCode = urlParams.get("code");
            this.gitCode = gitCode;
            if (!gitCode) {
                return;
            }
            this["$refs"].modal.hide();
            const loader = this.$loading.show({
                loader: "dots",
            });
            await this.getOrgDetails();
            this.$store.getters.client
                .get(`/orguser/github/success?code=${gitCode}`)
                .then((res) => {
                    this.$store.commit("updateGitToken", {
                        gitToken: res.data.access_token,
                    });
                    if (res.data.userData.login) {
                        let domainVerify = null;
                        let githubUserNameVerify = null;
                        if (res.data.userData.email) {
                            let gitUrlSplitArr = res.data.userData.email.split("@");
                            domainVerify = gitUrlSplitArr[1];
                            githubUserNameVerify = res.data.userData.login;
                        }
                        if (domainVerify === this.orgAccessURL && githubUserNameVerify === this.userGithubUsername) {
                            if (res.data.access_token !== null && res.data.access_token !== "") {
                                this.gitToken = res.data.access_token;
                                this.username = res.data.userData.login;
                            }
                            if(this.$store.state.Auth.isWorkspaceCreated){
                                return
                            }
                            if (res.data.access_token !== "") {
                                let workspaceParams = {
                                    userId: this.$store.state.Auth.userId,
                                    orgId: this.$store.state.Auth.orgId,
                                    packeges: ["DITAOt-3.6", "Custom plugin"],
                                    installedPath: `${InstalledPath}`,
                                    isInstalled: true,
                                };
                                this.$refs["modalprogress"].show();
                                this.$store.getters.client
                                    .post(`/orguser/workspace?orgId=${this.$store.state.Auth.orgId}`, workspaceParams)
                                    .then(() => {
                                        this.$store.commit("setWorkspaceStatus" , true)
                                        this.$refs["modalprogress"].hide();
                                        this.messageToast("Workspace Created", "success", "Workspace Created Successfully");
                                    })
                                    .catch(() => {
                                        this.isLoading = false;
                                    });
                            }
                        } else {
                            this.messageToast("Invalid Email", "danger", "You have to log in to GitHub using your organization email");
                            setTimeout(() => {
                                localStorage.setItem("gitToken", null);
                                window.location.href = `${URL}docmanager`;
                            }, 4000);
                        }
                    } else {
                        this.messageToast("Invalid response", "danger", "Received an invalid response from the server");
                    }
                })
                .catch((err) => {
                    this.messageToast("Error", "danger", err.response ? err.response.data.message : "An error occurred");
                })
                .finally(() => {
                    loader.hide();
                });
        },
        async getOrgDetails() {
            // loading is enabled until organization details are fetched
            this.isLoading = true;
            // Try request to get organization details
            this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.orgId}`)
                .then((res) => {
                    if (res.data) {
                        // If the response contains data, consider it a successful response and update the data
                        this.appAccess = res.data[0];
                        const str = res.data[0].orgGithubURL;
                        // Split orgGithubURL using a forward slash
                        const gitUrlSplitArr = str.split("/");
                        // The array github URL split initializes data variables
                        this.orgGithubUser = gitUrlSplitArr[3];
                        this.orgAccessURL = res.data[0].accessURL;
                    } else {
                        // Handle other errors, e.g., data is null or not as expected
                        this.messageToast("Invalid request", "danger", "An error occurred");
                    }
                    // loading is disabled once organization details are fetched
                    this.isLoading = false;
                })
                .catch((err) => {
                    // Handle network issues or unexpected errors
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                    // loading is disabled if an error occurs while fetching organization details
                    this.isLoading = false;
                });
        },
        syncprojects() {
            this.progress = 0;
            let body = {
                userId: this.userId,
                orgId: this.orgId,
                gitToken: this.$store.state.Auth.gitToken,
            };
            const progressInterval = setInterval(() => {
                if (this.progress < 100) {
                    this.progress += 50;
                }
            }, 1000);
            this.$refs["modaloutputprogress"].show();
            this.$store.getters.client
                .put(`/orguser/workspace/sync`, body)
                .then(() => {
                    clearInterval(progressInterval); // Stop the progress interval
                    setTimeout(() => {
                        this.$refs["modaloutputprogress"].hide();
                        this.selectedproject = "";
                        this.messageToast(
                            "Success",
                            "success",
                            "Sync complete! Your project is up-to-date."
                        );
                    }, 2000);
                })
                .catch((err) => {
                    clearInterval(progressInterval); // Stop the progress interval
                    this.$refs["modaloutputprogress"].hide();
                    this.messageToast(
                        "Error",
                        "danger",
                        err.response ?
                        err.response.data.message :
                        "An error occurred while syncing your project. Please try again later or contact our support team for assistance."
                    );
                });
        },
        async getProjectData() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client
                .get(`/projectuser/byuserid?userId=${this.userId}`)
                .then((response) => {
                    if (response.data) {
                        this.projectList = response.data;
                        this.projectListSearch = response.data;
                        this.$store.commit("setProjectsData", response.data);
                    } else {
                        this.messageToast("Invalid request", "danger", "An error occurred");
                    }
                    loader.hide();
                })
                .catch((err) => {
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                    loader.hide();
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
