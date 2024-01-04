<template>
    <div>
        <!-- Header for the Navbar-Logo Configuration Section -->
        <h5 class="text-primary title p-2  mb-2">Navbar-Logo</h5>
        <div class="form-group row">
            <!-- Logo Image Input -->
            <b-col sm="6">
                <label for="logo-image">Logo</label>
                <input type="file" class="form-control-file" id="logo-image" name="logo-image" accept=".jpg, .jpeg, .png"
                    @change="onFileSelected">
            </b-col>
            <!-- Size Selection -->
            <b-col sm="6">
                <label for="size">Size</label>
                <multiselect v-model="topictitle1Attr.backgroundsize"
                    :options="topictitle1_backgroundImgSize.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <!-- Title Section (conditionally shown) -->
        <h5 v-if="!disabledAlignment" class="text-primary p-2 ">Title</h5>
        <div class="form-group row">
            <!-- Alignment Selection (conditionally shown) -->
            <b-col v-if="!disabledAlignment" sm="6 mt-2 mb-0">
                <label for="alignment">Alignment</label>
                <multiselect v-model="topictitle1Attr.selectedAlignment" :options="alignment.map(item => item.value)">
                </multiselect>
            </b-col>
            <!-- Background Color Input -->
            <b-col sm="6 mt-2 mb-0">
                <label for="background-color">Background-Color</label>
                <input type="color" id="color" class="form-control" v-model="topictitle1Attr.map_title_backgroundcolor">
            </b-col>
            <!-- Font Family Selection (conditionally shown) -->
            <b-col v-if="!disabledFontFamily" sm="6 mt-2 mb-0">
                <label for="font-family">Font-Family</label>
                <multiselect v-model="topictitle1Attr.fontFamily" :options="topictitle1_fonts.map(item => item.name)">
                </multiselect>
            </b-col>
            <!-- Font Color Input (conditionally shown) -->
            <b-col v-if="!disabledFontColor" sm="6 mt-2 mb-0">
                <label for="font-color">Font-Color</label>
                <input type="color" id="color" class="form-control" v-model="topictitle1Attr.map_title_fontcolor">
            </b-col>
            <!-- Font Size Selection (conditionally shown) -->
            <b-col v-if="!disabledFontSize" sm="6 mt-2 mb-0">
                <label for="font-size">Font-Size</label>
                <multiselect v-model="topictitle1Attr.fontSize" :options="topictitle1_fontsize.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <div class="d-flex justify-content-end mt-3">
            <div class="col-sm-auto">
                <!-- Submit Button -->
                <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="confirm()">Submit</b-button>
            </div>
            <div class="col-sm-auto">
                <!-- Next Button -->
                <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="nextForm()">Next</b-button>
            </div>
            <div class="col-sm-auto">
                <!-- Reset Button -->
                <b-button size="sm" variant="light" class="w-100 mb-2" @click.prevent="refreshFormData()">Reset</b-button>
            </div>
        </div>
    </div>
</template>
<script>
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
import {
    eventBus
} from "../../../../../main";
export default {
    props: {
        formDataList: {
            type: Object,
            required: true,
        },
        title: {
            type: [String, Object],
        },
        paragraph: {
            type: [String, Object],
        },
    },
    components: {
        Multiselect
    },
    data() {
        return {
            disabledAlignment: false,
            disabledFontFamily: false,
            disabledFontColor: false,
            disabledFontSize: false,
            topictitle1Attr: {
                logoName: null,
                selectedAlignment: null,
                backgroundsize: null,
                fontFamily: null,
                map_title_backgroundcolor: null,
                map_title_fontcolor: null,
                fontSize: null,
            },
            rating: '',
            condition: true,
            topictitle1_fontsize: [{
                id: 1,
                value: '8pt'
            }, {
                id: 2,
                value: '12pt'
            }, {
                id: 3,
                value: '16pt'
            }, {
                id: 4,
                value: '18pt'
            }, {
                id: 5,
                value: '24pt'
            }, {
                id: 6,
                value: '28pt'
            }, {
                id: 7,
                value: '32pt'
            }, {
                id: 8,
                value: '36pt'
            }, {
                id: 9,
                value: '42pt'
            }, {
                id: 10,
                value: '48pt'
            }],
            alignment: [{
                id: 1,
                value: 'Left'
            }, {
                id: 2,
                value: 'Center'
            }, {
                id: 3,
                value: 'Right'
            }],
            topictitle1_fonts: [{
                id: 1,
                name: 'Serif',
                value: 'serif'
            }, {
                id: 2,
                name: 'Sans-serif',
                value: 'sans-serif'
            }, {
                id: 3,
                name: 'Monospace',
                value: 'monospace'
            }, {
                id: 4,
                name: 'Helvetica',
                value: 'Helvetica'
            }, {
                id: 5,
                name: 'Courier',
                value: 'Courier'
            }],
            topictitle1_backgroundImgSize: [{
                id: 1,
                name: '60px',
                value: '60px'
            }, {
                id: 2,
                name: '70px',
                value: '70px'
            }, {
                id: 3,
                name: '80px',
                value: '80px'
            }, {
                id: 4,
                name: '90px',
                value: '90px'
            }, {
                id: 5,
                name: '100px',
                value: '100px'
            }],
        }
    },
    created() {
        this.updateFormData(this.formDataList);
    },
    beforeDestroy() {
        this.submitForm();
    },
    mounted() {
        const data = {
            title: "Header",
            paragraph: "You can use these fields to design the technical manual's front cover pages.",
            icons: 'mdi mdi-page-layout-header font-size-26 align-middle'
        };
        this.$emit("data-mounted", data);
        eventBus.$on("theme-selected", (e) => {
            if (e == "Dynamic Theme 1") {
                this.disabledAlignment = true
                this.disabledFontFamily = true
                this.disabledFontColor = true
                this.disabledFontSize = true
            } else {
                this.disabledAlignment = false
                this.disabledFontFamily = false
                this.disabledFontColor = false
                this.disabledFontSize = false
            }
        })
    },
    computed: {
        formattedMessage() {
            return {
                frontmatter_title_commons: this.frontmatter_title,
                topic_title: this.topic_title,
            };
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
        convertDataToLowerCase() {
            const dataKeys = Object.keys(this.$data);
            for (const key of dataKeys) {
                const obj = this.$data[key];
                if (typeof obj === "object" && obj !== null) {
                    const keys = Object.keys(obj);
                    for (const innerKey of keys) {
                        if (obj[innerKey] !== null && typeof obj[innerKey] === "string") {
                            obj[innerKey] = obj[innerKey].toLowerCase();
                        }
                    }
                }
            }
        },
        async confirm() {
            if (this.condition) {
                this.submitForm()
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-primary btn-sm mr-2",
                        cancelButton: "btn btn-light btn-sm"
                    },
                    buttonsStyling: false
                });
                await swalWithBootstrapButtons.fire({
                    title: "Are you sure?",
                    text: "You want to make final changes.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.finalSubmit()
                    }
                });
            }
        },
        updateFormData(formDataList) {
            for (const key in formDataList) {
                if (Object.prototype.hasOwnProperty.call(formDataList, key)) {
                    this[key] = formDataList[key];
                }
            }
        },
        refreshFormData() {
            this.topictitle1Attr.selectedAlignment = null,
                this.topictitle1Attr.backgroundsize = null,
                this.topictitle1Attr.fontFamily = null,
                this.topictitle1Attr.map_title_backgroundcolor = null,
                this.topictitle1Attr.map_title_fontcolor = null,
                this.topictitle1Attr.fontSize = null
        },
        onFileSelected(event) {
            const file = event.target.files[0];
            const fileSize = file.size / 1024 / 1024;
            if (fileSize > 3) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-primary btn-sm mr-2",
                        cancelButton: "btn btn-light btn-sm"
                    },
                    buttonsStyling: false
                });
                swalWithBootstrapButtons.fire({
                    icon: 'error',
                    title: 'File size should not exceed 3 MB',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
                event.target.value = null;
            } else {
                const formData = new FormData();
                formData.append('HtmlLogo', file);
                this.topictitle1Attr.logoName = file.name
                const userId = this.$store.state.Auth.userId;
                const orgId = this.$store.state.Auth.orgId;
                this.$store.getters.client.post(`/orguser/docstyler/uploadHtmlLogo?userId=${userId}&orgId=${orgId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(() => { })
                    .catch(() => { });
            }
        },
        nextForm() {
            this.$emit('next-form',)
            this.submitForm()
            this.convertDataToLowerCase()
        },
        finalSubmit() {
            this.$emit('final-submit'),
                this.convertDataToLowerCase()
        },
        submitForm() {
            const formData = {
                topictitle1Attr: this.topictitle1Attr,
            }
            this.$emit('form-submitnew', formData)
        },
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

.star-rating {
    display: inline-block;
}

.star {
    color: orange;
    cursor: pointer;
    position: relative;
    top: -17px;
    bottom: 0px;
}

.filled {
    color: orange;
}

.form-group {
    margin: 10px;
}

@media screen and (max-width: 280px) {
    .btn {
        width: 20px;
        font-size: 8px;
        margin: 0;
        padding: 3px 4px;
    }

    * {
        font-size: 15px;
    }
}
</style>
