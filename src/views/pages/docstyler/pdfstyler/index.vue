<template>
    <div>
        <!-- Progress Modal -->
        <b-modal id="modal-progress" ref="modaloutputprogress" hide-header title="Processing" title-class="font-18"
            hide-footer hide-close no-close-on-backdrop no-close-on-esc>
            <strong>Please wait</strong>
            <br />
            <p>Working on customization to receive the desired output.</p>
            <b-progress :value="progress" :max="100" class="custom-progress"></b-progress>
        </b-modal>
        <!-- Sidebar -->
        <div class="row">
            <div class="col-xl-3 col-lg-4  user-select-none">
                <div no-body>
                    <div class="custom-html-styler d-flex justify-content-between align-items-center flex-wrap">
                        <div class="custom-title mb-0">
                            PDF STYLER
                        </div>
                    </div>
                    <div class="border-top">

                        <!-- Front Page Form Link -->
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title"
                                :class="{ active: currentFormNumber === 1, '': currentFormNumber === 1 }"
                                @click="changeForm(1)">
                                <i class="mdi mdi-home font-size-18 align-middle mr-2"></i> Front Page
                            </a>
                        </div>
                        <!-- Table of Content Form Link -->
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title"
                                :class="{ active: currentFormNumber === 2, '': currentFormNumber === 2 }"
                                @click="changeForm(2)">
                                <i class="mdi mdi-format-list-bulleted font-size-18 align-middle mr-2"></i> Table of
                                content
                            </a>
                        </div>
                        <!-- Header/Footer Form Link -->
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title"
                                :class="{ active: currentFormNumber === 3, '': currentFormNumber === 3 }"
                                @click="changeForm(3)">
                                <i class="mdi mdi-page-layout-header-footer font-size-18 align-middle mr-2"></i>
                                Header/Footer
                            </a>
                        </div>
                        <!-- Commons Form Link -->
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title"
                                :class="{ active: currentFormNumber === 4, '': currentFormNumber === 4 }"
                                @click="changeForm(4)">
                                <i class="mdi mdi-folder-multiple-outline font-size-18 align-middle mr-2"></i> Commons
                            </a>
                        </div>
                        <!-- Tables Form Link -->
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title"
                                :class="{ active: currentFormNumber === 5, '': currentFormNumber === 5 }"
                                @click="changeForm(5)">
                                <i class="mdi mdi-table-large font-size-18 align-middle mr-2"></i> Tables
                            </a>
                        </div>
                        <!-- Lists Form Link -->
                        <div class="categories-group-card">
                            <a class="categories-group-list card-title"
                                :class="{ active: currentFormNumber === 6, '': currentFormNumber === 6 }"
                                @click="changeForm(6)">
                                <i class="mdi mdi-format-list-bulleted font-size-18 align-middle mr-2"></i> Lists
                            </a>
                        </div>

                    </div>
                </div>
            </div>
            <!-- Main Content Area -->
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
                            <!-- Dynamic Form Component -->
                            <component :formDataList="formDataList" :is="currentForm" :form-number="currentFormNumber"
                                @form-submitnew="handleformSubmit" @data-mounted="handleChildData"
                                @next-form="handlenextbtn" @final-submit="finalSubmit"></component>
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
import frontpage from './components/frontpage.vue'
import TableOfContent from './components/tableofcontent.vue'
import HeaderFooter from './components/headerfooter.vue'
import Commons from './components/commons.vue'
import tables from './components/tables.vue'
import lists from './components/lists.vue'

export default {
    components: {
        frontpage,
        TableOfContent,
        HeaderFooter,
        Commons,
        tables,
        lists,
    },
    data() {
        return {
            progress: 0,
            condition: true,
            currentFormNumber: 1,
            totalForms: 6,
            formDataList: {},
            childData: {},
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
                    return 'frontpage'
                case 2:
                    return 'TableOfContent'
                case 3:
                    return 'HeaderFooter'
                case 4:
                    return 'Commons'
                case 5:
                    return 'tables'
                case 6:
                    return 'lists'
                default:
                    return null
            }
        },
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
        },
        handledefualt() {
            this.redirectDocPublishrer()
            this.messageToast(
                "Success",
                "success",
                "Your DITA-OT has been reset to its default settings."
            );
        }
    }
}
</script>
<style scoped>
/* form {
    margin: 2rem 0;
    padding: 2rem;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
} */
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
