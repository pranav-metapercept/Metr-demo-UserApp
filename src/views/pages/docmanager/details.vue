<template>
<div>
    <!-- Page Header -->
    <PageHeader :icon="'fas fa-file-invoice'" :title="title" :items="items" />
    <!-- Project Info -->
    <div class="d-flex justify-content-between align-items-center">
        <div>
            <div class=" mr-2 px-1 ">
                <span class="project-name">{{ projectName }}</span>
            </div>
            <div class="mr-2 dita-ot-cont px-1 ">
                <span class="dita-ot">DITA-OT Version:</span>
                <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
            </div>
        </div>
        <button  class="btn btn-primary btn-sm " type="submit" @click="openEditor()">
            <span class="d-flex align-items-center justify-content-center">
                <span>
                    <i class="mdi mdi-file-edit mdi-16px"></i>
                </span>
                <span class=" ml-2">
                    DocEditor
                </span>
            </span>
        </button>
    </div>
    <!-- Branches Dropdown -->
    <div class="row mb-2 mt-3">
        <label class=" col-label ml-3">Select Branch <span class="text-danger">*</span></label>
        <div class="col-lg-12 ">
            <select class="form-control" v-model="selected" placeholder="Select Branch" @change="getObject">
                <option value="" disabled>Please Choose Branch</option>
                <option v-for="(option, index) in repobranchesdata" :key="index" :value="option.value">{{ option.text }}
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
                                    <div class="custom-source  d-flex justify-content-between align-items-center flex-wrap">
                                        <div class="custom-title mb-0">
                                            Source
                                        </div>
                                    </div>
                                    <div class="border-top">
                                        <simplebar v-if="treeData.length > 0" class="mt-1 custom-jstree">
                                            <v-jstree :data="treeData" multiple allow-batch whole-row @item-click="itemClick"></v-jstree>
                                        </simplebar>
                                        <template v-else>
                                            <div class="d-flex justify-content-center align-items-center no-output-cont">
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
                                    <div class="custom-source  d-flex justify-content-between align-items-center flex-wrap">
                                        <div class="custom-title mb-0">
                                            Target
                                        </div>
                                    </div>
                                    <div class="border-top">
                                        <div class="download-field " v-on:click="downloadFun()">
                                            <div class="download-btn">
                                                <span>Download as Zip</span>
                                                <img class="downloadImg" src="../../../assets/toolbarsvgs/download.svg" alt="SVG Image" />
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
</div>
</template>

<script>
import axios from "axios";
import JSZip from "jszip";
import listContent from "list-github-dir-content";
import pMap from "p-map";
import pRetry from "p-retry";
import saveFile from "save-file";
import simplebar from "simplebar-vue";
import Swal from "sweetalert2";
import {
    mapGetters
} from "vuex";
import checkurl from "../../../components/urlvalidator";
import PageHeader from "@/components/pageheader";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CryptoJS from "crypto-js";
import devicevalidator from "../../../components/devicevalidator";
import {
    eventBus
} from "../../../main";
import {
    secretKey
} from "../../../api/global.env";
export default {
    components: {
        PageHeader,
        simplebar,
    },
    computed: {
        ...mapGetters(["ditaOtVersions"]),
    },
    data() {
        return {
            title: "DocManager",
            items: [{
                    text: "Projects",
                    href: `/docmanager`,
                },
                {
                    text: "DocManager",
                    active: true,
                },
            ],
            treeData: [],
            repobranchesdata: [],
            ditaotVersion: "",
            projectName: CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            repouser: CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            selected: "",
            isLoading: false,
            downloadURL: "",
            brachName: null,
            urlParserRegex: /^[/]([^/]+)[/]([^/]+)[/]tree[/]([^/]+)[/](.*)/,
            outputURL: null,
            gitToken: this.$store.state.Auth.gitToken,
            isDocEditor: null,
            isDocPublisher: null,
            editor: ClassicEditor,
            editorData: null,
            editorLoader: false,
            modal: false,
            userId: this.$store.state.Auth.userId,
        };
    },
    created() {
        // this.validateURL();
    },
    async mounted() {
        eventBus.$emit("update-sidebar", "menuitems.docmanager.text");
        this.getRepoBranch();
        this.getOrgDetails();
    },
    methods: {
        // openEditor(){
        //   this.modal = true;
        //   setTimeout(()=>{this.editorLoader = true}, 2000)
        // },
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
        async openEditor() {
            this.navigateToEditor();
        },
        navigateToEditor() {
            const encryptedRepouser = CryptoJS.AES.encrypt(this.repouser, secretKey).toString();
            const encryptedReponame = CryptoJS.AES.encrypt(this.projectName, secretKey).toString();
            const encryptedBranch = CryptoJS.AES.encrypt(this.brachName, secretKey).toString();
            const encodedRepouser = encodeURIComponent(encryptedRepouser);
            const encodedReponame = encodeURIComponent(encryptedReponame);
            const encodedBranch = encodeURIComponent(encryptedBranch);
            this.$router.push({
                path: `/doceditor/${encodedRepouser}/${encodedReponame}/${encodedBranch}`,
            });
        },
        handleAccessDenied() {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-primary btn-sm mr-2",
                    cancelButton: "btn btn-light btn-sm"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                icon: "error",
                title: "Oops...",
                text: "Sorry, you do not have access to DocEditor. Please contact your administrator if you would like to access this feature. Thank you.",
            });
        },
        itemClick(node) {
            node.model;
        },
        // Get organization detail
        async getOrgDetails() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            let orgId = this.$store.state.Auth.orgId;
            this.$store.getters.client
                .get(`serveradmin/organization/byorgid?orgId=${orgId}`)
                .then((res) => {
                    loader.hide();
                    if (res.data && res.data.length > 0) {
                        // Check if data exists and if it's in the expected format
                        this.isDocEditor = res.data[0].editor;
                        this.isDocPublisher = res.data[0].publisher;
                    } else {
                        // Handle an invalid response
                        this.messageToast("Invalid request", "danger", "An error occurred");
                    }
                })
                .catch((err) => {
                    loader.hide();
                    // Handle network issues or unexpected errors
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                    devicevalidator(err.response.data.message);
                });
        },
        // Get all branches inside repository
        async getRepoBranch() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            let branchResponse;
            this.$store.getters.client
                .get(`orguser/repobranches?repoUser=${this.repouser}&repoName=${this.projectName}`)
                .then((res) => {
                    branchResponse = res;
                    if (branchResponse.data && branchResponse.data.length > 0) {
                        let length = branchResponse.data.length - 1;
                        this.branchName = branchResponse.data[length].name;
                        this.selected = branchResponse.data[length].name;
                        this.repobranchesdata = branchResponse.data.map((element) => ({
                            value: element.name,
                            text: element.name,
                        }));
                        this.outputURL = `https://github.com/${this.repouser}/${this.projectName}/tree/${branchResponse.data[length].name}/output`;
                        return this.$store.getters.client.get(
                            `project/outputtree?gitUsername=${this.repouser}&gitReponame=${this.projectName}&branchsha=${branchResponse.data[length].commit.sha}`
                        );
                    } else {
                        this.messageToast("Invalid request", "danger", "No branches found in the repository.");
                    }
                })
                .then((outputResponse) => {
                    if (outputResponse.data) {
                        this.treeData = outputResponse.data;
                    } else {
                        this.messageToast("Invalid request", "danger", "No data found in the output tree.");
                    }
                })
                .catch(() => {
                    // Handle errors here, e.g., show an error message or log the error.
                    this.messageToast("Invalid request", "danger", "An error occurred while fetching data.");
                })
                .finally(() => {
                    loader.hide();
                });
        },
        // Get tree of output folder in particular branch
        getObject(branchsha) {
            this.brachName = branchsha;
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.outputURL = `https://github.com/${CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}/${CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}/tree/${this.brachName}/bin/output`;
            this.$store.getters.client
                .get(`project/outputtree?gitUsername=${CryptoJS.AES.decrypt(
                    this.$route.params.repouser,
                    secretKey
                ).toString(CryptoJS.enc.Utf8)}&gitReponame=${CryptoJS.AES.decrypt(
                    this.$route.params.reponame,
                    secretKey
                ).toString(CryptoJS.enc.Utf8)}&branchsha=${branchsha}`)
                .then((res) => {
                    loader.hide();
                    if (res.data) {
                        // Check if data exists
                        this.treeData = res.data;
                    } else {
                        // Handle an invalid response
                        this.messageToast("Invalid request", "danger", "An error occurred");
                    }
                })
                .catch((err) => {
                    loader.hide();
                    // Handle network issues or unexpected errors
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                });
        },
        // Download output folder as a zip
        async downloadFun() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            const zipPromise = new JSZip();
            let user;
            let repository;
            let ref;
            let dir;
            try {
                const parsedUrl = new URL(this.outputURL);
                [, user, repository, ref, dir] = this.urlParserRegex.exec(parsedUrl.pathname);
            } catch (err) {
                // Handle URL parsing error
                this.messageToast("Invalid request", "danger", "Error parsing URL");
                loader.hide();
                return;
            }
            try {
                const {
                    private: repoIsPrivate
                } = await this.fetchRepoInfo(`${user}/${repository}`);
                const files = await listContent.viaTreesApi({
                    user,
                    repository,
                    ref,
                    directory: decodeURIComponent(dir),
                    token: this.gitToken,
                    getFullData: true,
                });
                const controller = new AbortController();
                const fetchPublicFile = async (file) => {
                    const response = await axios.get(
                        `https://raw.githubusercontent.com/${user}/${repository}/${ref}/${this.escapeFilepath(file.path)}`, {
                            signal: controller.signal
                        }
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.statusText} for ${file.path}`);
                    }
                    return response.blob();
                };
                const fetchPrivateFile = async (file) => {
                    const response = await axios.get(file.url, {
                        headers: {
                            Authorization: `Bearer ${this.gitToken}`,
                        },
                        signal: controller.signal,
                    });
                    const {
                        content
                    } = await response.data;
                    const decoder = await fetch(
                        `data:application/octet-stream;base64,${content}`
                    );
                    return decoder.blob();
                };
                let downloaded = 0;
                const downloadFile = async (file) => {
                    const localDownload = () => (repoIsPrivate ? fetchPrivateFile(file) : fetchPublicFile(file));
                    const onFailedAttempt = (error) => {
                        error // Handle download error, if needed
                    };
                    try {
                        const blob = await pRetry(localDownload, {
                            onFailedAttempt
                        });
                        downloaded++;
                        const zip = await zipPromise;
                        zip.file(file.path.replace(dir + "/", ""), blob, {
                            binary: true
                        });
                    } catch (error) {
                        // Handle individual download error, if needed
                    }
                };
                await pMap(files, downloadFile, {
                    concurrency: 20
                });
                loader.hide();
                const zip = await zipPromise;
                const zipBlob = await zip.generateAsync({
                    type: "blob"
                });
                // Check if any files were downloaded successfully
                if (downloaded > 0) {
                    await saveFile(
                        zipBlob,
                        `${user} ${repository} ${ref} ${dir}.zip`.replace(/\//, "-")
                    );
                } else {
                    // Handle case when no files were downloaded
                    this.messageToast("Invalid request", "danger", "No files were downloaded.");
                }
            } catch (error) {
                // Handle other errors
                this.messageToast("Invalid request", "danger", "An error occurred while downloading.");
            }
        },
        async fetchRepoInfo(repo) {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${repo}`,
                    this.gitToken ? {
                        headers: {
                            Authorization: `Bearer ${this.gitToken}`,
                        },
                    } : {}
                );
                if (!response.ok) {
                    throw new Error(`HTTP ${response.statusText}`);
                }
                return response.json();
            } catch (error) {
                // Handle errors and display an error message
                this.messageToast("Invalid request", "danger", "Error fetching repository info");
                throw error; // Re-throw the error to be handled at a higher level if needed
            }
        },
        escapeFilepath(path) {
            return path.replaceAll("#", "%23");
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
    background: #007BFF;
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
    color: rgba(23, 35, 61, 1)
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
