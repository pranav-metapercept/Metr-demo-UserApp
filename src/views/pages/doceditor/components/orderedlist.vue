<template>
    <div>
        <!-- This is a container for the CKEditor component -->
        <div ref="ckeditor"></div>
    </div>
    </template>
    

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
    eventBus
} from "../../../../main";
export default {
    data() {
        return {
            editor: null,
            ckeditorContent: '',
            textData: ''
        };
    },
    props: {
        tagData: {
            type: Object,
            required: true
        },
    },
    mounted() {
        ClassicEditor
            .create(this.$refs.ckeditor, {
                toolbar: {
                    items: ['numberedList', 'undo', 'redo']
                }
            })
            .then(editor => {
                this.editor = editor;
                if (typeof this.textData === 'string') {
                    this.editor.setData(this.textData);
                } else {
                    this.textData = '';
                    this.editor.setData(this.textData);
                }
            })
            .catch(error => {
                error
            });
        eventBus.$on('saveOlChanges', this.convertToDita);
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        convertToDita() {
            const xml = `<title>${this.editor.getData().replace(/&nbsp;/g, '')}</title>`;
            //  xml = xml.replace(/&nbsp;/g, '');
            this.readXML(xml);
        },
        readXML(xml) {
            let fileContentObjn = xml;
            let that = this;
            let domParser = new DOMParser();
            let xmlDom = domParser.parseFromString(
                fileContentObjn,
                "application/xml"
            );
            that.preProcess(xmlDom);
            that.xmlObject = null;
            that.xmlObject = that.xmlDomToJson(xmlDom.childNodes[0]);
            this.genarateNodeId();
            if (that.xmlObject.html && that.xmlObject.text) {
                return;
            }
        },
        preProcess(xml) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                const node = xml.childNodes[i];
                if (node.nodeType !== 1) {
                    xml.removeChild(node);
                    i--;
                } else if (node.nodeName.toLowerCase() === 'ul' || node.nodeName.toLowerCase() === 'ol') {
                    this.preProcess(node);
                }
            }
        },
        xmlDomToJson(xml) {
            if (xml.nodeType !== 1) {
                return null;
            }
            let obj = {};
            obj.xtag = xml.nodeName;
            if (xml.attributes.length > 0) {
                for (let i = 0; i < xml.attributes.length; i++) {
                    let attribute = xml.attributes[i];
                    obj[attribute.nodeName] = attribute.nodeValue;
                }
            }
            // Convert the XML element's childNodes
            let items = [];
            for (let i = 0; i < xml.childNodes.length; i++) {
                let node = xml.childNodes[i];
                if (node.nodeType === 1) {
                    let item = this.xmlDomToJson(node); // Call recursion to convert childNodes
                    if (item) {
                        items.push(item);
                    }
                } else if (node.nodeType === 3) {
                    let text = (node.textContent || "").replace(/(\r|\n)/g, "").trim();
                    if (text) {
                        items.push(text);
                    }
                }
            }
            // Assign the childNodes array to the object
            if (items.length > 0) {
                obj[obj.xtag] = items;
            }
            return obj;
        },
        genarateNodeId() {
            const body = {
                nodeDetails: this.xmlObject,
            }
            this.$store.getters.client
                .post(`/orguser/doceditor/generateNodeId`, body)
                .then((res) => {
                    this.tagData[this.tagData.xtag] = [...this.tagData[this.tagData.xtag], ...res.data.title]
                })
                .catch(() => {});
        }
    }
};
</script>
