<template>
    <div>
        <!-- Condition: Valid XML file not selected with an error message -->
        <div v-if="!validFileSelected && typeof errorMessage === 'string'"
            class="text-center d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                    <img class="image-style" src="../../../../assets/placeholder.png" />
                    <div class="error-text">
                        {{ errorMessage || "Please select a valid XML file." }}
                    </div>
                </div>
            </div>
        </div>
        <!-- Condition: Valid tag not selected -->
        <div v-else-if="!tagSelected" class="text-center d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                    <img class="image-style" src="../../../../assets/placeholder.png" />
                    <div class="error-text">Please select a valid tag</div>
                </div>
            </div>
        </div>
        <!-- Condition: Selected tag has no child tags -->
        <div v-else-if="xtagOptions.length === 0" class="text-center d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                    <img class="image-style" src="../../../../assets/placeholder.png" />
                    <div class="error-text">The selected tag does not have any child tags</div>
                </div>
            </div>
        </div>
        <!-- Default Condition: Valid XML file and selected tag -->
        <div v-else>
            <div class="row">
                <div class="col-md-12">
                    <div v-if="xtagOptions.length === 0" class="text-center d-flex flex-column align-items-center">
                        <div class="d-flex justify-content-center align-items-center m-0 p-0">
                            <div class="text-center">
                                <img class="image-style" src="../../../../assets/placeholder.png" />
                                <div class="error-text">No tag selected</div>
                            </div>
                        </div>
                    </div>
                    <!-- Condition: Tag selected, show the Add Tag form -->
                    <div v-else class="col-md-12 mt-2">
                        <div>
                            <div class="row  mx-2 add-tag">
                                <h5 class="heading-center ">
                                    Add Tag
                                </h5>
                                <div class="col-md-12">
                                    <b-form-group label-for="Tag-select" :state="!selectedxtag">
                                        <b-form-select id="tag-select" v-model="selectedxtag" size="sm">
                                            <option value=null disabled>Please select a tag</option>
                                            <option v-for="option in xtagOptions" :key="option.value" :value="option.value"
                                                :disabled="option.disabled">
                                                {{ option.text }}
                                            </option>
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <div class="d-flex justify-content-center col-md-12 mb-4">
                                    <button class="btn btn-primary btn-sm w-sm mr-2">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

// import Multiselect from "vue-multiselect";
export default {
    components: {
        // Multiselect,
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
            tagSelected: true,
            validFileSelected: true,
            tagName: '',
            nodeId: '',
            selectedxtag: null,
            selectedText: null,
            xtagOptions: [
                {
                    "text": "abbreviated-form",
                    "value": "abbreviated-form",
                    "disabled": false
                },
                {
                    "text": "apiname",
                    "value": "apiname",
                    "disabled": false
                },
                {
                    "text": "b",
                    "value": "b",
                    "disabled": false
                },
                {
                    "text": "boolean",
                    "value": "boolean",
                    "disabled": false
                },
                {
                    "text": "cite",
                    "value": "cite",
                    "disabled": false
                },
                {
                    "text": "cmdname",
                    "value": "cmdname",
                    "disabled": false
                },
                {
                    "text": "codeph",
                    "value": "codeph",
                    "disabled": false
                },
                {
                    "text": "data",
                    "value": "data",
                    "disabled": false
                },
                {
                    "text": "data-about",
                    "value": "data-about",
                    "disabled": false
                },
                {
                    "text": "draft-comment",
                    "value": "draft-comment",
                    "disabled": false
                },
                {
                    "text": "equation-inline",
                    "value": "equation-inline",
                    "disabled": false
                },
                {
                    "text": "filepath",
                    "value": "filepath",
                    "disabled": false
                },
                {
                    "text": "foreign",
                    "value": "foreign",
                    "disabled": false
                },
                {
                    "text": "i",
                    "value": "i",
                    "disabled": false
                },
                {
                    "text": "image",
                    "value": "image",
                    "disabled": false
                },
                {
                    "text": "keyword",
                    "value": "keyword",
                    "disabled": false
                },
                {
                    "text": "line-through",
                    "value": "line-through",
                    "disabled": false
                },
                {
                    "text": "markupname",
                    "value": "markupname",
                    "disabled": false
                },
                {
                    "text": "mathml",
                    "value": "mathml",
                    "disabled": false
                },
                {
                    "text": "menucascade",
                    "value": "menucascade",
                    "disabled": false
                },
                {
                    "text": "msgnum",
                    "value": "msgnum",
                    "disabled": false
                },
                {
                    "text": "msgph",
                    "value": "msgph",
                    "disabled": false
                },
                {
                    "text": "numcharref",
                    "value": "numcharref",
                    "disabled": false
                },
                {
                    "text": "option",
                    "value": "option",
                    "disabled": false
                },
                {
                    "text": "overline",
                    "value": "overline",
                    "disabled": false
                },
                {
                    "text": "parameterentity",
                    "value": "parameterentity",
                    "disabled": false
                },
                {
                    "text": "parmname",
                    "value": "parmname",
                    "disabled": false
                },
                {
                    "text": "ph",
                    "value": "ph",
                    "disabled": false
                },
                {
                    "text": "q",
                    "value": "q",
                    "disabled": false
                },
                {
                    "text": "required-cleanup",
                    "value": "required-cleanup",
                    "disabled": false
                },
                {
                    "text": "sort-as",
                    "value": "sort-as",
                    "disabled": false
                },
                {
                    "text": "state",
                    "value": "state",
                    "disabled": false
                },
                {
                    "text": "sub",
                    "value": "sub",
                    "disabled": false
                },
                {
                    "text": "sup",
                    "value": "sup",
                    "disabled": false
                },
                {
                    "text": "svg-container",
                    "value": "svg-container",
                    "disabled": false
                },
                {
                    "text": "synph",
                    "value": "synph",
                    "disabled": false
                },
                {
                    "text": "systemoutput",
                    "value": "systemoutput",
                    "disabled": false
                },
                {
                    "text": "term",
                    "value": "term",
                    "disabled": false
                },
                {
                    "text": "text",
                    "value": "text",
                    "disabled": false
                },
                {
                    "text": "textentity",
                    "value": "textentity",
                    "disabled": false
                },
                {
                    "text": "tm",
                    "value": "tm",
                    "disabled": false
                },
                {
                    "text": "tt",
                    "value": "tt",
                    "disabled": false
                },
                {
                    "text": "u",
                    "value": "u",
                    "disabled": false
                },
                {
                    "text": "uicontrol",
                    "value": "uicontrol",
                    "disabled": false
                },
                {
                    "text": "unknown",
                    "value": "unknown",
                    "disabled": false
                },
                {
                    "text": "userinput",
                    "value": "userinput",
                    "disabled": false
                },
                {
                    "text": "varname",
                    "value": "varname",
                    "disabled": false
                },
                {
                    "text": "wintitle",
                    "value": "wintitle",
                    "disabled": false
                },
                {
                    "text": "xmlatt",
                    "value": "xmlatt",
                    "disabled": false
                },
                {
                    "text": "xmlelement",
                    "value": "xmlelement",
                    "disabled": false
                },
                {
                    "text": "xmlnsname",
                    "value": "xmlnsname",
                    "disabled": false
                },
                {
                    "text": "xmlpi",
                    "value": "xmlpi",
                    "disabled": false
                }
            ],
            schema: {},
        };
    },

};
</script>
<style>
.overflow-wrap {
    word-wrap: break-word;
    word-break: break-all;
}


.add-tag {
    background-color: #f1f5f7;
}

.image-style {
    height: 200px;
}

.error-text {
    color: #666;
    font-size: 1vw;
}

.heading-center {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
}

option:disabled {
    background: #e7e7e8 !important;
    color: #b6b6be !important;
}

option:selected {
    background: red !important;
    color: #b6b6be !important;
    background-color: red;
}

.disable-cust-cls {
    background: #e7e7e8 !important;
    color: #838588 !important;


}

/* Add media queries for iPad */
@media screen and (max-width: 1024px) and (max-height: 1366px) {

    /* Adjust your UI styles for iPad in landscape mode */
    /* You can modify the styles, such as font sizes, padding, or element sizes, to make your UI suitable for iPad. */
    .image-style {
        height: 150px;
    }

    #tag-select {
        font-size: 14px;
    }
}

@media screen and (max-width: 992px) {
    .image-style {
        height: 150px;
    }

    #tag-select {
        /* Change the ID to match your b-form-select element */
        font-size: 14px;
        /* Adjust the font size */
    }
}

@media screen and (max-width: 768px) {
    .image-style {
        height: 15vh;
    }

    #tag-select {
        /* Change the ID to match your b-form-select element */
        font-size: 12px;
        /* Adjust the font size */
        width: fit-content;
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

    #tag-select {
        /* Change the ID to match your b-form-select element */
        font-size: 10px;
        /* Adjust the font size */
    }
}

@media screen and (max-width: 320px) {
    .image-style {
        height: 15vh;
    }

    #tag-select {
        /* Change the ID to match your b-form-select element */
        font-size: 9px;
        /* Adjust the font size */
    }
}

@media screen and (max-width: 280px) {
    .image-style {
        height: 15vh;
    }

    .error-text {
        color: #666;
        font-size: 3vw;
    }

    #tag-select {
        /* Change the ID to match your b-form-select element */
        font-size: 8px;
        /* Adjust the font size */
    }
}
</style>
