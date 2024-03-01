<template>
  <div>
    <Layout>
      <PageHeader
        :icon="'ri-dashboard-line h3'"
        :title="title"
        :items="items"
      />
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
                    </b-table>
                  </div>
                  <!-- Pagination and Total Rows Count -->
                  <div class="row">
                    <div
                      class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls"
                    >
                      <ul class="pagination pagination-rounded mb-0">
                        <span class="py-2 ml-2"
                          >Total Pages: {{ totalPages }}</span
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
    </Layout>
  </div>
</template>

<script>
import moment from "moment";
import * as XLSX from "xlsx";
import Layout from "../../layouts/main";
export default {
  components: {
    Layout,
  },
  data() {
    return {
      activityData: [
        {
          _id: "641051ebca19b316a00b796a",
          ditaMapFileName: "ditamap20",
          outputFormat: "html5",
          ditaotVersion: "3.4.1",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "DitaxPresso guide",
          releasedBy: "Jyoti Kamal Singh",
          createdAt: "2023-03-14T10:52:27.505Z",
          updatedAt: "2023-03-14T10:52:27.505Z",
        },
        {
          _id: "64105403ca19b316a00b796b",
          ditaMapFileName: "ditamap20",
          outputFormat: "html5",
          ditaotVersion: "3.4.1",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "DitaxPresso guide",
          releasedBy: "Samantha Roberts",
          createdAt: "2023-03-14T11:01:23.019Z",
          updatedAt: "2023-03-14T11:01:23.019Z",
        },
        {
          _id: "6410570eca19b316a00b796c",
          ditaMapFileName: "ditamap21",
          outputFormat: "pdf",
          ditaotVersion: "3.5.2",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "Documentation Overhaul",
          releasedBy: "Nathan Blackwell",
          createdAt: "2023-05-02T14:45:11.742Z",
          updatedAt: "2023-05-02T14:45:11.742Z",
        },
        {
          _id: "64105a9dca19b316a00b796d",
          ditaMapFileName: "ditamap22",
          outputFormat: "epub",
          ditaotVersion: "3.6.0",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "User's Guide",
          releasedBy: "Emily Anderson",
          createdAt: "2023-07-19T09:32:45.126Z",
          updatedAt: "2023-07-19T09:32:45.126Z",
        },
        {
          _id: "64105d28ca19b316a00b796e",
          ditaMapFileName: "ditamap23",
          outputFormat: "html5",
          ditaotVersion: "3.6.3",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "Interactive Tutorial",
          releasedBy: "Aiden Turner",
          createdAt: "2023-09-10T18:20:37.891Z",
          updatedAt: "2023-09-10T18:20:37.891Z",
        },
        {
          _id: "64106232ca19b316a00b796f",
          ditaMapFileName: "ditamap24",
          outputFormat: "html5",
          ditaotVersion: "3.7.0",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "Advanced Techniques",
          releasedBy: "Olivia Carter",
          createdAt: "2023-11-05T12:15:55.673Z",
          updatedAt: "2023-11-05T12:15:55.673Z",
        },
        {
          _id: "6410648eca19b316a00b7970",
          ditaMapFileName: "ditamap25",
          outputFormat: "pdf",
          ditaotVersion: "3.7.2",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "Optimization Guide",
          releasedBy: "Liam Mitchell",
          createdAt: "2024-01-08T08:50:14.991Z",
          updatedAt: "2024-01-08T08:50:14.991Z",
        },
        {
          _id: "64106710ca19b316a00b7971",
          ditaMapFileName: "ditamap26",
          outputFormat: "epub",
          ditaotVersion: "3.8.0",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "Mastering DitaxPresso",
          releasedBy: "Lucas Foster",
          createdAt: "2024-03-14T15:30:42.217Z",
          updatedAt: "2024-03-14T15:30:42.217Z",
        },
        {
          _id: "64106977ca19b316a00b7972",
          ditaMapFileName: "ditamap27",
          outputFormat: "html5",
          ditaotVersion: "3.9.1",
          orgId: "640ecdb18e33cc0b2c5ea795",
          userId: "63f3120a58cb1b1d4852b107",
          releaseTitle: "Advanced User Manual",
          releasedBy: "Sophia Rodriguez",
          createdAt: "2024-05-20T09:12:31.572Z",
          updatedAt: "2024-05-20T09:12:31.572Z",
        },
      ],
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
      colfields: [], // Initialize as empty, will be populated in created()
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage);
    },
  },
  watch: {
    perPage() {
      this.currentPage = 1;
    },
  },
  created() {
    this.colfields = this.generateTableColumns();
    this.prepareChartData();
  },
  methods: {
    moment,
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onPageChange(page) {
      this.currentPage = page;
    },
    prepareChartData() {
      // Your chart data preparation logic here
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
    filterTable(row, filter) {
      const filterUpperCase = filter.toUpperCase();
      const hasNameMatch = row.projectName
        .toUpperCase()
        .startsWith(filterUpperCase);
      return hasNameMatch;
    },
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
      XLSX.writeFile(wb, "table_data.csv", {
        bookType: "csv",
      });
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
