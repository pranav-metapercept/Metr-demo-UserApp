<template>
  <div>
    <!-- Select Theme Section -->
    <h5 class="text-primary title p-2 mb-2">Select Theme</h5>
    <div class="row">
      <div
        class="col-md-4 col-sm-6 mb-3"
        v-for="(option, index) in options"
        :key="index"
      >
        <div
          class="image-container"
          :class="{ selected: option === selectedOption }"
          @click="selectTheme(option)"
        >
          <img
            class="option__image select-img img-fluid"
            :src="option.img"
            :alt="option.title"
          />
          <div class="image-footer">{{ option.title }}</div>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-12">
        <!-- Buttons Section -->
        <div class="d-flex justify-content-between mt-3">
          <div class="d-flex">
            <div>
              <!-- Next Button -->
              <b-button
                size="sm"
                variant="primary"
                class="w-100 mb-2 ml-2"
                @click.prevent="nextForm()"
                >Next</b-button
              >
            </div>
          </div>
          <div class="d-flex">
            <div>
              <!-- Reset Button -->
              <b-button
                size="sm"
                variant="light"
                class="w-100 mb-2 mr-2"
                @click.prevent="refreshFormData()"
                >Reset</b-button
              >
            </div>
            <div>
              <!-- Submit Button -->
              <b-button
                size="sm"
                variant="primary"
                class="w-100 mb-2 ml-2"
                @click.prevent="confirm()"
                >Submit</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import img1 from "../../../../../assets/htmlStyler/layout_1.png";
import img2 from "../../../../../assets/htmlStyler/layout_2.png";
import img3 from "../../../../../assets/htmlStyler/layout_3.jpg";
import imgDefault from "../../../../../assets/htmlStyler/layout_default.png";
import Swal from "sweetalert2";
import { eventBus } from "../../../../../main";
export default {
  props: ["formDataList"],
  data() {
    return {
      condition: true,
      selectedOption: null,
      options: [
        { title: "Default", desc: "", img: imgDefault },
        { title: "Green", desc: "", img: img1 },
        { title: "Dark", desc: "", img: img2 },
        { title: "Dynamic Theme 1", desc: "", img: img3 },
      ],
    };
  },
  watch: {
    selectedOption: {
      handler(newValue, oldvalue) {
        oldvalue;
        eventBus.$emit("theme-selected", newValue.title);
      },
    },
  },
  created() {
    console.log(this.formDataList);
    // Call the updateFormData method with your formDataList
    this.updateFormData(this.formDataList);
  },
  mounted() {
    this.selectedOption = this.options[0];
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
  methods: {
    selectTheme(option) {
      this.selectedOption = option;
      this.$emit("theme-selected", option.title);
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
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    updateFormData(formDataList) {
      for (const key in formDataList) {
        if (Object.prototype.hasOwnProperty.call(formDataList, key)) {
          this[key] = formDataList[key];
        }
      }
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
    submitForm() {
      const formData = {
        selectedTheme: this.selectedOption.title,
      };
      this.$emit("form-submitnew", formData);
    },
    customLabel({ title, desc }) {
      return `${title} – ${desc}`;
    },
  },
};
</script>
<style scoped>
.select-img {
  cursor: pointer;
}

.select-img:hover {
  opacity: 0.8;
}

.image-container {
  position: relative;
}

.image-container.selected {
  border: 2px solid #0f3460;
}

.image-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 5px;
}
</style>
