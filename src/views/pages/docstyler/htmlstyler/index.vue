<template>
    <div>
        <!-- Modal for showing processing progress -->
        <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-header
            hide-footer hide-close no-close-on-backdrop no-close-on-esc>
            <strong>Please wait</strong>
            <br />
            <p>Working on customization to receive the desired output. </p>
            <b-progress :value="progress" :max="100" class="custom-progress"></b-progress>
        </b-modal>
        <div class="row">
            <div class="col-xl-3 col-lg-4 mb-5  user-select-none">
                <div no-body>
                    <div class="custom-html-styler d-flex justify-content-between align-items-center flex-wrap">
                        <div class="custom-title mb-0">
                            HTML STYLER
                        </div>
                    </div>
                    <div class="border-top">
                        <!-- Categories/Sections in the menu -->
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title"
                                :class="{ active: currentFormNumber === 1, '': currentFormNumber === 1 }"
                                @click="changeForm(1)">
                                <i class="mdi mdi-apps font-size-18 align-middle mr-2"></i> Themes
                            </a>
                        </div>
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title" aria-controls="collapseTwo"
                                :class="{ active: currentFormNumber === 2, '': currentFormNumber === 2 }"
                                @click="changeForm(2)">
                                <i class="mdi mdi-page-layout-header font-size-18 align-middle mr-2"></i> Header
                            </a>
                        </div>
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title" data-toggle="collapse" aria-expanded="false"
                                aria-controls="collapseThree"
                                :class="{ active: currentFormNumber === 3, '': currentFormNumber === 3 }"
                                @click="changeForm(3)">
                                <i class="mdi mdi-format-list-bulleted font-size-18 align-middle mr-2"></i> Table of content
                            </a>
                        </div>
                        <div class="categories-group-card" v-if="!disabledTable">
                            <a class="categories-group-list card-title" data-toggle="collapse" aria-expanded="false"
                                aria-controls="collapseFour"
                                :class="{ active: currentFormNumber === 4, '': currentFormNumber === 4 }"
                                @click="changeForm(4)">
                                <i class="mdi mdi-table font-size-18 align-middle mr-2"></i> Tables
                            </a>
                        </div>
                        <div class="categories-group-card" v-if="disabledTable">
                            <a class="categories-group-list card-title" data-toggle="collapse" aria-expanded="false"
                                aria-controls="collapseFour"
                                :class="{ active: currentFormNumber === 5, '': currentFormNumber === 5 }"
                                @click="changeForm(5)">
                                <i class="mdi mdi-table font-size-18 align-middle mr-2"></i> Customized options
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-9  border-left ">
                <div no-body>
                    <div class="custom-html-styler d-flex justify-content-between align-items-center flex-wrap">
                        <div class="custom-title mb-0">
                            <span class="text-uppercase">{{ childData.title }}</span>
                        </div>
                    </div>
                    <div class="mx-1 border-top">
                        <b-card-sub-title class="mt-3 mb-4">
                            <h6 class="card-subtitle text-center"> {{ childData.paragraph }}</h6>
                        </b-card-sub-title>
                        <!-- Conditional rendering of form components -->
                        <div v-if="currentFormNumber > 0 && currentFormNumber <= totalForms">
                            <component :formDataList="formDataList" :is="currentForm" :title="title"
                                :form-number="currentFormNumber" @form-submitnew="handleformSubmit"
                                @data-mounted="handleChildData" @next-form="handlenextbtn" @final-submit="finalSubmit">
                            </component>
                        </div>
                        <div v-else>
                            <p>No form found</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
import Swal from "sweetalert2";
import Header from './components/header.vue'
import TableOfContent from './components/tableofcontent.vue'
import Themes from './components/theme.vue'
import Table from './components/table.vue'
import CustomizedOptions from './components/customizedoptions.vue'
import {
    eventBus
} from "../../../../main";
import CryptoJS from "crypto-js";
import {
    secretKey
} from "../../../../api/global.env";
export default {
    components: {
        Header,
        TableOfContent,
        Themes,
        Table,
        CustomizedOptions,
    },
    data() {
        return {
            disabledTable: false,
            progress: 0,
            childData: {},
            condition: true,
            currentFormNumber: 1,
            totalForms: 5,
            formDataList: {},
            title: {},
            userId: null,
            orgId: null,
            projectName: null,
            repouser: null,
            brachName: null,
        }
    },
    computed: {
        _() {
            return _;
        },
        currentForm() {
            switch (this.currentFormNumber) {
                case 1:
                    return 'Themes'
                case 2:
                    return 'Header'
                case 3:
                    return 'TableOfContent'
                case 4:
                    return 'Table'
                case 5:
                    return 'CustomizedOptions'
                default:
                    return null
            }
        },
    },
    mounted() {
        eventBus.$on("theme-selected", (e) => {
            if (e == "Dynamic Theme 1") {
                this.disabledTable = true
            } else {
                this.disabledTable = false
            }
        })
    },
    watch: {
        formDataList: {
            handler(newFormData, oldFormData) {
                newFormData,
                    oldFormData
                eventBus.$emit('theme-selected', newFormData.selectedTheme)
                if (newFormData.selectedTheme == "Dynamic Theme 1") {
                    this.disabledTable = true
                } else {
                    this.disabledTable = false
                }
            },
            deep: true
        }
    },
    methods: {
        handleChildData(data) {
            this.childData = data;
        },
        async defaultalert() {
            if (this.condition) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-primary btn-sm mr-2",
                        cancelButton: "btn btn-light btn-sm"
                    },
                    buttonsStyling: false
                });
                await swalWithBootstrapButtons.fire({
                    title: "Are you sure?",
                    text: "This will set all attributes to default as dita-ot files. You will lose your previous attributes sets. Click confirm button to proceed.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Confirm",
                    cancelButtonText: "No",
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.handledefualt()
                    }
                });
            }
        },
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        changeForm(formNumber) {
            this.currentFormNumber = formNumber
        },
        handleformSubmit(formData) {
            this.formDataList = JSON.parse(JSON.stringify({
                ...this.formDataList,
                ...formData
            }))
        },
        handlenextbtn() {
            if (this.disabledTable) {
                if (this.currentFormNumber == 3) {
                    this.currentFormNumber++
                }
            }
            if (this.currentFormNumber < this.totalForms) {
                this.currentFormNumber++
            }
        },
        redirectDocPublishrer() {
         
            this.$router.push({
                path: `/docpublisher`,
            });
        },
        finalSubmit() {
            console.log(this.formDataList);
            this.progress = 0;
            this.$refs["modaloutputprogress"].show();
            const targetProgress = 100;
            const totalTime = 2000;
            const increment = (targetProgress / totalTime) * 50;
            const intervalId = setInterval(() => {
                if (this.progress < targetProgress) {
                    this.progress += increment;
                } else {
                    clearInterval(intervalId);
                }
            }, 20);
            const body = {
                userId: this.userId,
                orgId: this.orgId,
                customizationOptions: this.formDataList,
                projectName: CryptoJS.AES.decrypt(
                    this.$route.params.reponame,
                    secretKey
                ).toString(CryptoJS.enc.Utf8)
            }
            this.$store.getters.client
                .post(`/orguser/docstyler/customizeHtmlOutput`,
                    body
                )
                .then(() => {
                    setTimeout(() => {
                        this.messageToast(
                            "Success",
                            "success",
                            "Your customization has been successfully completed, and now you can publish your document to receive the desired output."
                        );
                    }, 1000)
                    setTimeout(() => {
                        this.redirectDocPublishrer()
                        this.$refs["modaloutputprogress"].hide();
                    }, 2000);
                })
                .catch((err) => {
                    this.$refs["modaloutputprogress"].hide();
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        err.response.data.message
                    );
                });
        },
        handledefualt() {
            const body = {
                userId: this.userId,
                orgId: this.orgId,
                customizationOptions: {},
                projectName: CryptoJS.AES.decrypt(
                    this.$route.params.reponame,
                    secretKey
                ).toString(CryptoJS.enc.Utf8)
            }
            this.$store.getters.client
                .post(`/orguser/docstyler/customizePdfOutput`,
                    body
                )
                .then(() => {
                    this.redirectDocPublishrer()
                    this.messageToast(
                        "Success",
                        "success",
                        "Your DITA-OT has been reset to its default settings."
                    );
                })
                .catch((err) => {
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        err.data.message
                    );
                });
        }
    }
}
</script>
<style scoped>
label {
    font-weight: 400;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}

.custom-html-styler {
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

.custon-btn {
    background: #2b313f !important;
    color: #fff !important;
    border-color: #2b313f !important;
    width: 90px;
    height: 30px;
}

.btn-info {
    width: 130px;
    /* font-size:90%; */
    height: 30px;
    /* overflow-x: scroll; */
    /* white-space: nowrap; */
}

.btn-container {
    display: flex;
    overflow-x: scroll;
}

.card-btn {
    margin: 10px;
    float: right;
}

.categories-group-list {
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: left;
}

.categories-group-list.active {
    color: rgba(254, 94, 69, 1);
}

.bg-card {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 0px;
    padding: 0px;
}

.bg-navbar {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 1vh;
    padding: 0px;
}

.bg-header {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 1vh;
    padding: 0px;
}

.custom-header {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 0px;
    padding: 0px;
}

.headers-icons {
    color: #ffffff;
    font-size: 30px;
    margin-right: 5px;
}

.card-title {
    font-size: 15px;
    margin-top: 0px;
    margin-bottom: 0px;
}

.card-titleNavbar {
    font-size: 15px;
    font-size: 15px;
    margin-top: 0px;
    margin-bottom: 0px;
}

.card-subtitle {
    margin-bottom: -10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
}

.form-header {
    margin: -12px 0 -6px 0;
}

.custom-progress {
    height: 5px;
}
</style>
