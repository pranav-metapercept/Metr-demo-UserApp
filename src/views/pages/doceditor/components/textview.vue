<template>
  <div>
      <!-- This is the container for the code editor -->
      <div class="editor-container">
          <!-- This is the card element for the editor -->
          <div class="editor-card">
              <!-- This is the body of the editor card -->
              <div class="editor-card-body">
                  <!-- This is the CKEditor component -->
                  <div ref="editor" class="code-editor"></div>
              </div>
          </div>
      </div>
  </div>
  </template>
  
<script>
import ace from 'brace';
import 'brace/mode/xml';
import xmlFormat from 'xml-formatter';
import {
    JsonToXml
} from "../convert.js";
export default {
    props: {
        errorMessage: {
            type: [Object, String, undefined],
        },
        data: {
            type: [Object, String],
            required: true,
        },
        rootContent: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            formattedXml: '',
            fileContent: '',
            currentFilePath: '',
            themes: [
                'ambiance',
                'chaos',
                'chrome',
                'clouds',
                'cobalt',
                'crimson_editor',
                'dawn',
                'dreamweaver',
                'eclipse',
                'github',
                'gob',
                'gruvbox',
                'monokai',
                'nord_dark',
                'pastel_on_dark',
                'solarized_dark',
                'solarized_light',
                'sqlserver',
                'terminal',
                'textmate',
                'tomorrow',
                'tomorrow_night',
                'tomorrow_night_blue',
            ],
        };
    },
    mounted() {
        this.convertData();
        this.getContent();
        this.initializeEditor();
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        async convertData() {
            let result = this.processJson(this.data);
            let parser = new JsonToXml();
            result = parser.parse(result);
            this.formattedXml = this.rootContent + xmlFormat(result, {
                indentation: '  ',
                filter: (node) => node.type !== 'Comment',
                collapseContent: true,
                lineSeparator: '\n'
            });
        },
        processJson(json) {
            const copyJson = JSON.parse(JSON.stringify(json));
            this.deleteAdditionalFields(copyJson);
            return copyJson;
        },
        deleteAdditionalFields(nodeDetails) {
            if (typeof nodeDetails === "string") return;
            const tagName = nodeDetails.xtag;
            delete nodeDetails.nodeId;
            delete nodeDetails.childFrequency;
            if (nodeDetails.xtagNew) delete nodeDetails.xtagNew;
            if (!nodeDetails[tagName] || !nodeDetails[tagName].length) return;
            for (const childNode of nodeDetails[tagName]) {
                this.deleteAdditionalFields(childNode);
            }
        },
        getContent() {
            this.fileContent = this.formattedXml;
            this.setValueInEditor();
        },
        initializeEditor() {
            const editor = ace.edit(this.$refs.editor);
            editor.getSession().setMode('ace/mode/xml');
            editor.setShowPrintMargin(false);
            editor.setReadOnly(true);
            editor.selection.getCursor();
            this.handleWindowResize(editor);
        },
        setValueInEditor() {
            const editor = ace.edit(this.$refs.editor);
            editor.setValue(this.fileContent, -1);
            this.handleWindowResize(editor);
        },
        changeTheme(selectedTheme, editor) {
            editor.setTheme(`ace/theme/${selectedTheme}`);
        },
        handleWindowResize(editor) {
            editor.resize();
        },
    },
    computed: {
        selectedTheme: {
            get() {
                return this.selectedThemeValue;
            },
            set(newValue) {
                this.$emit('update:selectedThemeValue', newValue);
            },
        },
    },
    watch: {
        selectedThemeValue(newValue) {
            const editor = ace.edit(this.$refs.editor);
            this.changeTheme(newValue, editor);
        },
        data: {
            handler(newValue) {
                this.fileContent = newValue;
                if (!newValue) {
                    this.convertData();
                    this.getContent();
                    this.initializeEditor();
                } else {
                    this.convertData();
                    this.getContent();
                    this.initializeEditor();
                }
            },
            immediate: true
        },
        fileContent(newValue) {
            if (newValue) {
                this.setValueInEditor();
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleWindowResize);
    },
};
</script>
<style scoped>
.code-editor {
    width: 100%;
    height: 100%;
}
.editor-container {
    height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.editor-card {
    width: 100%;
    height: 100%;
}
.editor-card-body {
    height: 86vh;
    width: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    border: 1px solid #dcdcdc;
}
</style>
