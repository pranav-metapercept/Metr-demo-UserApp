<template>
  <div>
    <Layout>

      <!-- Display a page header with title and breadcrumb items -->
      <PageHeader :icon="'ri-dashboard-line h3'" :title="title" :items="items" />

      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-12">
          <!-- Use responsive classes for different screen sizes -->
          <Project />
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <!-- Stat Component for displaying statistics -->
          <Role />
          <RecentPublication />
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12">
          <!-- RecentNotification Component for displaying recent notifications -->
          <RecentNotification />
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Project from './project.vue'
import Role from './role.vue'
import RecentNotification from './recentnotification.vue'
import RecentPublication from './recentpublication.vue'
// import { eventBus } from '../../../main';

export default {
  components: {
    // Import and use child components
    Layout,
    PageHeader,

    Project,
    Role,
    RecentNotification,
    RecentPublication,
  },
  data() {
    return {
      title: "Dashboard",
      items: [{
        text: "Dashboard",
        active: true,
      }],
    };
  },
  mounted() {
    // Emit an event to update the sidebar with the current menu item
    // eventBus.$emit('update-sidebar', "menuitems.dashboard.text");
  }
};
</script>

<style scoped>
/* Remove the unnecessary styling for .column */
</style>
