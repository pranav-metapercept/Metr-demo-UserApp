<template>
  <div>
    <PageHeader :icon="'ri-dashboard-line h3'" :title="title" :items="items" />
    <div>
      <!-- Main Card -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <!-- Filter and Per Page Options -->
              <div class="row mt-2 d-flex justify-content-between mx-3">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Show&nbsp;
                    <b-form-select
                      v-model="perPage"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select
                    >&nbsp;entries
                  </label>
                </div>
                <div
                  class="d-flex align-items-center justify-content-between mb-3"
                >
                  <div class="search-box mr-3">
                    <div class="position-relative">
                      <input
                        type="text"
                        class="form-control text-primary rounded custom-input-box"
                        placeholder="Search"
                        id="myInput"
                        v-model="filter"
                      />
                      <i class="mdi mdi-magnify search-icon"></i>
                    </div>
                  </div>
                  <!-- Buttons -->
                  <b-button
                    size="sm"
                    class="export-button mr-2"
                    variant="light"
                    @click="exportToExcel"
                    >Export to Excel</b-button
                  >
                  <b-button
                    size="sm"
                    class="export-button"
                    variant="light"
                    @click="exportToCSV"
                    >Export to CSV</b-button
                  >
                </div>

                <!-- Data Table -->
                <div class="table-responsive mb-0">
                  <b-table
                    :items="activityData"
                    :fields="colfields"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                    :filter-function="filterTable"
                    ref="adminTable"
                    show-empty
                  >
                    <!-- Custom cell rendering for createdAt -->
                    <template #cell(createdAt)="row">
                      {{ moment(row.item.createdAt).format("YYYY-MM-DD") }}
                    </template>
                    <template #cell(delete)="row">
                      <div @click="deleteRow(row.item)">
                        <i class="btn text-secondary mdi mdi-delete"></i>
                      </div>
                    </template>
                    <template #cell(download)="row">
                      <b-button
                        size="sm"
                        variant="primary"
                        @click="downloadZip(row.item)"
                        ><i class="mdi mdi-download"></i
                      ></b-button>
                    </template>
                  </b-table>
                </div>
                <!-- Pagination and Total Rows Count -->
                <div class="row">
                  <div
                    class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls"
                  >
                    <ul class="pagination pagination-rounded mb-0">
                      <span class="py-2 ml-2">
                        Total Pages: {{ this.totalPages }}</span
                      >
                    </ul>
                  </div>
                  <div class="row-pagination-cust-cls">
                    <ul class="pagination-rounded mb-0">
                      <!-- pagination -->
                      <b-pagination
                        :key="totalPages"
                        v-model="currentPage"
                        :total-pages="totalPages"
                        @change="onPageChange"
                      ></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import * as XLSX from "xlsx";
import { eventBus } from "../../../main";

export default {
  data() {
    return {
      activityData: [],
      title: "Recent Publication ",
      items: [
        {
          text: "Dashboard",
          href: `/dashboard`,
        },
        {
          text: "Recent Publications",
          active: true,
        },
      ],
      userId: this.$store.state.Auth.userId,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "",
      sortDesc: true,
      colfields: this.generateTableColumns(),
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Number of Releases",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    rows() {
      return this.activityData.length;
    },
    _() {
      return _;
    },
    totalPages() {
      return Math.ceil(this.rows / this.perPage);
    },
  },
  watch: {
    perPage: {
      handler() {
        this.currentPage = 1;
      },
    },
  },
  created() {
    eventBus.$emit("update-sidebar", "menuitems.dashboard.text");
    if (this.$store.state.Auth.recentPublicationsData.length) {
      this.activityData = this.$store.state.Auth.recentPublicationsData;
    } else {
      this.getReleasePublication();
    }
    this.prepareChartData();
  },
  mounted() {
    console.log(this.activityData);
  },
  methods: {
    moment,
    onFiltered(filteredItems) {
      // Update the totalRows to the length of the filtered items
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onPageChange(page) {
      this.currentPage = page;
    },
    prepareChartData() {
      const projects = {};
      // Count releases per project
      this.activityData.forEach((release) => {
        const projectName = release.projectName;
        projects[projectName] = (projects[projectName] || 0) + 1;
      });
      // Populate chart data
      this.chartData.labels = Object.keys(projects);
      this.chartData.datasets[0].data = Object.values(projects);
      // Update the chart
      this.$refs.barChart._chart.update();
    },
    generateTableColumns() {
      return [
        {
          key: "releaseTitle",
          label: "Release Title",
          sortable: true,
        },
        {
          key: "projectName",
          label: "Project Name",
          sortable: true,
        },
        {
          key: "releasedBy",
          label: "Released By",
          sortable: true,
        },
        {
          key: "outputFormat",
          label: "Output Format",
          sortable: true,
        },
        {
          key: "ditaotVersion",
          label: "DITA OT Version",
          sortable: true,
        },
        {
          key: "createdAt",
          label: "Created At",
          sortable: true,
          sortByFormatted: true,
          formatter: (value, key, item) =>
            moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          key: "delete",
          label: "Delete",
          sortable: false,
        },
        {
          key: "download",
          label: "Download",
          sortable: false,
        },
      ];
    },
    // This method is use to generate error or success message
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    deleteRow(item) {
      const index = this.activityData.indexOf(item);
      if (index !== -1) {
        this.activityData.splice(index, 1);
        this.$store.commit("setRecentPublicationsData", this.activityData);
        this.deleteItemOnServer(item);
      }
    },
    deleteItemOnServer(item) {
      this.$store.getters.client
        .delete(`/orguser/release?Id=${item._id}`)
        .then(() => {
          this.messageToast("Success", "primary", "Item deleted successfully");
        })
        .catch(() => {
          this.messageToast("Error", "danger", "Failed to delete item");
        });
    },
    getReleasePublication() {
      this.activityData = [
        {
          _id: "65ddc122e54c8412c021793b",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "443314a8681c5d489a80b5cddb47ccd4cb2e3d2d",
          owner: "pranav-metapercept",
          createdAt: "2024-02-27T11:01:54.972Z",
          updatedAt: "2024-02-27T11:01:54.972Z",
          __v: 0,
        },
        {
          _id: "65dda1cbe54c8412c021793a",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "gfdg",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "1d75420d74cfa415f3d2a3b4eb96be400575e127",
          owner: "pranav-metapercept",
          createdAt: "2024-02-27T08:48:11.898Z",
          updatedAt: "2024-02-27T08:48:11.898Z",
          __v: 0,
        },
        {
          _id: "65dda0bbe54c8412c0217939",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "pdf",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "5bb307cb156bfd83e3a0c63b9fc9572b9b09f288",
          owner: "pranav-metapercept",
          createdAt: "2024-02-27T08:43:39.594Z",
          updatedAt: "2024-02-27T08:43:39.594Z",
          __v: 0,
        },
        {
          _id: "65dc81a31c7d7213d8d1c8fa",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "c033c8759b01e3faffe44e709aaf9b32d0673cbc",
          owner: "pranav-metapercept",
          createdAt: "2024-02-26T12:18:43.170Z",
          updatedAt: "2024-02-26T12:18:43.170Z",
          __v: 0,
        },
        {
          _id: "65dc76011c7d7213d8d1c8f1",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "cfe4f09dec727b55c172b5319afeee8646b9d1de",
          owner: "pranav-metapercept",
          createdAt: "2024-02-26T11:29:05.608Z",
          updatedAt: "2024-02-26T11:29:05.608Z",
          __v: 0,
        },
        {
          _id: "65dc75341c7d7213d8d1c8f0",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "1554baef0ef16e304c5a92432816cbabfb5e20b5",
          owner: "pranav-metapercept",
          createdAt: "2024-02-26T11:25:40.148Z",
          updatedAt: "2024-02-26T11:25:40.148Z",
          __v: 0,
        },
        {
          _id: "65dc74f51c7d7213d8d1c8ef",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "fbd9a5cc7a92a8c0088f498bcd7c61012729d096",
          owner: "pranav-metapercept",
          createdAt: "2024-02-26T11:24:37.328Z",
          updatedAt: "2024-02-26T11:24:37.328Z",
          __v: 0,
        },
        {
          _id: "65dc74ac1c7d7213d8d1c8ee",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "f5b7d10c2c3e1042ec593e0f420cf7f7f37e0e4b",
          owner: "pranav-metapercept",
          createdAt: "2024-02-26T11:23:24.585Z",
          updatedAt: "2024-02-26T11:23:24.585Z",
          __v: 0,
        },
        {
          _id: "65dc74651c7d7213d8d1c8ed",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "ce567264e264089687d2a96ca9566909b9eaf381",
          owner: "pranav-metapercept",
          createdAt: "2024-02-26T11:22:13.717Z",
          updatedAt: "2024-02-26T11:22:13.717Z",
          __v: 0,
        },
        {
          _id: "65d7371db62d37112afc39ad",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "html5",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "ca16546346f403e6abdcfcb54060994740ddfccf",
          owner: "pranav-metapercept",
          createdAt: "2024-02-22T11:59:25.032Z",
          updatedAt: "2024-02-22T11:59:25.032Z",
          __v: 0,
        },
        {
          _id: "65d71d88b62d37112afc39ac",
          ditaMapFileName: "flowers01.ditamap",
          outputFormat: "pdf",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "flowers-02",
          commitSHA: "77803c2fc3237d903075643c02a951930ef1ffd5",
          owner: "pranav-metapercept",
          createdAt: "2024-02-22T10:10:16.365Z",
          updatedAt: "2024-02-22T10:10:16.365Z",
          __v: 0,
        },
        {
          _id: "65d71cb8b62d37112afc39ab",
          ditaMapFileName: "introduction.ditamap",
          outputFormat: "pdf",
          ditaotVersion: "3.0.4",
          orgId: "65d48eb9706dab437fd3ccf7",
          userId: "65d48eb9706dab437fd3ccfb",
          releaseTitle: "test",
          releasedBy: "jyoti",
          projectName: "ditamap-04",
          commitSHA: "d28e794242dddb3052c15620863265da6d267c58",
          owner: "pranav-metapercept",
          createdAt: "2024-02-22T10:06:48.338Z",
          updatedAt: "2024-02-22T10:06:48.338Z",
          __v: 0,
        },
      ];
    },
    async downloadZip(item) {
      let loader = this.$loading.show({
        loader: "dots",
      });
      try {
        const response = await this.$store.getters.client.get(
          `/orguser/release/download?releaseId=${item._id}`,
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${item.releaseTitle}.zip`);
        document.body.appendChild(link);
        link.click();
        loader.hide();
        this.messageToast("Success", "primary", "Downloaded successfull!");
      } catch (error) {
        loader.hide();
        this.messageToast("Invalid request", "danger", error.message);
      }
    },
    exportToExcel() {
      const dataToExport = this.activityData.map((item) => ({
        "Release Title": item.releaseTitle,
        "Project Name": item.projectName,
        "Released By": item.releasedBy,
        "Output Format": item.outputFormat,
        "DITA OT Version": item.ditaotVersion,
        "Created At": moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      }));
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      // Save the workbook as an Excel file
      XLSX.writeFile(wb, "table_data.xlsx");
    },
    exportToCSV() {
      const dataToExport = this.activityData.map((item) => ({
        "Release Title": item.releaseTitle,
        "Project Name": item.projectName,
        "Released By": item.releasedBy,
        "Output Format": item.outputFormat,
        "DITA OT Version": item.ditaotVersion,
        "Created At": moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      }));
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      // Save the workbook as a CSV file
      XLSX.writeFile(wb, "table_data.csv", {
        bookType: "csv",
      });
    },
    filterTable(row, filter) {
      const filterUpperCase = filter.toUpperCase();
      const hasNameMatch = row.projectName
        .toUpperCase()
        .startsWith(filterUpperCase);
      return hasNameMatch;
    },
  },
};
</script>

<style>
.custom-input-box {
  border: 1px solid #ced4da !important;
  border-radius: 0px;
  background-color: #ffffff !important;
}

.export-button {
  height: 38px;
  /* Adjust the height as needed */
  line-height: 38px;
  /* Center the text vertically within the button */
}

.search-box input {
  height: 38px;
  /* Match the height of buttons */
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .row-count-cust-cls {
    /* float: right !important; */
    margin-bottom: 10px;
  }

  .row-pagination-cust-cls {
    margin-top: 20px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .row-count-cust-cls ul {
    /* float: right !important; */
    margin-bottom: 10px;
    text-align: left !important;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>
