<template>
  <!-- Template for the DocPublisher page -->
  <div>
    <!-- Page header with title and items -->
    <PageHeader :icon="'mdi mdi-cog h2'" :title="title" :items="items" />
    <div>
      <div class="mr-2 px-1">
        <span class="project-name">{{ projectName }}</span>
      </div>
      <div class="mr-2 dita-ot-cont px-1">
        <span class="dita-ot">DITA-OT Version:</span>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-xl-12">
        <!-- Display default publisher if custom plugin is disabled -->
        <div>
          <generateoutput />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import generateoutput from "./components/generateoutput";

import { eventBus } from "../../../main";

import Swal from "sweetalert2";

export default {
  components: {
    generateoutput,
  },

  data() {
    return {
      organizationDetails: null,
      customPluginOutputFormat: null,
      orgId: null,
      projectName: null,
      repouser: null,
      brachName: null,
      title: "DocPublisher",
      items: [
        {
          text: "Projects",
          href: `/docmanager`,
        },
        {
          text: "DocEditor",
          href: `/doceditor/${encodeURIComponent(
            this.$route.params.repouser
          )}/${encodeURIComponent(
            this.$route.params.reponame
          )}/${encodeURIComponent(this.$route.params.repobranch)}`,
        },
        {
          text: "DocPublisher",
          active: true,
        },
      ],
    };
  },
  created() {
    eventBus.$emit("update-sidebar", "menuitems.docpublisher.text");
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
        text: "Do you want to style your document before publishing?",
        showCancelButton: true,
        confirmButtonText: "Yes! Let's proceed",
        cancelButtonText: "No! Continue with DocPublisher",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.$router.push({
            path: `/docstyler`,
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

    async getoutputFormat() {
      await this.$store.getters.client
        .get(`/orguser/docpublisher/customplugin`)
        .then((res) => {
          this.customPluginOutputFormat = res.data;
          this.ditaOtFolder = res.data;
        })
        .catch(() => {});
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
