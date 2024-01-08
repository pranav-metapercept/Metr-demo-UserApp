<template>
    <!-- Template for a tree item -->
    <div class="my-1">
        <li class="no-dots" v-if="isValidFileName(model.name)">
            <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType" class="d-flex align-items-center">
                <span :class="{ highlight: isHighlighted }" v-on:click="test(model)" @click="selectModel(model)"
                    class="d-flex align-items-center path">
                    <span class="folder-icon mr-1 " v-if="isFolder"> {{ isOpen ? "▼" : "▶" }} </span>
                    <i class="fas fa-folder icon-cog " v-if="isFolder"></i>
                    <i class="fas fa-file-alt icon-cog" v-else></i>
                    <span class="truncated-path">{{ model.name }}</span>
                </span>
            </div>
            <ul v-show="isOpen" v-if="isFolder">
                <!-- Display child tree items when the folder is open -->
                <TreeItem class="item" v-for="childModel in model.children" :key="childModel.id" :model="childModel">
                </TreeItem>
            </ul>
        </li>
    </div>
</template>
<script>
import {
    eventBus
} from "../../../../main";
import devicevalidator from "../../../../components/devicevalidator";
export default {
    name: 'TreeItem',
    props: {
        model: Object
    },
    data() {
        return {
            isOpen: true, // Indicates whether the folder is open
            selectedModel: null, // Currently selected model
            highlightedModel: null // Model currently highlighted
        }
    },
    computed: {
        isFolder() {
            return this.model.children && this.model.children.length // Check if the item is a folder
        },
        isHighlighted() {
            return this.model === this.highlightedModel // Check if the item is highlighted
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
        isValidFileName(fileName) {
            // Check if the file name is valid
            return !fileName.endsWith('.png') && !fileName.endsWith('.svg') && !fileName.endsWith('.jpg') && fileName !== '.git' && fileName !== 'Images' && fileName !== 'images' && fileName !== 'out' && fileName !== 'output' && fileName !== 'README.md';
        },
        toggle() {
            if (this.isFolder) {
                this.isOpen = !this.isOpen; // Toggle folder open/closed
            }
        },
        changeType() {
            if (!this.isFolder) {
                this.model.children = []; // Clear children if not a folder
                this.addChild(); // Add a child (custom logic)
                this.isOpen = true; // Open the folder
            }
        },
        async test(model) {
          
            await this.$store.getters.client
                .get(`/orguser/workspace/filecontent?path=${model.path}`)
                .then((res) => {
                    // Emit events and handle responses
                    eventBus.$emit('getcontent', {
                        content: res.data,
                        path: model.path
                    });
                 
                    eventBus.$emit('update_toolbar_filepath', model.path);
                    eventBus.$emit('textViewContent', {
                        content: res.data,
                        path: model.path
                    });
                    eventBus.$emit('clearHistory');
                },
                )
                .catch((error) => {
                   
                    
                    devicevalidator(error.response.data.message);
                })
        },
        selectModel(model) {
            eventBus.$emit('highlightModel', model); // Emit event to highlight the model
        },
    },
    created() {
        eventBus.$on('highlightModel', (model) => {
            this.highlightedModel = model;
        });
    }
}
</script>
<style scoped>
.icon-cog {
    color: #1C274C;
}
.highlight {
    font-weight: bold;
    background-color: #d3e3fd;
    padding: 2px 10px;
    border-radius: 10px;
    display: inline-block;
    /* margin: 10px; */
}
.bold {
    font-weight: bold;
}
.item {
    cursor: pointer;
}
.truncated-path {
    overflow: hidden;
    font-family: 'Roboto';
    font-size: 12px;
    color: #1C274C;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 1px);
    padding-left: 8px;
}
.folder-icon {
    font-size: 11px;
    width: 11px;
    color: #1C274C;
    margin-right: 0.2rem;
    user-select: none;
}
.no-dots {
    list-style: none;
    padding-left: 0;
}
</style>
