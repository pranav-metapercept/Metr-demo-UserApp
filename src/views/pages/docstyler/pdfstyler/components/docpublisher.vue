<template>
    <div>
        <!-- Page Header Component -->
        <PageHeader :icon="'mdi mdi-cog h2'" :title="title" :items="items" class="larger-icon" />
        <!-- Project Information Section -->
        <div>
            <div class=" mr-2 px-1 ">
                <span class="project-name">{{ projectName }}</span>
            </div>
            <div class="mr-2 dita-ot-cont px-1 ">
                <span class="dita-ot">DITA-OT Version:</span>
                <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
            </div>
        </div>
        <!-- Generate Output Section (conditionally displayed) -->
        <div class="row">
            <div class="col-xl-12">
                <!-- Generate Output Component with DITA-OT Version Prop -->
                <generateoutput :ditaotVersion="ditaOtVersions" />
            </div>
        </div>
    </div>
</template>
<script>
// import generateoutput from './generateoutout.vue'
import generateoutput from '../components/generateoutput.vue'

import {
    eventBus
} from '../../../../../main';


export default {
    components: {
        generateoutput,

    },

    data() {
        return {
            organizationDetails: null,
            ditaOtVersions: '4.3.2',
            orgId: null,
            projectName: null,
            repouser: null,
            brachName: null,
            title: "DocPublisher",
            items: [{
                text: "Projects",
                href: `/docmanager`
            },
            {
                text: "DocEditor",
                href: `/doceditor/${encodeURIComponent(this.$route.params.repouser)}/${encodeURIComponent(this.$route.params.reponame)}/${encodeURIComponent(this.$route.params.repobranch)}`
            },
            {
                text: "DocStyler",
                href: `/docstyler/${encodeURIComponent(this.$route.params.repouser)}/${encodeURIComponent(this.$route.params.reponame)}/${encodeURIComponent(this.$route.params.repobranch)}`
            },
            {
                text: "DocPublisher",
                active: true
            }
            ],
        }
    },
    created() {
        eventBus.$emit('update-sidebar', "menuitems.docpublisher.text");
    },
}
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