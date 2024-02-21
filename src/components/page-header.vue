<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>
<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-md-6">
      <div class="page-title-box m-0 p-0">
        <div class="media">
          <div class="d-flex align-items-center">
            <div class="mt-2">
              <h5>{{ title }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 m-0 p-0">
      <div
        class="page-title-right m-0 p-0"
        style="display: flex; justify-content: flex-end"
      >
        <b-breadcrumb :items="items" class="m-0"></b-breadcrumb>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>

<style scoped></style>
<style lang="scss" scoped>
.notify-item {
  .active {
    color: #16181b;
    background-color: #f8f9fa;
  }
}

.logo-text {
  font-size: 13px;
  color: white;
}

a {
  cursor: pointer;
}

@media (max-width: 768px) {
  .page-title-box {
    margin-bottom: 0px;
  }
}

@media screen and (max-width: 280px) {
  * {
    font-size: 10px;
  }

  .avatar-xs {
    height: 1rem;
    width: 2rem;
  }
}
</style>
