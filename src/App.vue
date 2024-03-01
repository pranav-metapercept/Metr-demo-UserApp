<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import appConfig from "@/app.config";

export default {
  name: "app",
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === "function" ? title(this.$store) : title;
      return title ? `${title} | ${appConfig.title}` : appConfig.title;
    },
  },
};
</script>
<style>
.swal2-icon.swal2-success .swal2-success-ring {
  border-color: red;
}
.position-reletive {
  position: relative;
}

.btn-light {
  background-color: #ffffff !important;
  border-color: #dcdee2 !important;
}

.cmh-icon {
  color: #ffffff;
  font-size: 30px;
  margin-right: 5px;
}

.card-header {
  height: 7vh;
  min-height: 3rem;
  display: flex;
  align-items: center;
}

.text-center {
  text-align: center;
}

.view-detail {
  background: unset !important;
  font-size: 12px;
  border: none !important;
  color: #117c5c !important;
  font-weight: bold;
}

.inputbox {
  display: flex;
  flex-direction: column;
}

.input {
  padding: 6px 8px;
  border-radius: 3px;
  border: 1px solid rgb(193, 189, 189);
}

.text-truncate {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-icons-btn {
  background: none;
  border: none;
  font-size: 16px;
}

.card-icons-btn:nth-child(1) {
  color: #5864d2;
}

.iconBox {
  text-align: right;
}

.card-icons-btn:nth-child(2) {
  color: red;
}

.card-body {
  position: relative;
}

.Card-img {
  width: 80px;
}

.Card-img img {
  width: 100%;
}

.title {
  font-weight: 500;
  font-size: 15px;
}
</style>
