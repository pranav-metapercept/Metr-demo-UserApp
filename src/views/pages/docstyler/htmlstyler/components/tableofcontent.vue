<template>
    <div>
        <!-- Header Configuration Section (conditionally shown) -->
        <div v-if="!disabledSpaceAfter">
            <h5 class="mb-2 text-primary p-2  title">Header</h5>
            <div class="form-group row">
                <!-- Font Family Selection for Header -->
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-family">Font-Family</label>
                    <multiselect v-model="toc_header.fontFamily" :options="frontmatter_title_fonts.map(item => item.name)">
                    </multiselect>
                </b-col>
                <!-- Color Input for Header -->
                <b-col sm="6 mt-2 mb-0">
                    <label for="color">Color</label>
                    <input type="color" id="color" class="form-control" v-model="toc_header.color">
                </b-col>
                <!-- Font Size Selection for Header -->
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-size">Font-Size</label>
                    <multiselect v-model="toc_header.fontSize" :options="toc_header_fontsize.map(item => item.value)">
                    </multiselect>
                </b-col>
                <!-- Font Weight Selection for Header -->
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-weight">Font-Weight</label>
                    <multiselect v-model="toc_header.fontWeight" :options="toc_header_fontweight.map(item => item.value)">
                    </multiselect>
                </b-col>
            </div>
        </div>
        <!-- Chapter Content Configuration Section (conditionally shown) -->
        <div v-if="!disabledSpaceAfter">
            <h5 class="mb-2 text-primary p-2  title">Chapter Content</h5>
            <div class="form-group row">
                <!-- Font Size Selection for Chapter Content -->
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-size">Font-Size</label>
                    <multiselect v-model="toc_chap_content.fontSize"
                        :options="toc_chap_content_fontsize.map(item => item.value)">
                    </multiselect>
                </b-col>
                <!-- Font Weight Selection for Chapter Content -->
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-weight">Font-Weight</label>
                    <multiselect v-model="toc_chap_content.fontWeight"
                        :options="toc_chap_content_fontweight.map(item => item.value)">
                    </multiselect>
                </b-col>
                <!-- Color Input for Chapter Content -->
                <b-col sm="6 mt-2 mb-0">
                    <label for="color">Color</label>
                    <input type="color" id="color" class="form-control" v-model="toc_chap_content.color">
                </b-col>
            </div>
        </div>
        <!-- Leader Configuration Section (conditionally shown) -->
        <h5 v-if="!disabledLeader" class="text-primary p-2  title">Leader</h5>
        <div v-if="!disabledLeader" class="form-group row">
            <!-- Leader Pattern Selection for Leader -->
            <b-col sm="6 mt-2 mb-0">
                <label for="leader-pattern">Leader-Pattern</label>
                <multiselect v-model="toc_leader.leader" :options="toc_leadter_pattern.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <!-- Sidebar Configuration Section (conditionally shown) -->
        <h5 v-if="!disabledSidebar" class="text-primary p-2  title">Sidebar</h5>
        <div v-if="!disabledSidebar" class="form-group row">
            <!-- Background Color Input for Sidebar -->
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Background-Color</label>
                <input type="color" id="color" class="form-control" v-model="toc_sidebar.backgroundColor">
            </b-col>
            <!-- Color Input for Sidebar -->
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="color" class="form-control" v-model="toc_sidebar.color">
            </b-col>
            <!-- Active Topic Color Input for Sidebar -->
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Active-Topic-Color</label>
                <input type="color" id="color" class="form-control" v-model="toc_sidebar.ActiveTopicColor">
            </b-col>
        </div>
        <!-- Buttons Section -->
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
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";
import {
    eventBus
} from "../../../../../main";
export default {
    props: ['formDataList'],
    components: {
        Multiselect
    },
    data() {
        return {
            rating: '',
            disabledSpaceBefore: false,
            disabledSpaceAfter: false,
            disabledLeader: false,
            disabledSidebar: true,
            condition: true,
            toc_header: {
                fontFamily: null,
                color: null,
                fontSize: null,
                fontWeight: null,
            },
            toc_chap_content: {
                fontSize: null,
                fontWeight: null,
                color: null,
            },
            toc_leader: {
                leader: null,
            },
            toc_sidebar: {
                backgroundColor: null,
                color: null,
                ActiveTopicColor: null,
            },
            //options for toc 
            //Header
            frontmatter_title_fonts: [{
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
            toc_header_fontsize: [{
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
            toc_header_fontweight: [{
                id: 1,
                value: '300'
            }, {
                id: 2,
                value: '400'
            }, {
                id: 3,
                value: '500'
            }, {
                id: 4,
                value: '600'
            }, {
                id: 5,
                value: '900'
            }],
            toc_header_fonts: [{
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
            //chapter content
            toc_chap_content_fontsize: [{
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
            toc_chap_content_fontweight: [{
                id: 1,
                value: '300'
            }, {
                id: 2,
                value: '400'
            }, {
                id: 3,
                value: '500'
            }, {
                id: 4,
                value: '600'
            }, {
                id: 5,
                value: '900'
            }],
            //leader-pattern
            toc_leadter_pattern: [{
                id: 1,
                name: 'Dots',
                value: 'dots'
            }, {
                id: 2,
                name: 'Rule',
                value: 'rule'
            }, {
                id: 3,
                name: 'Space',
                value: 'space'
            }, {
                id: 4,
                name: 'Use-content',
                value: 'use-content'
            }],
        }
    },
    computed: {
        formattedMessage() {
            return {
                toc_header: this.toc_header,
                toc_chap_content: this.toc_chap_content,
                toc_leader: this.toc_leader,
                toc_sidebar: this.toc_sidebar
            };
        },
    },
    created() {
        // Call the updateFormData method with your formDataList
        this.updateFormData(this.formDataList);
    },
    beforeDestroy() {
        this.submitForm();
    },
    mounted() {
        const data = {
            title: "Table of Content",
            paragraph: "Use these fields to design the toc .",
            icons: 'mdi mdi-format-list-bulleted font-size-26 align-middle mr-2'
        };
        this.$emit("data-mounted", data);
        eventBus.$on("theme-selected", (e) => {
            if (e == "Dynamic Theme 1") {
                this.disabledSpaceBefore = true
                this.disabledSpaceAfter = true
                this.disabledLeader = true
                this.disabledSidebar = false
            } else {
                this.disabledSpaceBefore = false
                this.disabledSpaceAfter = false
                this.disabledLeader = false
                this.disabledSidebar = true
            }
        })
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
            this.toc_header.fontFamily = null,
                this.toc_header.color = null,
                this.toc_header.fontSize = null,
                this.toc_header.fontWeight = null,
                this.toc_header.spacebefore = null,
                this.toc_header.spaceafter = null
            this.toc_chap_content.fontSize = null,
                this.toc_chap_content.fontWeight = null,
                this.toc_chap_content.color = null,
                this.toc_leader.leader = null,
                this.toc_sidebar.backgroundColor = null,
                this.toc_sidebar.color = null,
                this.toc_sidebar.ActiveTopicColor = null
        },
        nextForm() {
            this.$emit('next-form',)
            this.submitForm()
            this.convertDataToLowerCase()
        },
        finalSubmit() {
            this.$emit('final-submit')
            this.convertDataToLowerCase()
        },
        submitForm() {
            const formData = {
                toc_header: this.toc_header,
                toc_chap_content: this.toc_chap_content,
                toc_leader: this.toc_leader,
                toc_sidebar: this.toc_sidebar,
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
}</style>
