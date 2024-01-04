<template>
  <div>

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
  </div>
</template>

<script>
import Project from './components/project.vue'
import Role from './components/role.vue'
import RecentNotification from './components/recentnotification.vue'
import RecentPublication from './components/recentpublication.vue'
import { eventBus } from '../../../main';

export default {
  components: {
    // Import and use child components
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
    eventBus.$emit('update-sidebar', "menuitems.dashboard.text");
  }
};
</script>

<style scoped>
/* Remove the unnecessary styling for .column */
</style>
