<template>
<!-- File Explorer container -->
<div class="file-explorer">
    <!-- File Explorer header -->
    <header class="file-explorer-header">File Explorer</header>
    <!-- Show preloader if isLoading is true -->
    <div v-if="isLoading" class="preloader">
        <div class="status">
            <div class="spinner">
                <i class="ri-loader-line spin-icon"></i>
            </div>
        </div>
    </div>
    <!-- Render a tree view using v-jstree component -->
    <v-jstree :data="treeData" whole-row @item-click="itemClick"></v-jstree>
</div>
</template>
<script>
import {
    secretKey
} from '../../../../api/global.env';
import CryptoJS from 'crypto-js';
export default {
    data() {
        return {
            treeData: [], // Holds the file tree data
            isLoading: false, // Indicates whether data is loading
        };
    },
    mounted() {
        // Call the getFiletree method when the component is mounted
        this.getFiletree();
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        async itemClick(node) {
            // Handle item click event
            // Fetch file content based on the clicked node's path
            this.$store.getters.client
                .get(`orguser/repocontent?repoUser=${CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}&repoName=${CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}&repoBranch=${CryptoJS.AES.decrypt(
                this.$route.params.repobranch,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}&repoPath=${node.model.path}`)
                .then((res) => {
                    if (res.data) {
                        // Emit the file content to the parent component
                        this.$emit('filcontent', res.data);
                    } else {
                        // Handle an invalid response
                        this.messageToast("Invalid request", "danger", "An error occurred");
                    }
                })
                .catch((err) => {
                    // Handle network issues or unexpected errors
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                });
        },
        getFiletree() {
            // Fetch and display the file tree for the selected repository
            this.isLoading = true; // Show loading spinner
            this.$store.getters.client
                .get(`project/githubtree?gitUsername=${CryptoJS.AES.decrypt(
                this.$route.params.repouser,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}&gitReponame=${CryptoJS.AES.decrypt(
                this.$route.params.reponame,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}&branchsha=${CryptoJS.AES.decrypt(
                this.$route.params.repobranch,
                secretKey
            ).toString(CryptoJS.enc.Utf8)}`)
                .then((res) => {
                    if (res.data) {
                        // Set the tree data if the response contains data
                        this.treeData = res.data;
                    } else {
                        // Handle an invalid response
                        this.messageToast("Invalid request", "danger", "An error occurred");
                    }
                    this.isLoading = false; // Hide loading spinner
                })
                .catch((err) => {
                    // Handle network issues or unexpected errors
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                    this.isLoading = false; // Hide loading spinner
                });
        },
    },
};
</script>
<style scoped>
.file-explorer {
    overflow: scroll;
}
.file-explorer-header {
    background-color: #021559;
    padding: 4px;
    border-radius: 0px;
}
.preloader {
    text-align: center;
}
.status {
    display: inline-block;
}
.spinner {
    display: inline-block;
}
.spin-icon {
    font-size: 24px;
}
</style>
