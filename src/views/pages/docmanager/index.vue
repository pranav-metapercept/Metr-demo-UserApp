<template>
    <div>
        <!-- Page Header component -->
        <PageHeader :icon="'fas fa-clipboard-list'" :title="title" :items="item" />
        <!-- Modal for Workspace Setup -->
        <b-modal id="modal-progress" hide-header ref="modalprogress" title="Setting Up Your Workspace" title-class="font-18"
            hide-footer hide-close no-close-on-backdrop no-close-on-esc>
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
        <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" hide-header title-class="font-18"
            hide-footer hide-close no-close-on-backdrop no-close-on-esc>
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
                    <b-form-input class="w-100" v-model="search" placeholder="Search Projects"
                        @input="searchProject"></b-form-input>
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
                <b-modal hide-footer hide-close no-close-on-backdrop no-close-on-escer id="modal-standard" ref="modal"
                    title="Github Login" title-class="font-18">
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
                                    <button class="btn btn-primary btn-sm btn-block custom-button"
                                        @click="syncGithub">Login</button>
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



import {
    BRow,
    BCol,
    BPagination
} from "bootstrap-vue";

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

            appAccess: {},
            isLoading: false,
            orgGithubUser: "",
            orgAccessURL: "",
            userGithubUsername: "",
            projectList: [
                {
                    "userRole": [
                        "DocPublisher",
                        "DocManager",
                        "DocEditor",
                        "DocMigration"
                    ],
                    "_id": "651425e9fd88d58449853731",
                    "projectId": "651425b5fd88d5844985371f",
                    "projectName": "test-dita",
                    "userId": "6514252dfd88d584498536e7",
                    "githubUsername": "Vedantika-DITAxPresso",
                    "githubEmail": "vedantika.g@ditaxpresso.com",
                    "githubUserId": "102965209",
                    "acceptInvitation": false,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2023-09-27T12:54:01.054Z",
                    "updatedAt": "2023-09-27T12:54:01.054Z",
                    "__v": 0,
                    "owner": "Jyoti-Metapercept"
                },
                {
                    "userRole": [
                        "DocManager",
                        "DocPublisher",
                        "DocEditor"
                    ],
                    "_id": "65168cfa572e62500af31b68",
                    "projectId": "651425abfd88d58449853703",
                    "userId": "6514252dfd88d584498536e7",
                    "githubUsername": "Vedantika-DITAxPresso",
                    "githubEmail": "vedantika.g@ditaxpresso.com",
                    "githubUserId": "102965209",
                    "acceptInvitation": false,
                    "isActive": false,
                    "isDeleted": false,
                    "projectName": "nodejs-App",
                    "createdAt": "2023-09-29T08:38:18.215Z",
                    "updatedAt": "2023-09-29T08:38:18.215Z",
                    "__v": 0,
                    "owner": "Jyoti-Metapercept"
                }
            ]
            ,
            currentPage: parseInt(localStorage.getItem("currentPage")) || 1,
            progress: 0,
            perPage: 6,
            gitCode: null,
            search: "",
            projectListSearch: "",
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


    },
    methods: {

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
