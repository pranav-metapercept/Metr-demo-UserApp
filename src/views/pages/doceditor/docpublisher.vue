<template>
    <!-- Template for the DocPublisher page -->
    <div>
        <!-- Page header with title and items -->
        <PageHeader :icon="'mdi mdi-cog h2'" :title="title" :items="items" />
        <div>
            <div class=" mr-2 px-1 ">
                <span class="project-name">{{ projectName }}</span>
            </div>
            <div class="mr-2 dita-ot-cont px-1 ">
                <span class="dita-ot">DITA-OT Version:</span>
                <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
            </div>
        </div>
        <div class="row mt-3">

            <div class="col-xl-12">
                <!-- Display default publisher if custom plugin is disabled -->
                <div v-if="ditaOtVersions !== null">
                    <generateoutput :ditaotVersion="ditaOtVersions" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import generateoutput from "./components/generateoutput";

import {
    secretKey
} from "../../../api/global.env";
import {
    eventBus
} from "../../../main";
import {
    mapGetters
} from "vuex";
import Swal from "sweetalert2";

import CryptoJS from "crypto-js";
import devicevalidator from "../../../components/devicevalidator";
export default {
    components: {
        generateoutput,

    },
    computed: {
        ...mapGetters(["ditaOtVersions"]),
    },
    data() {
        return {
            organizationDetails: null,
            customPluginOutputFormat: null,
            orgId: null,
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
            title: "DocPublisher",
            items: [{
                text: "Projects",
                href: `/docmanager`
            },
            {
                text: "DocEditor",
                href: `/doceditor/${encodeURIComponent(this.$route.params.repouser)}/${encodeURIComponent(this.$route.params.reponame)}/${encodeURIComponent(this.$route.params.repobranch)}`,
            },
            {
                text: "DocPublisher",
                active: true
            }
            ],
        };
    },
    created() {
        eventBus.$emit("update-sidebar", "menuitems.docpublisher.text");
        this.getoutputFormat()
    },
    mounted() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-primary btn-sm my-3",
                cancelButton: "btn btn-sm mr-2 btn-primary",
            },
            buttonsStyling: false,
        });
        // Display a confirmation dialog with options
        swalWithBootstrapButtons
            .fire({
                text: " Would you like to style your document before publishing it?",
                showCancelButton: true,
                confirmButtonText: "Yes, Redirect to DocStyler! ",
                cancelButtonText: "No, Continue with DocPublisher!",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const encodedRepouser = encodeURIComponent(this.$route.params.repouser);
                    const encodedReponame = encodeURIComponent(this.$route.params.reponame);
                    const encodedBranch = encodeURIComponent(this.$route.params.repobranch);
                    this.$router.push({
                        path: `/docstyler/${encodedRepouser}/${encodedReponame}/${encodedBranch}`,
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons;
                }
            });

    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        async getOrgDetails() {
            return this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.orgId}`)
                .then((res) => {
                    if (res.data) {
                        this.organizationDetails = res.data[0];
                        this.$store.commit("setOrgDetails", this.organizationDetails);
                    } else {
                        this.messageToast("Invalid request", "danger", "No data received from the server");
                    }
                })
                .catch((err) => {
                    devicevalidator(err.response.data.message);
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                });
        },
        async getoutputFormat() {
            await this.$store.getters.client
                .get(`/orguser/docpublisher/customplugin`)
                .then((res) => {
                    this.customPluginOutputFormat = res.data;
                    this.ditaOtFolder = res.data;
                })
                .catch(() => { });
        },
    },
};
</script>
<style scoped>
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
    ;
}

.form-group {
    margin: 10px;
}

.btabs-height {
    height: 100%;
}

/* Media query for Z Fold when the screen is folded */
@media screen and (max-width: 280px) {
    .font-size-15 {
        font-size: 8px !important;
    }
}
</style>
