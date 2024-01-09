<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./vertical";
import Horizontal from "./horizontal";

export default {
  components: { Vertical, Horizontal, },
  data() {
    return {
      title: "",
      items: [],
      show: false,
    };
  },
  computed: {
    ...layoutComputed,
  },
  methods: {

    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },


  },


};
</script>

<template>
  <div>
    <vertical v-if="layoutType === 'vertical'" :layout="layoutType">
      <slot />
      <router-view />
    </vertical>
    <Horizontal v-if="layoutType === 'horizontal'" :layout="layoutType">
      <slot />
    </Horizontal>
  </div>
</template>
