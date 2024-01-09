<template>
    <div>
        <!-- Progress Modal -->
        <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-header
            hide-footer hide-close no-close-on-backdrop no-close-on-esc>
            <strong>Please wait</strong>
            <br />
            <p>loading . . .</p>
            <b-progress :value="75" :max="100" animated></b-progress>
        </b-modal>
        <!-- Commit Modal -->
        <b-modal id="modal-commit" v-model="showModal" ref="modalcommit" title="Commit Output" title-class="font-18"
            hide-header hide-footer hide-close no-close-on-backdrop no-close-on-esc>
            <div>
                <b-form-group label="Commit Message">
                    <b-form-input for="text" v-model="commitMsg"></b-form-input>
                </b-form-group>
                <button class="btn btn-primary btn-sm " v-on:click="commitOutput()">
                    Commit
                </button>
            </div>
        </b-modal>
        <div v-if="hideform" class="row justify-content-center">
            <div class="col-md-6">
                <div class=" bg-primary text-white"></div>
                <div class="card shadow-sm">
                    <div class="card-body">
                        <form>
                            <h5 class=" mb-4">Project Name : {{ projectName }}</h5>
                            <div>
                                Please note that the download button will become available only
                                after you make your commit. Thank you for your understanding.
                            </div>
                            <div class="d-flex justify-content-center pt-1">
                                <button v-on:click="openDownload()" class="btn btn-primary btn-sm  mr-2 mb-2"
                                    :disabled="disabledownloadbutton">
                                    <span class="d-flex align-items-center">
                                        <span>
                                            <i class="fas fa-file-archive mr-2"></i>
                                        </span>
                                        <span>
                                            Download Output
                                        </span>
                                    </span>
                                </button>
                                <button class="btn btn-primary btn-sm  mr-2 mb-2" :disabled="disablecommitbutton"
                                    @click.prevent="githubCommit">
                                    <span class="d-flex align-items-center">
                                        <span>
                                            <i class="fab fa-github mr-2"></i>
                                        </span>
                                        <span>
                                            Commit on GitHub
                                        </span>
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!hideform" class="card ">
            <div class="card-body">
                <form novalidate @submit.prevent>
                    <!-- Title Input -->
                    <div class="form-group">
                        <label>Title</label>
                        <input v-validate="'required'" required v-model="typeform.releaseTitle"
                            @keydown.space="preventLeadingSpace" name="releaseTitle" type="text" id="releaseTitle"
                            class="form-control" placeholder="Enter Release Title" :class="{
                                'is-invalid': submitted && $v.releaseTitle.$error,
                            }" />
                        <p class="text-danger text-sm" v-show="errors.has('releaseTitle') &&
                            _.find(errors.items, { field: 'releaseTitle' }).rule == 'required'
                            ">
                        </p>
                    </div>
                    <!-- Input Source Dropdown -->
                    <div class="form-group">
                        <label>Input Source Ditamap</label>
                        <div>
                            <select class="form-control" v-validate="'required'" required v-model="typeform.inputPath">
                                <option value="" disabled selected>Select Source Ditamap</option>
                                <option v-for="data in selectInput" :key="data.path" :value="data.path">{{ data.fileName }}
                                </option>
                            </select>
                            <p class="text-danger text-sm" v-show="errors.has('typeform.inputPath') &&
                                $v.typeform.inputPath.required
                                ">
                                <span>Input Format selection is required</span>
                            </p>
                        </div>
                    </div>
                    <!-- Output Format Dropdown -->
                    <div class="form-group">
                        <label>Output Format</label>
                        <div>
                            <select class="form-control" v-validate="'required'" required
                                v-model="selectedOutputFormatIndex">
                                <option value="" disabled selected>Select Output Format</option>
                                <option v-for="(data, index) in selectOutputFormat" :key="data.id" :value="index">{{
                                    data.transtype }}</option>
                            </select>
                            <p class="text-danger text-sm" v-show="errors.has('typeform.outputFormat') &&
                                $v.typeform.outputFormat.required
                                ">
                                <span>Output Format selection is required</span>
                            </p>
                        </div>
                    </div>
                    <!-- Buttons for Generating Output and Resetting Form -->
                    <div class="form-group mb-0">
                        <div>
                            <button :disabled="!(typeform.inputPath && typeform.releaseTitle)"
                                class="btn btn-sm  btn-primary" v-on:click="generateOutputFun(projectPath, workspacePath)">
                                Transform
                            </button>
                            <button @click="resetform" class="btn btn-primary btn-sm  m-l-5 ml-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
import Swal from "sweetalert2";
import checkurl from "../../../../components/urlvalidator";
import {
    eventBus
} from "../../../../main";
import CryptoJS from "crypto-js";
import {
    secretKey
} from "../../../../api/global.env";
export default {
    props: {
        ditaotVersion: String,
    },
    data() {
        return {
            userId: null,
            orgId: null,
            userName: null,
            typeform: {
                inputPath: "",
                outputPath: "",
                outputFormat: "",
                releaseTitle: "",
            },
            projectName: CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            repouser: CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            brachName: CryptoJS.AES.decrypt(
                this.$route.params.repobranch,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            selectInput: null,
            selectOutputFormat: null,
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
            ditaOtFolder: "",
            selectedOutputFormatIndex: "",
            releaseParams:null
        };
    },
    created() {
        this.getWorkspace();
        this.hideform = false;
    },
    mounted() {
        this.getoutputFormat();
        this.makedefaultplugin();
        this.hideform = false;
    },
    computed: {
        _() {
            return _;
        },
    },
    methods: {
        redirectToDocStyler() {
            const encryptedRepouser = CryptoJS.AES.encrypt(
                this.repouser,
                secretKey
            ).toString();
            const encryptedReponame = CryptoJS.AES.encrypt(
                this.projectName,
                secretKey
            ).toString();
            const encryptedBranch = CryptoJS.AES.encrypt(
                this.brachName,
                secretKey
            ).toString();
            const encodedRepouser = encodeURIComponent(encryptedRepouser);
            const encodedReponame = encodeURIComponent(encryptedReponame);
            const encodedBranch = encodeURIComponent(encryptedBranch);
            this.$router.push({
                path: `/docstyler/${encodedRepouser}/${encodedReponame}/${encodedBranch}`,
            });
        },
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
        validateURL() {
            const newRepoUser = CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8);
            const newRepoName = CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8);
            const oldRepoUser = localStorage.getItem("repouser");
            const oldRepoName = localStorage.getItem("reponame");
            if (newRepoName !== oldRepoName || newRepoUser !== oldRepoUser) {
                checkurl(newRepoName);
            }
        },
        createPullreq() {
           
            this.$store.getters.client
                .post(`/orguser/workspace/pullGitChanges?projectName=${this.projectName}`)
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
                        .catch(() => {
                        });
                    this.$refs["pull-modal"].hide();
                    
                    this.messageToast(
                        "Success",
                        "success",
                        "Pull request successfully completed"
                    );
                })
                .catch((err) => {
                   
                    this.messageToast(
                        "Error",
                        "danger",
                        err.response ? err.response.data.message : "An error occurred during the pull request."
                    );
                });
        },
        async getWorkspace() {
            await this.$store.getters.client
                .get(`/orguser/workspace/byuserId?userId=${this.userId}`)
                .then(async (res) => {
                    let path = res.data.installedPath + `/${this.projectName}`;
                    this.workspacePath = res.data.installedPath;
                    this.projectPath =
                        res.data.installedPath + "/" + this.projectName;
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
                        .catch(() => { });
                    await this.$store.getters.client
                        .get(`/orguser/workspace/repotree?path=${path}`)
                        .then((tres) => {
                            this.model = tres.data;
                        })
                        .catch(() => { });
                })
                .catch(() => { });
        },
        makedefaultplugin() {
            const body = {
                userId: this.userId,
                orgId: this.orgId,
                customizationOptions: {},
            };
            this.$store.getters.client
                .post(`/orguser/docstyler/customizePdfOutput`, body)
                .then(() => { })
                .catch(() => { });
            this.$store.getters.client
                .post(`/orguser/docstyler/customizehtmlOutput`, body)
                .then(() => { })
                .catch(() => { });
        },
        async generateOutputFun(path) {
            this.disablebutton = true;
            let outputParams = {
                inputPath: this.typeform.inputPath,
                outputPath: path + "/output",
                transtype: this.ditaOtFolder[this.selectedOutputFormatIndex].transtype,
                ditaOtFolder: this.ditaOtFolder[this.selectedOutputFormatIndex]
                    .ditaOtFolder,
            };
            this.releaseParams = {
                ditaMapFileName: this.typeform.inputPath.split("/").pop(),
                outputFormat: this.ditaOtFolder[this.selectedOutputFormatIndex]
                    .transtype,
                ditaotVersion: this.ditaotVersion,
                orgId: this.orgId,
                userId: this.userId,
                releaseTitle: this.typeform.releaseTitle,
                releasedBy: this.userName,
                projectName: this.projectName,
            };
            await this.$validator.validateAll().then((result) => {
                if (result) {
                    this.$refs["modaloutputprogress"].show();
                    this.$store.getters.client
                        .post(
                            `/orguser/docpublisher/customplugin/publishOutput`,
                            outputParams
                        )
                        .then((res) => {
                            this.disablebutton = false;
                            setTimeout(() => {
                                this.$refs["modaloutputprogress"].hide();
                                this.messageToast(
                                    "Output Generated",
                                    "success",
                                    res.data.message
                                );
                                this.typeform.inputPath = null;
                                this.hideform = true;
                                this.typeform.outputFormat = null;
                                this.disablecommitbutton = false;
                                this.typeform.releaseTitle = null;
                                
                            }, 10000);
                        })
                        .catch((err) => {
                            this.$refs["modaloutputprogress"].hide();
                            this.messageToast(
                                "invalid request",
                                "danger",
                                err.response.data.message
                            );
                        });
                }
            });
        },
        commitOnGithub() {
            this.showModal = true;
        },
        githubCommit() {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-primary btn-sm mr-2",
                    cancelButton: "btn btn-light btn-sm"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Enter Commit Message to Commit on Github",
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
                    return value.trim() !== "" ?
                        undefined :
                        "Please enter a commit message.";
                },
            }).then(({
                value: commitMsg
            }) => {
                if (commitMsg !== undefined) {
                    let commitProjectObj = {
                        path: this.projectPath,
                        message: commitMsg,
                        githubUsername: null,
                        email: null,
                    };
                    swalWithBootstrapButtons.fire({
                        title: "Commit request in progress...",
                        allowOutsideClick: false,
                        onOpen: () => {
                            Swal.showLoading();
                        },
                    });
                    this.$store.getters.client
                        .put(`/orguser/workspace/commit`, commitProjectObj)
                        .then((res) => {
                            this.disabledownloadbutton = false;
                            this.releaseParams.commitSHA = res.data.commitSHA
                            this.releaseParams.owner = CryptoJS.AES.decrypt(
                                this.$route.params.repoowner,
                                secretKey
                            ).toString(CryptoJS.enc.Utf8)
                            this.$store.getters.client
                                .post(`/orguser/release`, this.releaseParams)
                                .then(() => { 
                                    this.$store.commit('setRecentPublicationsData', [] );
                                })
                                .catch((err) => {
                                    this.$refs["modaloutputprogress"].hide();
                                    this.messageToast(
                                        "invalid request",
                                        "danger",
                                        err.response.data.message
                                    );
                                });
                            swalWithBootstrapButtons.fire({
                                icon: "success",
                                title: "Commit request completed successfully!",
                                text: res.data.message,
                            });
                        })
                        .catch((err) => {
                            swalWithBootstrapButtons.fire({
                                icon: "error",
                                title: "Commit failed!",
                                text: err.response.data.message,
                            });
                        });
                }
            });
        },
        async getoutputFormat() {
            await this.$store.getters.client
                .get(`/orguser/docpublisher/customplugin`)
                .then((res) => {
                    this.selectOutputFormat = res.data;
                    this.ditaOtFolder = res.data;
                })
                .catch(() => { });
        },
        resetform() {
            this.typeform.inputPath = "";
            this.typeform.outputFormat = "";
            this.typeform.releaseTitle = "";
        },
        openDownload() {
            const encryptedRepouser = CryptoJS.AES.encrypt(
                this.repouser,
                secretKey
            ).toString();
            const encryptedReponame = CryptoJS.AES.encrypt(
                this.projectName,
                secretKey
            ).toString();
            const encodedRepouser = encodeURIComponent(encryptedRepouser);
            const encodedReponame = encodeURIComponent(encryptedReponame);
            this.$router.push({
                path: `/docmanager/${encodedRepouser}/${encodedReponame}`,
            });
        },
    },
};
</script>
