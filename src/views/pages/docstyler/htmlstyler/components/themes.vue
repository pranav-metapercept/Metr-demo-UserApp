<template>
  <div>
    <!-- Select Theme Section -->
    <h5 class="text-primary title p-2 mb-2">Select Theme</h5>
    <div class="col-lg-12 col-xl-6">
      <div class="d-flex flex-wrap justify-content-center">
        <!-- Theme Selection Cards -->
        <div
          class="text-dark h6 my-3"
          v-for="(image, index) in imageOptions"
          :key="index"
          @click="selectImage(image)"
        >
          <b-card
            :img-src="getImagePath(image)"
            img-alt="Card image"
            :class="{ 'selected-image': selectedTheme === image }"
            class="custom-card"
          >
            <b-card-text>
              <!-- Radio Button for Theme Selection -->
              <input
                type="radio"
                :value="image"
                v-model="selectedTheme"
                class="custom-input"
              />
              <span class="mr-2 text-primary">{{ image }}</span>
            </b-card-text>
          </b-card>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-12">
        <!-- Buttons Section -->
        <div class="d-flex justify-content-end mt-3">
          <div class="col-sm-auto">
            <!-- Submit Button -->
            <b-button
              size="sm"
              variant="primary"
              class="w-100 mb-2"
              @click.prevent="confirm()"
              >Submit</b-button
            >
          </div>
          <div class="col-sm-auto">
            <!-- Next Button -->
            <b-button
              size="sm"
              variant="primary"
              class="w-100 mb-2"
              @click.prevent="nextForm()"
              >Next</b-button
            >
          </div>
          <div class="col-sm-auto">
            <!-- Reset Button -->
            <b-button
              size="sm"
              variant="light"
              class="w-100 mb-2"
              @click.prevent="refreshFormData()"
              >Reset</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import { eventBus } from "../../../../../main";
export default {
  props: ["formDataList"],
  data() {
    return {
      condition: true,
      selectedTheme: "Default",
      imageOptions: ["Default", "Green", "Dark", "Dynamic Theme 1"],
    };
  },
  watch: {
    selectedTheme: {
      handler(newValue, oldvalue) {
        oldvalue;
        eventBus.$emit("theme-selected", newValue);
      },
    },
  },
  created() {
    // Call the updateFormData method with your formDataList
    this.updateFormData(this.formDataList);
  },
  mounted() {
    const data = {
      title: "Themes",
      paragraph:
        "You can use these fields to design the technical manual's front cover pages..",
      icons: "mdi mdi-apps font-size-26 align-middle mr-2",
    };
    this.$emit("data-mounted", data);
  },
  beforeDestroy() {
    this.submitForm();
  },
  computed: {
    formattedMessage() {
      return {
        frontmatter_title_commons: this.frontmatter_title,
        topic_title: this.topic_title,
      };
    },
  },
  methods: {
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    selectImage(image) {
      this.selectedTheme = image; // Update the selected theme when an image is clicked
    },
    async confirm() {
      if (this.condition) {
        this.submitForm();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-primary btn-sm mr-2",
            cancelButton: "btn btn-light btn-sm",
          },
          buttonsStyling: false,
        });
        await swalWithBootstrapButtons
          .fire({
            title: "Are you sure?",
            text: "You want to make final changes.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.finalSubmit();
            }
          });
      }
    },
    refreshFormData() {
      this.selectedTheme = "Default";
    },
    updateFormData(formDataList) {
      for (const key in formDataList) {
        if (Object.prototype.hasOwnProperty.call(formDataList, key)) {
          this[key] = formDataList[key];
        }
      }
    },
    nextForm() {
      this.$emit("next-form");
      this.submitForm();
    },
    prevForm() {
      this.$emit("prev-form");
      this.submitForm(), this.convertDataToLowerCase();
    },
    finalSubmit() {
      this.$emit("final-submit");
    },
    submitForm() {
      const formData = {
        selectedTheme: this.selectedTheme,
      };
      this.$emit("form-submitnew", formData);
    },
    getImagePath(imageName) {
      if (imageName === "Default") {
        return require("../../../../../assets/htmlStyler/layout_default.png");
      } else if (imageName === "Green") {
        return require("../../../../../assets/htmlStyler/layout_1.png");
      } else if (imageName === "Dark") {
        return require("../../../../../assets/htmlStyler/layout_2.png");
      } else if (imageName === "Dynamic Theme 1") {
        return require("../../../../../assets/htmlStyler/layout_3.jpg");
      }
    },
  },
};
</script>
<style scoped>
label {
  font-weight: 400;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(23, 35, 61, 1);
}

.selected-image {
  border: 4px solid rgb(207, 222, 233) !important;
  background-color: rgb(207, 222, 233) !important;
  border-radius: 2%;
  text-shadow: 2px;
  color: white;
}

.form-group {
  margin: 10px;
}

.custom-card {
  margin: 2rem;
}

.custom-card img {
  width: 25vw;
}

.custom-input {
  display: none;
  width: fit-content;
  font-weight: 600;
}

@media screen and (max-width: 280px) {
  .btn {
    width: 20px;
    font-size: 8px;
    margin: 0;
    padding: 3px 4px;
  }

  * {
    font-size: 15px;
  }
}
</style>
