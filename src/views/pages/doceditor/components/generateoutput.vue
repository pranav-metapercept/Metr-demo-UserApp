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
        <!-- Conditional HR -->
        <hr />
        <div v-if="!hideform" class="card">
            <div class="card-body">
                <form novalidate @submit.prevent>
                    <!-- Title Input -->
                    <div class="form-group">
                        <label>Title <span class="text-secondary">*</span></label>
                        <input v-validate="'required'" required v-model="typeform.releaseTitle"
                            @keydown.space="preventLeadingSpace" name="releaseTitle" type="text" id="releaseTitle"
                            class="form-control" placeholder="Enter release title" :class="{
                                'is-invalid': submitted && $v.releaseTitle.$error,
                            }" />
                        <p class="text-danger text-sm" v-show="errors.has('releaseTitle') &&
                            _.find(errors.items, { field: 'releaseTitle' }).rule == 'required'
                            ">
                        </p>
                    </div>
                    <!-- Input Source Dropdown -->
                    <div class="form-group">
                        <label>Input Source Ditamap <span class="text-secondary">*</span></label>
                        <div>
                            <select class="form-control" v-validate="'required'" required v-model="typeform.inputPath">
                                <option value="" disabled selected>Select source Ditamap</option>
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
                        <label>Output Format <span class="text-secondary">*</span></label>
                        <div>
                            <select class="form-control" v-validate="'required'" required v-model="typeform.outputFormat">
                                <option value="" disabled selected>Select output format</option>
                                <option v-for="data in selectOutputFormat" :key="data.id" :value="data.transtype">{{
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
                    <div class="form-group text-right mb-0">
                        <div>
                            <button :disabled="!(typeform.outputFormat && typeform.inputPath && typeform.releaseTitle)"
                                class="btn btn-sm  btn-primary" v-on:click="generateOutputFun(projectPath, workspacePath)">
                                Transform
                            </button>
                            <button @click="resetform" class="btn btn-light btn-sm  m-l-5 ml-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- Pull Request Modal -->
        <b-modal ref="pull-modal" hide-footer hide-header hide-close no-close-on-backdrop no-close-on-escer>
            <div class="d-block text-center">
                <h3>
                    You will need to Create a Pull Request.
                    <br />
                    We noticed that your repository is currently behind the latest changes. To ensure that your code is up
                    to date and aligned with the latest developments, you will need to create a pull request.
                </h3>
            </div>
            <hr class="my-2" />
            <button class="btn btn-primary btn-sm  " block @click="createPullreq()">
                Pull Repository
            </button>
        </b-modal>
    </div>
</template>

<script>
import _ from "lodash";

import checkurl from "../../../../components/urlvalidator";
export default {

    data() {
        return {

            typeform: {
                inputPath: "",
                outputPath: "",
                outputFormat: "",
                releaseTitle: "",
            },
            selectInput: null,
            projectName: null,
            repouser: null,
            brachName: null,
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
            releaseParams: null
        };
    },
    created() {


        this.hideform = false;
    },
    mounted() {

        this.hideform = false;
    },
    computed: {
        _() {
            return _;
        },
    },
    methods: {

        // Function to prevent leading space in an input field
        preventLeadingSpace(e) {
            // only prevent the keypress if the value is blank
            if (!e.target.value) e.preventDefault();
            // otherwise, if the leading character is a space, remove all leading white-space
            else if (e.target.value[0] == " ")
                e.target.value = e.target.value.replace(/^\s*/, "");
        },
        // Function to display a toast message  
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        // Function to validate a URL
        validateURL() {
            const newRepoUser = this.$route.params.repouser;
            const newRepoName = this.$route.params.reponame;
            const oldRepoUser = localStorage.getItem("repouser");
            const oldRepoName = localStorage.getItem("reponame");
            if (newRepoName !== oldRepoName || newRepoUser !== oldRepoUser) {
                checkurl(newRepoName);
            }
        },
        // Function to create a Pull Request



        async getoutputFormat() {
            await this.$store.getters.client
                .get(`/plugins`)
                .then((res) => {
                    this.selectOutputFormat = res.data;
                })
                .catch(() => { });
        },
        resetform() {
            this.typeform.inputPath = "";
            this.typeform.outputFormat = "";
            this.typeform.releaseTitle = "";
        },
        openDownload() {

            this.$router.push({
                path: `/docmanager/details`,
            });
        },
    },
};
</script>
<style scoped>
label {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}
</style>