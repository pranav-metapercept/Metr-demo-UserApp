<template>
<!-- Template for the main content of the page -->
<simplebar class="m-0 p-0 custom-simplebar">
    <!-- Navigation bar -->
    <navbar />
    <hr />
    <div class="row">
        <!-- Sidebar with DITAMAP tree -->
        <div class="col-md-2 col-sm-12">
            <div v-if="model !== null">
                <div class="card">
                    <div class="custom-ditamap d-flex justify-content-between align-items-center flex-wrap">
                        <div class="custom-title mb-0">DITAMAP</div>
                    </div>

                    <hr />
                    <div class="tree-rows">
                        <simplebar class="custom-tree-simplebar">
                            <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType">
                                <span class="d-flex align-items-center mt-1">
                                    <span class="folder-icon" v-if="isFolder">
                                        {{ isOpen ? "▶" : "▼" }}
                                    </span>
                                    <i class="fas fa-folder icon-cog" v-if="isFolder"></i>
                                    <i class="fas fa-file-alt icon-cog" v-else></i>
                                    <span class="truncated-path">{{ model.name }}</span>
                                </span>
                            </div>
                            <!-- Display child tree items when folder is open -->
                            <div v-show="isOpen" v-if="isFolder" class="mt-1 ml-3 custom-tree tree">
                                <TreeItem class="item treeItems" v-for="model in model.children" :key="model.id" :model="model">
                                </TreeItem>
                            </div>
                        </simplebar>
                    </div>
                </div>
            </div>
        </div>
        <!-- Text view or Tag view content -->
        <div v-if="textVisible" class="col-md-8 col-sm-12">
            <div class="card">
                <div class="custom-toolbar-container d-flex justify-content-center align-items-center">
                    <div class="custom-toolbar d-flex justify-content-between align-items-center flex-wrap">
                        <div class="custom-title mb-0">
                            <div class="d-flex justify-content-between text-center">

                                <div v-if="textVisible">
                                    <Toolbar :ditaot="ditaotVersion" :xmlObject="xmlObject" />
                                </div>
                                <div v-if="!textVisible">
                                    <div class="toolbar">
                                        <div class="btn-group mr-2 mb-2 read-only mb-sm-0 btn-toolbar p-0">
                                            <div>
                                                You are in read-only mode. Any changes or edits made
                                                will not happen.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <simplebar class="custom-recursivetags">
                    <div v-if="!xmlObject.html">
                        <div class="editor-page">
                            <div class="pl-2 pb-2 pr-2 py-2 mx-2">
                                <!-- Display recursive tags for XML editing -->
                                <recursive-tag :parentTagHistory="[]" :selectedTag="selectedTag" :errorMessage="errMessage" :data="xmlObject" :peers="[]" :self="0"></recursive-tag>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center">
                        <div class="d-flex justify-content-center">
                            <div class="position-relative">
                                <img class="placeholder-img" src="../../../assets/placeholder.png" alt="Placeholder Image" />
                                <div class="error-text">
                                    {{ errMessage || "Please select a valid XML file." }}
                                </div>
                            </div>
                        </div>
                    </div>
                </simplebar>
            </div>
        </div>
        <!-- Tag view content -->
        <div v-if="!textVisible" class="col-md-10 col-sm-12">
            <div class="card">
                <div class="custom-toolbar-container d-flex justify-content-center align-items-center">
                    <div class="custom-toolbar d-flex justify-content-between align-items-center flex-wrap">
                        <div class="custom-title mb-0">
                            <div class="d-flex justify-content-between text-center">
                                <div v-if="!textVisible">
                                    <button v-b-tooltip.hover title="Switch to Tag View" type="button" @click="toggleView" class="btn my-2">
                                        <img class="toggle-switch-img-tag" src="../../../assets/toolbarsvgs/authar.svg" alt="SVG Image" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <simplebar class="custom-recursivetags">
                    <div v-if="!xmlObject.html" class="pl-2 pb-2 pr-2 mx-2">
                        <!-- Display XML content in Tag view -->
                        <TextView :rootContent="rootContent" :data="xmlObject || xmlObjectold" :errorMessage="errMessage" />
                    </div>
                    <div v-else class="text-center">
                        <div class="d-flex justify-content-center">
                            <div class="position-relative">
                                <img class="placeholder-img" src="../../../assets/placeholder.png" alt="Placeholder Image" />
                                <div class="error-text">
                                    {{ errMessage || "Please select a valid XML file." }}
                                </div>
                            </div>
                        </div>
                    </div>
                </simplebar>
            </div>
        </div>
        <!-- Additional options for text view -->
        <div v-if="textVisible" class="col-md-2 col-sm-12">
            <div class="card">
                <div class="custom-navigation d-flex justify-content-between align-items-center flex-wrap">
                    <div class="custom-title mb-0">
                        <!-- Navigation Buttons for DocManager, DocPublisher, and DocStyler -->
                        <button class="btn btn-light mr-1 btn-sm" @click="redirectDocmanager()">
                            DocManager
                        </button>
                        <button class="btn btn-light mr-1 btn-sm" @click="redirectDocPublisher()">
                            DocPublisher
                        </button>
                        <button class="btn btn-light mr-1 btn-sm" v-on:click="redirectDocStyler()">
                            DocStyler
                        </button>
                    </div>
                </div>
                <hr />
                <b-tabs class="edit-tags" justified nav-class="nav-tabs-custom" content-class="text-muted">
                    <b-tab title="Add Child Tag" active>
                        <div>
                            <div v-if="model !== null">
                                <!-- EditTag component for adding child tags -->
                                <EditTag :errorMessage="errMessage" :data="xmlObject" />
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Add Attribute">
                        <div>
                            <div v-if="model !== null">
                                <!-- Attribute component for adding attributes -->
                                <Attribute :errorMessage="errMessage" :data="xmlObject" />
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>

    <div>
        <!-- Pull Request modal dialog -->
        <b-modal v-model="pullReqModal" id="modal-center" centered hide-footer title="Action Required">
            <p>
                You will need to Create a Pull Request We noticed that your repository
                is currently behind the latest changes. To ensure that your code is up
                to date and aligned with the latest developments, we recommend
                following these steps:
                <br />
                <code>1.</code>Create a Pull Request by clicking the “Pull request
                button from the toolbar” to compare your code with the latest changes.
                This step is crucial to review and integrate your work seamlessly.
                <br />
                <code>2.</code>Review and Commit: Once the pull request is open, take
                your time to review the changes and address any conflicts. This
                ensures that your code works harmoniously with the updated codebase.
                Once everything looks good, you can proceed to commit your changes.
                <br />
                Remember, pull requests are an essential part of our collaborative
                development process, enabling us to maintain code quality and stay in
                sync with ongoing developments.
            </p>
        </b-modal>
        <b-modal ref="pull-modal" hide-footer hide-header hide-close no-close-on-backdrop no-close-on-escer>
            <div class="d-block text-center">
                <h3>
                    You will need to Create a Pull Request.
                    <br />
                    We noticed that your repository is currently behind the latest
                    changes. To ensure that your code is up to date and aligned with the
                    latest developments, you will need to create a pull request.
                </h3>
            </div>
            <hr class="my-2" />
            <button class="btn btn-primary btn-sm" block @click="createPullreq()">
                Pull Repository
            </button>
        </b-modal>
    </div>
</simplebar>
</template>

<script>
import TextView from "./components/textview.vue";
import Attribute from "./components/attribute.vue";
import EditTag from "./components/edittag.vue";
import Toolbar from "./components/toolbar.vue";
import _ from "lodash";
import {
    JsonToXml
} from "./convert.js";
import Swal from "sweetalert2";
import {
    secretKey
} from "../../../api/global.env";
import RecursiveTag from "./components/recuresivetag.vue";
import TreeItem from "./components/treeitems.vue";
import {
    eventBus
} from "../../../main";
// import xmlFormatter from "xml-formatter";
import {
    BTabs,
    BTab
} from "bootstrap-vue";
import navbar from "./components/navbar.vue";
import simplebar from "simplebar-vue";
import xmlFormat from "xml-formatter";
import CryptoJS from "crypto-js";
// import { elementFromString } from "@tiptap/vue-2";
export default {
    data() {
        return {
            historyObject: [],
            futureObject: [],
            changesMade: false,
            xmlOutput: "",
            showEditOption: true,
            showAttr: false,
            errMessage: null,
            componentVisible: true,
            editComponentVisible: true,
            textVisible: true,
            pullReqModal: false,
            pullReqModal2: false,
            title: "DocEditor",
            tagSelected: false,
            items: [{
                    text: "Projects",
                    href: `/docmanager`,
                },
                {
                    text: "DocEditor",
                    active: true,
                },
            ],
            xmlObjectold: {
                xtag: "Root",
                Root: [], // the initial tag's childnodes array object
            },
            xmlObject: {
                xtag: "Root",
                Root: [], // the initial tag's childnodes array object
            },
            modalVisible: false,
            names: "",
            lastSaved: "N/A",
            timerId: null,
            nameState: null,
            submittedNames: [],
            isLoading: false,
            clickedTag: {},
            isAddAttr: false,
            newAttrName: "newName",
            newAttrValue: "newValue",
            fileSHA: null,
            model: null,
            isOpen: true,
            fileContent: null,
            currentfilePath: null,
            localRepoPath: null,
            commitMsg: null,
            ditaotVersion: "",
            showAlert: false,
            isDocPublisher: null,
            xtag: null,
            text: null,
            showComponentA: true,
            getdatafromsessionStorage: false,
            showCommitBtn: false,
            showSaveContentBtn: false,
            intervalId: null,
            formattedXml: "",
            projectName: CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            selectedTag: "",
            xmlfile: "",
            oldXmlValue: null,
            rootContent: "",
            unsavedChanges: false,
        };
    },
    components: {
        simplebar,
        RecursiveTag,
        TreeItem,
        navbar,
        TextView,
        Toolbar,
        Attribute,
        EditTag,
        BTabs,
        BTab,
    },
    created() {
        this.readXML();
        eventBus.$on("clear-Data", () => {
            (this.selectedTag = ""), eventBus.$emit("validTagSelected", false);
        });
        eventBus.$on("nodeIdUpdate", (newxtag, newNodeId) => {
            this.selectedTag = newNodeId;
            eventBus.$emit("generateTextList", newxtag, newNodeId);
        });
        eventBus.$on("validTagSelected", (flag) => {
            this.tagSelected = flag;
        });
        eventBus.$on("undoChanges", () => {
            this.undo();
        });
        eventBus.$on("redoChanges", () => {
            this.redo();
        });
        eventBus.$on("toggleView", () => {
            this.toggleView();
        });
        window.addEventListener("beforeunload", this.checkUnsavedChanges);
        eventBus.$on("selectedTagData", (nodeId) => {
            this.selectedTag = nodeId;
        });
        eventBus.$on("clicktag", async (data) => {
            let keys = Object.keys(data);
            this.$refs.editmodal.show();
            delete data[keys[keys.length - 1]];
            this.clickedTag = data;
        });
        eventBus.$on("edit", async (data) => {
            this.editAttribute(data);
            this.$refs.editmodal.hide();
            this.showAlert = true;
        });
    },
    beforeDestroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
    },
    mounted() {
        eventBus.$on("saveContentEditor", () => {
            this.saveContent();
        });
        eventBus.$on("saveRecord", () => {
            this.record();
        });
        eventBus.$on("clearHistory", () => {
            (this.historyObject = []), (this.futureObject = []);
        });
        eventBus.$on("githubCommit", this.githubCommit);
       
        let that = this;
        this.$nextTick(() => {
            eventBus.$emit("xmlData", that.xmlObject);
        });
        eventBus.$on("body-updated", (body) => {
            body.nodeDetails = this.xmlObject;
            this.body = body;
            if (this.body) {
                this.$store.getters.client
                    .post("/orguser/doceditor/editXml", this.body)
                    .then((res) => {
                        let updatedData = res.data;
                        localStorage.setItem("xmlObject", JSON.stringify(updatedData));
                        this.xmlObject = JSON.parse(localStorage.getItem("xmlObject"));
                        eventBus.$emit("saveRecord");
                        // Optionally, display a success message here
                        this.messageToast("XML saved successfully", "success");
                    })
                    .catch((err) => {
                        // Handle network or server errors
                        this.messageToast(
                            "Network error",
                            "danger",
                            err.response ? err.response.data.message : "An error occurred"
                        );
                    });
            }
        });
        eventBus.$on("add-link", (body) => {
            body.nodeDetails = this.xmlObject;
            this.body = body;
            if (this.body) {
                this.$store.getters.client
                    .post("/orguser/doceditor/editXml", this.body)
                    .then((res) => {
                        if (res.data) {
                            let updatedData = res.data;
                            localStorage.setItem("xmlObject", JSON.stringify(updatedData));
                            this.xmlObject = JSON.parse(localStorage.getItem("xmlObject"));
                            eventBus.$emit("saveRecord");
                            // Optionally, display a success message here
                            this.messageToast("Link added successfully", "success");
                        } else {
                            // Handle validation errors
                            this.messageToast(
                                "Invalid request",
                                "danger",
                                "An error occurred"
                            );
                        }
                    })
                    .catch((err) => {
                        // Handle network or server errors
                        this.messageToast(
                            "Network error",
                            "danger",
                            err.response ? err.response.data.message : "An error occurred"
                        );
                    });
            }
        });
        eventBus.$on("add-img", (body) => {
            body.nodeDetails = this.xmlObject;
            body.editDetails.filePath = this.currentfilePath;
            if (body) {
                this.$store.getters.client
                    .post("/orguser/doceditor/editXml", body)
                    .then((res) => {
                        if (res.data && res.data.error) {
                            // Handle the error using the response data
                            this.messageToast(
                                "Error: " + res.data.error,
                                "danger",
                                "An error occurred"
                            );
                        } else {
                            // Handle the success case
                            let updatedData = res.data;
                            localStorage.setItem("xmlObject", JSON.stringify(updatedData));
                            this.xmlObject = JSON.parse(localStorage.getItem("xmlObject"));
                            eventBus.$emit("saveRecord");
                            // Optionally, display a success message here
                            this.messageToast("Image added successfully", "success");
                        }
                    })
                    .catch((err) => {
                        // Handle network or server errors
                        this.messageToast(
                            "Network error",
                            "danger",
                            err.response ? err.response.data.message : "An error occurred"
                        );
                    });
            }
        });
        eventBus.$on("updateAns", () => {
            this.updateAns(this.xmlObject, {});
        });
        eventBus.$on("valuechange", function () {
            sessionStorage.setItem("xmlObject", JSON.stringify(that.xmlObject));
        });
        eventBus.$on("add-attribute", function () {
            sessionStorage.setItem("xmlObject", JSON.stringify(that.xmlObject));
        });
        eventBus.$on("get-data", function (data) {
            that.xmlObject = data;
        });
        eventBus.$on("click-tag", function (data) {
            that.clickedTag = data;
        });
        eventBus.$on("clear-attributes", function () {
            that.clickedTag = {};
        });
        document.addEventListener("keydown", this.handleKeyDown);
        this.getDitaOt();
    },
    computed: {
        isFolder() {
            return this.model.children && this.model.children.length;
        },
        _() {
            return _;
        },
    },
    watch: {
        historyObject: {
            handler() {
                if (this.historyObject.length === 0) {
                    eventBus.$emit("historyObjectChanged", true);
                } else {
                    eventBus.$emit("historyObjectChanged", false);
                }
            },
            deep: true,
        },
        futureObject: {
            handler() {
                if (this.futureObject.length === 0) {
                    eventBus.$emit("futureObjectChanged", true);
                } else {
                    eventBus.$emit("futureObjectChanged", false);
                }
            },
            deep: true,
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
        updateAns(data, ancestors) {
            if (typeof data === "string") return;
            const tagName = data.xtag;
            const newAncestors = {
                ...ancestors,
            };
            newAncestors[tagName] = true;
            data.ancestors = newAncestors;
            for (const childNodes of data[tagName]) {
                this.updateAns(childNodes, newAncestors);
            }
        },
        markChanges() {
            this.unsavedChanges = true;
        },
        clearChanges() {
            this.unsavedChanges = false;
        },
        checkUnsavedChanges(event) {
            if (this.unsavedChanges) {
                event.returnValue = "Changes you made may not be saved.";
            }
        },
        handleKeyDown(event) {
            if ((event.ctrlKey || event.metaKey) && event.key === "z") {
                // Ctrl+Z pressed (undo)
                event.preventDefault();
                this.undo();
            } else if ((event.ctrlKey || event.metaKey) && event.key === "y") {
                // Ctrl+Y pressed (redo)
                event.preventDefault();
                this.redo();
            } else if ((event.ctrlKey || event.metaKey) && event.key === "s") {
                // Ctrl+S pressed (save)
                event.preventDefault();
                this.saveContent();
            }
        },
        record() {
            this.markChanges();
            let a = this.deepCopy(this.xmlObject);
            this.historyObject.push(a);
            this.futureObject = [];
            if (this.historyObject.length > 10) {
                this.historyObject.shift();
            }
            this.changesMade = false;
        },
        undo() {
            this.undoTriggered = true;
            if (this.historyObject.length === 0) {
                // alert("No history found!");
                return;
            }
            let previousState = this.historyObject.pop();
            if (previousState === null || previousState.xtag === "html") return;
            this.futureObject.push(this.deepCopy(this.xmlObject));
            this.xmlObject = previousState;
        },
        redo() {
            if (this.futureObject.length === 0) {
                return;
            }
            let nextState = this.futureObject.pop();
            this.historyObject.push(this.deepCopy(this.xmlObject));
            this.xmlObject = nextState;
        },
        textSync() {
            eventBus.$emit("toggleSync");
            eventBus.$emit("saveRecord");
        },
        showAttribute() {
            this.showAttr = true;
            this.showEditOption = false;
        },
        showEdit() {
            this.showEditOption = true;
            this.showAttr = false;
        },
        toggleComponent() {
            this.componentVisible = !this.componentVisible;
            this.getcontent();
        },
        toggleEdit() {
            this.editComponentVisible = !this.editComponentVisible;
        },
        toggleView() {
            this.textVisible = !this.textVisible;
            eventBus.$emit("rootContent", this.rootContent);
            eventBus.$emit("clear-Data");
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
                })
                .then(({
                    value: commitMsg
                }) => {
                    if (commitMsg !== undefined) {
                        let commitProjectObj = {
                            path: this.projectPath,
                            message: commitMsg,
                            githubUsername: this.$store.state.Auth.githubUsername,
                            email: this.$store.state.Auth.userEmail,
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
                                this.releaseParams.commitSHA = res.data.commitSHA;
                                this.releaseParams.owner = CryptoJS.AES.decrypt(
                                    this.$route.params.repouser,
                                    secretKey
                                ).toString(CryptoJS.enc.Utf8);
                                this.$store.getters.client
                                    .post(`/orguser/release`, this.releaseParams)
                                    .then(() => {
                                        this.$store.commit("setRecentPublicationsData", []);
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
        async getDitaOt() {
            this.getOrgId = this.$store.state.Auth.orgId;
            return this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.getOrgId}`)
                .then((response) => {
                    if (
                        response.data &&
                        Array.isArray(response.data) &&
                        response.data.length > 0 &&
                        "ditaotVersion" in response.data[0]
                    ) {
                        this.ditaotVersion = response.data[0].ditaotVersion;
                    } else {
                        this.messageToast(
                            "Invalid request",
                            "danger",
                            "No valid DITA OT version data received from the server"
                        );
                    }
                })
                .catch((err) => {
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        err.response ? err.response.data.message : "An error occurred"
                    );
                });
        },
        redirectDocPublisher() {
            if (this.$store.state.Auth.projectsData.length) {
                const repoName = this.projectName;
                const projectData = this.$store.state.Auth.projectsData.find(
                    (item) => item.projectName === repoName
                );
                if (projectData && projectData.userRole.includes("DocPublisher")) {
                    this.navigateToDocPublisher();
                } else {
                    this.showAccessDeniedMessage("DocPublisher");
                }
            } else {
                this.fetchProjectsData()
                    .then(() => {
                        const repoName = this.projectName;
                        const projectData = this.$store.state.Auth.projectsData.find(
                            (item) => item.projectName === repoName
                        );
                        if (projectData && projectData.userRole.includes("DocPublisher")) {
                            this.navigateToDocPublisher();
                        } else {
                            this.showAccessDeniedMessage("DocPublisher");
                        }
                    })
                    .catch(() => {
                        this.showAccessDeniedMessage("DocPublisher");
                    });
            }
        },
        redirectDocmanager() {
            this.$router.push({
                name: "DocManager",
            });
        },
        redirectDocStyler() {
            if (this.$store.state.Auth.projectsData.length) {
                const repoName = this.projectName;
                const projectData = this.$store.state.Auth.projectsData.find(
                    (item) => item.projectName === repoName
                );
                if (projectData && projectData.userRole.includes("DocPublisher")) {
                    this.navigateToDocStyler();
                } else {
                    this.showAccessDeniedMessage("DocStyler");
                }
            } else {
                this.fetchProjectsData()
                    .then(() => {
                        const repoName = this.projectName;
                        const projectData = this.$store.state.Auth.projectsData.find(
                            (item) => item.projectName === repoName
                        );
                        if (projectData && projectData.userRole.includes("DocEditor")) {
                            this.navigateToDocStyler();
                        } else {
                            this.showAccessDeniedMessage("DocStyler");
                        }
                    })
                    .catch(() => {
                        this.showAccessDeniedMessage("DocStyler");
                    });
            }
        },
        navigateToDocStyler() {
            const encodedRepouser = encodeURIComponent(this.$route.params.repouser);
            const encodedReponame = encodeURIComponent(this.$route.params.reponame);
            const encodedBranch = encodeURIComponent(this.$route.params.repobranch);
            this.$router.push({
                path: `/docstyler/${encodedRepouser}/${encodedReponame}/${encodedBranch}`,
            });
        },
        navigateToDocPublisher() {
            const encodedRepouser = encodeURIComponent(this.$route.params.repouser);
            const encodedReponame = encodeURIComponent(this.$route.params.reponame);
            const encodedBranch = encodeURIComponent(this.$route.params.repobranch);
            this.$router.push({
                path: `/doceditor/docpublisher/${encodedRepouser}/${encodedReponame}/${encodedBranch}`,
            });
        },
        showAccessDeniedMessage(role) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-primary btn-sm mr-2",
                    cancelButton: "btn btn-light btn-sm",
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons.fire({
                icon: "error",
                title: "Oops...",
                text: `Sorry, you do not have access to ${role}. Please contact your administrator if you would like to access this feature. Thank you.`,
            });
        },
        fetchProjectsData() {
            this.userId = this.$store.state.Auth.userId;
            return this.$store.getters.client
                .get(`/projectuser/byuserid?userId=${this.userId}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        this.$store.commit("setProjectsData", res.data);
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
                    this.messageToast(
                        "Error",
                        "danger",
                        error.response ?
                        error.response.data.message :
                        "An error occurred while fetching project data."
                    );
                });
        },
        controlcommitbtn() {
            this.$refs.viewDetailsModel.show();
        },
        async getcontent() {
            eventBus.$on("getcontent", (data) => {
                this.fileContent = data.content;
                this.currentfilePath = data.path;
                let fileContentObjn = data.content;
                let domParser = new DOMParser();
                let xmlDom = domParser.parseFromString(
                    fileContentObjn,
                    "application/xml"
                );
                if (typeof fileContentObjn === "object") {
                    sessionStorage.setItem("xmlObject", JSON.stringify(""));
                    this.xmlObject = JSON.parse(sessionStorage.getItem("xmlObject"));
                    this.errMessage = "Please select a valid XML file.";
                    return;
                } else {
                    let rootElement = xmlDom.documentElement;
                    this.rootContent = fileContentObjn.split(
                        `<${rootElement.nodeName}`
                    )[0];
                    eventBus.$emit("rootContent", this.rootContent);
                    this.preProcess(xmlDom);
                    this.xmlObjectold = null;
                    if (!this.getdatafromsessionStorage) {
                        this.xmlObjectold = this.xmlDomToJson(xmlDom.childNodes[0]);
                    } else {
                        this.xmlObjectold = sessionStorage.getItem();
                    }
                    this.xmlObjectold = this.xmlDomToJson(xmlDom.childNodes[0]);
                    const body = {
                        nodeDetails: this.xmlObjectold,
                    };
                    if (!data.path) return;
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store.getters.client
                        .post(`/orguser/doceditor/generateNodeId`, body)
                        .then((res) => {
                            this.errMessage = res.data;
                            sessionStorage.setItem("xmlObject", JSON.stringify(res.data));
                            this.xmlObject = JSON.parse(sessionStorage.getItem("xmlObject"));
                            this.sendData();
                            loader.hide();
                        })
                        .catch((err) => {
                            this.errMessage = err.response.data.message;
                            loader.hide();
                        });
                    this.$emit("get-data", this.xmlObject);
                }
            });
        },
        sendData() {
            let that = this;
            eventBus.$emit("xmlData", that.xmlObject);
        },
        convertXmlObjectToXml() {
            let xmlString = this.convertToXml(this.xmlObject);
            return xmlString;
        },
        toggle() {
            if (this.isFolder) {
                this.isOpen = !this.isOpen;
            }
        },
        remove() {
            eventBus.$emit("edit", {
                editWay: "remove",
                name: this.name,
                value: this.value,
            });
        },
        changeType() {
            if (!this.isFolder) {
                this.model.children = [];
                this.addChild();
                this.isOpen = true;
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
                .then(async (res) => {
                    let path = res.data.installedPath + `/${this.projectName}`;
                    this.localRepoPath = res.data.installedPath + `/${this.projectName}`;
                    await this.$store.getters.client
                        .post(`/orguser/workspace/fetchGitRemoteChanges?path=${path}`)
                        .then((res) => {
                            if (
                                res.data.message.includes("please pull your branch to proceed")
                            ) {
                                this.$refs["pull-modal"].show();
                            }
                        });
                    await this.$store.getters.client
                        .get(`/orguser/workspace/repotree?path=${path}`)
                        .then((tres) => {
                            loader.hide();
                            this.model = tres.data;
                        })
                        .catch(() => {
                            loader.hide();
                        });
                })
                .catch(() => {});
        },
        async readXML() {
            await this.getcontent();
            let fileContentObjn = this.fileContent;
            let that = this;
            let domParser = new DOMParser();
            let xmlDom = domParser.parseFromString(
                fileContentObjn,
                "application/xml"
            );
            that.preProcess(xmlDom);
            that.xmlObject = null;
            that.xmlObject = that.xmlDomToJson(xmlDom.childNodes[0]);
            if (that.xmlObject.html && that.xmlObject.text) {
                return;
            }
            that.$emit("get-data", that.xmlObject);
        },
        preProcess(xml) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                if (xml.childNodes[i].nodeType !== 1) {
                    xml.removeChild(xml.childNodes[i]);
                    i--;
                }
            }
        },
        xmlDomToJson(xml) {
            if (xml.nodeType !== 1) {
                return null;
            }
            let obj = {};
            obj.xtag = xml.nodeName;
            // Process the text content if present
            // let nodeText = (xml.textContent || "").replace(/(\r|\n)/g, "").trim();
            // if (nodeText) {
            //   obj.text = nodeText;
            // }
            // Convert the XML element's attributes
            if (xml.attributes.length > 0) {
                for (let i = 0; i < xml.attributes.length; i++) {
                    let attribute = xml.attributes[i];
                    obj[attribute.nodeName] = attribute.nodeValue;
                }
            }
            // Convert the XML element's childNodes
            let items = [];
            for (let i = 0; i < xml.childNodes.length; i++) {
                let node = xml.childNodes[i];
                if (node.nodeType === 1) {
                    let item = this.xmlDomToJson(node); // Call recursion to convert childNodes
                    if (item) {
                        items.push(item);
                    }
                } else if (node.nodeType === 3) {
                    let text = (node.textContent || "").replace(/(\r|\n)/g, "").trim();
                    if (text) {
                        items.push(text);
                    }
                }
            }
            if (items.length > 0) {
                obj[obj.xtag] = items;
            }
            return obj;
        },
        createPullreq() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client
                .post(
                    `/orguser/workspace/pullGitChanges?projectName=${this.projectName}`
                )
                .then((res) => {
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
                    res;
                    this.$refs["pull-modal"].hide();
                    loader.hide();
                    this.messageToast(
                        "Success",
                        "success",
                        "Pull request successfully completed "
                    );
                })
                .catch((err) => {
                    loader.hide();
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        err.response.data.message
                    );
                });
        },
        getData(data) {
            this.clickedTag = data;
        },
        sendTextAjax: function (interfacever, sendData, func) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = "";
            //get and process data
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 1) {
                    xhr.setRequestHeader("If-Modified-Since", "0");
                    xhr.setRequestHeader("Cache-Control", "no-cache");
                    xhr.setRequestHeader("Content-Type", "application/json");
                }
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.statuss == 304) {
                        let data = xhr.response;
                        if (func) {
                            func(data);
                        }
                    } else {
                        if (interfacever.alertMessage) {
                            alert(interfacever.alertMessage + " " + xhr.status);
                        }
                    }
                }
            };
            //send data
            if (typeof sendData == "object") {
                sendData = JSON.stringify(sendData);
            }
            if (interfacever.type == "GET" || interfacever.type == "get") {
                xhr.open("GET", interfacever.url + "?data=" + sendData, true);
            } else {
                xhr.open("POST", interfacever.url, true);
            }
            xhr.send(sendData);
        },
        //deep copy of array and object
        deepCopy: function (origin) {
            return JSON.parse(JSON.stringify(origin));
        },
        //Number Quick Sort
        quickSort: function (origin) {
            let a = this.deepCopy(origin);
            //conversion type
            for (let i = 0; i < a.length; i++) {
                if (!isNaN(parseFloat(a[i]))) {
                    a[i] = parseFloat(a[i]);
                }
            }
            if (a.length <= 1) {
                return a;
            }
            let flagIndex = Math.floor(a.length / 2);
            let flag = a.splice(flagIndex, 1)[0];
            let left = []; //store elements smaller than flag
            let right = []; //Store elements larger than flag
            for (let i = 0; i < a.length; i++) {
                if (a[i] < flag) {
                    left.push(a[i]);
                } else {
                    right.push(a[i]);
                }
            }
            //recursive condition
            return this.quickSort(left).concat(flag, this.quickSort(right));
        },
        //Object array sorted by attribute name
        objectSort: function (origin, prop) {
            let a = this.deepCopy(origin);
            //conversion type
            for (let i = 0; i < a.length; i++) {
                if (!isNaN(parseFloat(a[i][prop]))) {
                    a[i][prop] = parseFloat(a[i][prop]);
                }
            }
            //end condition
            if (a.length <= 1) {
                return a;
            }
            let flagIndex = Math.floor(a.length / 2);
            let flag = a.splice(flagIndex, 1)[0];
            let left = [];
            let right = [];
            for (let i = 0; i < a.length; i++) {
                if (a[i][prop] < flag[prop]) {
                    left.push(a[i]);
                } else {
                    right.push(a[i]);
                }
            }
            return this.objectSort(left).concat(flag, this.quickSort(right));
        },
        //Get the current date string function
        getDate: function () {
            var a = new Date();
            var year = a.getFullYear();
            var month = a.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            var date = a.getDate();
            if (date < 10) {
                date = "0" + date;
            }
            var b = year + "-" + month + "-" + date;
            return b;
        },
        processJson(json) {
            const copyJson = JSON.parse(JSON.stringify(json));
            this.deleteAdditionalFields(copyJson);
            return copyJson;
        },
        deleteAdditionalFields(nodeDetails) {
            if (typeof nodeDetails === "string") return;
            const tagName = nodeDetails.xtag;
            delete nodeDetails.nodeId;
            delete nodeDetails.childFrequency;
            if (nodeDetails.xtagNew) delete nodeDetails.xtagNew;
            if (!nodeDetails[tagName] || !nodeDetails[tagName].length) return;
            for (const childNode of nodeDetails[tagName]) {
                this.deleteAdditionalFields(childNode);
            }
        },
        // formattedXmlText() {
        //   let result = this.processJson(this.xmlObject);
        //   let parser = new JsonToXml();
        //   result = parser.parse(result);
        //   this.formattedXml = xmlFormatter(result, { indentation: "  " });
        // },
        async saveContent() {
            if (document.getElementsByClassName("toast").length) {
                return;
            }
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.clearChanges();
            let result = this.processJson(this.xmlObject);
            let parser = new JsonToXml();
            result = parser.parse(result);
            this.formattedXml = result;
            const xmlWithRoot =
                this.rootContent +
                xmlFormat(this.formattedXml, {
                    indentation: "  ",
                    filter: (node) => node.type !== "Comment",
                    collapseContent: true,
                    lineSeparator: "\n",
                });
            let fileSaveObj = {
                path: this.currentfilePath,
                content: xmlWithRoot,
            };
            await this.$store.getters.client
                .post(`/orguser/workspace/savefilecontent`, fileSaveObj)
                .then(() => {
                    this.showCommitBtn = true;
                    loader.hide();
                    this.messageToast(
                        "Success",
                        "success",
                        "Your changes have been saved successfully into your workspace."
                    );
                })
                .catch((err) => {
                    loader.hide();
                    this.messageToast("Request failed", "danger", err);
                });
        },
    },
};
</script>

<style scoped>
.custom-ditamap,
.custom-navigation,
.custom-toolbar-container {
    padding: 24px;
    gap: 24px;
    background-color: rgba(113, 165, 203, 0.2);
}

.custom-toolbar-container {
    padding: 18px;
}

.custom-navigation {
    padding: 14px;
}

.btn-light {
    border-radius: 4px;
    padding: 2px;
    padding-left: 10px;
    padding-right: 10px;
    color: rgba(23, 35, 61, 1);
    background-color: #fff;
}

.custom-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.5px;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}

* {
    margin: 0px;
    padding: 0px;
}

.card-header {
    justify-content: center !important;
    background-color: rgba(113, 165, 203, 0.2) !important;
}

.custom-jstree {
    padding-bottom: 5rem;
}

.custom-simplebar {
    background-color: #ffff;
    height: 100vh;
    margin: 0;
    padding: 0;
}

.custom-tree-simplebar {
    height: 84vh;
    padding-bottom: 20px;

}

.row {
    position: sticky;
}

.ditamap-img {
    height: 20px;
    padding: 0px;
}

.folder-icon {
    font-size: 11px;
    width: 11px;
    color: #1c274c;
    margin-right: 0.2rem;
}

.custom-recursivetags {
    overflow: auto;
    height: 83vh;
    font: 12pt;
}

.custom-tree {
    height: 72vh;
}

.toggle-switch-img {
    height: 25px;
    padding: 0;
}

.toggle-switch-img-tag {
    height: 20px;
    padding: 0;
}

.error-text {
    bottom: 0;
    left: 0;
    right: 0;
    color: #666;
    font-size: 2vw;
    padding: 20px;
}

.edit-tags {
    height: 82vh;
}

.text-view {
    height: 80vh;
}

.icon-cog {
    color: #1c274c;
}

.placeholder-img {
    height: 250px;
    margin-bottom: 10px;
}

.bold {
    font-weight: bold;
}

.truncated-path {
    overflow: hidden;
    font-family: "Roboto";
    font-size: 12px;
    color: #1c274c;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 1px);
    padding-left: 8px;
}

.card {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(198, 198, 198, 1);
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgba(198, 198, 198, 1);
    background-color: white;
}

.b-navbar {
    border: 1px solid rgba(198, 198, 198, 1);
    background-color: white;
}

.tree-rows {
    padding-left: 10px;
    padding-top: 0px;
}

hr {
    margin-top: 0rem;
    margin-bottom: 0rem;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.card {
    height: 93vh;
    border-radius: 0;
}

.toolbar {
    background-color: #f1f5f7;
    border-radius: 2rem;
    margin-left: 2rem;
    margin-right: 2rem;
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.truncated-path {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 1px);
    /* Adjust the padding value to create the desired distance */
    padding-left: 8px;
    /* Adjust the padding value to create the desired distance */
}

.editor-page {
    margin-left: 1rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin-right: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: white;
    border: 1px #d3d3d3 solid;
    min-height: 256mm;
}

.read-only {
    font-size: 20px;
    padding: 20px;
    color: #1c274c;
    font-family: "Roboto";
    text-align: center;
}

.error-text {
    padding: 20px;
}

@media screen and (min-width: 601px) {
    .error-text {
        font-size: 2vw;
    }
}

@media screen and (max-width: 600px) {
    .error-text {
        font-size: 30px;
    }
}

@media screen and (max-width: 280px) {
    .read-only {
        font-size: 10px;
        text-align: center;
        padding: 25px;
    }
}
</style>
