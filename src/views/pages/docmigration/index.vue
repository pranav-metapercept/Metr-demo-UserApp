<template>
  <div>
    <!-- Page Header component with props -->
    <PageHeader :icon="'mdi mdi-file-replace h2'" :title="title" :items="items" />
    <div>
            <div class="mr-2 dita-ot-cont px-1 ">
                <span class="dita-ot">DITA-OT Version:</span>
                <span class="dita-ot-version ml-2">{{ ditaOtVersions }}</span>
            </div>
        </div>
    <div class="container">
      <div class="row ">
        <div class="col-md-6 offset-md-3">
          <!-- Details component -->
          <Details/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Details from "./components/details.vue";
import { mapGetters } from 'vuex';

import { eventBus } from "../../../main";
export default {
  components: {
    Details,
   
  },
  data() {
    return {
      // Initialize data properties
      ditaotVersion: '', // DITA-OT version
      title: "DocMigration",
      items: [
        {
          text: "Dashboard",
          href: "/"
        },
        {
          text: "DocMigration",
          active: true
        }
      ],
    };
  },
  computed: {
    ...mapGetters(['ditaOtVersions']), // Using Vuex getter
  },
  mounted() {
    // Emit event to update the sidebar menu
    eventBus.$emit('update-sidebar', "menuitems.docmigration.text");
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
    ;
}

label {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}

</style>