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
              <div class="row mt-2">
                <div class="col-sm-12 col-md-5 col-lg-4">
                  <div id="tickets-table_length" class="dataTables_length">
                    <label class="d-inline-flex align-items-center">
                      Show&nbsp;
                      <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                    </label>
                  </div>
                </div>
          
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                    <label class="d-inline-flex align-items-center">
                      Search:
                      <b-form-input v-model="filter" type="search" placeholder="Search Project Name..." class="form-control form-control-sm ml-2"></b-form-input>
                    </label>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-4">
                  <div class="container">
                    <div class="row">
                      <!-- Use responsive classes to control button visibility -->
                      <b-button size="sm" class="mt-md-1 mt-lg-0 d-md-inline d-lg-none" variant="primary" @click="exportToExcel">Export to Excel</b-button>
                      <b-button size="sm" class="mt-md-1 mt-lg-0 ml-2 d-md-inline d-lg-none" variant="primary" @click="exportToCSV">Export to CSV</b-button>
                      <!-- For larger screens, buttons will always be visible -->
                      <b-button size="sm" class="mt-md-1 mt-lg-0 d-none d-lg-inline" variant="primary" @click="exportToExcel">Export to Excel</b-button>
                      <b-button size="sm" class="mt-md-1 mt-lg-0 ml-2 d-none d-lg-inline" variant="primary" @click="exportToCSV">Export to CSV</b-button>
                    </div>
                  </div>
                </div>
              </div>
                        <!-- Data Table -->
                        <div class="table-responsive mb-0">
                            <b-table :items="activityData" :fields="colfields" responsive="sm" :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered" :filter-function="filterTable" ref="adminTable" show-empty>
                                <!-- Custom cell rendering for createdAt -->
                                <template #cell(createdAt)="row">
                                    {{ moment(row.item.createdAt).format("YYYY-MM-DD") }}
                                </template>
                                <template #cell(delete)="row">
                                    <div @click="deleteRow(row.item)"><i class="btn text-secondary mdi mdi-delete"></i></div>
                                </template>
                                <template #cell(download)="row">
                                    <b-button size="sm" variant="primary" @click="downloadZip(row.item)"><i class="mdi mdi-download"></i></b-button>
                                </template>
                            </b-table>
                        </div>
                        <!-- Pagination and Total Rows Count -->
                        <div class="row">
                            <div class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                                <ul class="pagination pagination-rounded mb-0">
                                    <span class="py-2 ml-2"> Total Pages: {{ this.totalPages }}</span>
                                </ul>
                            </div>
                            <div class="row-pagination-cust-cls">
                                <ul class="pagination-rounded mb-0">
                                    <!-- pagination -->
                                    <b-pagination :key="totalPages" v-model="currentPage" :total-pages="totalPages" @change="onPageChange"></b-pagination>
                                </ul>
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
export default {
    data() {
        return {
            activityData: [],
            title: "Recent Publication ",
            items: [{
                    text: "Dashboard",
                    href: `/dashboard`,
                },
                {
                    text: "Recent Publications",
                    active: true
                }
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
                datasets: [{
                    label: 'Number of Releases',
                    backgroundColor: '#f87979',
                    data: []
                }]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
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
        if (this.$store.state.Auth.recentPublicationsData.length) {
            this.activityData = this.$store.state.Auth.recentPublicationsData
        } else {
            this.getReleasePublication();
        }
        this.prepareChartData();
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
            this.data.forEach((release) => {
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
            return [{
                    key: "releaseTitle",
                    label: "Release Title",
                    sortable: true
                },
                {
                    key: "projectName",
                    label: "Project Name",
                    sortable: true
                },
                {
                    key: "releasedBy",
                    label: "Released By",
                    sortable: true
                },
                {
                    key: "outputFormat",
                    label: "Output Format",
                    sortable: true
                },
                {
                    key: "ditaotVersion",
                    label: "DITA OT Version",
                    sortable: true
                },
                {
                    key: "createdAt",
                    label: "Created At",
                    sortable: true,
                    sortByFormatted: true,
                    formatter: (value, key, item) => moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
                },
                {
                    key: "delete",
                    label: "Delete",
                    sortable: false
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
                this.$store.commit('setRecentPublicationsData', this.activityData)
                this.deleteItemOnServer(item);
            }
        },
        deleteItemOnServer(item) {
            this.$store.getters.client
                .delete(`/orguser/release?Id=${item._id}`)
                .then(() => {
                    this.messageToast("Success", "success", "Item deleted successfully");
                })
                .catch(() => {
                    this.messageToast("Error", "danger", "Failed to delete item");
                });
        },
        getReleasePublication() {
            this.$store.getters.client
                .get(`/orguser/release/byuserId?userId=${this.userId}`)
                .then((response) => {
                    if (response.data) {
                        console.log(response.data);
                        this.activityData = response.data.reverse();
                        this.$store.commit('setRecentPublicationsData', response.data);
                    } else {
                        this.messageToast("Invalid request", "danger", "No data received from the server");
                    }
                })
                .catch((err) => {
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                    this.showSpinner = false;
                });
        },
        async downloadZip(item) {
            let loader = this.$loading.show({
                loader: "dots",
            });
            try {
                const response = await this.$store.getters.client.get(`/orguser/release/download?releaseId=${item._id}`, {
                    responseType: "arraybuffer",
                });
                const blob = new Blob([response.data], {
                    type: response.headers['content-type']
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${item.releaseTitle}.zip`);
                document.body.appendChild(link);
                link.click();
                loader.hide()
                this.messageToast("Success", "success", "Zip file has been downloaded successfully");
            } catch (error) {
                loader.hide();
                this.messageToast("Invalid request", "danger", error.message);
            }
        },
        exportToExcel() {
            const dataToExport = this.activityData.map(item => ({
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
                bookType: "csv"
            });
        },
        filterTable(row, filter) {
            const filterUpperCase = filter.toUpperCase();
            const hasNameMatch = row.projectName.toUpperCase().startsWith(filterUpperCase);
            return hasNameMatch;
        },
    },
};
</script>

<style>
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
@media only screen and (min-width: 768px) {}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {}
</style>
