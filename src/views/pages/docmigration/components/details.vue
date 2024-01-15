<template>
    <div>

        <!-- Important Message Modal -->
        <b-modal ref="importantMessageModal" hide-footer title="Important Message" hide-close no-close-on-backdrop
            no-close-on-esc>
            <div class="d-block text-center">
                <h6>
                    "I'm sorry, It seems that the formatting of your Word file is not correct, which may be causing some
                    issues. In order to rectify this, you will need to adjust the formatting to ensure that it meets the
                    required standards. Once you have made the necessary changes, please try again."
                </h6>
            </div>
            <hr />
            <button class="btn btn-primary btn-sm mt-3" @click="hideModal">Go Back</button>
        </b-modal>
        <!-- Card for file upload -->
        <div class="container mt-3">
            <div class="card">
                <div class="card-body">
                    <div class="form-group" v-if="!showUploadScreen && !showConvertScreen">
                        <div>
                            <h6>Upload Word File<span class="text-danger">*</span></h6>
                        </div>
                        <form @submit.prevent="submitForm" enctype="multipart/form-data">
                            <!-- File drop zone -->
                            <div class="row">
                                <div class="col-md-12 offset-md-0 col-lg-12 offset-lg-0 drop-zone"
                                    :class="{ dragging: dragging }" @dragover.prevent @dragenter="dragging = true"
                                    @dragleave="dragging = false" @drop="handleDrop">
                                    <!-- Displayed when no file is selected -->
                                    <!-- Displayed when no file is selected -->
                                    <div v-if="!fileSelected" class="text-center" @click="openFileInput">
                                        <img src="../../../../assets/images/upload.svg" class="img-fluid"
                                            style="max-width: 100%;" />
                                        <p class="mt-2">Drag and drop or <span class="text-primary">browse file</span> to
                                            upload
                                        </p>
                                        <p class="m-0 " v-if="!fileName">Accepted file type: docx only</p>
                                    </div>
                                    <div v-if="fileSelected" class="alert alert-success m-2" role="alert">
                                        <p v-if="fileName">Selected file: {{ fileName }}</p>
                                    </div>
                                    <input v-if="!fileSelected" type="file" @change="handleFileInput" class="d-none"
                                        ref="fileInput" name="wordFile" accept=".docx" />
                                </div>
                            </div>
                            <div class="text-right mt-3">
                                <div v-if="!showConvertbtn">
                                    <!-- Buttons for uploading and resetting the form -->
                                    <button type="button" class="btn btn-sm btn-primary mr-2" :disabled="!fileSelected"
                                        @click="sendFileToServer()">
                                        Upload
                                    </button>
                                    <button type="button" class="btn btn-sm btn-light" @click="cancelForm">
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="form-group" v-if="showUploadScreen && !showConvertScreen">
                        <div>
                            <h6>Upload Word File<span class="text-danger">*</span></h6>
                        </div>
                        <form @submit.prevent="submitForm" enctype="multipart/form-data">
                            <!-- File drop zone -->
                            <div class="showConvertbtn ">
                                <div v-if="fileSelected" class="  d-flex justify-content-between p-0 m-0">
                                    <p v-if="fileName"> {{ fileName }}</p>
                                    <p v-if="showConvertbtn" class="text-secondary"><span
                                            class="mdi mdi-check-circle-outline mr-1"></span>Done</p>
                                </div>
                                <b-progress variant="secondary" :value="progress" :max="100"
                                    class="custom-height"></b-progress>
                            </div>
                            <div class="text-right mt-3">
                                <button :disabled="!showConvertbtn" class="btn btn-primary btn-sm"
                                    @click.prevent="convertToDita()">
                                    Convert Now
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="form-group" v-if="showConvertScreen">
                        <div>
                            <h6>Converting to Dita<span class="text-danger">*</span></h6>
                        </div>
                        <form @submit.prevent="submitForm" enctype="multipart/form-data">
                            <!-- File drop zone -->
                            <div class="showConvertbtn ">
                                <div v-if="fileSelected" class="  d-flex justify-content-between p-0 m-0">
                                    <p v-if="fileName"> {{ fileName }}</p>
                                </div>
                                <b-progress variant="secondary" :value="progress" :max="100"
                                    class="custom-height"></b-progress>
                            </div>
                            <div class="text-right mt-3">
                                <button disabled class="btn btn-primary btn-sm" @click.prevent="convertToDita()">
                                    Convert Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from "lodash";

export default {
    data() {
        return {
            progress: 0,
            dragging: false,
            file: null,
            fileName: null,
            fileSelected: false,
            uploadPercentage: 0,
            showConvertbtn: false,
            showUploadScreen: false,
            showConvertScreen: false
        };
    },
    computed: {
        _() {
            return _;
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
        handleDrop(e) {
            e.preventDefault();
            this.dragging = false;
            const file = e.dataTransfer.files[0];
            if (file) {
                if (
                    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                    file.type === "application/msword"
                ) {
                    this.file = file;
                    this.fileName = file.name;
                    this.fileSelected = true;
                } else {
                    this.messageToast("Error", "danger", "Please select a valid Word file.");
                    this.file = null;
                    this.fileName = null;
                    this.fileSelected = false;
                }
            }
        },
        handleFileInput(e) {
            const file = e.target.files[0];
            if (file) {
                if (
                    file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ) {
                    this.file = file;
                    this.fileName = file.name;
                    this.fileSelected = true;
                } else {
                    this.messageToast(
                        "Error",
                        "danger",
                        "Please select a valid Word file."
                    );
                    e.target.value = null;
                    this.fileSelected = false;
                }
            }
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        sendFileToServer() {
            this.showUploadScreen = true
            this.progress = 0;
            const formData = new FormData();
            formData.append("wordFile", this.file);

            const targetProgress = 100;
            const totalTime = 5000; // 5 seconds in milliseconds
            const increment = (targetProgress / totalTime) * 50;
            const intervalId = setInterval(() => {
                if (this.progress < targetProgress) {
                    this.progress += increment;
                } else {
                    clearInterval(intervalId);
                }
            }, 50);
            this.showConvertbtn = true
            this.fileSelected = true
        },
        submitForm() {
            if (this.file) {
                this.sendFileToServer();
            }
        },
        cancelForm() {
            this.file = null;
            this.fileName = null;
            this.dragging = false;
            this.formData = null;
            this.fileSelected = false;
        },
        hideModal() {
            window.location.reload();
        },
        convertToDita() {

            this.progress = 0;
            this.showConvertScreen = true
            let folderName = this.fileName.split('.')
            folderName.pop()
            folderName = folderName.join('.')

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
            setTimeout(() => {
                this.showConvertScreen = false
            }, 2000)
            setTimeout(() => {
                this.$router.push({
                    path: `/docmigration/outputscreen`
                });
                this.showConvertScreen = false
            }, 2000);

        }
    },
};
</script>
<style scoped>
p {
    margin-top: 0;
    margin-bottom: 0.3rem !important;
}

.drop-zone {
    border: 1.5px dashed rgba(15, 52, 96, 1);
    background-color: rgba(113, 165, 203, 0.05);
    display: flex;
    height: 200px;
    padding: 20px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.drop-zone p.mt-2 {
    margin-top: 0.5rem;
    font-size: 20px;
}

.drop-zone p.m-0 {
    font-size: 16px;
    font-weight: 400;
    line-height: 12px;
    letter-spacing: 0.5px;
    text-align: center;
}

.alert-success {
    margin: 0.5rem 0;
}

.btn-secondaryBtn {
    background: #252b3b !important;
    color: #fff !important;
}

.card-icons-btn {
    background: #5864d2;
    color: #fff;
}

.card-icons-btn:hover {
    color: #fff;
}

.progress {
    height: 20px;
}

.progress-bar {
    background-color: rgba(254, 94, 69, 1) !important;
}

.showConvertbtn {
    padding: 0.2rem !important;
    background-color: rgba(220, 222, 226, 0.2);
}

.custom-height {
    height: 5px;
}
</style>
