<template>
    <div>

        <div>
            <div class="row" no-body>
                <div class="col-md-12">
                    <div>

                        <!-- Display attribute table when attributes are present -->
                        <div class="col-lg-12">
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
                                            <multiselect v-model="selectedAttribute" :options="attributeOptions"
                                                :searchable="false" :close-on-select="true" :show-labels="false"
                                                :option-height="5" class="responsive-multiselect">
                                            </multiselect>
                                            <pre class="language-json"><code>{{ value }}</code></pre>
                                        </div>
                                    </b-form-group>
                                </div>
                                <div class="col-md-12">
                                    <label class="typo__label">Enter Value</label>
                                    <b-form-group label-for="Text-input" invalid-feedback="Text is required">
                                        <b-form-input class="col-md-" id="name-input" v-model="selectedAttributeValue"
                                            required placeholder="Enter attribute Value"></b-form-input>
                                    </b-form-group>
                                </div>
                                <div class="d-flex justify-content-center col-md-12 mb-4">
                                    <button class="btn btn-primary btn-sm mr-2" @click="setvalue()"
                                        :disabled="!selectedAttribute || !selectedAttributeValue">
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
            attributeList: [
                {
                    "name": "href",
                    "value": "news://news.software.ibm.com:119/c11fd3$85qq$2@news.boulder.ibm.com"
                },
                {
                    "name": "format",
                    "value": "news"
                }
            ],
            schema: {},
            addAttributeVisibleInput: false,
            showAddAttributebtn: false,
            selectedAttribute: null,
            selectedAttributeValue: null,
            attributeOptions: [
                "anchorref",
                "audience",
                "base",
                "compact",
                "conaction",
                "conkeyref",
                "conref",
                "conrefend",
                "deliveryTarget",
                "dir",
                "id",
                "importance",
                "keyref",
                "mapkeyref",
                "otherprops",
                "outputclass",
                "platform",
                "product",
                "props",
                "rev",
                "status",
                "translate",
                "xml:lang",
                "xml:space",
                "xtrc",
                "xtrf"
            ],
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

    },
    mounted() {
        this.getSchema()
    },


};
</script>
