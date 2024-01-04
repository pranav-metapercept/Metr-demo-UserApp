<template>
<div>
    <!-- Check if a valid file is not selected and an error message is provided -->
    <div v-if="!validFileSelected && typeof errorMessage === 'string'" class="text-center d-flex flex-column align-items-center">
        <div class="d-flex justify-content-center align-items-center m-0 p-0">
            <div class="text-center">
                <img class="image-style" src="../../../../assets/placeholder.png" />
                <div class="error-text">
                    {{ errorMessage || "Please select a valid XML file." }}
                </div>
            </div>
        </div>
    </div>
    <!-- Check if a tag is not selected -->
    <div v-else-if="!tagSelected">
        <div class="text-center d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                    <img class="image-style" src="../../../../assets/placeholder.png" />
                    <div class="error-text">Please select a valid tag</div>
                </div>
            </div>
        </div>
    </div>
    <!-- Display content when a tag is selected -->
    <div v-else>
        <div class="row" no-body>
            <div class="col-md-12">
                <div>
                    <!-- Check if no attributes are added -->
                    <div v-if="attributeList.length === 0 && !addAttributeVisibleInput" class="text-center d-flex flex-column align-items-center">
                        <div class="d-flex justify-content-center align-items-center m-0 p-0">
                            <div class="text-center">
                                <img class="image-style" src="../../../../assets/placeholder.png" />
                                <div class="error-text">No attribute added</div>
                            </div>
                        </div>
                    </div>
                    <!-- Display attribute table when attributes are present -->
                    <div class="col-lg-12" v-if="attributeList.length > 0">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title text-uppercase">Selected tag : {{ this.tagName }}</h4>
                                <p class="card-title-desc">
                                    This table displays attribute information of <code>{{ this.tagName }}</code> tag.
                                </p>
                                <div class="table-responsive table-striped" simplebar>
                                    <table class="table table-sm m-0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Attribute</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-body">
                                            <tr v-for="(attribute, index) in attributeList" :key="index">
                                                <th scope="row">{{ index + 1 }}</th>
                                                <td>{{ attribute.name }}</td>
                                                <td>{{ attribute.value }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Button to add a new attribute -->
        <div v-if="!addAttributeVisibleInput" class="col-md-12 text-center">
            <button @click="showAddAttribute" class="btn btn-primary btn-sm">Add Attribute</button>
        </div>
        <!-- Input form to add a new attribute -->
        <div v-if="addAttributeVisibleInput" class="mt-1">
            <div class="col-md-12">
                <form ref="form" @submit.stop.prevent="handleSubmit" class="mt-2">
                    <div>
                        <div class="row mx-2 add-attribute-form">
                            <h6 class="heading-center">Add Attribute</h6>
                            <div class="col-md-12">
                                <b-form-group label-for="Text-input" invalid-feedback="Attribute is required">
                                    <div>
                                        <label class="typo__label">Select an attribute</label>
                                        <multiselect v-model="selectedAttribute" :options="attributeOptions" :searchable="false" :close-on-select="true" :show-labels="false" :option-height="5" class="responsive-multiselect">
                                        </multiselect>
                                        <pre class="language-json"><code>{{ value }}</code></pre>
                                    </div>
                                </b-form-group>
                            </div>
                            <div class="col-md-12">
                                <label class="typo__label">Enter Value</label>
                                <b-form-group label-for="Text-input" invalid-feedback="Text is required">
                                    <b-form-input class="col-md-" id="name-input" v-model="selectedAttributeValue" required placeholder="Enter attribute Value"></b-form-input>
                                </b-form-group>
                            </div>
                            <div class="d-flex justify-content-center col-md-12 mb-4">
                                <button class="btn btn-primary btn-sm mr-2" @click="setvalue()" :disabled="!selectedAttribute || !selectedAttributeValue">
                                    Add
                                </button>
                                <button class="btn btn-light btn-sm" @click="showAddAttribute()">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<style>
.overflow-wrap {
    word-wrap: break-word;
    word-break: break-all;
}
.image-style {
    height: 200px;
}
.error-text {
    color: #666;
    font-size: 1vw;
}
.table-body {
    overflow: scroll;
}
.add-attribute-form {
    background-color: #f1f5f7;
}
.heading-center {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 15px;
}
.b-form-select select option {
    height: 5px;
}
.b-form-select .dropdown-menu {
    z-index: 1000;
}
.table-striped {
    height: 18vh;
}
.responsive-multiselect {
    width: 100%;
    /* By default, take the full width */
}
@media screen and (max-width: 576px) {
    .multiselect__placeholder {
        background-color: red;
        font-size: 1vh;
    }
    .col-md-12 .form-control::placeholder {
        display: none;
    }
}
@media screen and (max-width: 992px) {
    .image-style {
        height: 150px;
    }
}
@media screen and (max-width: 768px) {
    .image-style {
        height: 15vh;
    }
    .multiselect__placeholder {
        display: none;
    }
}
@media screen and (max-width: 820px) {
    .image-style {
        height: 15vh;
    }
    .multiselect__placeholder {
        font-size: 0vh;
    }
    .col-md-12 .form-control::placeholder {
        font-size: 0vh;
        padding-bottom: 20px;
        text-wrap: wrap;
        text-align: justify;
    }
}
@media screen and (max-width: 576px) {
    .image-style {
        height: 30vh;
    }
    .error-text {
        color: #666;
        font-size: 3vw;
    }
   
}
@media screen and (max-width: 320px) {
    .image-style {
        height: 15vh;
    }
}
@media screen and (max-width: 280px) {
    .table-striped {
        height: 10vh;
    }
    .image-style {
        height: 15vh;
    }
    .error-text {
        color: #666;
        font-size: 3vw;
    }
}
</style>
<script>
import {
    eventBus
} from '../../../../main';
import schema from "../../../../assets/schema.js"
import Multiselect from "vue-multiselect";
export default {
    components: {
        Multiselect,
    },
    props: {
        data: {
            type: [Object, String],
            required: true,
        },
        errorMessage: {
            type: [Object, String, undefined],
        },
    },
    data() {
        return {
            tagSelected: false,
            validFileSelected: true,
            attributeList: [],
            schema: {},
            addAttributeVisibleInput: false,
            showAddAttributebtn: false,
            selectedAttribute: null,
            selectedAttributeValue: null,
            attributeOptions: [],
            tagName: '',
            nodeId: '',
            xtagOptions: [],
            nameState: null,
            currentname: null,
            indexNum: null,
            selectedTagNodeId: null,
            xmlObject: null,
            TextList: [],
            isView: false,
            addTag: false,
            addAttr: false,
            attrData: [],
            selectedTagData: null
        };
    },
    created() {
        eventBus.$on("setCollectedTagData", (selectedTagData) => {
            this.selectedTagData = selectedTagData
            this.tagName = selectedTagData.xtag
            this.attributeOptions = Object.keys(this.schema[selectedTagData.xtag].attributes)
            this.genarateAttributeList(selectedTagData)
        })
        eventBus.$on('tag-frequency', (xtagOptions, attributeOptions) => {
            this.xtagOptions = xtagOptions
            this.attributeOptions = attributeOptions
            this.attributeOptions.sort((a, b) => {
                const textA = a.toUpperCase();
                const textB = b.toUpperCase();
                if (textA < textB) {
                    return -1;
                }
                if (textA > textB) {
                    return 1;
                }
                return 0;
            });
        });
        eventBus.$on('validTagSelected', (flag) => {
            this.tagSelected = flag;
        });
        eventBus.$on('validFileSelected', (flag) => {
            this.validFileSelected = flag;
            this.tagSelected = false
        });
    },
    mounted() {
        this.getSchema()
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        getSchema() {
            this.schema = schema
        },
        showAddAttribute() {
            this.addAttributeVisibleInput = !this.addAttributeVisibleInput
            this.showAddAttributebtn = !this.showAddAttributebtn
        },
        setvalue() {
            const existingAttribute = this.attributeList.find(attr => attr.name === this.selectedAttribute);
            if (existingAttribute) {
                this.messageToast(
                    "Success",
                    "info",
                    "Attribute value updated successfully."
                );
                this.selectedTagData[this.selectedAttribute] = this.selectedAttributeValue
                this.genarateAttributeList(this.selectedTagData)
            } else {
                this.selectedTagData[this.selectedAttribute] = this.selectedAttributeValue
                this.genarateAttributeList(this.selectedTagData)
            }
            // Clear the input values
            this.selectedAttribute = null;
            this.selectedAttributeValue = null;
        },
        genarateAttributeList(selectedTagData) {
            const attributelist = [];
            for (const key in selectedTagData) {
                if (
                    key !== "nodeId" &&
                    key !== "childFrequency" &&
                    key !== "xtagNew" &&
                    key !== "xtag" &&
                    key !== "text" &&
                    key !== selectedTagData.xtag &&
                    key !== 'ancestors'
                ) {
                    const newAttr = {
                        name: key,
                        value: selectedTagData[key],
                    };
                    attributelist.push(newAttr);
                }
            }
            this.attributeList = attributelist;
            this.selectedAttribute = ''
            this.selectedAttributeValue = ""
        }
    }
};
</script>
