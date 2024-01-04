<template>
<div>
    <!-- Page header component with title and icon -->
    <PageHeader :title="title" :icon="'ri-dashboard-line h3'" :items="item" />
    <div>
          
            <div class="mr-2 dita-ot-cont px-1 ">
                <span class="dita-ot">DITA-OT Version:</span>
                <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
            </div>
        </div>
    <!-- Modal for committing output to GitHub -->
    <b-modal id="modal-commit" ref="modalcommit" title="Commit Output" title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
        <div>
            <b-form-group label="Commit Message">
                <b-form-input for="text" v-model="commitMsg"></b-form-input>
            </b-form-group>
            <button class="btn btn-sm  btn-primary" v-on:click="commitOutput()">
                Commit on GitHub
            </button>
        </div>
    </b-modal>
    <!-- Modal for showing progress -->
    <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" hide-header title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
        <strong>Please wait</strong>
        <br />
        <p>loading . . .</p>
        <b-progress :value="progress" :max="100" class="custom-progress"></b-progress>
    </b-modal>
    <div class="row justify-content-center">
        <div class="col-md-4 bg-white">
            <!-- GitHub commit form -->
            <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
                <div class="custom-title mb-0">
                    Github Commit
                </div>
            </div>

            <div class="card-body">

                <label>Select Project<span class="text-danger">*</span></label>

                <!-- Multiselect for project selection -->
                <multiselect v-model="selectedproject" :options="projectlist.map(item => item.text)" placeholder="Choose a Project">
                </multiselect>

                <div class="text-right pt-1">
                    <!-- Buttons for committing and syncing projects -->
                    <button type="submit" class="btn btn-primary btn-sm mr-2 " @click.prevent="syncprojects">
                        Sync Projects
                    </button>
                    <button :disabled="!disabledCommit" type="submit" class="btn btn-secondary btn-sm " @click.prevent="commitOutput">
                        Commit on Github
                    </button>
                    
                </div>

            </div>

        </div>
    </div>
</div>
</template>

<script>
import _ from "lodash";
import Multiselect from "vue-multiselect";
import {
    mapActions
} from "vuex";
import Swal from "sweetalert2";

import {
    eventBus
} from '../../../../main';
import {
    mapGetters
} from 'vuex';
import CryptoJS from "crypto-js";
import {
    secretKey
} from "../../../../api/global.env";
export default {
    components: {

        Multiselect
    },
    props: {
        items: Object,
    },
    data() {
        return {
            ditaotVersion: '',
            progress: 0,
            selectedproject: "",
            projectlist: [],
            commitMsg: null,
            userId: this.$store.state.Auth.userId,
            orgId: this.$store.state.Auth.orgId,
            disabledCommit: false,
            title: "DocMigration",
            item: [{
                    text: "Dashboard",
                    href: "/"
                },
                {
                    text: "DocMigration",
                    active: true
                }
            ],
        };
    },
    computed: {
        _() {
            return _;
        },
        isCommitButtonDisabled() {
            return this.commitMsg.length === 0
        },
        ...mapGetters(['ditaOtVersions']),
    },
    watch: {
        selectedproject: function (newVal) {
            if (newVal) {
                this.disabledCommit = true;
            } else {
                this.disabledCommit = false;
            }
        }
    },
    mounted() {
        // Emit an event to update the sidebar
        eventBus.$emit('update-sidebar', "menuitems.docmigration.text");
        this.getprojectslist()
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
        // Call the 'get' action to fetch project details
        ...mapActions({
            get: "userProjectDetails"
        }),
        // Fetch the list of projects
        getprojectslist() {
            let loader = this.$loading.show({
                loader: "dots"
            });
            this.$store.getters.client.get(`/orguser/wordToDita/syncedprojects?orgId=${this.orgId}&userId=${this.userId}`)
                .then(response => {
                    if (response.data && Array.isArray(response.data)) {
                        response.data.forEach((ele) => {
                            this.projectlist.push({
                                value: ele.projectName,
                                text: ele.projectName,
                            });
                        });
                    } else {
                        this.messageToast("Error", "danger", "Received invalid data from the server");
                    }
                    loader.hide();
                })
                .catch(error => {
                    this.messageToast("Error", "danger", error.response ? error.response.data.message : "An error occurred while fetching project names.");
                    loader.hide();
                });
        },
        // Show the GitHub commit modal
        gitHubCommit() {
            this.$refs["modalcommit"].show();
        },
        // Commit the selected output to GitHub
        commitOutput() {
            this.progress = 0
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
                    cancelButton: "btn btn-light btn-sm"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
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
                    return value.trim() !== "" ? undefined : "Please enter a commit message.";
                },
            }).then(({
                value: commitMsg
            }) => {
                if (commitMsg !== undefined) {
                    let body = {
                        commitMessage: commitMsg,
                        userId: this.userId,
                        orgId: this.orgId,
                        commitFolderName: this.selectedproject,
                        ditaFolderName: CryptoJS.AES.decrypt(this.$route.params.selectedfolder, secretKey).toString(CryptoJS.enc.Utf8)
                    }
                    swalWithBootstrapButtons.fire({
                        title: "Commit request in progress...",
                        allowOutsideClick: false,
                        onOpen: () => {
                            Swal.showLoading();
                        },
                    });
                    this.$store.getters.client
                        .post(`/orguser/wordToDita/commitDitaFiles`, body)
                        .then((res) => {
                            this.showCommitBtn = false;
                            swalWithBootstrapButtons.fire({
                                icon: 'success',
                                title: "Commit request completed successfully!",
                                text: res.data.message || res.data,
                            });
                            this.$router.push({
                                path: `/docmigration`,
                            });
                            this.commitMsg = null,
                                this.selectedproject = ""
                        })
                        .catch((err) => {
                            swalWithBootstrapButtons.fire({
                                icon: 'error',
                                title: "Commit failed!",
                                text: err.response.data.message,
                            });
                            this.commitMsg = null,
                                this.selectedproject = ""
                        });
                }
            });
        },
        // Sync projects with GitHub
        syncprojects() {
            this.progress = 0;
            let body = {
                "userId": this.userId,
                "orgId": this.orgId,
                gitToken: this.$store.state.Auth.gitToken
            }
            setInterval(() => {
                if (this.progress < 100) {
                    this.progress += 50;
                }
            }, 1000);
            this.$refs["modaloutputprogress"].show();
            this.$store.getters.client.put(`/orguser/workspace/sync`, body).then(() => {
                setTimeout(() => {
                    this.$refs["modaloutputprogress"].hide();
                    this.selectedproject = ""
                    this.messageToast(
                        "Success",
                        "success",
                        "Sync complete! Your projects are up-to-date."
                    )
                }, 2000)
            }).catch(() => {
                setTimeout(() => {
                    this.$refs["modaloutputprogress"].hide();
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        "Sorry, we were unable to sync your projects at this time. Please check your network connectivity and try again. If the issue persists, please contact our technical support team for further assistance."
                    )
                }, 1000);
            })
        }
    }
}
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
    ;
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
    ;
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

.card-body{
    padding-top: 0rem;
}
</style>
