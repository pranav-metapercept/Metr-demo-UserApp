<template>
  <div>
    <!-- Modal component with various options -->
    <b-modal ref="my-modal" hide-footer title="important message" hide-close no-close-on-backdrop no-close-on-esc>
      <div class="d-block text-center">
        <h6>
          <!-- Important message to be displayed in the modal -->
          "I'm sorry, but it seems like you don't have the necessary permission
          to access DocMigration at the moment. If you wish to access
          DocMigration, you'll need to contact the administrator in charge of
          granting access to DocMigration.
        </h6>
      </div>
      <!-- Close button for the modal -->
      <button class="btn btn-primary btn-sm mt-3" block @click="hideModal"
        >Close Me</button
      >
    </b-modal>
  </div>
</template>
<script>
export default {
  methods: {
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
    showModal() {
      // Show the modal when this method is called
      this.$refs["my-modal"].show();
    },
    hideModal() {
      // Hide the modal and navigate to the "Dashboard" route
      this.$refs["my-modal"].hide();
      this.$router.push({ name: "Dashboard" });
    },
  },
  mounted() {
    // Automatically show the modal when the component is mounted
    this.showModal();
  },
};
</script>
<style>
.modal-header .close {
  display: none;
}
</style>
