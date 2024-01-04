<template>
<div>
    <!-- Page header component with title and icon -->
    <PageHeader :icon="'ri-dashboard-line h3'" :title="title" :items="items" />
    <div class="d-flex justify-content-between align-items-center">
        <div>
           
            <div class="mr-2 dita-ot-cont px-1">
                <span class="dita-ot">DITA-OT Version:</span>
                <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-4 bg-white">
            <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
                <div class="custom-title mb-0">Output Screen</div>
            </div>

            <div class="card-body">
                <p class="mb-4">
                    <span class="text-muted"> Source word file:</span>
                    <span class="text-primary"> {{ selectedfolder }}</span>
                </p>

                <div class="text-right pt-1">
                    <!-- Button to download output as ZIP -->
                    <button class="btn btn-sm btn-primary mr-2 mb-2 m-0" @click.prevent="downloadZip">
                        Download as ZIP
                    </button>
                    <!-- Button to commit output on GitHub -->
                    <button class="btn btn-secondary btn-sm mb-2 m-0" @click="gitHubCommit">
                        Commit on GitHub
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
import {
    eventBus
} from "../../../../main";
import CryptoJS from "crypto-js";
import {
    secretKey
} from "../../../../api/global.env";
export default {
    data() {
        return {
            userId: this.$store.state.Auth.userId,
            orgId: this.$store.state.Auth.orgId,
            ditaotVersion: "",
            // Decrypt and display selected folder name
            selectedfolder: CryptoJS.AES.decrypt(
                this.$route.params.selectedfolder,
                secretKey
            ).toString(CryptoJS.enc.Utf8),
            title: "DocMigration",
            items: [{
                    text: "Dashboard",
                    href: "/",
                },
                {
                    text: "DocMigration",
                    active: true,
                },
            ],
        };
    },
    mounted() {
        // Emit an event to update the sidebar
        eventBus.$emit("update-sidebar", "menuitems.docmigration.text");
    },
    computed: {
        ...mapGetters(["ditaOtVersions"]),
    },
    methods: {
        // Display a toast message
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        // Function to download the output as a ZIP file
        async downloadZip() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            await this.$store.getters.client
                .get(
                    `/orguser/wordToDita/downloadDitazip?orgId=${this.orgId}&userId=${this.userId}&folderName=${this.selectedfolder}`, {
                        responseType: "blob",
                    }
                )
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `${this.selectedfolder}.zip`);
                    document.body.appendChild(link);
                    link.click();
                    loader.hide();
                    this.messageToast(
                        "Success",
                        "success",
                        "Zip file has been downloaded successfully"
                    );
                })
                .catch((error) => {
                    loader.hide();
                    this.messageToast("Invalid request", "danger", error.message);
                });
        },
        // Function to navigate to the GitHub commit screen
        gitHubCommit() {
            const encryptedFoldername = CryptoJS.AES.encrypt(
                this.selectedfolder,
                secretKey
            ).toString();
            const encodedFoldername = encodeURIComponent(encryptedFoldername);
            this.$router.push({
                path: `/docmigration/outputscreen/githubcommit/${encodedFoldername}`,
            });
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

.custom-notifications {
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

.card-body{
    padding-top: 0rem;
}
</style>
