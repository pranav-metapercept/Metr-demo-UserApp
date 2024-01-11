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
            <button class="btn btn-primary btn-sm " type="submit" @click="openEditor()">
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
                                        <div
                                            class="custom-source  d-flex justify-content-between align-items-center flex-wrap">
                                            <div class="custom-title mb-0">
                                                Source
                                            </div>
                                        </div>
                                        <div class="border-top">
                                            <simplebar v-if="treeData.length > 0" class="mt-1 custom-jstree">
                                                <v-jstree :data="treeData" multiple allow-batch whole-row
                                                    @item-click="itemClick"></v-jstree>
                                            </simplebar>
                                            <template v-else>
                                                <div
                                                    class="d-flex justify-content-center align-items-center no-output-cont">
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
                                        <div
                                            class="custom-source  d-flex justify-content-between align-items-center flex-wrap">
                                            <div class="custom-title mb-0">
                                                Target
                                            </div>
                                        </div>
                                        <div class="border-top">
                                            <div class="download-field " v-on:click="downloadFun()">
                                                <div class="download-btn">
                                                    <span>Download as Zip</span>
                                                    <img class="downloadImg" src="../../../assets/toolbarsvgs/download.svg"
                                                        alt="SVG Image" />
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


import PageHeader from "@/components/pageheader";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


import {
    eventBus
} from "../../../main";

export default {
    components: {
        PageHeader,
        simplebar,
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
            treeData: [
                {
                    "text": "output",
                    "children": [
                        {
                            "text": "commonltr.css",
                            "children": [],
                            "sha": "b1ae8e04c6d6566bcd8a537b53fa3e38c3ded45d",
                            "icon": "ri-file-text-line",
                            "opened": false
                        },
                        {
                            "text": "commonrtl.css",
                            "children": [],
                            "sha": "9a2784d5c76a981ec46a17b0ed7c5466960b8e62",
                            "icon": "ri-file-text-line",
                            "opened": false
                        },
                        {
                            "text": "concepts",
                            "children": [
                                {
                                    "text": "notices.html",
                                    "children": [],
                                    "sha": "10887a46b2c76c0f9dd23dc316c63a44e15358d7",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "taskbook-abstract.html",
                                    "children": [],
                                    "sha": "db2335bec9f62846dd5046e5d0b354f028fc65ae",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                }
                            ],
                            "sha": "7acb0578d41b82e31675bd021ef6d6c217fd76a8",
                            "opened": false
                        },
                        {
                            "text": "index.html",
                            "children": [],
                            "sha": "31d8e2af8b5efc7b6549115306ec151edbbeebbf",
                            "icon": "ri-file-text-line",
                            "opened": false
                        },
                        {
                            "text": "tasks",
                            "children": [
                                {
                                    "text": "closeprograms.html",
                                    "children": [],
                                    "sha": "2a880ccc47e726bf03f2f024703277eba6d5c85d",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "configuredatabase.html",
                                    "children": [],
                                    "sha": "0f3a37b808022edcec59d982b66b84177d1be5ac",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "configurestorage.html",
                                    "children": [],
                                    "sha": "82a5646f3c4d370bb0a63188bfa67f7ebef9f2fa",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "configurewebserver.html",
                                    "children": [],
                                    "sha": "c106d0f3e826de2163ed2ecf407da13918146d03",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "configuring.html",
                                    "children": [],
                                    "sha": "361eeb0d6961e71bc395e79f07c766a2159f730d",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "databasetrouble.html",
                                    "children": [],
                                    "sha": "ad6601e3d91413aa798be321be4b6f5d1a3b942f",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "drivetrouble.html",
                                    "children": [],
                                    "sha": "535ae87d60a782ea03cd8c2d5972f3b9dfb088e3",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "insertdrive.html",
                                    "children": [],
                                    "sha": "2f0545f9f82ac7f67b6cac54dcf8ddcd8be88f5c",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "installdb.html",
                                    "children": [],
                                    "sha": "c63337050895d1bcbc9333fff149962ce3793db9",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "installstorage.html",
                                    "children": [],
                                    "sha": "d8c1b9718b4e0dc28db5f8dcb6fd7ae94cf0987e",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "installwebserver.html",
                                    "children": [],
                                    "sha": "fa392239be1e4f8389aef3f5709ddf076b84eb94",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "maintaindatabase.html",
                                    "children": [],
                                    "sha": "695536fc62ce835f4e7bd7f8bfae838b51861e55",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "maintaining.html",
                                    "children": [],
                                    "sha": "2e6ff1b71727a07380e3ccfe7bb36f61563554a0",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "maintainserver.html",
                                    "children": [],
                                    "sha": "f56639183b43c1750bff887028b04941c3782b75",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "maintainstorage.html",
                                    "children": [],
                                    "sha": "b1af17e0e2e3ab19e863eca61c319ad4cd40b81c",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "replacecover.html",
                                    "children": [],
                                    "sha": "d9017c3acf71b9f2ecb92a4c7a6e918a3bf2dbbf",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "restart.html",
                                    "children": [],
                                    "sha": "a1c58fb1b0b1538140ec19a946ab36f630d69446",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "runsetup.html",
                                    "children": [],
                                    "sha": "7b598ae6171918e2d71fb8dc73d5948a6a450e02",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "troubleshooting.html",
                                    "children": [],
                                    "sha": "b12c420406b51c5264972b6a79ce425905d1bda6",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "unscrewcover.html",
                                    "children": [],
                                    "sha": "23b2a23b35fd004fbeacc250eb50452cd0db2153",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "webtrouble.html",
                                    "children": [],
                                    "sha": "c9e1ad0a6a37789d8211876ae0985b94e12f253b",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                }
                            ],
                            "sha": "7f91446ce83f2d17dd4d11b4f169eadcd950f2f5",
                            "opened": false
                        },
                        {
                            "text": "topics",
                            "children": [
                                {
                                    "text": "installing.html",
                                    "children": [],
                                    "sha": "768a6aa644bb3c55c51aae1df6ade2e9cb89b98a",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "task_appendix.html",
                                    "children": [],
                                    "sha": "3418ab49202ef2b7ee22bf2bb0d61f52bffd2282",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "task_preface.html",
                                    "children": [],
                                    "sha": "12d942fdd677897db9882c1be42f2d4501c6931f",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                },
                                {
                                    "text": "trademarks.html",
                                    "children": [],
                                    "sha": "208ba434445dd9e9af53ad3a012995b65ae2f91b",
                                    "icon": "ri-file-text-line",
                                    "opened": false
                                }
                            ],
                            "sha": "ef764edb37c4010742f07799da65d766856f553b",
                            "opened": false
                        }
                    ],
                    "sha": "70e5166a1c141760286f9d3413c7288e3165efc7",
                    "opened": false
                }
            ]
            ,
            repobranchesdata: [],
            ditaotVersion: "",
            projectName: null,
            repouser: null,
            selected: "main",
            isLoading: false,
            downloadURL: "",
            brachName: "main",
            urlParserRegex: /^[/]([^/]+)[/]([^/]+)[/]tree[/]([^/]+)[/](.*)/,
            outputURL: null,
            gitToken: null,
            isDocEditor: null,
            isDocPublisher: null,
            editor: ClassicEditor,
            editorData: null,
            editorLoader: false,
            modal: false,
            userId: null,
            ditaOtVersions: '4.3.2'
        };
    },
    async mounted() {
        eventBus.$emit("update-sidebar", "menuitems.docmanager.text");
    
    },
    methods: {
        async openEditor() {
            this.navigateToEditor();
        },
        navigateToEditor() {
            this.$router.push({
                path: `/doceditor`,
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
       

       
        // Download output folder as a zip
        async downloadFun() {

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
