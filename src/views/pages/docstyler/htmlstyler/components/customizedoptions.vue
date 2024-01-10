<template>
<div>
    <!-- Header for the Footer Configuration Section -->
    <h5 class="mb-2 text-primary p-2   title">Footer</h5>
    <div class="form-group row">
        <!-- Background Color Input -->
        <b-col sm="6 mt-2 mb-0">
            <label for="color">Background-Color</label>
            <input type="color" id="color" class="form-control" v-model="footer.BackgroundColor">
        </b-col>
        <!-- Copyright Input -->
        <b-col sm="6 mt-2 mb-0">
            <label for="facebook">Copyright</label>
            <input v-validate="'required'" required v-model="footer.copyright" @keydown.space="preventLeadingSpace" name="facebook" type="text" class="form-control" id="facebook" placeholder="Enter Copyright" />
        </b-col>
        <!-- Footer Icons Selection -->
        <b-col sm="12 mt-2 mb-0">
            <label class="control-label">Footer</label>
            <multiselect v-model="footerIcons" :options="options" :multiple="true"></multiselect>
        </b-col>
        <!-- Twitter Redirect Link Input (conditionally shown) -->
        <b-col sm="6 mt-2 mb-0" v-show="showTwitter">
            <label for="name">Twitter Redirect Link</label>
            <input v-validate="'required'" required v-model="footerUrl.twitterUrl" @keydown.space="preventLeadingSpace" name="name" type="text" class="form-control" id="twitter" placeholder="Enter organization name" />
        </b-col>
        <!-- Github Redirect Link Input (conditionally shown) -->
        <b-col sm="6 mt-2 mb-0" v-show="showGithub">
            <label for="github">Github Redirect Link</label>
            <input v-validate="'required'" required v-model="footerUrl.githubUrl" @keydown.space="preventLeadingSpace" name="github" type="text" class="form-control" id="github" placeholder="Enter Github link" />
        </b-col>
        <!-- LinkedIn Redirect Link Input (conditionally shown) -->
        <b-col sm="6 mt-2 mb-0" v-show="showLinkedIn">
            <label for="linkedin">LinkedIn Redirect Link</label>
            <input v-validate="'required'" required v-model="footerUrl.linkedinUrl" @keydown.space="preventLeadingSpace" name="linkedin" type="text" class="form-control" id="linkedin" placeholder="Enter LinkedIn link" />
        </b-col>
        <!-- Facebook Redirect Link Input (conditionally shown) -->
        <b-col sm="6 mt-2 mb-0" v-show="showFacebook">
            <label for="facebook">Facebook Redirect Link </label>
            <input v-validate="'required'" required v-model="footerUrl.facebookUrl" @keydown.space="preventLeadingSpace" name="facebook" type="text" class="form-control" id="facebook" placeholder="Enter Facebook link" />
        </b-col>
    </div>
    <div class="d-flex justify-content-end mt-3">
        <div class="col-sm-auto">
            <!-- Submit Button -->
            <button class="btn btn-primary btn-sm " @click.prevent="confirm()">Submit</button>
        </div>
        <div class="col-sm-auto">
            <!-- Reset Button -->
            <button class="btn btn-light btn-sm " @click.prevent="refreshFormData()">Reset</button>
        </div>
    </div>
</div>
</template>
<script>
import Swal from "sweetalert2";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import _ from "lodash";
import Multiselect from "vue-multiselect";
export default {
    props: ['formDataList'],
    components: {
        Multiselect,
    },
    data() {
        return {
            editor: ClassicEditor,
            editorData: '<p>Initial data</p>',
            rating: '',
            name: '',
            footer: {
                BackgroundColor: null,
                copyright: null
            },
            footerUrl: {
                twitterUrl: null,
                githubUrl: null,
                linkedinUrl: null,
                facebookUrl: null,
            },
            showTwitter: false,
            showGithub: false,
            showLinkedIn: false,
            showFacebook: false,
            submitted: false,
            footerIcons: null,
            condition: true,
            breadcrumb: {
                fontWeight: null,
                fontSize: null,
                fontFamily: null,
                color: null,
                textDecoration: null,
            },
            breadcrumbHover: {
                color: null,
                textDecoration: null,
            },
            options: [
                "Twitter",
                "Github",
                "LinkedIn",
                "Facebook",
            ],
            breadcrumb_fontweight: [{
                id: 1,
                value: '100'
            }, {
                id: 2,
                value: '300'
            }, {
                id: 3,
                value: '400'
            }, {
                id: 4,
                value: '700'
            }, {
                id: 5,
                value: '900'
            }],
            breadcrumb_fonts: [{
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
            breadcrumb_fontsize: [{
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
            breadcrumb_textdecoration: [{
                id: 1,
                name: 'Dashed',
                value: 'dashed'
            }, {
                id: 2,
                name: 'Dotted',
                value: 'dotted'
            }, {
                id: 3,
                name: 'Double',
                value: 'double'
            }, {
                id: 4,
                name: 'Line-through',
                value: 'line-through'
            }, {
                id: 5,
                name: 'Dashed',
                value: 'dashed'
            }, {
                id: 6,
                name: 'None',
                value: 'none'
            }, {
                id: 7,
                name: 'Overline',
                value: 'overline'
            }, {
                id: 8,
                name: 'Solid',
                value: 'solid'
            }, {
                id: 9,
                name: 'Underline',
                value: 'underline'
            }, {
                id: 10,
                name: 'Wavy',
                value: 'wavy'
            }],
        }
    },
    computed: {
        formattedMessage() {
            return {
                breadcrumb: this.breadcrumb,
            };
        },
        _() {
            return _;
        },
    },
    created() {
        this.updateFormData(this.formDataList);
    },
    
    mounted() {
        const data = {
            title: "Customized Options",
            paragraph: "You can use these fields to design various components of a selected theme",
            icons: 'mdi mdi-table font-size-26 align-middle mr-2'
        };
        this.$emit("data-mounted", data);
    },
    watch: {
        $data: {
            deep: true,
            handler() {
                this.convertDataToLowerCase();
            }
        },
        footerIcons: {
            handler: function () {
                this.updateOptions()
            },
            deep: true
        }
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        updateOptions() {
            if (this.footerIcons.includes("twitter")) {
                this.showTwitter = true
            } else {
                this.showTwitter = false
            }
            if (this.footerIcons.includes("github")) {
                this.showGithub = true
            } else {
                this.showGithub = false
            }
            if (this.footerIcons.includes("linkedin")) {
                this.showLinkedIn = true
            } else {
                this.showLinkedIn = false
            }
            if (this.footerIcons.includes("facebook")) {
                this.showFacebook = true
            } else {
                this.showFacebook = false
            }
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
        nextForm() {
            this.$emit('next-form', )
            this.submitForm(),
                this.convertDataToLowerCase()
        },
        finalSubmit() {
            this.$emit('final-submit'),
                this.convertDataToLowerCase()
        },
        refreshFormData() {},
        submitForm() {
            const formData = {
                breadcrumb: this.breadcrumb,
                breadcrumbHover: this.breadcrumbHover,
                footerUrl: this.footerUrl,
                footerIcons: this.footerIcons,
                footer: this.footer
            }
            this.$emit('form-submitnew', formData)
        },
    }
}
</script>
<style scoped>

label{
    font-weight: 400;
}
h1 {
    text-decoration: wavy
}
.form-group {
    margin: 10px;
}
</style>
