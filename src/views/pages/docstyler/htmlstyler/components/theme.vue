<template>
    <div>
        <!-- Select Theme Section -->
        <h5 class="text-primary title p-2 mb-2">Select Theme</h5>
        <div>

            <multiselect class="custom-multiselect" v-model="value" placeholder="Choose Theme" label="title"
                track-by="title" :options="options" :custom-label="customLabel" :show-labels="false">
                <template slot="singleLabel" slot-scope="props">
                    <img class="option__image custom-image" :src="props.option.img" alt="No img Sky">
                    <span class="option__desc">
                        <span class="option__title ml-2">{{ props.option.title }}</span>
                    </span>
                </template>
                <template slot="option" slot-scope="props">
                    <img class="option__image select-img " :src="props.option.img" alt="No img Sky">
                    <div class="option__desc">
                        <span class="option__title">{{ props.option.title }}</span>
                        <span class="option__small">{{ props.option.desc }}</span>
                    </div>
                </template>
            </multiselect>
        </div>
        <div class="form-group row">
            <div class="col-12">
                <!-- Buttons Section -->
                <div class="d-flex justify-content-end mt-3">
                    <div class="col-sm-auto">
                        <!-- Submit Button -->
                        <b-button size="sm" variant="primary" class="w-100 mb-2"
                            @click.prevent="confirm()">Submit</b-button>
                    </div>
                    <div class="col-sm-auto">
                        <!-- Next Button -->
                        <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="nextForm()">Next</b-button>
                    </div>
                    <div class="col-sm-auto">
                        <!-- Reset Button -->
                        <b-button size="sm" variant="light" class="w-100 mb-2"
                            @click.prevent="refreshFormData()">Reset</b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import img1 from '../../../../../assets/htmlStyler/layout_1.png'
import img2 from '../../../../../assets/htmlStyler/layout_2.png'
import img3 from '../../../../../assets/htmlStyler/layout_3.jpg'
import imgDefault from '../../../../../assets/htmlStyler/layout_default.png'
import Swal from "sweetalert2";
import {
    eventBus
} from "../../../../../main";

export default {
    components: {
        Multiselect
    },
    data() {
        return {
            condition: true,
            value: { title: 'Default', desc: '', img: imgDefault },
            options: [
                { title: 'Green', desc: '', img: img1 },
                { title: 'Dark', desc: '', img: img2 },
                { title: 'Dynamic Theme 1', desc: '', img: img3 },
            ]
        }
    },
    watch: {
        value: {
            handler(newValue, oldvalue) {
                oldvalue
                eventBus.$emit('theme-selected', newValue.title)
            }
        }
    },
    created() {
        // Call the updateFormData method with your formDataList
        this.updateFormData(this.formDataList);
    },
    mounted() {
        const data = {
            title: "Themes",
            paragraph: "You can use these fields to design the technical manual's front cover pages..",
            icons: 'mdi mdi-apps font-size-26 align-middle mr-2',
        };
        this.$emit("data-mounted", data);
    },
  
    methods: {
        nextForm() {
            this.$emit('next-form',)
            this.submitForm()
        },
        finalSubmit() {
            alert("hi   ")
            this.$emit('final-submit')
        },
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        updateFormData(formDataList) {
            for (const key in formDataList) {
                if (Object.prototype.hasOwnProperty.call(formDataList, key)) {
                    this[key] = formDataList[key];
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
        submitForm() {
            const formData = {
                selectedTheme: this.value.title,
            }
            this.$emit('form-submitnew', formData)
        },
        customLabel({ title, desc }) {
            return `${title} – ${desc}`
        }
    }
}
</script>
<style scoped>
.select-img {
    max-height: 30vh;
    margin-bottom: 50px;
    width: auto;
    overflow-y: scroll;
}

.custom-multiselect .multiselect__content-wrapper {
    max-height: 10px;
    /* Adjust the desired height here */
    overflow-y: auto;

}

.custom-image {
    height: 30vh;
    overflow: scroll;
    object-fit: fill;
    z-index: 997745;

}
</style>
