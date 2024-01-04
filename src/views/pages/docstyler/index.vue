<template>
<div>
    <div>
        <!-- Page Header Component -->
        <PageHeader :title="title" :icon="'fas fa-palette'" :items="items" />
        <div>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <!-- Project Name Badge -->
                <div>
                    <div class=" mr-2 px-1 ">
                        <span class="project-name">{{ projectName }}</span>
                    </div>
                    <div class="mr-2 dita-ot-cont px-1 ">
                        <span class="dita-ot">DITA-OT Version:</span>
                        <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Bootstrap Vue Tabs -->
        <b-tabs class="custom-tabs bg-white" v-model="activeTab" justified nav-class="nav-tabs-custom" content-class="p-3 text-muted">
            <!-- HTML Styler Tab -->
            <b-tab title="HTML Styler" active>
                <htmlstyler></htmlstyler>
            </b-tab>
            <!-- PDF Styler Tab -->
            <b-tab title="PDF Styler">
                <pdfstyler></pdfstyler>
            </b-tab>
        </b-tabs>
    </div>
</div>
</template>

<script>
import {
    BTabs,
    BTab
} from "bootstrap-vue";
import htmlstyler from "./htmlstyler/index.vue";
import pdfstyler from "./pdfstyler/index.vue";

import checkurl from "../../../components/urlvalidator";
import {
    eventBus
} from "../../../main";
import {
    mapGetters
} from "vuex";
import CryptoJS from "crypto-js";
import {
    secretKey
} from "../../../api/global.env";
export default {
    components: {
        BTabs,
        BTab,
        htmlstyler,
        pdfstyler,

    },
    computed: {
        ...mapGetters(["ditaOtVersions"]),
    },
    data() {
        return {
            ditaotVersion: "",
            projectName: CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            repouser: CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            brachName: CryptoJS.AES.decrypt(
                this.$route.params.repobranch,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            activeTab: 0,
            title: "DocStyler",
            items: [{
                    text: "Projects",
                    href: `/docmanager`,
                },
                {
                    text: "DocEditor",
                    href: `/doceditor/${encodeURIComponent(this.$route.params.repouser)}/${encodeURIComponent(this.$route.params.reponame)}/${encodeURIComponent(this.$route.params.repobranch)}`,
                },
                {
                    text: "DocStyler",
                    active: true,
                },
            ],
        };
    },
    mounted() {
        eventBus.$emit("update-sidebar", "menuitems.docmanager.text");
    },
    created() {
        eventBus.$emit("update-sidebar", "menuitems.docmanager.text");
        // this.validateURL()
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        validateURL() {
            const newRepoUser = CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8);
            const newRepoName = CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8);
            const oldRepoUser = localStorage.getItem("repouser");
            const oldRepoName = localStorage.getItem("reponame");
            if (newRepoName !== oldRepoName || newRepoUser !== oldRepoUser) {
                checkurl(newRepoName);
            }
        },
    },
};
</script>

<style scoped>

.custom-source {
    padding: 14px;
    gap: 24px;
}

.custom-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.5px;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}

.project-name {
    font-size: 18px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0em;
    text-align: center;
    color: rgba(23, 35, 61, 1);
    ;
}

.dita-ot-cont {
    margin-top: 0.4rem;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
}

.dita-ot {
    color: rgba(23, 35, 61, 1);
}

.dita-ot-version {
    color: rgba(105, 111, 121, 1);
}

label {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}

.btabs-height {
    height: 100%;
}

.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
    background-color: rgb(153, 177, 255) !important;
    color: #fff !important;
}
</style>
